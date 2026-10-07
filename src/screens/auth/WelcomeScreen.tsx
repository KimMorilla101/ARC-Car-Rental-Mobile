import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, type ButtonVariant } from '@/components/common/Button';
import { FocusAwareStatusBar } from '@/components/common/FocusAwareStatusBar';
import { Icon, type IconName } from '@/components/common/Icon';
import { palette, gradients } from '@/constants/theme';

import { styles } from './WelcomeScreen.styles';

interface Slide {
  eyebrow: string;
  title: string;
  body: string;
  icon: IconName;
  accent: string;
  button: ButtonVariant;
  image: string;
}

// Onboarding copy from the Figma prototype. Swap the photos for the exported Figma assets.
const slides: Slide[] = [
  {
    eyebrow: 'WELCOME TO ARC RIDE',
    title: 'Find Your\nPerfect Car',
    body: 'Browse premium vehicles. Smart recommendations matched to your trip type, budget, and passenger count.',
    icon: 'truck',
    accent: palette.blueBright,
    button: 'primary',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    eyebrow: 'SIMPLE BOOKING',
    title: 'Book in\nMinutes',
    body: 'Set your pickup date, return date, and location. Send your booking in a few taps and track its status in the app.',
    icon: 'zap',
    accent: palette.green,
    button: 'success',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    eyebrow: 'TRUSTED SERVICE',
    title: 'Drive with\nConfidence',
    body: 'Every vehicle is inspected and road-ready. Transparent pricing, zero hidden fees, 24/7 support.',
    icon: 'shield',
    accent: palette.purple,
    button: 'purple',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
  },
];

/** First screen for signed-out users: three-slide onboarding that ends at sign-in. */
export default function WelcomeScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const last = index === slides.length - 1;

  const next = () => (last ? router.push('/login') : setIndex(index + 1));

  return (
    <ImageBackground source={{ uri: slide.image }} style={styles.background} contentFit="cover" transition={300}>
      <FocusAwareStatusBar style="light" />
      <LinearGradient colors={gradients.heroOverlay} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={() => router.push('/login')} hitSlop={12} style={styles.skip} accessibilityRole="button">
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <View style={styles.content}>
          <View style={[styles.iconTile, { backgroundColor: `${slide.accent}26`, borderColor: `${slide.accent}55` }]}>
            <Icon name={slide.icon} size={22} color={slide.accent} />
          </View>
          <Text style={[styles.eyebrow, { color: slide.accent }]}>{slide.eyebrow}</Text>
          <Text style={styles.title} accessibilityRole="header">
            {slide.title}
          </Text>
          <Text style={styles.body}>{slide.body}</Text>
          <View style={styles.dots} accessibilityLabel={`Slide ${index + 1} of ${slides.length}`}>
            {slides.map((item, dotIndex) => (
              <Pressable key={item.eyebrow} onPress={() => setIndex(dotIndex)} hitSlop={6} accessibilityRole="button" accessibilityLabel={`Go to slide ${dotIndex + 1}`}>
                <View style={[styles.dot, dotIndex === index && [styles.dotActive, { backgroundColor: slide.accent }]]} />
              </Pressable>
            ))}
          </View>
          <Button label={last ? 'Get Started' : 'Continue'} trailingIcon="chevron-right" variant={slide.button} onPress={next} />
          <Pressable onPress={() => router.push('/register')} hitSlop={8} style={styles.registerLink} accessibilityRole="link">
            <Text style={styles.registerText}>
              New here? <Text style={styles.registerAccent}>Create an account</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
