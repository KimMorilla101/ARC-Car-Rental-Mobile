import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { apiConfig } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { useSubmit } from '@/hooks/useSubmit';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { hasErrors, rules, validate } from '@/utils/validation';

import { styles } from './LoginForm.styles';

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
        icon="mail"
        placeholder="juan@email.com"
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
        icon="lock"
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
      <Button label="Sign In" icon="arrow-right" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Pressable onPress={() => router.replace('/register')} hitSlop={8} accessibilityRole="link">
          <Text style={styles.link}>Create Account</Text>
        </Pressable>
      </View>
      {apiConfig.useMockApi && (
        <View style={styles.demo}>
          <Text style={styles.demoText}>Demo data mode: sign in with juan@example.com / password123</Text>
        </View>
      )}
    </View>
  );
}
