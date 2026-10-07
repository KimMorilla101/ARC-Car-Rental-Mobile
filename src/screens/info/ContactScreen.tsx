import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FormField } from '@/components/common/FormField';
import { Icon, type IconName } from '@/components/common/Icon';
import { IconTile } from '@/components/common/IconTile';
import { BackLink, PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useSubmit } from '@/hooks/useSubmit';
import { supportApi } from '@/services/supportApi';
import { getFieldErrors, getFormError } from '@/utils/errorHandler';
import { hasErrors, rules, validate } from '@/utils/validation';

import { styles } from './ContactScreen.styles';

const FIELDS = ['email', 'message'] as const;
type Field = (typeof FIELDS)[number];

// Business contact details from the Figma design; confirm with ARC Car Rental before release.
const contactDetails: { label: string; value: string; icon: IconName }[] = [
  { label: 'Call us', value: '+63 917 123 4567', icon: 'phone' },
  { label: 'Email', value: 'support@arcride.ph', icon: 'mail' },
  { label: 'Main branch', value: 'Ecoland Drive, Matina, Davao City', icon: 'map-pin' },
  { label: 'Business hours', value: 'Mon – Sun · 8:00 AM – 8:00 PM', icon: 'clock' },
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
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={screenStyles.stackScroll} keyboardShouldPersistTaps="handled">
          <BackLink />
          <PageHeader title="Contact Us" subtitle="Reach ARC Car Rental before, during, or after your trip." />
          <View style={styles.details}>
            {contactDetails.map((item) => (
              <View key={item.label} style={styles.detail}>
                <IconTile name={item.icon} color={palette.blue} background={palette.blueSoft} size={40} />
                <View style={styles.detailCopy}>
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={styles.detailValue} selectable>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <Card title="Send a Message" icon="message-circle" style={styles.card}>
          {sent && (
            <View style={styles.success} accessibilityLiveRegion="polite">
              <Icon name="check-circle" size={16} color={palette.greenDark} />
              <Text style={styles.successText}>Message sent. ARC Car Rental will reply by email.</Text>
            </View>
          )}
          <ErrorMessage message={getFormError(error, FIELDS)} />
          <FormField
            label="Your email"
            icon="mail"
            value={values.email}
            onChangeText={update('email')}
            error={errors.email ?? serverErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <FormField label="Message" placeholder="How can we help?" value={values.message} onChangeText={update('message')} error={errors.message ?? serverErrors.message} multiline />
          <Button label="Send Message" icon="send" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
