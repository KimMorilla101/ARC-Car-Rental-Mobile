import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Checkbox } from '@/components/common/Checkbox';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { palette } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useSubmit } from '@/hooks/useSubmit';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { hasErrors, rules, validate } from '@/utils/validation';

const FIELDS = ['email', 'password'] as const;

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<(typeof FIELDS)[number], string>>>({});
  const { submit, isSubmitting, error, reset } = useSubmit(signIn);

  const update = (field: (typeof FIELDS)[number]) => (text: string) => {
    setValues((current) => ({ ...current, [field]: text }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    reset();
  };

  const onSubmit = async () => {
    const found = validate(values, {
      email: [rules.required('Email'), rules.email()],
      password: [rules.required('Password')],
    });
    setErrors(found);
    if (hasErrors(found)) return;
    const result = await submit({ ...values, remember });
    // On success the route guard moves the renter to Home; on failure show server errors inline.
    if (!result.ok) setValues((current) => ({ ...current, password: '' }));
  };

  const serverErrors = getFieldErrors(error, FIELDS);

  return (
    <View>
      <ErrorMessage message={getFormError(error, FIELDS)} />
      <FormField
        label="Email address"
        placeholder="you@example.com"
        value={values.email}
        onChangeText={update('email')}
        error={errors.email ?? serverErrors.email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <FormField
        label="Password"
        placeholder="Enter your password"
        value={values.password}
        onChangeText={update('password')}
        error={errors.password ?? serverErrors.password}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />
      <View style={styles.options}>
        <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
        <Pressable onPress={() => router.push('/forgot-password')} hitSlop={8} accessibilityRole="link">
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
      </View>
      <PrimaryButton label="Sign in  →" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>New to ARC Ride? </Text>
        <Pressable onPress={() => router.replace('/register')} hitSlop={8} accessibilityRole="link">
          <Text style={styles.link}>Create account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  options: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  link: { color: palette.blue, fontSize: 13, fontWeight: '800' },
  submit: { marginTop: 28 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: palette.muted, fontSize: 13 },
});
