import type { RefObject } from 'react';
import { Platform, type TextInput } from 'react-native';

// Some Android keyboards send an Enter key-up right after the "Next" action, and React Native hides
// the keyboard on that key-up. Focusing a moment later lets it finish, so the keyboard stays open.
const ANDROID_DELAY_MS = 100;

/** Moves focus to another field from a keyboard "Next" key (use in onSubmitEditing). */
export function focusNextField(ref: RefObject<TextInput | null>) {
  if (Platform.OS === 'android') setTimeout(() => ref.current?.focus(), ANDROID_DELAY_MS);
  else ref.current?.focus();
}
