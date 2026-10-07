import { Pressable, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/common/Icon';
import { palette, text } from '@/constants/theme';
import type { PaymentMethod, PaymentMethodOption } from '@/types/payment';

import { styles } from './PaymentMethodSelector.styles';

const methodIcon: Record<PaymentMethod, IconName> = {
  cash: 'dollar-sign',
  online: 'smartphone',
  bank_transfer: 'credit-card',
};

interface PaymentMethodSelectorProps {
  options: PaymentMethodOption[];
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  error?: string | null;
}

/** Payment choices come from the backend so ARC can enable/disable methods without an app update. */
export function PaymentMethodSelector({ options, value, onChange, error }: PaymentMethodSelectorProps) {
  const selected = options.find((option) => option.method === value);
  return (
    <View>
      <View accessibilityRole="radiogroup" style={styles.list}>
        {options.map((option) => {
          const active = value === option.method;
          return (
            <Pressable
              key={option.method}
              onPress={() => onChange(option.method)}
              style={[styles.option, active && styles.optionActive]}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}>
              <View style={[styles.icon, active && styles.iconActive]}>
                <Icon name={methodIcon[option.method]} size={18} color={active ? palette.white : palette.blue} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.label}>{option.label}</Text>
                <Text style={styles.description}>{option.description}</Text>
              </View>
              <View style={[styles.radio, active && styles.radioActive]}>{active && <View style={styles.radioDot} />}</View>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {selected && selected.accounts.length > 0 && (
        <View style={styles.accounts}>
          <Text style={text.label}>SEND YOUR PAYMENT TO</Text>
          {selected.accounts.map((account) => (
            <View key={`${account.provider}-${account.accountNumber}`} style={styles.account}>
              <Text style={styles.provider}>{account.provider}</Text>
              <View style={styles.accountCopy}>
                <Text style={styles.accountNumber} selectable>
                  {account.accountNumber}
                </Text>
                <Text style={styles.accountName}>{account.accountName}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
