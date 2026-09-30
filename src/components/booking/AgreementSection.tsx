import { useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/common/PrimaryButton';
import { gutter, palette } from '@/constants/theme';
import type { RentalAgreement } from '@/types/booking';

interface AgreementSectionProps {
  agreement: RentalAgreement | undefined;
  accepted: boolean;
  onAccept: () => void;
  error?: string | null;
}

/**
 * Rental agreement card. The renter must open the agreement and scroll to the end before
 * "I Agree" is enabled; the accepted version is sent with the booking so Laravel can record it.
 */
export function AgreementSection({ agreement, accepted, onAccept, error }: AgreementSectionProps) {
  const [open, setOpen] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const viewportHeight = useRef(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 24) setReachedEnd(true);
  };

  return (
    <View style={[styles.card, error ? styles.cardError : null]}>
      <Text style={[styles.text, accepted && styles.accepted]}>
        {accepted ? '✓ You accepted the ARC Car Rental Agreement.' : 'Open and scroll through the ARC Car Rental Agreement before accepting it.'}
      </Text>
      <PrimaryButton
        label={!agreement ? 'Loading agreement…' : accepted ? 'Review agreement again' : 'Open rental agreement'}
        variant="outline"
        disabled={!agreement}
        onPress={() => setOpen(true)}
        style={styles.button}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.modal}>
          <Text style={styles.modalTitle}>{agreement?.title}</Text>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onLayout={(event) => {
              viewportHeight.current = event.nativeEvent.layout.height;
            }}
            onContentSizeChange={(_width, height) => {
              // An agreement short enough to fit without scrolling counts as read.
              if (viewportHeight.current > 0 && height <= viewportHeight.current) setReachedEnd(true);
            }}>
            {agreement?.clauses.map((clause, index) => (
              <View key={clause} style={styles.clause}>
                <Text style={styles.clauseNumber}>{String(index + 1).padStart(2, '0')}</Text>
                <Text style={styles.clauseText}>{clause}</Text>
              </View>
            ))}
            <Text style={styles.end}>{reachedEnd ? 'End of agreement.' : 'Scroll to the end to enable acceptance.'}</Text>
          </ScrollView>
          <PrimaryButton
            label={reachedEnd ? 'I Agree' : 'Scroll to review agreement'}
            disabled={!reachedEnd}
            onPress={() => {
              onAccept();
              setOpen(false);
            }}
          />
          <PrimaryButton label="Close" variant="ghost" onPress={() => setOpen(false)} style={styles.close} />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: 15, borderWidth: 1, borderColor: palette.line, padding: 15 },
  cardError: { borderColor: palette.danger },
  text: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  accepted: { color: palette.green, fontWeight: '800' },
  button: { minHeight: 44, marginTop: 12 },
  error: { color: palette.danger, fontSize: 12, fontWeight: '600', marginTop: 8 },
  modal: { flex: 1, paddingHorizontal: gutter, backgroundColor: palette.canvas },
  modalTitle: { color: palette.navy, fontSize: 24, fontWeight: '900', marginTop: 20 },
  modalScroll: { backgroundColor: palette.white, borderRadius: 16, marginTop: 18 },
  modalContent: { padding: 17 },
  clause: { flexDirection: 'row', marginBottom: 19 },
  clauseNumber: { color: palette.blue, fontSize: 12, fontWeight: '900', width: 30 },
  clauseText: { color: palette.ink, fontSize: 14, lineHeight: 21, flex: 1 },
  end: { color: palette.muted, fontSize: 12, textAlign: 'center', padding: 20 },
  close: { marginTop: 4 },
});
