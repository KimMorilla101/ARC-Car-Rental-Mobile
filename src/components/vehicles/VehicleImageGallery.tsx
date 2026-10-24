import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { Icon } from '@/components/common/Icon';
import { palette } from '@/constants/theme';

import { styles } from './VehicleImageGallery.styles';

/** Swipeable full-width photo gallery with page dots. Missing or broken photos show a placeholder. */
export function VehicleImageGallery({ images, name }: { images: string[]; name: string }) {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  // Indexes of photos that failed to load (e.g. deleted from the admin website).
  const [failed, setFailed] = useState<number[]>([]);
  const photos = images.filter(Boolean);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  if (photos.length === 0) return <PhotoPlaceholder width={width} />;

  return (
    <View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScroll}>
        {photos.map((uri, index) =>
          failed.includes(index) ? (
            <PhotoPlaceholder key={`${uri}-${index}`} width={width} />
          ) : (
            <Image
              key={`${uri}-${index}`}
              source={{ uri }}
              style={[styles.image, { width }]}
              contentFit="cover"
              transition={200}
              onError={() => setFailed((current) => [...current, index])}
              accessibilityLabel={`${name} photo ${index + 1} of ${photos.length}`}
            />
          ),
        )}
      </ScrollView>
      {photos.length > 1 && (
        <View style={styles.dots}>
          {photos.map((uri, index) => (
            <View key={`${uri}-dot-${index}`} style={[styles.dot, index === page && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

function PhotoPlaceholder({ width }: { width: number }) {
  return (
    <View style={[styles.image, styles.placeholder, { width }]}>
      <Icon name="image" size={32} color={palette.muted} />
      <Text style={styles.placeholderText}>Photo not available</Text>
    </View>
  );
}
