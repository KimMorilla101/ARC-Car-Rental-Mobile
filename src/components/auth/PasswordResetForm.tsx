import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { palette } from '@/constants/theme';
import { useSubmit } from '@/hooks/useSubmit';
import { authApi } from '@/services/authApi';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { rules, validate } from '@/utils/validation';

const FIELDS = ['email'] as const;

/**
 * Requests a password-reset email. The reset itself happens through the link Laravel emails, so
 * the app only collects the address. The success message never reveals whether an account exists.
 */
export function PasswordResetForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const { submit, isSubmitting, error, reset } = useSubmit(authApi.forgotPassword);

  const onSubmit = async () => {
    const found = validate({ email }, { email: [rules.required('Email'), rules.email()] });
    setEmailError(found.email);
    if (found.email) return;
    const result = await submit({ email: email.trim() });
    if (result.ok) setSent(true);
  };

  if (sent) {
    return (
      <View style={styles.success} accessibilityLiveRegion="polite">
        <Text style={styles.check}>✓</Text>
        <Text style={styles.successTitle}>Check your email</Text>
        <Text style={styles.successText}>If an ARC Ride account uses {email.trim()}, we sent a link to reset your password.</Text>
        <PrimaryButton label="Back to sign in" onPress={() => router.replace('/login')} style={styles.stretch} />
      </View>
    );
  }

  return (
    <View>
      <ErrorMessage message={getFormError(error, FIELDS)} />
      <FormField
        label="Email address"
        placeholder="you@example.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(undefined);
          reset();
        }}
        error={emailError ?? getFieldErrors(error, FIELDS).email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={onSubmit}
      />
      <PrimaryButton label="Send reset link" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  submit: { marginTop: 28 },
  success: { alignItems: 'center', paddingVertical: 20 },
  check: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#DDF7ED', color: palette.green, textAlign: 'center', lineHeight: 58, fontSize: 28, fontWeight: '900', overflow: 'hidden' },
  successTitle: { color: palette.navy, fontSize: 22, fontWeight: '900', marginTop: 14 },
  successText: { color: palette.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  stretch: { alignSelf: 'stretch' },
});
