import { Pressable, Text, View } from 'react-native';

import { palette, text } from '@/constants/theme';

import { Icon } from './Icon';
import { styles } from './SectionTitle.styles';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: string;
  onPress?: () => void;
  /** Serif heading for big home sections like "Featured Vehicles". */
  display?: boolean;
}

export function SectionTitle({ title, subtitle, action, onPress, display = false }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={display ? styles.display : text.sectionTitle} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={[text.caption, styles.subtitle]}>{subtitle}</Text> : null}
      </View>
      {action && (
        <Pressable onPress={onPress} hitSlop={10} accessibilityRole="button" style={styles.action}>
          <Text style={styles.actionText}>{action}</Text>
          <Icon name="chevron-right" size={15} color={palette.blue} />
        </Pressable>
      )}
    </View>
  );
}
