import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { BackLink, PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { palette } from '@/constants/theme';

import { styles } from './ChangePasswordScreen.styles';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [changed, setChanged] = useState(false);

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={screenStyles.stackScroll} keyboardShouldPersistTaps="handled">
          <BackLink label="Profile" />
          {changed ? (
            <View style={styles.success} accessibilityLiveRegion="polite">
              <View style={styles.check}>
                <Icon name="check-circle" size={32} color={palette.green} />
              </View>
              <Text style={styles.title}>Password Updated</Text>
              <Text style={styles.text}>Use your new password the next time you sign in.</Text>
              <Button label="Back to Profile" onPress={() => router.back()} style={styles.stretch} />
            </View>
          ) : (
            <>
              <PageHeader title="Change Password" subtitle="Choose a strong password you do not use anywhere else." />
              <ChangePasswordForm onChanged={() => setChanged(true)} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
