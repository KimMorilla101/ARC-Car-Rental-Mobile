import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import { Icon, type IconName } from './Icon';
import { styles } from './Pill.styles';

export type PillTone = 'blue' | 'green' | 'gray' | 'amber' | 'red' | 'purple' | 'solidGreen' | 'solidBlue';

const toneStyles: Record<PillTone, { background: string; text: string; border?: string }> = {
  blue: { background: palette.blueTint, text: palette.blueDark },
  green: { background: palette.greenSoft, text: palette.greenDark },
  gray: { background: palette.divider, text: palette.muted },
  amber: { background: palette.amberSoft, text: palette.amber, border: palette.amberBorder },
  red: { background: palette.dangerSoft, text: palette.dangerText },
  purple: { background: palette.purpleSoft, text: palette.purpleDark },
  solidGreen: { background: palette.green, text: palette.white },
  solidBlue: { background: palette.blue, text: palette.white },
};

/** Status / label badge. */
export function Pill({ children, tone = 'blue', icon }: { children: ReactNode; tone?: PillTone; icon?: IconName }) {
  const colors = toneStyles[tone];
  return (
    <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border ?? colors.background }]}>
      {icon && <Icon name={icon} size={11} color={colors.text} />}
      <Text style={[styles.text, { color: colors.text }]}>{children}</Text>
    </View>
  );
}
