import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileImagePicker } from '@/components/profile/ProfileImagePicker';
import { useAuth } from '@/hooks/useAuth';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  if (!user) return null;

  return (
    <Screen>
      <TopBar back title="Edit profile" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={screenStyles.stackScroll} keyboardShouldPersistTaps="handled">
          <ProfileImagePicker />
          <ProfileForm
            user={user}
            onSaved={(saved) => {
              updateUser(saved);
              router.back();
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
