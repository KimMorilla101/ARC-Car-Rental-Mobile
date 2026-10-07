/**
 * Static help content from the Figma design. Fees quoted here mirror the current Figma values;
 * the amounts actually charged always come from the API. Move this to the backend if ARC wants
 * to edit it without an app update.
 */
export interface FaqSection {
  title: string;
  icon: 'truck' | 'file-text' | 'credit-card' | 'clock' | 'corner-down-left' | 'x-circle' | 'droplet' | 'map-pin' | 'award';
  items: [question: string, answer: string][];
}

export const faqSections: FaqSection[] = [
  {
    title: 'Rentals',
    icon: 'truck',
    items: [
      ['How do I book a car?', 'Choose a car in Browse, tap Book Now, and complete the four steps: dates & delivery, documents, payment, and the rental agreement.'],
      ['How old do I need to be to rent?', "You need a valid Philippine driver's license. ARC may ask for additional requirements for luxury vehicles."],
      ['Can I choose a specific unit?', 'You book a car model. ARC assigns the specific unit before pickup and shows it in your booking details.'],
      ['When is my booking confirmed?', 'Bookings stay Pending or Pending Verification until ARC staff verify your payment and documents. You will be notified once it is confirmed.'],
    ],
  },
  {
    title: 'Documents',
    icon: 'file-text',
    items: [
      ['What documents are required?', "A valid driver's license (front and back), a primary valid ID, a recent proof of billing, and proof of the ₱1,000 down payment."],
      ['Which IDs are accepted?', "Passport, PhilSys National ID, SSS, UMID, PRC ID, or voter's ID."],
      ['What counts as proof of billing?', 'A water, electric, or internet bill from the last three months.'],
      ['What if a document is rejected?', 'You will see the reason on your booking. Upload a clearer or valid copy from the booking details screen.'],
    ],
  },
  {
    title: 'Payments',
    icon: 'credit-card',
    items: [
      ['Which payment methods can I use?', 'Cash at an ARC branch, online payment (GCash / Maya), or bank transfer.'],
      ['Why do I need a down payment?', 'The ₱1,000 down payment reserves your unit. It is deducted from your total, and the remaining balance is paid before pickup.'],
      ['Does uploading proof confirm my booking?', 'No. Proof of payment is checked by ARC staff first. Your booking is confirmed only after verification.'],
      ['Are there hidden fees?', 'No. The pricing summary lists every fee: rental fee, fixed car wash fee, delivery fee (if any), extension fee, and late-return fee.'],
    ],
  },
  {
    title: 'Extensions',
    icon: 'clock',
    items: [
      ['Can I extend my rental?', 'Yes. Request an hourly, daily, or monthly extension from your booking before the scheduled return date and fixed return time.'],
      ['Is my extension approved automatically?', 'No. ARC approves every request after checking that the vehicle is available.'],
      ['What if another customer booked the car after me?', 'ARC may arrange an equivalent replacement vehicle at no extra charge.'],
      ['Can I extend after the deadline?', 'No. Once the return time passes, Return Vehicle Mode starts and the rental can no longer be extended.'],
    ],
  },
  {
    title: 'Returns',
    icon: 'corner-down-left',
    items: [
      ['Can I change my return time?', 'No. The return time is always the same as your pickup time. Only the return date can change, through an approved extension.'],
      ['What is Return Vehicle Mode?', 'It activates when your return deadline passes. It shows where to return the car and the late-return fee so far.'],
      ['How much is the late-return fee?', 'A predefined fee is charged for every hour of delay (currently ₱300 per hour). The final amount is recorded when staff verify your return.'],
    ],
  },
  {
    title: 'Cancellations',
    icon: 'x-circle',
    items: [
      ['Can I cancel a booking?', 'Contact ARC Car Rental through the Contact page before your pickup date to cancel.'],
      ['Is the down payment refundable?', 'Refunds depend on how close to pickup you cancel. ARC staff will explain the options when you contact them.'],
      ['What happens to a cancelled booking?', 'It stays in My Bookings under Cancelled so you can book the same car again later.'],
    ],
  },
  {
    title: 'Car Wash',
    icon: 'droplet',
    items: [
      ['What is the car wash fee?', 'A fixed car wash fee (currently ₱350) is added to every completed rental. It is shown separately in your pricing summary.'],
      ['Does it depend on how dirty the car is?', 'No. The fee is the same for every rental, regardless of the vehicle condition.'],
      ['Can I wash the car myself to skip the fee?', 'No. The fixed fee covers ARC’s standard cleaning between rentals.'],
    ],
  },
  {
    title: 'Delivery',
    icon: 'map-pin',
    items: [
      ['Can you deliver the car to me?', 'Yes. Choose Delivery in step 1 of the booking, pick your area, and enter your address.'],
      ['How much is delivery?', 'Delivery fees depend on the area and are shown before you confirm the booking.'],
      ['Is my delivery address my travel destination?', 'No. The travel destination is where you plan to drive and is asked separately.'],
    ],
  },
  {
    title: 'Trust Score',
    icon: 'award',
    items: [
      ['What is my Trust Score?', 'A score from 0 to 100% based on your rental history, such as returning cars on time and in good condition.'],
      ['Who can see it?', 'Only you can see your Trust Score. It is managed by ARC Car Rental.'],
      ['Can I change my Trust Score?', 'Not directly. It improves automatically as you complete rentals on time.'],
    ],
  },
];
