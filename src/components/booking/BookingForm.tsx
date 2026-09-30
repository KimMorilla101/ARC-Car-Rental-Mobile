import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { screenStyles } from '@/components/common/Screen';
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { PaymentProofUploader } from '@/components/payment/PaymentProofUploader';
import { palette } from '@/constants/theme';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { bookingApi } from '@/services/bookingApi';
import { paymentApi } from '@/services/paymentApi';
import type { UploadFile } from '@/types/api';
import type { DeliveryMethod, RentalAgreement, RequirementType } from '@/types/booking';
import type { PaymentMethod, PaymentMethodOption } from '@/types/payment';
import type { Vehicle } from '@/types/vehicle';
import { addDays, defaultPickup, startOfDay, withTimeOf } from '@/utils/bookingDates';
import { getErrorMessage, getFieldErrors, getFormError } from '@/utils/errorHandler';
import { pickImage } from '@/utils/filePicker';
import { formatPeso } from '@/utils/formatters';

import { AgreementSection } from './AgreementSection';
import { BookingSummary } from './BookingSummary';
import { DateTimeField } from './DateTimeField';
import { LocationSelector } from './LocationSelector';
import { RequirementRow } from './RequirementRow';

const SERVER_FIELDS = ['pickupAt', 'returnAt', 'deliveryAddress', 'destination', 'paymentMethod', 'vehicleId'] as const;
type FormErrors = Partial<Record<(typeof SERVER_FIELDS)[number] | 'documents' | 'paymentProof' | 'agreement' | 'quote', string>>;

interface BookingFormProps {
  vehicle: Vehicle;
  agreement: RentalAgreement | undefined;
  paymentMethods: PaymentMethodOption[];
}

export function BookingForm({ vehicle, agreement, paymentMethods }: BookingFormProps) {
  const router = useRouter();
  const [pickup, setPickup] = useState(defaultPickup);
  const [returnDate, setReturnDate] = useState(() => addDays(defaultPickup(), 3));
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('shop_pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [destination, setDestination] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentProof, setPaymentProof] = useState<UploadFile | null>(null);
  const [documents, setDocuments] = useState<Partial<Record<RequirementType, UploadFile>>>({});
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [progress, setProgress] = useState<string | null>(null);

  // The fixed-return rule: return time always equals pickup time.
  const returnAt = withTimeOf(returnDate, pickup);
  const debouncedAddress = useDebouncedValue(deliveryAddress.trim(), 600);
  const quotePayload = {
    vehicleId: vehicle.id,
    pickupAt: pickup.toISOString(),
    returnAt: returnAt.toISOString(),
    deliveryMethod,
    deliveryAddress: deliveryMethod === 'delivery' ? debouncedAddress || null : null,
  };
  const quote = useApiQuery(`quote:${JSON.stringify(quotePayload)}`, () => bookingApi.quote(quotePayload), { keepPreviousData: true });
  const selectedPayment = paymentMethods.find((option) => option.method === paymentMethod);
  const requirements = quote.data?.requirements ?? [];

  const clearError = (field: keyof FormErrors) => setErrors((current) => ({ ...current, [field]: undefined }));

  const onPickupChange = (date: Date) => {
    const next = withTimeOf(date, pickup);
    setPickup(next);
    if (startOfDay(returnDate) <= startOfDay(next)) setReturnDate(addDays(next, 1));
    clearError('pickupAt');
  };

  const onPickupTimeChange = (time: Date) => {
    setPickup(withTimeOf(pickup, time));
    clearError('pickupAt');
  };

  const selectFile = async (onFile: (file: UploadFile) => void, errorField: keyof FormErrors) => {
    const result = await pickImage();
    if ('file' in result) {
      onFile(result.file);
      clearError(errorField);
    } else if ('error' in result) {
      setErrors((current) => ({ ...current, [errorField]: result.error }));
    }
  };

  const validateForm = (): FormErrors => {
    const found: FormErrors = {};
    if (pickup.getTime() <= Date.now()) found.pickupAt = 'Choose a pickup time in the future.';
    if (returnAt.getTime() <= pickup.getTime()) found.returnAt = 'The return date must be after the pickup date.';
    if (deliveryMethod === 'delivery' && deliveryAddress.trim().length < 10) found.deliveryAddress = 'Enter the full delivery address.';
    if (!destination.trim()) found.destination = 'Travel destination is required.';
    if (!paymentMethod) found.paymentMethod = 'Choose a payment method.';
    if (selectedPayment?.requiresProof && !paymentProof) found.paymentProof = 'Upload your proof of payment.';
    if (requirements.some((item) => !documents[item.type])) found.documents = 'Upload every required document.';
    if (!agreementAccepted) found.agreement = 'Review and accept the rental agreement.';
    // Never submit without a server price; the summary card shows why the quote failed.
    if (!quote.data || quote.error) found.quote = 'The price could not be calculated yet.';
    return found;
  };

  const onSubmit = async () => {
    if (progress) return;
    const found = validateForm();
    setErrors(found);
    setSubmitError(null);
    if (Object.values(found).some(Boolean) || !paymentMethod || !agreement) return;
    if (quote.data && !quote.data.available) return;

    try {
      setProgress('Submitting booking…');
      const booking = await bookingApi.create({
        ...quotePayload,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress.trim() : null,
        destination: destination.trim(),
        paymentMethod,
        agreementVersion: agreement.version,
        agreementAccepted: true,
      });

      // The booking now exists. Upload files one by one; a failed upload is not fatal because the
      // confirmation screen reloads the booking and shows which documents are still missing.
      const uploads = requirements.map((item) => ({ label: item.label, run: () => bookingApi.uploadRequirement(booking.id, item.type, documents[item.type] as UploadFile) }));
      if (selectedPayment?.requiresProof && paymentProof) uploads.push({ label: 'Payment proof', run: () => paymentApi.uploadProof(booking.id, paymentProof) });
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
      setErrors((current) => ({ ...current, ...getFieldErrors(error, SERVER_FIELDS) }));
    } finally {
      setProgress(null);
    }
  };

  const unavailable = quote.data && !quote.data.available;
  const hasClientErrors = Object.values(errors).some(Boolean);

  return (
    <View>
      <Text style={screenStyles.title}>Almost ready to ride</Text>
      <Text style={screenStyles.subtitle}>
        Confirm your trip details for {vehicle.name}. Required items stay pending until ARC Car Rental verifies them.
      </Text>
      <View style={styles.vehicle}>
        <Text style={styles.vehicleName}>{vehicle.name}</Text>
        <Text style={styles.vehicleMeta}>
          {vehicle.category} • {formatPeso(vehicle.rates.daily)} / day
        </Text>
      </View>

      <Text style={screenStyles.section}>Pickup & return</Text>
      <LocationSelector
        method={deliveryMethod}
        onMethodChange={setDeliveryMethod}
        address={deliveryAddress}
        onAddressChange={(text) => {
          setDeliveryAddress(text);
          clearError('deliveryAddress');
        }}
        addressError={errors.deliveryAddress}
      />
      <View style={styles.row}>
        <DateTimeField label="Pickup date" mode="date" value={pickup} minimumDate={new Date()} onChange={onPickupChange} />
        <DateTimeField label="Pickup time" mode="time" value={pickup} onChange={onPickupTimeChange} />
      </View>
      {errors.pickupAt ? <Text style={styles.error}>{errors.pickupAt}</Text> : null}
      <View style={styles.row}>
        <DateTimeField
          label="Return date"
          mode="date"
          value={returnDate}
          minimumDate={addDays(pickup, 1)}
          onChange={(date) => {
            setReturnDate(date);
            clearError('returnAt');
          }}
        />
        <DateTimeField label="Return time (fixed)" mode="time" value={returnAt} onChange={() => undefined} locked />
      </View>
      {errors.returnAt ? <Text style={styles.error}>{errors.returnAt}</Text> : null}
      <Text style={styles.helper}>Return time automatically matches pickup time and cannot be changed.</Text>
      {unavailable && <ErrorMessage message="No unit of this car is free for those dates. Try different dates or another car." />}

      <Text style={screenStyles.section}>Trip information</Text>
      <FormField
        label="Travel destination"
        placeholder="Where do you intend to travel?"
        value={destination}
        onChangeText={(text) => {
          setDestination(text);
          clearError('destination');
        }}
        error={errors.destination}
        helper="Travel destination is separate from your pickup or delivery location."
      />

      <Text style={screenStyles.section}>Payment method</Text>
      <PaymentMethodSelector
        options={paymentMethods}
        value={paymentMethod}
        onChange={(method) => {
          setPaymentMethod(method);
          clearError('paymentMethod');
          clearError('paymentProof');
        }}
        error={errors.paymentMethod}
      />
      {selectedPayment?.requiresProof && (
        <PaymentProofUploader fileName={paymentProof?.name ?? null} onPick={() => selectFile(setPaymentProof, 'paymentProof')} error={errors.paymentProof} />
      )}

      <Text style={screenStyles.section}>Required documents</Text>
      {quote.isLoading && requirements.length === 0 ? <Text style={styles.helper}>Loading requirements…</Text> : null}
      {requirements.map((item) => {
        const file = documents[item.type];
        return (
          <RequirementRow
            key={item.type}
            label={item.label}
            description={item.description}
            statusText={file ? `Selected: ${file.name}` : 'Missing'}
            statusTone={file ? 'done' : 'missing'}
            actionLabel={file ? 'Replace' : 'Upload'}
            onAction={() => selectFile((picked) => setDocuments((current) => ({ ...current, [item.type]: picked })), 'documents')}
          />
        );
      })}
      {errors.documents ? <Text style={styles.error}>{errors.documents}</Text> : null}

      <Text style={screenStyles.section}>Rental agreement</Text>
      <AgreementSection
        agreement={agreement}
        accepted={agreementAccepted}
        onAccept={() => {
          setAgreementAccepted(true);
          clearError('agreement');
        }}
        error={errors.agreement}
      />

      <BookingSummary
        pricing={quote.data?.pricing}
        rentalDays={quote.data?.rentalDays}
        loading={quote.isFetching}
        error={quote.error ? getErrorMessage(quote.error) : null}
      />

      <ErrorMessage message={getFormError(submitError, SERVER_FIELDS) ?? (hasClientErrors ? 'Please fix the highlighted items above.' : null)} />
      <PrimaryButton label={progress ?? 'Submit booking  →'} onPress={onSubmit} loading={!!progress} disabled={!!unavailable || !agreement} />
      {progress && <Text style={styles.progress}>{progress}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  vehicle: { backgroundColor: palette.blueSoft, padding: 16, borderRadius: 16, marginTop: 20 },
  vehicleName: { color: palette.navy, fontSize: 18, fontWeight: '800' },
  vehicleMeta: { color: palette.blue, fontSize: 12, marginTop: 5, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10 },
  helper: { color: palette.muted, fontSize: 11, lineHeight: 17, marginTop: 7 },
  error: { color: palette.danger, fontSize: 12, fontWeight: '600', marginTop: 6 },
  progress: { color: palette.muted, fontSize: 12, textAlign: 'center', marginTop: 10 },
});
