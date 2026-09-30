import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

/** The Trust Score is managed by ARC staff and only visible to the renter. */
export function TrustScoreCard({ score, caption = 'Visible to you, managed by ARC Car Rental' }: { score: number | null; caption?: string }) {
  return (
    <View style={styles.card} accessibilityLabel={`ARC Trust Score ${score === null ? 'not rated yet' : `${score} percent`}`}>
      <View style={styles.copy}>
        <Text style={styles.label}>YOUR ARC TRUST SCORE</Text>
        <Text style={styles.caption}>{score === null ? 'Complete your first rental to get a score' : caption}</Text>
      </View>
      <Text style={styles.value}>{score === null ? '—' : `${score}%`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.navy, borderRadius: 16, padding: 16, marginTop: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  copy: { flex: 1 },
  label: { color: palette.onNavyAccent, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  caption: { color: palette.onNavyMuted, fontSize: 11, marginTop: 5 },
  value: { color: palette.white, fontSize: 27, fontWeight: '900' },
});
