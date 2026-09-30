import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import { greeting } from '@/utils/formatters';

export function WelcomeHeader({ name }: { name: string }) {
  const firstName = name.split(' ')[0];
  return (
    <View>
      <Text style={styles.greeting}>
        {greeting()}, {firstName}
      </Text>
      <Text style={styles.heading} accessibilityRole="header">
        Where will you go next?
      </Text>
      <Text style={styles.subheading}>Find a car that fits the journey.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: { color: palette.blue, fontSize: 13, fontWeight: '800', marginTop: 8 },
  heading: { color: palette.navy, fontSize: 30, fontWeight: '900', letterSpacing: -0.8, marginTop: 5 },
  subheading: { color: palette.muted, fontSize: 14, marginTop: 6 },
});
