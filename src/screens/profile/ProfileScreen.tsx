import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TrustScoreCard } from '@/components/dashboard/TrustScoreCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { Avatar } from '@/components/profile/ProfileImagePicker';
import { palette } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  if (!user) return null;

  const onSignOut = async () => {
    setSigningOut(true);
    // Always clears the local session, even if the server is unreachable. The route guard then
    // returns to the welcome screen.
    await signOut();
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <TopBar title="Profile" />
      <ScrollView contentContainerStyle={screenStyles.tabScroll}>
        <View style={styles.profile}>
          <Avatar name={user.name} url={user.avatarUrl} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Pressable style={styles.edit} onPress={() => router.push('/profile/edit')} accessibilityRole="button">
            <Text style={styles.editText}>Edit profile</Text>
          </Pressable>
        </View>
        <TrustScoreCard score={user.trustScore} caption="Managed by ARC Car Rental" />

        <Text style={styles.section}>Account</Text>
        <View style={styles.menu}>
          <MenuRow label="Personal information" detail={user.phone ?? 'Add your mobile number'} href="/profile/edit" />
          <MenuRow label="Change password" detail="Update your sign-in password" href="/profile/password" />
          <MenuRow label="Booking history" detail="Upcoming, active and past rentals" href="/bookings" />
        </View>

        <Text style={styles.section}>Support</Text>
        <View style={styles.menu}>
          <MenuRow label="Notifications" detail="Booking and rental updates" href="/notifications" />
          <MenuRow label="Help center" detail="Answers to common questions" href="/faq" />
          <MenuRow label="Contact ARC Car Rental" detail="Call, email, or send a message" href="/contact" />
          <MenuRow label="About ARC Ride" detail="Our mission and services" href="/about" last />
        </View>

        {confirmingLogout ? (
          <View style={styles.confirm} accessibilityLiveRegion="polite">
            <Text style={styles.confirmText}>Log out of ARC Ride on this device?</Text>
            <View style={styles.confirmRow}>
              <PrimaryButton label="Cancel" variant="outline" onPress={() => setConfirmingLogout(false)} style={styles.confirmButton} disabled={signingOut} />
              <PrimaryButton label="Log out" onPress={onSignOut} loading={signingOut} style={[styles.confirmButton, styles.logoutButton]} />
            </View>
          </View>
        ) : (
          <PrimaryButton label="Log out" variant="danger" onPress={() => setConfirmingLogout(true)} />
        )}
      </ScrollView>
    </Screen>
  );
}

function MenuRow({ label, detail, href, last }: { label: string; detail: string; href: Href; last?: boolean }) {
  const router = useRouter();
  return (
    <Pressable style={[styles.row, last && styles.rowLast]} onPress={() => router.push(href)} accessibilityRole="button" accessibilityLabel={label}>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profile: { alignItems: 'center', paddingVertical: 19 },
  name: { color: palette.navy, fontSize: 21, fontWeight: '900', marginTop: 12 },
  email: { color: palette.muted, fontSize: 13, marginTop: 4 },
  edit: { borderWidth: 1, borderColor: '#BFD5F7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 13 },
  editText: { color: palette.blue, fontSize: 12, fontWeight: '800' },
  section: { color: palette.navy, fontSize: 17, fontWeight: '800', marginTop: 22, marginBottom: 9 },
  menu: { backgroundColor: palette.white, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: palette.border },
  row: { minHeight: 63, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: palette.divider },
  rowLast: { borderBottomWidth: 0 },
  rowCopy: { flex: 1 },
  rowLabel: { color: palette.navy, fontSize: 14, fontWeight: '800' },
  rowDetail: { color: palette.muted, fontSize: 11, marginTop: 5 },
  chevron: { color: palette.blue, fontSize: 23 },
  confirm: { backgroundColor: palette.white, borderRadius: 16, padding: 16, marginTop: 22, borderWidth: 1, borderColor: palette.border },
  confirmText: { color: palette.navy, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  confirmRow: { flexDirection: 'row', gap: 10 },
  confirmButton: { flex: 1, minHeight: 46, marginTop: 14 },
  logoutButton: { backgroundColor: palette.danger },
});
