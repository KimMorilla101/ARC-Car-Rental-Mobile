import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

export function SectionTitle({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.heading} accessibilityRole="header">
        {title}
      </Text>
      {action && (
        <Pressable onPress={onPress} hitSlop={10} accessibilityRole="button">
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  heading: { color: palette.navy, fontSize: 19, fontWeight: '800' },
  action: { color: palette.blue, fontSize: 13, fontWeight: '800' },
});
