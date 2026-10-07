import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  state: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  icon: { width: 56, height: 56, borderRadius: 18, backgroundColor: palette.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: palette.navy, fontSize: 18, fontFamily: font.bold, marginTop: 14, textAlign: 'center' },
  message: { marginTop: 6, textAlign: 'center' },
  retry: { alignSelf: 'stretch', marginTop: 18 },
  banner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: palette.dangerSoft, borderRadius: 12, padding: 13, marginTop: 16 },
  bannerText: { color: palette.dangerText, fontSize: 13, lineHeight: 19, fontFamily: font.medium, flex: 1 },
  notice: { flexDirection: 'row', gap: 10, backgroundColor: palette.amberSoft, borderColor: palette.amberBorder, borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 16 },
  noticeBlue: { backgroundColor: palette.blueSoft, borderColor: palette.blueTint },
  noticeCopy: { flex: 1 },
  noticeTitle: { color: palette.amber, fontSize: 15, fontFamily: font.bold, marginBottom: 4 },
  noticeTitleBlue: { color: palette.blueDark },
  noticeText: { color: palette.amberText, fontSize: 13, lineHeight: 20, fontFamily: font.regular },
  noticeTextBlue: { color: palette.blueDark },
});
