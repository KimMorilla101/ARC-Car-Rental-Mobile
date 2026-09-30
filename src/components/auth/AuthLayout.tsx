import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandLogo } from '@/components/common/BrandLogo';
import { Screen } from '@/components/common/Screen';
import { palette } from '@/constants/theme';

interface AuthLayoutProps {
  backLabel: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Shared shell for sign-in, registration and password reset. */
export function AuthLayout({ backLabel, title, subtitle, children }: AuthLayoutProps) {
  const router = useRouter();
  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} hitSlop={10} accessibilityRole="button">
            <Text style={styles.back}>‹ {backLabel}</Text>
          </Pressable>
          <View style={styles.logo}>
            <BrandLogo />
          </View>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 28, paddingTop: 18, justifyContent: 'center', width: '100%', maxWidth: 520, alignSelf: 'center' },
  back: { color: palette.blue, fontSize: 15, fontWeight: '700', marginBottom: 30 },
  logo: { marginBottom: 40 },
  title: { color: palette.navy, fontSize: 34, fontWeight: '800', letterSpacing: -1, marginBottom: 8 },
  subtitle: { color: '#708099', fontSize: 15, lineHeight: 22, marginBottom: 14 },
});
