import * as ImagePicker from 'expo-image-picker';

import type { UploadFile } from '@/types/api';

/** Client-side limit for quick feedback; Laravel must enforce its own max file size and MIME types. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type PickResult = { file: UploadFile } | { canceled: true } | { error: string };

/** Opens the photo library for one image (documents, receipts, profile photo). */
export async function pickImage(options: { square?: boolean } = {}): Promise<PickResult> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    quality: 0.7,
    allowsEditing: options.square ?? false,
    aspect: options.square ? [1, 1] : undefined,
  });
  if (result.canceled) return { canceled: true };

  const asset = result.assets[0];
  if (asset.fileSize && asset.fileSize > MAX_UPLOAD_BYTES) return { error: 'That image is larger than 5 MB. Please choose a smaller one.' };
  return {
    file: {
      uri: asset.uri,
      name: asset.fileName ?? `upload-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    },
  };
}
