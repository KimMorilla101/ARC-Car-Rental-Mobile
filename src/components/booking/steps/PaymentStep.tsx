import { Text, View } from 'react-native';

import { NoticeBox } from '@/components/common/ErrorMessage';
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { PaymentProofUploader } from '@/components/payment/PaymentProofUploader';
import type { UploadFile } from '@/types/api';
import type { PaymentMethodOption } from '@/types/payment';

import type { StepProps } from './bookingDraft';
import { styles } from './PaymentStep.styles';

interface PaymentStepProps extends StepProps {
  paymentMethods: PaymentMethodOption[];
  onPick: (onFile: (file: UploadFile) => void) => void;
}

/** Step 3: choose cash, online or bank transfer; online/bank need a receipt upload. */
export function PaymentStep({ draft, update, errors, paymentMethods, onPick }: PaymentStepProps) {
  const selected = paymentMethods.find((option) => option.method === draft.paymentMethod);
  // Methods are set by ARC on the server; never invent one if none are enabled.
  if (paymentMethods.length === 0) {
    return <NoticeBox title="No payment methods available">ARC has not enabled any payment method yet. Please contact ARC to complete your booking.</NoticeBox>;
  }
  return (
    <View>
      <PaymentMethodSelector options={paymentMethods} value={draft.paymentMethod} onChange={(paymentMethod) => update({ paymentMethod })} error={errors.paymentMethod} />
      {selected?.requiresProof && (
        <>
          <PaymentProofUploader fileName={draft.paymentProof?.name ?? null} onPick={() => onPick((paymentProof) => update({ paymentProof }))} />
          {errors.paymentProof ? <Text style={styles.error}>{errors.paymentProof}</Text> : null}
        </>
      )}
      <NoticeBox tone="blue">Uploaded proof does not confirm your booking automatically. ARC staff verify every payment before confirming.</NoticeBox>
    </View>
  );
}
