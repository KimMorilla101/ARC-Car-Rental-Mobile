import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { ErrorMessage } from '@/components/common/ErrorMessage';
import { palette } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { profileApi } from '@/services/profileApi';
import { getErrorMessage } from '@/utils/errorHandler';
import { pickImage } from '@/utils/filePicker';
import { initials } from '@/utils/formatters';

import { styles } from './ProfileImagePicker.styles';

/** Avatar that uploads a new photo immediately; the avatar only changes after the server accepts it. */
export function ProfileImagePicker() {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!user) return null;

  const change = async () => {
    setError(null);
    const picked = await pickImage({ square: true });
    if ('error' in picked) return setError(picked.error);
    if (!('file' in picked)) return;
    setUploading(true);
    try {
      updateUser(await profileApi.uploadAvatar(picked.file));
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={change} disabled={uploading} accessibilityRole="button" accessibilityLabel="Change profile photo">
        <Avatar name={user.name} url={user.avatarUrl} size={88} />
        <View style={styles.overlay}>{uploading ? <ActivityIndicator color={palette.white} /> : <Text style={styles.overlayText}>Change</Text>}</View>
      </Pressable>
      <ErrorMessage message={error} />
    </View>
  );
}

export function Avatar({ name, url, size = 76 }: { name: string; url: string | null; size?: number }) {
  const shape = { width: size, height: size, borderRadius: size / 2 };
  if (url) return <Image source={{ uri: url }} style={shape} contentFit="cover" accessibilityLabel={`${name}'s photo`} />;
  return (
    <View style={[styles.initials, shape]}>
      <Text style={[styles.initialsText, { fontSize: size * 0.32 }]}>{initials(name)}</Text>
    </View>
  );
}
