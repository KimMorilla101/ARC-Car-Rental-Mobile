/**
 * TEMPORARY in-memory data used only when EXPO_PUBLIC_USE_MOCK_API=true in a development build.
 * Delete this folder once the Laravel API is live. Nothing outside src/services may import it.
 *
 * Mock sign-in is NOT real authentication: accounts live in memory and anyone can use the demo login.
 * It exists only so the screens can be tested before the Laravel API is ready.
 *
 * Values mirror the Figma prototype. The real fees, fleet and content are owned by Laravel.
 */
import type { User } from '@/types/auth';
import type { Booking, BookingLocations, BookingRequirement, RentalAgreement } from '@/types/booking';
import type { AppNotification } from '@/types/notification';
import type { PaymentMethodOption } from '@/types/payment';
import type { Vehicle } from '@/types/vehicle';

export const MOCK_POLICY = {
  carWashFee: 350,
  downPayment: 1000,
  lateFeePerHour: 300,
};

export const MOCK_TOKEN_PREFIX = 'mock-token-';

// No sample fleet. Real vehicles, photos and prices are added by the administrator through the admin
// website and served by the Laravel API. Only one clearly labelled test car exists, for testing.
export const mockVehicles: Vehicle[] = [
  // TEST CAR, NOT REAL: kept (owner's decision) so Car Details and Booking can be tested in mock mode
  // until real cars are uploaded through the admin website. Mock data is ignored in release builds.
  // Delete this entry to see the "No cars available yet" empty state again.
  {
    id: 9999, name: 'TEST CAR (not real)', category: 'Sedan', rates: { hourly: 1, daily: 1, monthly: 1 }, imageUrl: '', gallery: [],
    seats: 5, doors: 4, transmission: 'Automatic', fuel: 'Gasoline', rating: null, reviewCount: 0, isPopular: false,
    description: 'Temporary test vehicle for checking the app. It is not a real ARC car.', features: ['Test feature'], availableUnits: 1, matchScore: null,
  },
];

export const mockLocations: BookingLocations = {
  branches: [
    { id: 1, name: 'ARC Davao City Branch – Ecoland Drive (Main)', address: 'Ecoland Drive, Matina, Davao City' },
    { id: 2, name: 'ARC SM Lanang Branch', address: 'SM Lanang Premier, J.P. Laurel Ave, Davao City' },
  ],
  deliveryZones: [
    { id: 1, name: 'Davao City proper', fee: 300 },
    { id: 2, name: 'Davao City outskirts (Toril, Calinan, Bunawan)', fee: 500 },
    { id: 3, name: 'Panabo / Tagum', fee: 900 },
  ],
};

/** Demo account for mock mode. Any newly registered account also works until the app reloads. */
const MOCK_DEMO_LOGIN = { email: 'juan@example.com', password: 'password123' };

export const mockUsers: (User & { password: string })[] = [
  { id: 1, name: 'Juan Dela Cruz', email: MOCK_DEMO_LOGIN.email, password: MOCK_DEMO_LOGIN.password, phone: '09171234567', address: 'Davao City', avatarUrl: null, trustScore: 92 },
];

export function requirementTemplate(): BookingRequirement[] {
  return [
    { type: 'drivers_license', label: "Driver's License", description: "Front and back of your valid PH driver's license", status: 'missing', rejectionReason: null },
    { type: 'valid_id', label: 'Primary Valid ID', description: "Passport, PhilSys, SSS, UMID, PRC ID, or voter's ID", status: 'missing', rejectionReason: null },
    { type: 'proof_of_billing', label: 'Proof of Billing', description: 'Water, electric, or internet bill (last 3 months)', status: 'missing', rejectionReason: null },
    { type: 'down_payment', label: '₱1,000 Down-Payment Proof', description: 'Receipt for the down payment that reserves your unit', status: 'missing', rejectionReason: null },
  ];
}

/** A date `days` from now at a fixed hour, so demo data stays relevant whenever the app runs. */
function atHour(days: number, hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export function priceFor(rentalFee: number, deliveryFee = 0, extras: { lateReturnFee?: number; extensionFee?: number } = {}) {
  const total = rentalFee + deliveryFee + MOCK_POLICY.carWashFee + (extras.lateReturnFee ?? 0) + (extras.extensionFee ?? 0);
  return {
    rentalFee,
    deliveryFee,
    carWashFee: MOCK_POLICY.carWashFee,
    lateReturnFee: extras.lateReturnFee ?? 0,
    extensionFee: extras.extensionFee ?? 0,
    total,
    downPayment: MOCK_POLICY.downPayment,
    balanceDue: total - MOCK_POLICY.downPayment,
  };
}

// No sample bookings, since every booking belongs to a car. Bookings created in mock mode are kept
// here until the app reloads.
export const mockBookings: (Booking & { userId: User['id'] })[] = [];

export const mockNotifications: (AppNotification & { userId: User['id'] })[] = [
  { id: 1, userId: 1, type: 'general', title: 'Welcome to ARC Ride', body: 'Your account is ready. Browse our fleet and book your first ride.', bookingId: null, readAt: atHour(-90, 9), createdAt: atHour(-90, 8) },
];

export const mockAgreement: RentalAgreement = {
  version: 'mock-2026-10',
  title: 'ARC CAR RENTAL — RENTAL AGREEMENT',
  sections: [
    { title: '1. Rental Terms', body: 'The customer (Renter) agrees to rent the vehicle described in the booking from ARC Car Rental (Company) under the terms and conditions set forth in this agreement. This agreement takes effect upon booking confirmation.' },
    { title: '2. Pickup & Return', body: 'The vehicle must be picked up and returned at the agreed date and time. The return time is fixed to the pickup time and cannot be changed manually.' },
    { title: '3. Required Documents', body: "The Renter must submit a valid driver's license, a primary valid ID, proof of billing and proof of the ₱1,000 down payment. Bookings stay pending until ARC staff verify every document." },
    { title: '4. Payment', body: 'A ₱1,000 down payment reserves the unit and is deducted from the total. Uploaded payment proof does not confirm a booking until ARC staff verify it.' },
    { title: '5. Car Wash Fee', body: 'A fixed car wash fee applies to every completed rental, regardless of the condition of the vehicle.' },
    { title: '6. Extensions', body: 'Extensions must be requested before the scheduled return date and time and require ARC approval. Approval depends on vehicle availability. Expired rentals cannot be extended.' },
    { title: '7. Late Returns', body: 'Returning the vehicle after the scheduled return time incurs a late-return fee for every hour of delay. Return Vehicle Mode activates once the deadline passes.' },
    { title: '8. Prohibited Uses', body: 'The vehicle must not be used for illegal activities, subletting, racing, off-road driving (unless the vehicle type permits), or transport of hazardous materials.' },
    { title: '9. Traffic Violations', body: 'The Renter is responsible for all traffic violations, tolls, parking fees and penalties incurred during the rental period.' },
    { title: '10. Damage & Liability', body: 'The Renter is responsible for the vehicle, its documents and its fuel during the rental. Damage beyond normal wear is charged according to the inspection at return.' },
  ],
};

export const mockPaymentMethods: PaymentMethodOption[] = [
  { method: 'cash', label: 'Cash In Person', description: 'Pay at any ARC branch before pickup. Your booking is confirmed once staff receive the payment.', requiresProof: false, accounts: [] },
  {
    method: 'online', label: 'Online Payment (GCash / Maya)', description: 'Send the payment, then upload a screenshot of the receipt.', requiresProof: true,
    accounts: [
      { provider: 'GCash', accountName: 'ARC Car Rental', accountNumber: '0917 123 4567' },
      { provider: 'Maya', accountName: 'ARC Car Rental', accountNumber: '0918 765 4321' },
    ],
  },
  {
    method: 'bank_transfer', label: 'Bank Transfer', description: 'Transfer to our bank account, then upload the deposit slip or screenshot.', requiresProof: true,
    accounts: [
      { provider: 'BPI', accountName: 'ARC Car Rental Services', accountNumber: '1234-5678-90' },
      { provider: 'BDO', accountName: 'ARC Car Rental Services', accountNumber: '0098-7654-321' },
    ],
  },
];
