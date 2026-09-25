import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen, TopBar, palette } from '@/components/arc-ui';

const questions = [
  ['What documents are required?', 'A valid driver’s license, primary valid ID, proof of billing, and ₱1,000 down-payment proof.'],
  ['When is my booking confirmed?', 'Online and bank-transfer bookings remain Pending Verification until ARC verifies the payment and documents. Cash bookings stay pending until payment is confirmed.'],
  ['Can I extend my rental?', 'Request an hourly, daily, or monthly extension before the original return date and fixed return time. Every request requires ARC approval.'],
  ['What happens after the return deadline?', 'Return Vehicle Mode activates. Expired rentals cannot be extended; return the vehicle and create a new booking if you want to rent again.'],
  ['What is the car wash fee?', 'A fixed predefined car wash fee is shown separately in your pricing summary. It does not depend on how dirty the vehicle is.'],
  ['What is my Trust Score?', 'Your Trust Score reflects your rental history and performance. It is managed by ARC Car Rental and can only be viewed by you.'],
];

export default function FaqScreen() {
  const [open, setOpen] = useState<number | null>(null);
  return <Screen><TopBar back title="FAQ" /><ScrollView contentContainerStyle={styles.scroll}><Text style={styles.title}>Frequently asked questions</Text><Text style={styles.subtitle}>Everything you need to know about renting with ARC.</Text>{questions.map(([question, answer], index) => <Pressable key={question} style={styles.item} onPress={() => setOpen(open === index ? null : index)}><View style={styles.row}><Text style={styles.question}>{question}</Text><Text style={styles.icon}>{open === index ? '−' : '+'}</Text></View>{open === index && <Text style={styles.answer}>{answer}</Text>}</Pressable>)}</ScrollView></Screen>;
}
const styles = StyleSheet.create({ scroll: { padding: 20, paddingBottom: 35 }, title: { color: palette.navy, fontSize: 28, fontWeight: '900', marginTop: 14 }, subtitle: { color: palette.muted, fontSize: 14, marginTop: 6, marginBottom: 20 }, item: { backgroundColor: palette.white, borderRadius: 15, padding: 16, marginTop: 10, borderWidth: 1, borderColor: '#E8EDF4' }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 }, question: { color: palette.navy, fontSize: 14, fontWeight: '800', flex: 1 }, icon: { color: palette.blue, fontSize: 20, fontWeight: '800' }, answer: { color: palette.muted, fontSize: 13, lineHeight: 20, marginTop: 10 },
});
