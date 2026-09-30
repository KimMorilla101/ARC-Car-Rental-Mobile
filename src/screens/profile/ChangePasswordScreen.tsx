import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { palette } from '@/constants/theme';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [changed, setChanged] = useState(false);

  return (
    <Screen>
      <TopBar back title="Change password" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={screenStyles.stackScroll} keyboardShouldPersistTaps="handled">
          {changed ? (
            <View style={styles.success} accessibilityLiveRegion="polite">
              <Text style={styles.check}>✓</Text>
              <Text style={styles.title}>Password updated</Text>
              <Text style={styles.text}>Use your new password the next time you sign in.</Text>
              <PrimaryButton label="Back to profile" onPress={() => router.back()} style={styles.stretch} />
            </View>
          ) : (
            <>
              <Text style={screenStyles.subtitle}>Choose a strong password you do not use anywhere else.</Text>
              <ChangePasswordForm onChanged={() => setChanged(true)} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  success: { alignItems: 'center', paddingVertical: 30 },
  check: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#DDF7ED', color: palette.green, textAlign: 'center', lineHeight: 58, fontSize: 28, fontWeight: '900', overflow: 'hidden' },
  title: { color: palette.navy, fontSize: 22, fontWeight: '900', marginTop: 14 },
  text: { color: palette.muted, fontSize: 14, textAlign: 'center', marginTop: 6 },
  stretch: { alignSelf: 'stretch' },
});
