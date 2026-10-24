import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/common/Icon';
import { palette } from '@/constants/theme';

import { styles } from './VehiclePhoto.styles';

interface VehiclePhotoProps {
  uri: string | null | undefined;
  /** Size and corner radius of the photo; the placeholder uses the same box. */
  style: StyleProp<ImageStyle>;
  /** Show "Photo not available" under the icon (for large photos; small thumbnails show only the icon). */
  label?: boolean;
}

/** Car photo from the admin website, or a placeholder when it is missing or fails to load. */
export function VehiclePhoto({ uri, style, label = false }: VehiclePhotoProps) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      // The photo's size and radius styles are plain box styles, so the placeholder can reuse them.
      <View style={[style as StyleProp<ViewStyle>, styles.placeholder]} accessibilityLabel="Photo not available">
        <Icon name="image" size={label ? 28 : 18} color={palette.muted} />
        {label && <Text style={styles.label}>Photo not available</Text>}
      </View>
    );
  }
  return <Image source={{ uri }} style={style} contentFit="cover" transition={200} onError={() => setFailed(true)} />;
}
