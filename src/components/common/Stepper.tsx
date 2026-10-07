import { Fragment } from 'react';
import { Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import { Icon } from './Icon';
import { styles } from './Stepper.styles';

/** Numbered progress indicator for multi-step forms: done steps show a tick, the current one is outlined. */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <View>
      <View style={styles.row} accessibilityLabel={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}>
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <Fragment key={step}>
              {index > 0 && <View style={[styles.line, index <= current && styles.lineDone]} />}
              <View style={[styles.circle, done && styles.circleDone, active && styles.circleActive]}>
                {done ? <Icon name="check" size={15} color={palette.white} /> : <Text style={[styles.number, active && styles.numberActive]}>{index + 1}</Text>}
              </View>
            </Fragment>
          );
        })}
      </View>
      <Text style={styles.caption}>
        Step {current + 1} of {steps.length}: <Text style={styles.captionStep}>{steps[current]}</Text>
      </Text>
    </View>
  );
}
