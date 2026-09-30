import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

export function LoadingSpinner({ label, fullScreen = false }: { label?: string; fullScreen?: boolean }) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]} accessibilityRole="progressbar" accessibilityLabel={label ?? 'Loading'}>
      <ActivityIndicator color={palette.blue} size="large" />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 30 },
  fullScreen: { flex: 1, backgroundColor: palette.canvas },
  label: { color: palette.muted, fontSize: 13, marginTop: 12 },
});
