import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { palette } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useSubmit } from '@/hooks/useSubmit';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { hasErrors, MIN_PASSWORD_LENGTH, rules, validate } from '@/utils/validation';

const FIELDS = ['name', 'email', 'password', 'passwordConfirmation'] as const;
type Field = (typeof FIELDS)[number];

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', password: '', passwordConfirmation: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const { submit, isSubmitting, error, reset } = useSubmit(register);

  const update = (field: Field) => (text: string) => {
    setValues((current) => ({ ...current, [field]: text }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    reset();
  };

  const onSubmit = async () => {
    const found = validate(values, {
      name: [rules.required('Full name'), rules.minLength('Full name', 2)],
      email: [rules.required('Email'), rules.email()],
      password: [rules.required('Password'), rules.password()],
      passwordConfirmation: [rules.required('Password confirmation'), rules.matches(() => values.password, 'Passwords do not match.')],
    });
    setErrors(found);
    if (hasErrors(found)) return;
    // On success the route guard moves the new renter to Home.
    await submit(values);
  };

  const serverErrors = getFieldErrors(error, FIELDS);
  const fieldError = (field: Field) => errors[field] ?? serverErrors[field];

  return (
    <View>
      <ErrorMessage message={getFormError(error, FIELDS)} />
      <FormField label="Full name" placeholder="Juan Dela Cruz" value={values.name} onChangeText={update('name')} error={fieldError('name')} autoComplete="name" textContentType="name" autoCapitalize="words" />
      <FormField
        label="Email address"
        placeholder="you@example.com"
        value={values.email}
        onChangeText={update('email')}
        error={fieldError('email')}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <FormField
        label="Password"
        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
        value={values.password}
        onChangeText={update('password')}
        error={fieldError('password')}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <FormField
        label="Confirm password"
        placeholder="Re-enter your password"
        value={values.passwordConfirmation}
        onChangeText={update('passwordConfirmation')}
        error={fieldError('passwordConfirmation')}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />
      <PrimaryButton label="Create account  →" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => router.replace('/login')} hitSlop={8} accessibilityRole="link">
          <Text style={styles.link}>Sign in</Text>
        </Pressable>
      </View>
      <Text style={styles.terms}>By creating an account, you agree to our Terms of Service and Privacy Policy.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  submit: { marginTop: 28 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footerText: { color: palette.muted, fontSize: 13 },
  link: { color: palette.blue, fontSize: 13, fontWeight: '800' },
  terms: { color: '#8A98AA', fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 30 },
});
