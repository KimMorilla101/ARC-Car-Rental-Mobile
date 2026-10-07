import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { Icon } from '@/components/common/Icon';
import { palette } from '@/constants/theme';
import { useSubmit } from '@/hooks/useSubmit';
import { authApi } from '@/services/authApi';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { rules, validate } from '@/utils/validation';

import { styles } from './PasswordResetForm.styles';

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
        <View style={styles.check}>
          <Icon name="mail" size={26} color={palette.green} />
        </View>
        <Text style={styles.successTitle}>Check your email</Text>
        <Text style={styles.successText}>If an ARC Ride account uses {email.trim()}, we sent a link to reset your password.</Text>
        <Button label="Back to Login" onPress={() => router.replace('/login')} style={styles.stretch} />
      </View>
    );
  }

  return (
    <View>
      <ErrorMessage message={getFormError(error, FIELDS)} />
      <FormField
        label="Email address"
        icon="mail"
        placeholder="you@example.com"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
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
      <Button label="Send Reset Link" icon="send" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
    </View>
  );
}
