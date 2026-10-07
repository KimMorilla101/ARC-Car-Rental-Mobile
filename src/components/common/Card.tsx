import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { palette } from '@/constants/theme';

import { Icon, type IconName } from './Icon';
import { styles } from './Card.styles';

/** White rounded card with a soft shadow; optional icon + title header like "Rental Period". */
export function Card({ children, title, icon, right, style }: { children: ReactNode; title?: string; icon?: IconName; right?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, style]}>
      {title && (
        <View style={styles.header}>
          {icon && <Icon name={icon} size={18} color={palette.blue} />}
          <Text style={styles.title}>{title}</Text>
          <View style={styles.spacer} />
          {right}
        </View>
      )}
      {children}
    </View>
  );
}
