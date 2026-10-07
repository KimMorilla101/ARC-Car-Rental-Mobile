import { View } from 'react-native';

import type { BookingQuote, RentalAgreement } from '@/types/booking';
import type { Vehicle } from '@/types/vehicle';
import { getErrorMessage } from '@/utils/errorHandler';

import { AgreementSection } from '../AgreementSection';
import { BookingSummary } from '../BookingSummary';
import type { StepProps } from './bookingDraft';
import { styles } from './AgreementStep.styles';

interface AgreementStepProps extends StepProps {
  agreement: RentalAgreement;
  vehicle: Vehicle;
  quote: { data: BookingQuote | undefined; error: unknown; isFetching: boolean };
}

/** Step 4: read and accept the rental agreement, and review the final price from the server quote. */
export function AgreementStep({ draft, update, errors, agreement, vehicle, quote }: AgreementStepProps) {
  return (
    <View>
      <AgreementSection agreement={agreement} accepted={draft.agreementAccepted} onAcceptedChange={(agreementAccepted) => update({ agreementAccepted })} error={errors.agreement} />
      <View style={styles.summary}>
        <BookingSummary
          pricing={quote.data?.pricing}
          rentalDays={quote.data?.rentalDays}
          dailyRate={vehicle.rates.daily}
          loading={quote.isFetching}
          error={quote.error ? getErrorMessage(quote.error) : null}
        />
      </View>
    </View>
  );
}
