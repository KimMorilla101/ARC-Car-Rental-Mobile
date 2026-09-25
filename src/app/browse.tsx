import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomNav, CarCard, Screen, SearchField, TopBar, palette, styles as ui } from '@/components/arc-ui';
import { cars } from '@/constants/mock-data';

export default function BrowseScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All cars');
  const categories = ['All cars', 'Sedan', 'SUV', 'MPV'];
  const filtered = cars.filter((car) => (category === 'All cars' || car.category.includes(category)) && car.name.toLowerCase().includes(query.toLowerCase()));
  return <Screen>
    <TopBar title="Browse cars" action={<Text style={styles.filterIcon}>≡</Text>} />
    <ScrollView contentContainerStyle={ui.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Find your next ride</Text><Text style={styles.subtitle}>Choose from our collection of clean, reliable vehicles.</Text>
      <View style={styles.search}><SearchField value={query} onChangeText={setQuery} placeholder="Search by car name" /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{categories.map((item) => <Text key={item} onPress={() => setCategory(item)} style={[styles.chip, item === category && styles.chipActive]}>{item}</Text>)}</ScrollView>
      <View style={styles.resultRow}><Text style={styles.resultCount}>{filtered.length} vehicles available</Text><Text style={styles.sort}>Recommended  ˅</Text></View>
      {filtered.map((car) => <CarCard key={car.id} car={car} />)}
      {filtered.length === 0 && <View style={styles.empty}><Text style={styles.emptyTitle}>No cars found</Text><Text style={styles.emptyText}>Try another search or category.</Text></View>}
    </ScrollView>
    <BottomNav active="browse" />
  </Screen>;
}

const styles = StyleSheet.create({
  filterIcon: { color: palette.navy, fontSize: 26 }, title: { color: palette.navy, fontSize: 28, fontWeight: '900', marginTop: 12 }, subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 6 }, search: { marginTop: 20 }, chips: { gap: 8, paddingVertical: 18 }, chip: { color: palette.muted, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9, fontSize: 12, fontWeight: '700' }, chipActive: { backgroundColor: palette.blue, color: palette.white, borderColor: palette.blue }, resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }, resultCount: { color: palette.navy, fontSize: 13, fontWeight: '800' }, sort: { color: palette.blue, fontSize: 11, fontWeight: '800' }, empty: { alignItems: 'center', padding: 45 }, emptyTitle: { color: palette.navy, fontSize: 19, fontWeight: '800' }, emptyText: { color: palette.muted, marginTop: 7 },
});
