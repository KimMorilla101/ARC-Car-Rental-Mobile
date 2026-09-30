import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { apiConfig } from '@/constants/api';
import { gutter, palette } from '@/constants/theme';

interface TopBarProps {
  title?: string;
  back?: boolean;
  action?: ReactNode;
}

export function TopBar({ title, back = false, action }: TopBarProps) {
  const router = useRouter();
  return (
    <View style={styles.bar}>
      {back ? (
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>A</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
        {title ?? (
          <Text>
            ARC <Text style={styles.accent}>RIDE</Text>
          </Text>
        )}
      </Text>
      {apiConfig.useMockApi && (
        <View style={styles.mockBadge} accessibilityLabel="Demo data mode">
          <Text style={styles.mockText}>DEMO DATA</Text>
        </View>
      )}
      <View style={styles.spacer} />
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { height: 64, paddingHorizontal: gutter, flexDirection: 'row', alignItems: 'center', backgroundColor: palette.canvas },
  brandMark: { width: 34, height: 34, borderRadius: 10, backgroundColor: palette.blue, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: palette.white, fontSize: 20, fontWeight: '900' },
  back: { width: 32 },
  backText: { color: palette.navy, fontSize: 34, lineHeight: 34 },
  title: { color: palette.navy, fontSize: 18, fontWeight: '800', marginLeft: 10, flexShrink: 1 },
  accent: { color: palette.blue },
  spacer: { flex: 1 },
  mockBadge: { marginLeft: 8, backgroundColor: palette.amberSoft, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  mockText: { color: palette.amber, fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
});
