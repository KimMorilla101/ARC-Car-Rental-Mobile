import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/common/Button';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { useSubmit } from '@/hooks/useSubmit';
import { profileApi } from '@/services/profileApi';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { hasErrors, MIN_PASSWORD_LENGTH, rules, validate } from '@/utils/validation';

import { styles } from './ChangePasswordForm.styles';

const FIELDS = ['currentPassword', 'password', 'passwordConfirmation'] as const;
type Field = (typeof FIELDS)[number];
const EMPTY: Record<Field, string> = { currentPassword: '', password: '', passwordConfirmation: '' };

export function ChangePasswordForm({ onChanged }: { onChanged: () => void }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const { submit, isSubmitting, error, reset } = useSubmit(profileApi.changePassword);

  const update = (field: Field) => (text: string) => {
    setValues((current) => ({ ...current, [field]: text }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    reset();
  };

  const onSubmit = async () => {
    const found = validate(values, {
      currentPassword: [rules.required('Current password')],
      password: [rules.required('New password'), rules.password(), (value) => (value === values.currentPassword ? 'Choose a password different from your current one.' : null)],
      passwordConfirmation: [rules.required('Password confirmation'), rules.matches(() => values.password, 'Passwords do not match.')],
    });
    setErrors(found);
    if (hasErrors(found)) return;
    const result = await submit(values);
    // Never keep passwords in state longer than needed.
    setValues(EMPTY);
    if (result.ok) onChanged();
  };

  const serverErrors = getFieldErrors(error, FIELDS);
  const fieldError = (field: Field) => errors[field] ?? serverErrors[field];

  return (
    <View>
      <ErrorMessage message={getFormError(error, FIELDS)} />
      <FormField label="Current password" icon="lock" value={values.currentPassword} onChangeText={update('currentPassword')} error={fieldError('currentPassword')} secureTextEntry autoComplete="current-password" textContentType="password" />
      <FormField
        label="New password"
        icon="lock"
        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
        value={values.password}
        onChangeText={update('password')}
        error={fieldError('password')}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <FormField
        label="Confirm new password"
        icon="lock"
        value={values.passwordConfirmation}
        onChangeText={update('passwordConfirmation')}
        error={fieldError('passwordConfirmation')}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={onSubmit}
      />
      <Button label="Update Password" icon="check" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
    </View>
  );
}
