import { Text, View } from 'react-native';

import { palette, text } from '@/constants/theme';

import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, icon = 'inbox', actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Icon name={icon} size={24} color={palette.blue} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[text.subtitle, styles.message]}>{message}</Text>
      {actionLabel && onAction && <Button label={actionLabel} variant="outline" onPress={onAction} style={styles.action} />}
    </View>
  );
}
