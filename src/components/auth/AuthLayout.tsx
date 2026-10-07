import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { BackLink } from '@/components/common/PageHeader';
import { Screen } from '@/components/common/Screen';
import { text } from '@/constants/theme';

import { styles } from './AuthLayout.styles';

interface AuthLayoutProps {
  backLabel?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Shared shell for sign-in, registration and password reset. */
export function AuthLayout({ backLabel, title, subtitle, children }: AuthLayoutProps) {
  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {backLabel ? <BackLink label={backLabel} /> : null}
          <View style={styles.header}>
            <Text style={text.pageTitle} accessibilityRole="header">
              {title}
            </Text>
            <Text style={text.subtitle}>{subtitle}</Text>
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
