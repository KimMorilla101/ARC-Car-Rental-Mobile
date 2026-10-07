import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { BackLink, PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileImagePicker } from '@/components/profile/ProfileImagePicker';
import { useAuth } from '@/hooks/useAuth';

import { styles } from './EditProfileScreen.styles';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  if (!user) return null;

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={screenStyles.stackScroll} keyboardShouldPersistTaps="handled">
          <BackLink label="Profile" />
          <PageHeader title="Edit Profile" subtitle="Keep your contact details up to date." />
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
