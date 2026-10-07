import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { type IconName } from '@/components/common/Icon';
import { IconTile } from '@/components/common/IconTile';
import { palette, text, gradients } from '@/constants/theme';

import { styles } from './WhyArcSection.styles';

const reasons: { title: string; body: string; icon: IconName; color: string; tint: string; background: string }[] = [
  { title: 'Inspected & Verified', body: 'Every vehicle is inspected before each rental to keep you safe on every road.', icon: 'shield', color: palette.blue, tint: palette.blueTint, background: palette.blueSoft },
  { title: 'Transparent Pricing', body: 'What you see during booking is exactly what you pay. No hidden charges.', icon: 'dollar-sign', color: palette.green, tint: palette.greenSoft, background: '#ECFDF5' },
  { title: '24/7 Support', body: 'Our team is available any time for roadside assistance, questions, or booking changes.', icon: 'headphones', color: palette.purple, tint: palette.purpleSoft, background: '#F5F3FF' },
];

/** "Why ARC Ride?" feature cards and the Smart Match call-to-action at the bottom of Home. */
export function WhyArcSection() {
  const router = useRouter();
  return (
    <View>
      <Text style={styles.heading}>Why ARC Ride?</Text>
      <Text style={[text.subtitle, styles.subheading]}>A rental experience designed entirely for you</Text>
      {reasons.map((reason) => (
        <View key={reason.title} style={[styles.card, { backgroundColor: reason.background, borderColor: reason.tint }]}>
          <IconTile name={reason.icon} color={reason.color} background={reason.tint} />
          <Text style={styles.cardTitle}>{reason.title}</Text>
          <Text style={styles.cardBody}>{reason.body}</Text>
        </View>
      ))}
      <LinearGradient colors={gradients.blue} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
        <View style={styles.ctaPill}>
          <Text style={styles.ctaPillText}>✦ Smart Recommendations</Text>
        </View>
        <Text style={styles.ctaTitle}>Not sure which car to pick?</Text>
        <Text style={styles.ctaBody}>Tell us about your trip and budget, and we will suggest the cars that fit best.</Text>
        <Button label="Get My Car Match" icon="star" variant="onDark" size="sm" onPress={() => router.push({ pathname: '/browse', params: { sort: 'recommended' } })} style={styles.ctaButton} />
      </LinearGradient>
    </View>
  );
}
