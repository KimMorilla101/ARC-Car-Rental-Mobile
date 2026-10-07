import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Icon } from '@/components/common/Icon';
import { palette, gradients } from '@/constants/theme';

import { styles } from './TrustScore.styles';

const caption = (score: number | null) => (score === null ? 'Complete your first rental to get a score' : 'Managed by ARC Car Rental · read only');

/** Ring chart of the renter's Trust Score (Profile). The score is set by ARC staff and cannot be edited. */
export function TrustScoreRing({ score }: { score: number | null }) {
  const size = 96;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = score === null ? 0 : Math.max(0, Math.min(100, score)) / 100;

  return (
    <View style={styles.ringCard} accessibilityLabel={`ARC Trust Score ${score === null ? 'not rated yet' : `${score} percent`}`}>
      <View style={styles.ring}>
        <Svg width={size} height={size}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={palette.blueTint} strokeWidth={stroke} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={palette.blue}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - progress)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={styles.ringValue}>{score === null ? '—' : `${score}%`}</Text>
        </View>
      </View>
      <View style={styles.ringCopy}>
        <Text style={styles.ringTitle}>ARC Trust Score</Text>
        <Text style={styles.ringCaption}>Based on your rental history and on-time returns.</Text>
        <View style={styles.readOnly}>
          <Icon name="lock" size={11} color={palette.muted} />
          <Text style={styles.readOnlyText}>{caption(score)}</Text>
        </View>
      </View>
    </View>
  );
}

/** Gradient Trust Score banner (Booking details). */
export function TrustScoreBanner({ score }: { score: number | null }) {
  return (
    <LinearGradient colors={gradients.trust} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
      <View style={styles.bannerCopy}>
        <View style={styles.bannerLabelRow}>
          <Icon name="award" size={14} color="#C7D2FE" />
          <Text style={styles.bannerLabel}>YOUR ARC TRUST SCORE</Text>
        </View>
        <Text style={styles.bannerCaption}>{caption(score)}</Text>
      </View>
      <Text style={styles.bannerValue}>{score === null ? '—' : `${score}%`}</Text>
    </LinearGradient>
  );
}
