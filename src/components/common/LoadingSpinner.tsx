import { ActivityIndicator, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import { styles } from './LoadingSpinner.styles';

export function LoadingSpinner({ label, fullScreen = false }: { label?: string; fullScreen?: boolean }) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]} accessibilityRole="progressbar" accessibilityLabel={label ?? 'Loading'}>
      <ActivityIndicator color={palette.blue} size="large" />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}
