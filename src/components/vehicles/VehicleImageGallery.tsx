import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { styles } from './VehicleImageGallery.styles';

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
