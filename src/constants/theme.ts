import type { TextStyle, ViewStyle } from 'react-native';

/**
 * ARC Ride design tokens, taken from the Figma mockups.
 * Use these instead of hard-coded values so every screen stays consistent.
 */
export const palette = {
  // Brand blue
  blue: '#2563EB',
  blueBright: '#3B82F6',
  blueDark: '#1D4ED8',
  blueSoft: '#EFF6FF',
  blueTint: '#DBEAFE',
  // Text
  navy: '#0F172A',
  ink: '#1E293B',
  muted: '#64748B',
  mutedLight: '#94A3B8',
  placeholder: '#94A3B8',
  label: '#475569',
  // Surfaces
  canvas: '#F7F9FC',
  white: '#FFFFFF',
  line: '#E2E8F0',
  border: '#E8EDF4',
  divider: '#F1F5F9',
  field: '#F8FAFC',
  // Dark hero / onboarding
  night: '#0B1220',
  nightSoft: '#1E293B',
  onDark: '#CBD5E1',
  onDarkMuted: '#94A3B8',
  // Status
  green: '#10B981',
  greenDark: '#047857',
  greenSoft: '#D1FAE5',
  amber: '#B45309',
  amberText: '#92400E',
  amberSoft: '#FEF3C7',
  amberBorder: '#FDE68A',
  amberStrong: '#D97706',
  purple: '#8B5CF6',
  purpleDark: '#6D28D9',
  purpleSoft: '#EDE9FE',
  danger: '#EF4444',
  dangerText: '#B91C1C',
  dangerSoft: '#FEE2E2',
  star: '#F59E0B',
  disabled: '#93B4F5',
  disabledGray: '#CBD5E1',
  skeleton: '#E2E8F0',
} as const;

/**
 * Font families: DM Serif Display for large brand titles, Inter for everything else. Custom fonts
 * ignore `fontWeight` on Android, so always pick the family for the weight you want instead.
 *
 * Type scale: 11 · 12 · 13 · 14 · 16 · 18 · 20 · 24 · 28 · 32 · 40. Text at 13px or smaller uses
 * semibold at most; bold is the heaviest weight.
 *
 * Native system fonts are never bundled: SF Pro (iOS) and Roboto (Android) appear only where the
 * operating system draws its own UI — date/time pickers, the photo picker, the keyboard — and in the
 * crash screen (ErrorBoundary), which avoids custom fonts in case they failed to load. SF Pro's
 * licence only covers Apple platforms. Proxima Nova is not used: it is a commercial font that needs
 * a licence covering app embedding before its files can be added.
 */
export const font = {
  display: 'DMSerifDisplay_400Regular',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const gradients = {
  blue: ['#3B82F6', '#1D4ED8'],
  green: ['#10B981', '#047857'],
  purple: ['#A855F7', '#6D28D9'],
  dark: ['#1E293B', '#0F172A'],
  trust: ['#1D4ED8', '#7C3AED'],
  heroOverlay: ['rgba(11,18,32,0.35)', 'rgba(11,18,32,0.75)', '#0B1220'],
} as const satisfies Record<string, readonly [string, string, ...string[]]>;

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 } as const;

/** Horizontal page gutter used by every scrolling screen. */
export const gutter = 20;

/** Height of the custom bottom tab bar, excluding the device safe-area inset. */
export const tabBarHeight = 64;

export const shadow = {
  card: { shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  button: { shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
} satisfies Record<string, ViewStyle>;

/** Reusable text styles from the mockups. */
export const text = {
  // Large serif titles read more polished with slightly tighter letter spacing.
  pageTitle: { fontFamily: font.display, fontSize: 32, lineHeight: 38, letterSpacing: -0.3, color: palette.navy },
  sectionTitle: { fontFamily: font.bold, fontSize: 18, lineHeight: 24, color: palette.navy },
  subtitle: { fontFamily: font.regular, fontSize: 14, lineHeight: 21, color: palette.muted },
  body: { fontFamily: font.regular, fontSize: 14, lineHeight: 21, color: palette.ink },
  label: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1, color: palette.label },
  eyebrow: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1.4 },
  caption: { fontFamily: font.regular, fontSize: 12, lineHeight: 17, color: palette.muted },
} satisfies Record<string, TextStyle>;
