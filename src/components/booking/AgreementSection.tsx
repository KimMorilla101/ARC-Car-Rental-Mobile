import { useRef, useState } from 'react';
import { ScrollView, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

import { Card } from '@/components/common/Card';
import { Checkbox } from '@/components/common/Checkbox';
import { Icon } from '@/components/common/Icon';
import { palette } from '@/constants/theme';
import type { RentalAgreement } from '@/types/booking';

import { styles } from './AgreementSection.styles';

interface AgreementSectionProps {
  agreement: RentalAgreement;
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  error?: string | null;
}

/**
 * Inline, scrollable rental agreement. "I agree" stays locked until the renter scrolls to the end;
 * the accepted version is sent with the booking so Laravel can record exactly what was agreed to.
 */
export function AgreementSection({ agreement, accepted, onAcceptedChange, error }: AgreementSectionProps) {
  const [reachedEnd, setReachedEnd] = useState(false);
  const viewportHeight = useRef(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 20) setReachedEnd(true);
  };

  return (
    <View>
      <Card
        title="Rental Agreement"
        icon="file-text"
        right={
          <View style={styles.readState}>
            <Icon name={reachedEnd ? 'check-circle' : 'alert-circle'} size={13} color={reachedEnd ? palette.green : palette.amberStrong} />
            <Text style={[styles.readText, reachedEnd && styles.readDone]}>{reachedEnd ? 'Read' : 'Scroll to read'}</Text>
          </View>
        }>
        <ScrollView
          style={styles.box}
          contentContainerStyle={styles.boxContent}
          nestedScrollEnabled
          onScroll={onScroll}
          scrollEventThrottle={16}
          onLayout={(event) => {
            viewportHeight.current = event.nativeEvent.layout.height;
          }}
          onContentSizeChange={(_width, height) => {
            // An agreement short enough to fit without scrolling counts as read.
            if (viewportHeight.current > 0 && height <= viewportHeight.current) setReachedEnd(true);
          }}>
          <Text style={styles.docTitle}>{agreement.title}</Text>
          <Text style={styles.docIntro}>Effective upon booking confirmation. Read carefully before accepting.</Text>
          {agreement.sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}
        </ScrollView>
      </Card>

      <View style={[styles.acceptCard, error ? styles.acceptError : null]}>
        <Checkbox
          checked={accepted}
          disabled={!reachedEnd}
          onChange={onAcceptedChange}
          accessibilityLabel="I have read and agree to the ARC Ride Rental Agreement"
          label={
            <Text style={styles.acceptText}>
              I have read and agree to the <Text style={styles.acceptStrong}>ARC Ride Rental Agreement</Text> and understand all terms, including the fixed car wash fee, return
              time policy, extension rules, and late-return fees.
            </Text>
          }
        />
        {!reachedEnd && (
          <View style={styles.hintRow}>
            <Icon name="alert-circle" size={13} color={palette.amberStrong} />
            <Text style={styles.hint}>You must scroll through the agreement above before accepting.</Text>
          </View>
        )}
        {error && reachedEnd ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
}
