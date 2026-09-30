/**
 * ARC Ride design tokens, taken from the Figma-based screens.
 * Use these instead of hard-coded hex values so the palette stays consistent.
 */
export const palette = {
  navy: '#10213A',
  navySoft: '#1E3150',
  navyLine: '#30425E',
  blue: '#347FF5',
  blueSoft: '#EAF2FF',
  blueTint: '#F0F6FF',
  ink: '#18263B',
  muted: '#718098',
  mutedLight: '#9BA8BB',
  placeholder: '#8B9AB0',
  label: '#63758F',
  line: '#DCE5F0',
  border: '#E8EDF4',
  divider: '#EEF1F5',
  canvas: '#F6F8FC',
  white: '#FFFFFF',
  green: '#10A979',
  greenSoft: '#E3F8F0',
  amber: '#A96800',
  amberText: '#8B6D39',
  amberSoft: '#FFF7E8',
  amberStrong: '#C9811A',
  star: '#E69A24',
  danger: '#D65B65',
  dangerSoft: '#FDECEE',
  disabled: '#B8C4D4',
  skeleton: '#E4EAF2',
  onNavyMuted: '#A9B7CA',
  onNavyAccent: '#93B9F5',
} as const;

export const radius = { sm: 9, md: 13, lg: 16, xl: 18, pill: 20 } as const;

/** Horizontal page gutter used by every scrolling screen. */
export const gutter = 20;

/** Height of the custom bottom tab bar, excluding the device safe-area inset. */
export const tabBarHeight = 68;
