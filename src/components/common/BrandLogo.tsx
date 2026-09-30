import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

/** "A" mark plus "ARC RIDE" wordmark. `inverse` is for dark backgrounds. */
export function BrandLogo({ inverse = false, showWordmark = true }: { inverse?: boolean; showWordmark?: boolean }) {
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="ARC Ride">
      <View style={styles.mark}>
        <Text style={styles.markText}>A</Text>
      </View>
      {showWordmark && (
        <Text style={[styles.logo, inverse && styles.logoInverse]}>
          ARC <Text style={inverse ? styles.accentInverse : styles.accent}>RIDE</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  mark: { width: 36, height: 36, borderRadius: 11, backgroundColor: palette.blue, alignItems: 'center', justifyContent: 'center' },
  markText: { color: palette.white, fontSize: 21, fontWeight: '900' },
  logo: { color: '#13233C', fontSize: 18, fontWeight: '800', letterSpacing: 1, marginLeft: 10 },
  logoInverse: { color: palette.white },
  accent: { color: palette.blue },
  accentInverse: { color: '#6AA4FF' },
});
