import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

interface InfoRowProps {
  label: string;
  value: string;
  strong?: boolean;
  /** `dark` for rows inside navy summary cards. */
  tone?: 'light' | 'dark';
  /** `stacked` puts the value under the label; `inline` puts it on the right. */
  layout?: 'stacked' | 'inline';
  muted?: boolean;
}

export function InfoRow({ label, value, strong, tone = 'light', layout = 'stacked', muted }: InfoRowProps) {
  const dark = tone === 'dark';
  return (
    <View style={[layout === 'inline' ? styles.inline : styles.stacked, !dark && layout === 'stacked' && styles.divider]}>
      <Text style={[dark ? styles.labelDark : styles.label, muted && styles.muted]}>{label}</Text>
      <Text style={[dark ? styles.valueDark : styles.value, strong && (dark ? styles.strongDark : styles.strong), muted && styles.muted]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stacked: { paddingVertical: 10 },
  inline: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 11 },
  divider: { borderBottomWidth: 1, borderBottomColor: palette.divider },
  label: { color: palette.muted, fontSize: 11 },
  value: { color: palette.navy, fontSize: 14, fontWeight: '700', marginTop: 4 },
  strong: { color: palette.blue, fontSize: 18, fontWeight: '900' },
  labelDark: { color: palette.onNavyMuted, fontSize: 12 },
  valueDark: { color: palette.white, fontSize: 12, fontWeight: '700', textAlign: 'right', flexShrink: 1 },
  strongDark: { fontSize: 16, fontWeight: '900' },
  muted: { color: '#6F829E', fontSize: 11 },
});
