import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';

import { Car } from '@/constants/mock-data';

export const palette = {
  navy: '#10213A',
  blue: '#347FF5',
  blueSoft: '#EAF2FF',
  ink: '#18263B',
  muted: '#718098',
  line: '#DCE5F0',
  canvas: '#F6F8FC',
  white: '#FFFFFF',
  green: '#10A979',
};

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function TopBar({ title, back = false, action }: { title?: string; back?: boolean; action?: React.ReactNode }) {
  const router = useRouter();
  return (
    <View style={styles.topBar}>
      {back ? <Pressable onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>‹</Text></Pressable> : <View style={styles.brandMark}><Text style={styles.brandMarkText}>A</Text></View>}
      <Text style={styles.topTitle}>{title ?? <Text>ARC <Text style={styles.brandAccent}>RIDE</Text></Text>}</Text>
      {action ?? <View style={styles.topSpacer} />}
    </View>
  );
}

export function BottomNav({ active }: { active: 'home' | 'browse' | 'bookings' | 'alerts' | 'profile' }) {
  const router = useRouter();
  const items = [
    { key: 'home', label: 'Home', path: '/home', icon: '⌂' },
    { key: 'browse', label: 'Browse', path: '/browse', icon: '◫' },
    { key: 'bookings', label: 'Bookings', path: '/bookings', icon: '▣' },
    { key: 'alerts', label: 'Alerts', path: '/notifications', icon: '◌' },
    { key: 'profile', label: 'Profile', path: '/profile', icon: '○' },
  ] as const;
  return <View style={styles.bottomNav}>{items.map((item) => <Pressable key={item.key} style={styles.navItem} onPress={() => router.push(item.path as never)}><Text style={[styles.navIcon, active === item.key && styles.navActive]}>{item.icon}</Text><Text style={[styles.navLabel, active === item.key && styles.navActive]}>{item.label}</Text></Pressable>)}</View>;
}

export function SectionTitle({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return <View style={styles.sectionTitle}><Text style={styles.sectionHeading}>{title}</Text>{action && <Pressable onPress={onPress}><Text style={styles.sectionAction}>{action}</Text></Pressable>}</View>;
}

export function CarCard({ car, compact = false, onPress }: { car: Car; compact?: boolean; onPress?: () => void }) {
  const router = useRouter();
  const open = onPress ?? (() => router.push({ pathname: '/car-details' as never, params: { id: car.id } }));
  return <Pressable onPress={open} style={({ pressed }) => [styles.carCard, compact && styles.carCardCompact, pressed && styles.pressed]}>
    <Image source={{ uri: car.image }} style={compact ? styles.carImageCompact : styles.carImage} contentFit="cover" />
    <View style={styles.carBody}>
      <View style={styles.carNameRow}><View><Text style={styles.carName}>{car.name}</Text><Text style={styles.carCategory}>{car.category}  •  {car.seats} seats</Text><Text style={styles.availability}>{car.units.length} unit{car.units.length === 1 ? '' : 's'} available</Text></View><Text style={styles.rating}>★ {car.rating}</Text></View>
      {!compact && <View style={styles.specRow}><Text style={styles.spec}>A  {car.transmission}</Text><Text style={styles.spec}>●  {car.fuel}</Text></View>}
      <View style={styles.priceRow}><View><Text style={styles.price}>₱{car.price.toLocaleString()}<Text style={styles.perDay}> / day</Text></Text>{car.match && <Text style={styles.match}>{car.match}% match</Text>}</View><Text style={styles.viewLink}>View details  ›</Text></View>
    </View>
  </Pressable>;
}

export function SearchField({ value, onChangeText, placeholder }: { value?: string; onChangeText?: (text: string) => void; placeholder: string }) {
  return <View style={styles.searchField}><Text style={styles.searchIcon}>⌕</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={palette.muted} style={styles.searchInput} /></View>;
}

export function Pill({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'green' | 'gray' }) {
  return <View style={[styles.pill, tone === 'green' && styles.pillGreen, tone === 'gray' && styles.pillGray]}><Text style={[styles.pillText, tone === 'green' && styles.pillGreenText, tone === 'gray' && styles.pillGrayText]}>{children}</Text></View>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
  scroll: { paddingHorizontal: 20, paddingBottom: 110 },
  topBar: { height: 64, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: palette.canvas },
  brandMark: { width: 34, height: 34, borderRadius: 10, backgroundColor: palette.blue, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: palette.white, fontSize: 20, fontWeight: '900' },
  topTitle: { color: palette.navy, fontSize: 18, fontWeight: '800', marginLeft: 10 },
  brandAccent: { color: palette.blue },
  topSpacer: { flex: 1 }, backButton: { width: 32 }, backText: { color: palette.navy, fontSize: 34, lineHeight: 30 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 78, backgroundColor: palette.white, borderTopWidth: 1, borderTopColor: '#E8EDF4', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 },
  navItem: { alignItems: 'center', width: 70 }, navIcon: { color: '#9BA8BB', fontSize: 22, height: 28 }, navLabel: { color: '#9BA8BB', fontSize: 10, fontWeight: '700' }, navActive: { color: palette.blue },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }, sectionHeading: { color: palette.navy, fontSize: 19, fontWeight: '800' }, sectionAction: { color: palette.blue, fontSize: 13, fontWeight: '800' },
  carCard: { backgroundColor: palette.white, borderRadius: 18, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E8EDF4' }, carCardCompact: { width: 260, marginRight: 14 }, carImage: { width: '100%', height: 170 }, carImageCompact: { width: '100%', height: 135 }, carBody: { padding: 15 }, carNameRow: { flexDirection: 'row', justifyContent: 'space-between' }, carName: { color: palette.navy, fontSize: 17, fontWeight: '800' }, carCategory: { color: palette.muted, fontSize: 12, marginTop: 4 }, availability: { color: palette.green, fontSize: 10, fontWeight: '800', marginTop: 4 }, rating: { color: '#E69A24', fontSize: 12, fontWeight: '800' }, specRow: { flexDirection: 'row', gap: 18, marginTop: 16 }, spec: { color: palette.muted, fontSize: 11 }, priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15 }, price: { color: palette.navy, fontSize: 18, fontWeight: '900' }, perDay: { color: palette.muted, fontSize: 11, fontWeight: '500' }, match: { color: palette.green, fontSize: 11, fontWeight: '800', marginTop: 3 }, viewLink: { color: palette.blue, fontSize: 12, fontWeight: '800' }, searchField: { height: 50, borderRadius: 13, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }, searchIcon: { color: palette.blue, fontSize: 25, marginRight: 9 }, searchInput: { flex: 1, color: palette.ink, fontSize: 14 }, pill: { backgroundColor: palette.blueSoft, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, alignSelf: 'flex-start' }, pillText: { color: palette.blue, fontSize: 11, fontWeight: '800' }, pillGreen: { backgroundColor: '#E3F8F0' }, pillGreenText: { color: palette.green }, pillGray: { backgroundColor: '#EEF1F5' }, pillGrayText: { color: palette.muted }, pressed: { opacity: 0.78 },
});
