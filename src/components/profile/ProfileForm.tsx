import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/common/Button';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { useSubmit } from '@/hooks/useSubmit';
import { profileApi } from '@/services/profileApi';
import type { User } from '@/types/auth';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { hasErrors, rules, validate } from '@/utils/validation';

import { styles } from './ProfileForm.styles';

const FIELDS = ['name', 'phone', 'address'] as const;
type Field = (typeof FIELDS)[number];

export function ProfileForm({ user, onSaved }: { user: User; onSaved: (user: User) => void }) {
  const [values, setValues] = useState<Record<Field, string>>({ name: user.name, phone: user.phone ?? '', address: user.address ?? '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const { submit, isSubmitting, error, reset } = useSubmit(profileApi.update);

  const update = (field: Field) => (text: string) => {
    setValues((current) => ({ ...current, [field]: text }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    reset();
  };

  const onSubmit = async () => {
    const found = validate(values, { name: [rules.required('Full name'), rules.minLength('Full name', 2)], phone: [rules.phPhone()] });
    setErrors(found);
    if (hasErrors(found)) return;
    const result = await submit({ name: values.name.trim(), phone: values.phone.trim() || null, address: values.address.trim() || null });
    if (result.ok) onSaved(result.value);
  };

  const serverErrors = getFieldErrors(error, FIELDS);

  return (
    <View>
      <ErrorMessage message={getFormError(error, FIELDS)} />
      <FormField label="Full name" icon="user" value={values.name} onChangeText={update('name')} error={errors.name ?? serverErrors.name} autoComplete="name" autoCapitalize="words" />
      <FormField label="Email address" icon="mail" value={user.email} editable={false} helper="Contact ARC Car Rental to change your email." />
      <FormField
        label="Mobile number"
        icon="phone"
        placeholder="09171234567"
        value={values.phone}
        onChangeText={update('phone')}
        error={errors.phone ?? serverErrors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
      />
      <FormField label="Address" icon="map-pin" placeholder="City or full address" value={values.address} onChangeText={update('address')} error={serverErrors.address} autoComplete="street-address" />
      <Button label="Save Changes" icon="check" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
    </View>
  );
}
