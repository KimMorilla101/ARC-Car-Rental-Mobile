import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { palette } from '@/constants/theme';

/** Swipeable full-width photo gallery with page dots. */
export function VehicleImageGallery({ images, name }: { images: string[]; name: string }) {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScroll}>
        {images.map((uri, index) => (
          <Image
            key={`${uri}-${index}`}
            source={{ uri }}
            style={[styles.image, { width }]}
            contentFit="cover"
            transition={200}
            accessibilityLabel={`${name} photo ${index + 1} of ${images.length}`}
          />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((uri, index) => (
            <View key={`${uri}-dot-${index}`} style={[styles.dot, index === page && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: { height: 245, backgroundColor: palette.skeleton },
  dots: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.55)' },
  dotActive: { backgroundColor: palette.white, width: 18 },
});
