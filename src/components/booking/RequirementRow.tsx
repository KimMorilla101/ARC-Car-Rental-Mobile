import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/common/Icon';
import { Pill, type PillTone } from '@/components/common/Pill';
import { palette } from '@/constants/theme';

import { styles } from './RequirementRow.styles';

interface RequirementRowProps {
  label: string;
  description: string;
  /** Badge in the top-right corner, e.g. "Required", "Uploaded", "Verified". */
  badge: { label: string; tone: PillTone };
  /** Name of the selected/uploaded file; shows the green "uploaded" box instead of the dashed one. */
  fileName?: string | null;
  /** Upload action; omit when the document can no longer be changed. */
  onUpload?: () => void;
  busy?: boolean;
}

/** Document card from the Figma "Documents" step: title, hint, status badge and a dashed upload box. */
export function RequirementRow({ label, description, badge, fileName, onUpload, busy }: RequirementRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Pill tone={badge.tone}>{badge.label}</Pill>
      </View>
      {onUpload && (
        <Pressable
          onPress={onUpload}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel={fileName ? `Replace ${label}` : `Upload ${label}`}
          style={({ pressed }) => [styles.upload, fileName ? styles.uploadDone : null, pressed && styles.pressed]}>
          {busy ? (
            <ActivityIndicator color={palette.blue} />
          ) : fileName ? (
            <>
              <Icon name="check-circle" size={16} color={palette.greenDark} />
              <Text style={styles.uploadDoneText} numberOfLines={1}>
                {fileName}
              </Text>
              <Text style={styles.replace}>Replace</Text>
            </>
          ) : (
            <>
              <Icon name="upload" size={16} color={palette.muted} />
              <Text style={styles.uploadText}>Upload File</Text>
            </>
          )}
        </Pressable>
      )}
    </View>
  );
}
