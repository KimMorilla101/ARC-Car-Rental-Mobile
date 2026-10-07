import { View } from 'react-native';

import { Icon, type IconName } from './Icon';
import { styles } from './IconTile.styles';

/** Rounded square with a tinted background holding a single icon (feature cards, notifications). */
export function IconTile({ name, color, background, size = 44 }: { name: IconName; color: string; background: string; size?: number }) {
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: background }]}>
      <Icon name={name} size={size * 0.45} color={color} />
    </View>
  );
}
