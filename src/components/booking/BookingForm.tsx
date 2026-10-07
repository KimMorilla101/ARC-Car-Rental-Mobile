import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { BackLink, PageHeader } from '@/components/common/PageHeader';
import { Stepper } from '@/components/common/Stepper';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { bookingApi } from '@/services/bookingApi';
import { paymentApi } from '@/services/paymentApi';
import type { UploadFile } from '@/types/api';
import type { BookingLocations, RentalAgreement } from '@/types/booking';
import type { PaymentMethodOption } from '@/types/payment';
import type { Vehicle } from '@/types/vehicle';
import { addDays, defaultPickup, withTimeOf } from '@/utils/bookingDates';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { pickImage } from '@/utils/filePicker';

import { AgreementStep } from './steps/AgreementStep';
import { BOOKING_STEPS, type BookingDraft, type DraftErrors } from './steps/bookingDraft';
import { DatesStep } from './steps/DatesStep';
import { DocumentsStep } from './steps/DocumentsStep';
import { PaymentStep } from './steps/PaymentStep';
import { styles } from './BookingForm.styles';

const SERVER_FIELDS = ['pickupAt', 'returnAt', 'branchId', 'deliveryZoneId', 'deliveryAddress', 'destination', 'paymentMethod', 'vehicleId'] as const;

interface BookingFormProps {
  vehicle: Vehicle;
  agreement: RentalAgreement;
  paymentMethods: PaymentMethodOption[];
  locations: BookingLocations;
}

/**
 * Four-step booking flow. Nothing is saved until "Confirm Booking": then the booking is created,
 * and the documents and payment proof are uploaded one by one. Prices always come from the
 * server quote.
 */
export function BookingForm({ vehicle, agreement, paymentMethods, locations }: BookingFormProps) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>(() => ({
    pickup: defaultPickup(),
    returnDate: addDays(defaultPickup(), 3),
    deliveryMethod: 'shop_pickup',
    branchId: locations.branches[0]?.id ?? null,
    deliveryZoneId: null,
    deliveryAddress: '',
    destination: '',
    documents: {},
    paymentMethod: null,
    paymentProof: null,
    agreementAccepted: false,
  }));
  const [errors, setErrors] = useState<DraftErrors>({});
  // Messages that come from the app itself (file picker, missing quote) rather than the API.
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const update = (changes: Partial<BookingDraft>) => {
    setDraft((current) => ({ ...current, ...changes }));
    // Editing anything clears old messages; the step is re-checked when the renter taps Continue.
    setErrors({});
    setSubmitError(null);
    setLocalError(null);
  };

  // The fixed-return rule: the return time always equals the pickup time.
  const returnAt = withTimeOf(draft.returnDate, draft.pickup);
  const delivery = draft.deliveryMethod === 'delivery';
  const debouncedAddress = useDebouncedValue(draft.deliveryAddress.trim(), 600);
  const quotePayload = {
    vehicleId: vehicle.id,
    pickupAt: draft.pickup.toISOString(),
    returnAt: returnAt.toISOString(),
    deliveryMethod: draft.deliveryMethod,
    branchId: delivery ? null : draft.branchId,
    deliveryZoneId: delivery ? draft.deliveryZoneId : null,
    deliveryAddress: delivery ? debouncedAddress || null : null,
  };
  const quote = useApiQuery(`quote:${JSON.stringify(quotePayload)}`, () => bookingApi.quote(quotePayload), { keepPreviousData: true });
  const requirements = quote.data?.requirements ?? [];
  const selectedPayment = paymentMethods.find((option) => option.method === draft.paymentMethod);

  const pick = async (onFile: (file: UploadFile) => void) => {
    setLocalError(null);
    const result = await pickImage();
    if ('file' in result) onFile(result.file);
    else if ('error' in result) setLocalError(result.error);
  };

  const validateStep = (index: number): DraftErrors => {
    const found: DraftErrors = {};
    if (index === 0) {
      if (draft.pickup.getTime() <= Date.now()) found.pickupAt = 'Choose a pickup time in the future.';
      if (returnAt.getTime() <= draft.pickup.getTime()) found.returnAt = 'The return date must be after the pickup date.';
      if (!delivery && !draft.branchId) found.branchId = 'Choose a pickup branch.';
      if (delivery && !draft.deliveryZoneId) found.deliveryZoneId = 'Choose a delivery area.';
      if (delivery && draft.deliveryAddress.trim().length < 10) found.deliveryAddress = 'Enter the full delivery address.';
      if (!draft.destination.trim()) found.destination = 'Travel destination is required.';
      if (quote.data && !quote.data.available) found.vehicleId = 'No unit of this car is free for those dates. Try different dates.';
    }
    if (index === 1 && requirements.some((item) => !draft.documents[item.type])) found.documents = 'Upload every required document to continue.';
    if (index === 2) {
      if (!draft.paymentMethod) found.paymentMethod = 'Choose a payment method.';
      if (selectedPayment?.requiresProof && !draft.paymentProof) found.paymentProof = 'Upload your proof of payment.';
    }
    if (index === 3 && !draft.agreementAccepted) found.agreement = 'Review and accept the rental agreement.';
    return found;
  };

  const goTo = (index: number) => {
    setStep(index);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const next = () => {
    const found = validateStep(step);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    goTo(step + 1);
  };

  const submit = async () => {
    if (progress || !draft.paymentMethod) return;
    const found = validateStep(3);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    // Never submit without a server price.
    if (!quote.data || quote.error) return setLocalError('The price could not be calculated yet. Check your connection and try again.');

    try {
      setProgress('Submitting booking…');
      const booking = await bookingApi.create({
        ...quotePayload,
        deliveryAddress: delivery ? draft.deliveryAddress.trim() : null,
        destination: draft.destination.trim(),
        paymentMethod: draft.paymentMethod,
        agreementVersion: agreement.version,
        agreementAccepted: true,
      });

      // The booking now exists. Upload files one by one; a failed upload is not fatal because the
      // confirmation screen reloads the booking and shows which documents are still missing.
      const uploads = requirements.flatMap((item) => {
        const file = draft.documents[item.type];
        return file ? [{ label: item.label, run: () => bookingApi.uploadRequirement(booking.id, item.type, file) }] : [];
      });
      const proof = draft.paymentProof;
      if (selectedPayment?.requiresProof && proof) uploads.push({ label: 'payment proof', run: () => paymentApi.uploadProof(booking.id, proof) });
      for (const [index, upload] of uploads.entries()) {
        setProgress(`Uploading ${upload.label} (${index + 1}/${uploads.length})…`);
        try {
          await upload.run();
        } catch {
          // Reported on the confirmation screen from the server's booking state.
        }
      }
      router.replace({ pathname: '/booking/[id]/submitted', params: { id: String(booking.id) } });
    } catch (error) {
      setSubmitError(error);
      const fieldErrors = getFieldErrors(error, SERVER_FIELDS);
      setErrors(fieldErrors);
      // Send the renter back to the step that holds the rejected field.
      if (Object.keys(fieldErrors).some((key) => key !== 'paymentMethod')) goTo(0);
    } finally {
      setProgress(null);
    }
  };

  const stepProps = { draft, update, errors };
  const last = step === BOOKING_STEPS.length - 1;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <BackLink />
        <PageHeader title="Complete Your Booking" subtitle={`Fill in your rental details to reserve the ${vehicle.name}.`} />
        <Stepper steps={BOOKING_STEPS} current={step} />

        <View style={styles.body}>
          {step === 0 && <DatesStep {...stepProps} locations={locations} />}
          {step === 1 && <DocumentsStep {...stepProps} requirements={requirements} onPick={pick} />}
          {step === 2 && <PaymentStep {...stepProps} paymentMethods={paymentMethods} onPick={pick} />}
          {step === 3 && <AgreementStep {...stepProps} agreement={agreement} vehicle={vehicle} quote={quote} />}
        </View>

        <ErrorMessage message={errors.vehicleId ?? localError ?? getFormError(submitError, SERVER_FIELDS)} />

        <View style={styles.actions}>
          {step > 0 && <Button label="Back" icon="chevron-left" variant="outline" onPress={() => goTo(step - 1)} disabled={!!progress} style={styles.back} />}
          {last ? (
            <Button label="Confirm Booking" icon="truck" onPress={submit} loading={!!progress} disabled={!draft.agreementAccepted} style={styles.primary} />
          ) : (
            <Button label="Continue" trailingIcon="chevron-right" onPress={next} style={styles.primary} />
          )}
        </View>
        {progress && <Text style={styles.progress}>{progress}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
