import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

export type PillTone = 'blue' | 'green' | 'gray' | 'amber' | 'red';

const toneStyles: Record<PillTone, { background: string; text: string }> = {
  blue: { background: palette.blueSoft, text: palette.blue },
  green: { background: palette.greenSoft, text: palette.green },
  gray: { background: palette.divider, text: palette.muted },
  amber: { background: palette.amberSoft, text: palette.amber },
  red: { background: palette.dangerSoft, text: palette.danger },
};

export function Pill({ children, tone = 'blue' }: { children: ReactNode; tone?: PillTone }) {
  const colors = toneStyles[tone];
  return (
    <View style={[styles.pill, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '800' },
});
