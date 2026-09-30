import { Stack } from 'expo-router';

import { palette } from '@/constants/theme';

/** Signed-out screens: welcome, sign in, register, forgot password. */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: palette.canvas } }} />;
}
