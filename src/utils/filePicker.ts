import { File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import type { UploadFile } from '@/types/api';

/**
 * Client-side limits for quick feedback only. Laravel must check size, MIME type and the real file
 * content again on the server, and strip image metadata.
 */
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

export type PickResult = { file: UploadFile } | { canceled: true } | { error: string };

/** Size reported by the picker, or read from the file itself; null when it cannot be determined. */
function sizeOf(asset: ImagePicker.ImagePickerAsset): number | null {
  if (asset.fileSize) return asset.fileSize;
  try {
    return new File(asset.uri).size;
  } catch {
    return null;
  }
}

/** Opens the photo library for one image (documents, receipts, profile photo). */
export async function pickImage(options: { square?: boolean } = {}): Promise<PickResult> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    quality: 0.7,
    allowsEditing: options.square ?? false,
    aspect: options.square ? [1, 1] : undefined,
    // Never read photo metadata such as GPS location into the app.
    exif: false,
  });
  if (result.canceled) return { canceled: true };

  const asset = result.assets[0];
  const mimeType = (asset.mimeType ?? 'image/jpeg').toLowerCase();
  if (!ALLOWED_TYPES.includes(mimeType)) {
    discardTemporaryFile(asset.uri);
    return { error: 'Please choose a JPG, PNG, WebP or HEIC photo.' };
  }
  const size = sizeOf(asset);
  if (size === null || size > MAX_UPLOAD_BYTES) {
    discardTemporaryFile(asset.uri);
    return { error: size === null ? 'That photo could not be read. Please choose another one.' : 'That image is larger than 5 MB. Please choose a smaller one.' };
  }
  return {
    file: {
      uri: asset.uri,
      name: asset.fileName ?? `upload-${Date.now()}.jpg`,
      mimeType,
    },
  };
}

/**
 * Deletes the app's own temporary copy of a picked photo (the picker copies photos into the app's
 * cache folder). Files outside that folder, such as the user's original photos, are never touched.
 * Call it only after the server has accepted the upload, so a failed upload can be retried.
 */
export function discardTemporaryFile(uri: string) {
  try {
    if (!uri.startsWith(Paths.cache.uri)) return;
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Best effort: the operating system also clears the cache folder when space is needed.
  }
}
