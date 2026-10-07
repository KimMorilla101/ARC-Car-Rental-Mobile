import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Icon, type IconName } from '@/components/common/Icon';
import { IconTile } from '@/components/common/IconTile';
import { PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { Avatar } from '@/components/profile/ProfileImagePicker';
import { TrustScoreRing } from '@/components/profile/TrustScore';
import { apiConfig } from '@/constants/api';
import { palette } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

import { styles } from './ProfileScreen.styles';

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
      <ScrollView contentContainerStyle={screenStyles.tabScroll}>
        <PageHeader title="Profile" />
        <View style={styles.profileCard}>
          <Avatar name={user.name} url={user.avatarUrl} size={68} />
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.detail}>{user.email}</Text>
            {user.phone ? <Text style={styles.detail}>{user.phone}</Text> : null}
          </View>
          <Pressable onPress={() => router.push('/profile/edit')} hitSlop={8} style={styles.edit} accessibilityRole="button" accessibilityLabel="Edit profile">
            <Icon name="edit-2" size={16} color={palette.blue} />
          </Pressable>
        </View>

        <View style={screenStyles.gap}>
          <TrustScoreRing score={user.trustScore} />
        </View>

        <Text style={styles.group}>ACCOUNT</Text>
        <View style={styles.menu}>
          <MenuRow icon="user" color={palette.blue} background={palette.blueSoft} label="Personal Information" detail="Name, phone, address, photo" href="/profile/edit" />
          <MenuRow icon="lock" color={palette.purple} background={palette.purpleSoft} label="Change Password" detail="Update your sign-in password" href="/profile/password" />
          <MenuRow icon="book-open" color={palette.green} background={palette.greenSoft} label="Booking History" detail="Upcoming, active and past rentals" href="/bookings" last />
        </View>

        <Text style={styles.group}>SUPPORT</Text>
        <View style={styles.menu}>
          <MenuRow icon="bell" color={palette.amberStrong} background={palette.amberSoft} label="Notifications" detail="Booking and rental updates" href="/notifications" />
          <MenuRow icon="help-circle" color={palette.blue} background={palette.blueSoft} label="FAQ" detail="Answers to common questions" href="/faq" />
          <MenuRow icon="headphones" color={palette.purple} background={palette.purpleSoft} label="Contact Us" detail="Call, email, or send a message" href="/contact" />
          <MenuRow icon="info" color={palette.muted} background={palette.divider} label="About ARC Ride" detail="Our mission and services" href="/about" last />
        </View>

        {confirmingLogout ? (
          <View style={styles.confirm} accessibilityLiveRegion="polite">
            <Text style={styles.confirmText}>Log out of ARC Ride on this device?</Text>
            <View style={styles.confirmRow}>
              <Button label="Cancel" variant="outline" onPress={() => setConfirmingLogout(false)} disabled={signingOut} style={styles.confirmButton} />
              <Button label="Log Out" variant="danger" icon="log-out" onPress={onSignOut} loading={signingOut} style={styles.confirmButton} />
            </View>
          </View>
        ) : (
          <Button label="Log Out" icon="log-out" variant="danger" onPress={() => setConfirmingLogout(true)} style={styles.logout} />
        )}
        {apiConfig.useMockApi && <Text style={styles.demo}>Demo data mode: changes are not saved to a server.</Text>}
      </ScrollView>
    </Screen>
  );
}

function MenuRow({ icon, color, background, label, detail, href, last }: { icon: IconName; color: string; background: string; label: string; detail: string; href: Href; last?: boolean }) {
  const router = useRouter();
  return (
    <Pressable style={({ pressed }) => [styles.row, last && styles.rowLast, pressed && styles.pressed]} onPress={() => router.push(href)} accessibilityRole="button" accessibilityLabel={label}>
      <IconTile name={icon} color={color} background={background} size={38} />
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <Icon name="chevron-right" size={18} color={palette.mutedLight} />
    </Pressable>
  );
}
