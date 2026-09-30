import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { InfoRow } from '@/components/common/InfoRow';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { palette } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useSubmit } from '@/hooks/useSubmit';
import { supportApi } from '@/services/supportApi';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { hasErrors, rules, validate } from '@/utils/validation';

const FIELDS = ['email', 'message'] as const;
type Field = (typeof FIELDS)[number];

// Business contact details from the Figma design; confirm with ARC Car Rental before release.
const contactDetails = [
  { label: 'CALL', value: '+63 917 123 4567' },
  { label: 'EMAIL', value: 'support@arcride.ph' },
  { label: 'LOCATION', value: 'Davao City, Philippines' },
  { label: 'BUSINESS HOURS', value: 'Mon - Sun • 8:00 AM - 8:00 PM' },
];

export default function ContactScreen() {
  const { user } = useAuth();
  const [values, setValues] = useState<Record<Field, string>>({ email: user?.email ?? '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const { submit, isSubmitting, error, reset } = useSubmit(supportApi.contact);

  const update = (field: Field) => (text: string) => {
    setValues((current) => ({ ...current, [field]: text }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    reset();
  };

  const onSubmit = async () => {
    const found = validate(values, { email: [rules.required('Email'), rules.email()], message: [rules.required('Message'), rules.minLength('Message', 10)] });
    setErrors(found);
    if (hasErrors(found)) return;
    const result = await submit({ email: values.email.trim(), message: values.message.trim() });
    if (result.ok) {
      setSent(true);
      setValues((current) => ({ ...current, message: '' }));
    }
  };

  const serverErrors = getFieldErrors(error, FIELDS);

  return (
    <Screen>
      <TopBar back title="Contact us" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={screenStyles.stackScroll} keyboardShouldPersistTaps="handled">
          <Text style={screenStyles.title}>We are here to help</Text>
          <Text style={screenStyles.subtitle}>Reach ARC Car Rental before, during, or after your trip.</Text>
          <View style={[screenStyles.card, styles.card]}>
            {contactDetails.map((item) => (
              <InfoRow key={item.label} label={item.label} value={item.value} />
            ))}
          </View>
          <Text style={screenStyles.section}>Send a message</Text>
          {sent && (
            <View style={styles.success} accessibilityLiveRegion="polite">
              <Text style={styles.successText}>✓ Message sent. ARC Car Rental will reply by email.</Text>
            </View>
          )}
          <ErrorMessage message={getFormError(error, FIELDS)} />
          <FormField
            label="Your email"
            value={values.email}
            onChangeText={update('email')}
            error={errors.email ?? serverErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <FormField label="Message" placeholder="How can we help?" value={values.message} onChangeText={update('message')} error={errors.message ?? serverErrors.message} multiline />
          <PrimaryButton label="Send message" onPress={onSubmit} loading={isSubmitting} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { marginTop: 22 },
  success: { backgroundColor: palette.greenSoft, borderRadius: 12, padding: 13 },
  successText: { color: palette.green, fontSize: 13, fontWeight: '700' },
});
