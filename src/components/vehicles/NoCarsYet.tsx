import { EmptyState } from '@/components/common/EmptyState';

/**
 * Shown when the fleet itself is empty (not when filters hide every car). Cars, photos and prices are
 * added by the administrator through the admin website and served by the Laravel API.
 */
export function NoCarsYet() {
  return (
    <EmptyState
      icon="truck"
      title="No cars available yet"
      message="Our rental cars will appear here once they are added by the administrator. Please check back later."
    />
  );
}
