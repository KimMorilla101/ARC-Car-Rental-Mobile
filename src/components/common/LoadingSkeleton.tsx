import { useEffect, useState, type ReactNode } from 'react';
import { Animated, StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { gutter, palette } from '@/constants/theme';

interface SkeletonProps {
  width?: DimensionValue;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Pulsing placeholder block. Compose these into screen-shaped skeletons below. */
export function Skeleton({ width = '100%', height, radius = 8, style }: SkeletonProps) {
  const [opacity] = useState(() => new Animated.Value(0.55));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.55, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: palette.skeleton, opacity }, style]} />;
}

function SkeletonGroup({ children, label }: { children: ReactNode; label: string }) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label}>
      {children}
    </View>
  );
}

export function VehicleCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <Skeleton height={compact ? 135 : 170} radius={0} />
      <View style={styles.cardBody}>
        <Skeleton width="60%" height={18} />
        <Skeleton width="40%" height={12} style={styles.gap} />
        <Skeleton width="35%" height={20} style={styles.gapLarge} />
      </View>
    </View>
  );
}

export function VehicleListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <SkeletonGroup label="Loading vehicles">
      {Array.from({ length: count }, (_, index) => (
        <VehicleCardSkeleton key={index} />
      ))}
    </SkeletonGroup>
  );
}

export function VehicleDetailsSkeleton() {
  return (
    <SkeletonGroup label="Loading vehicle details">
      <Skeleton height={245} radius={0} />
      <View style={styles.padded}>
        <Skeleton width="65%" height={28} />
        <Skeleton width="40%" height={14} style={styles.gap} />
        <Skeleton height={120} radius={16} style={styles.gapLarge} />
        <Skeleton width="50%" height={18} style={styles.gapLarge} />
        <Skeleton height={14} style={styles.gap} />
        <Skeleton width="80%" height={14} style={styles.gap} />
      </View>
    </SkeletonGroup>
  );
}

export function BookingListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <SkeletonGroup label="Loading bookings">
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.card}>
          <Skeleton height={150} radius={0} />
          <View style={styles.cardBody}>
            <Skeleton width="30%" height={10} />
            <Skeleton width="55%" height={18} style={styles.gap} />
            <Skeleton width="40%" height={12} style={styles.gap} />
          </View>
        </View>
      ))}
    </SkeletonGroup>
  );
}

export function DetailSkeleton() {
  return (
    <SkeletonGroup label="Loading details">
      <Skeleton width="40%" height={16} style={styles.gapLarge} />
      <Skeleton height={104} radius={18} style={styles.gapLarge} />
      <Skeleton height={70} radius={16} style={styles.gapLarge} />
      <Skeleton width="45%" height={18} style={styles.section} />
      <Skeleton height={220} radius={16} />
    </SkeletonGroup>
  );
}

export function NotificationListSkeleton() {
  return (
    <SkeletonGroup label="Loading notifications">
      {[0, 1, 2].map((index) => (
        <Skeleton key={index} height={84} radius={16} style={styles.gapLarge} />
      ))}
    </SkeletonGroup>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: 18, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: palette.border },
  compactCard: { width: 260, marginRight: 14 },
  cardBody: { padding: 15 },
  padded: { padding: gutter },
  gap: { marginTop: 8 },
  gapLarge: { marginTop: 16 },
  section: { marginTop: 28, marginBottom: 12 },
});
