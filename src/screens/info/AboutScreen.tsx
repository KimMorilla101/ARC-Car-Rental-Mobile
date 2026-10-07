import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { type IconName } from '@/components/common/Icon';
import { IconTile } from '@/components/common/IconTile';
import { BackLink, PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

import { styles } from './AboutScreen.styles';

const reasons: { title: string; icon: IconName }[] = [
  { title: 'Clean, inspected vehicles', icon: 'shield' },
  { title: 'Transparent rental and fixed fees', icon: 'dollar-sign' },
  { title: 'Flexible pickup and delivery', icon: 'map-pin' },
  { title: 'Support before, during, and after every trip', icon: 'headphones' },
];

export default function AboutScreen() {
  const router = useRouter();
  const { status } = useAuth();
  return (
    <Screen>
      <ScrollView contentContainerStyle={screenStyles.stackScroll}>
        <BackLink />
        <PageHeader title="About ARC Ride" subtitle="Davao City's trusted car rental." />
        <Image source={{ uri: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=85' }} style={styles.hero} contentFit="cover" />
        <Text style={styles.title}>Drive with confidence.</Text>
        <Text style={styles.text}>ARC Car Rental makes every journey easier with dependable vehicles, clear pricing, and customer-first support across Davao.</Text>
        <Text style={styles.heading}>Our mission</Text>
        <Text style={styles.text}>To give every customer a safe, simple, and trustworthy way to move.</Text>
        <Text style={styles.heading}>Why customers choose us</Text>
        {reasons.map((reason) => (
          <View key={reason.title} style={styles.reason}>
            <IconTile name={reason.icon} color={palette.blue} background={palette.blueSoft} size={36} />
            <Text style={styles.reasonText}>{reason.title}</Text>
          </View>
        ))}
        <Button
          label={status === 'signedIn' ? 'Browse Available Cars' : 'Create an Account'}
          trailingIcon="arrow-right"
          onPress={() => router.push(status === 'signedIn' ? '/browse' : '/register')}
          style={styles.button}
        />
      </ScrollView>
    </Screen>
  );
}
