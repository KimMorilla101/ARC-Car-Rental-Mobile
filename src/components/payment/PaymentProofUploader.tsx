import { RequirementRow } from '@/components/booking/RequirementRow';
import type { PillTone } from '@/components/common/Pill';

interface PaymentProofUploaderProps {
  /** Name of the selected/uploaded file, if any. */
  fileName: string | null;
  onPick: () => void;
  busy?: boolean;
  /** Badge override, e.g. the server's payment status on booking details. */
  badge?: { label: string; tone: PillTone };
}

/** Receipt/screenshot upload for online and bank-transfer payments, styled like the document cards. */
export function PaymentProofUploader({ fileName, onPick, busy, badge }: PaymentProofUploaderProps) {
  return (
    <RequirementRow
      label="Proof of Payment"
      description="Screenshot or photo of your transfer receipt"
      badge={badge ?? (fileName ? { label: 'Uploaded', tone: 'amber' } : { label: 'Required', tone: 'red' })}
      fileName={fileName}
      onUpload={onPick}
      busy={busy}
    />
  );
}
