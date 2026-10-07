import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';

import { palette } from '@/constants/theme';

export type IconName = ComponentProps<typeof Feather>['name'];

/** Line icons (Feather) matching the outline style used in the Figma design. */
export function Icon({ name, size = 18, color = palette.ink }: { name: IconName; size?: number; color?: string }) {
  return <Feather name={name} size={size} color={color} />;
}
