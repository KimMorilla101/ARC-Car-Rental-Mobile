import { Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { NoticeBox } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { UploadFile } from '@/types/api';
import type { BookingQuote, RequirementType } from '@/types/booking';

import { RequirementRow } from '../RequirementRow';
import type { StepProps } from './bookingDraft';
import { styles } from './DocumentsStep.styles';

interface DocumentsStepProps extends StepProps {
  requirements: BookingQuote['requirements'];
  /** The list comes from the server quote, which may still be loading or may have failed. */
  listStatus: 'loading' | 'error' | 'ready';
  onRetry: () => void;
  onPick: (onFile: (file: UploadFile) => void) => void;
}

/** Step 2: the four mandatory documents. Files are uploaded after the booking is created. */
export function DocumentsStep({ draft, update, errors, requirements, listStatus, onRetry, onPick }: DocumentsStepProps) {
  const setDocument = (type: RequirementType) => (file: UploadFile) => update({ documents: { ...draft.documents, [type]: file } });

  if (listStatus === 'loading') return <LoadingSpinner label="Loading the required documents…" />;
  if (listStatus === 'error') {
    return (
      <View>
        <NoticeBox title="Could not load the document list">Check your connection, then try again. You cannot continue until the list loads.</NoticeBox>
        <Button label="Try again" icon="refresh-cw" variant="outline" onPress={onRetry} style={styles.retry} />
      </View>
    );
  }

  return (
    <View>
      <NoticeBox>
        <Text style={styles.notice}>
          All {requirements.length} documents below are <Text style={styles.noticeStrong}>mandatory</Text>. Your booking cannot proceed without them. Documents will be verified by our
          staff.
        </Text>
      </NoticeBox>
      {requirements.map((item) => {
        const file = draft.documents[item.type];
        return (
          <RequirementRow
            key={item.type}
            label={item.label}
            description={item.description}
            badge={file ? { label: 'Uploaded', tone: 'amber' } : { label: 'Required', tone: 'red' }}
            fileName={file?.name ?? null}
            onUpload={() => onPick(setDocument(item.type))}
          />
        );
      })}
      {errors.documents ? <Text style={styles.error}>{errors.documents}</Text> : null}
    </View>
  );
}
