import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { useAuth } from '@/hooks/useAuth';
import { useSubmit } from '@/hooks/useSubmit';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { hasErrors, MIN_PASSWORD_LENGTH, rules, validate } from '@/utils/validation';

import { styles } from './RegisterForm.styles';

const FIELDS = ['name', 'email', 'phone', 'password', 'passwordConfirmation'] as const;
type Field = (typeof FIELDS)[number];

export function RegisterForm() {
  const { register } = useAuth();
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', phone: '', password: '', passwordConfirmation: '' });
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
      phone: [rules.required('Phone number'), rules.phPhone()],
      password: [rules.required('Password'), rules.password()],
      passwordConfirmation: [rules.required('Password confirmation'), rules.matches(() => values.password, 'Passwords do not match.')],
    });
    setErrors(found);
    if (hasErrors(found)) return;
    // On success the route guard moves the new renter to Home.
    await submit({ ...values, phone: values.phone.replace(/[\s-]/g, '') });
  };

  const serverErrors = getFieldErrors(error, FIELDS);
  const fieldError = (field: Field) => errors[field] ?? serverErrors[field];

  return (
    <View>
      <ErrorMessage message={getFormError(error, FIELDS)} />
      <FormField label="Full name" icon="user" placeholder="Juan Dela Cruz" value={values.name} onChangeText={update('name')} error={fieldError('name')} autoComplete="name" textContentType="name" autoCapitalize="words" />
      <FormField
        label="Email address"
        icon="mail"
        placeholder="juan@email.com"
        value={values.email}
        onChangeText={update('email')}
        error={fieldError('email')}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <FormField
        label="Phone number"
        icon="phone"
        placeholder="+63 9XX XXX XXXX"
        value={values.phone}
        onChangeText={update('phone')}
        error={fieldError('phone')}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
      />
      <FormField
        label="Password"
        icon="lock"
        placeholder={`Min. ${MIN_PASSWORD_LENGTH} characters`}
        value={values.password}
        onChangeText={update('password')}
        error={fieldError('password')}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <FormField
        label="Confirm password"
        icon="lock"
        placeholder="Repeat password"
        value={values.passwordConfirmation}
        onChangeText={update('passwordConfirmation')}
        error={fieldError('passwordConfirmation')}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />
      <Button label="Create Account" icon="check-circle" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
      <Text style={styles.terms}>
        By creating an account, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}
