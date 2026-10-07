import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  disabled: { opacity: 0.55 },
  box: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: palette.mutedLight, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.white, marginTop: 1 },
  boxChecked: { backgroundColor: palette.blue, borderColor: palette.blue },
  label: { color: palette.label, fontSize: 14, fontFamily: font.regular },
  custom: { flex: 1 },
});
