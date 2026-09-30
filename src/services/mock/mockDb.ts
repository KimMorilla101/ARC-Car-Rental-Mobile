/**
 * TEMPORARY in-memory data used only when EXPO_PUBLIC_USE_MOCK_API=true in a development build.
 * Delete this folder once the Laravel API is live. Nothing outside src/services may import it.
 *
 * Fees below are placeholders for the prototype. The real values are owned by Laravel.
 */
import type { User } from '@/types/auth';
import type { Booking, BookingRequirement, RentalAgreement } from '@/types/booking';
import type { AppNotification } from '@/types/notification';
import type { PaymentMethodOption } from '@/types/payment';
import type { Vehicle } from '@/types/vehicle';

export const MOCK_POLICY = {
  carWashFee: 500,
  downPayment: 1000,
  deliveryFee: 500,
  lateFeePerHour: 500,
  shopAddress: 'ARC Car Rental shop, Davao City',
};

export const MOCK_TOKEN_PREFIX = 'mock-token-';

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;

export const mockVehicles: Vehicle[] = [
  { id: 1, name: 'Toyota RAV4', category: 'SUV', rates: { hourly: 350, daily: 2800, monthly: 56000 }, imageUrl: photo('photo-1503376780353-7e6692767b70'), gallery: [photo('photo-1503376780353-7e6692767b70'), photo('photo-1494976388531-d1058494cdd8')], seats: 5, doors: 4, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.9, description: 'A confident SUV with flexible space for city drives and longer trips.', features: ['Toyota Safety Sense', 'Apple CarPlay', 'Backup camera', 'Large cargo area'], availableUnits: 3, matchScore: 96 },
  { id: 2, name: 'Toyota Vios', category: 'Sedan', rates: { hourly: 250, daily: 1800, monthly: 36000 }, imageUrl: photo('photo-1552519507-da3b142c6e3d'), gallery: [photo('photo-1552519507-da3b142c6e3d')], seats: 5, doors: 4, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.9, description: 'A dependable sedan with a quiet cabin and easy city handling.', features: ['Air conditioning', 'Bluetooth audio', 'Backup camera', 'USB charging'], availableUnits: 2, matchScore: 95 },
  { id: 3, name: 'Honda BR-V', category: 'SUV', rates: { hourly: 320, daily: 2500, monthly: 50000 }, imageUrl: photo('photo-1606664515524-ed2f786a0bd6'), gallery: [photo('photo-1606664515524-ed2f786a0bd6')], seats: 7, doors: 4, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.8, description: 'Room for the whole family with flexible seating and generous cargo space.', features: ['7 seats', 'Apple CarPlay', 'Cruise control', 'Large cargo area'], availableUnits: 1, matchScore: 92 },
  { id: 4, name: 'Mitsubishi Xpander', category: 'MPV', rates: { hourly: 300, daily: 2300, monthly: 46000 }, imageUrl: photo('photo-1549317661-bd32c8ce0db2'), gallery: [photo('photo-1549317661-bd32c8ce0db2')], seats: 7, doors: 4, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.7, description: 'A comfortable people mover built for family trips and airport runs.', features: ['7 seats', 'Rear air vents', 'Smart entry', 'Spacious interior'], availableUnits: 1, matchScore: 88 },
  { id: 5, name: 'Toyota Hilux', category: 'Pickup', rates: { hourly: 380, daily: 3000, monthly: 60000 }, imageUrl: photo('photo-1551830820-330a71b99659'), gallery: [photo('photo-1551830820-330a71b99659')], seats: 5, doors: 4, transmission: 'Manual', fuel: 'Diesel', rating: 4.8, description: 'A durable pickup for work trips, equipment, and open-road travel.', features: ['Bed liner', '4x2 drive', 'Hill start assist', 'Bluetooth audio'], availableUnits: 1, matchScore: 82 },
  { id: 6, name: 'Honda City Hatchback', category: 'Hatchback', rates: { hourly: 260, daily: 1900, monthly: 38000 }, imageUrl: photo('photo-1492144534655-ae79c964c9d7'), gallery: [photo('photo-1492144534655-ae79c964c9d7')], seats: 5, doors: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.7, description: 'A compact and efficient hatchback for easy city exploration.', features: ['Rear camera', 'Keyless entry', 'Bluetooth audio', 'Air conditioning'], availableUnits: 0, matchScore: 80 },
];

/** Demo account for mock mode. Any newly registered account also works until the app reloads. */
const MOCK_DEMO_LOGIN = { email: 'juan@example.com', password: 'password123' };

export const mockUsers: (User & { password: string })[] = [
  { id: 1, name: 'Juan Dela Cruz', email: MOCK_DEMO_LOGIN.email, password: MOCK_DEMO_LOGIN.password, phone: '09171234567', address: 'Davao City', avatarUrl: null, trustScore: 92 },
];

export function requirementTemplate(): BookingRequirement[] {
  return [
    { type: 'drivers_license', label: "Driver's License", description: 'Front and back, clear and valid', status: 'missing', rejectionReason: null },
    { type: 'proof_of_billing', label: 'Proof of Billing', description: 'Water, electric, or internet bill', status: 'missing', rejectionReason: null },
    { type: 'valid_id', label: 'Primary Valid ID', description: 'Government-issued identification', status: 'missing', rejectionReason: null },
    { type: 'down_payment', label: '₱1,000 Down-Payment Proof', description: 'Required to reserve the unit', status: 'missing', rejectionReason: null },
  ];
}

/** A date `days` from now at a fixed hour, so demo bookings stay relevant whenever the app runs. */
function atHour(days: number, hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

const verified = requirementTemplate().map((item) => ({ ...item, status: 'verified' as const }));

export const mockBookings: (Booking & { userId: User['id'] })[] = [
  {
    id: 101, userId: 1, reference: 'ARC-260924-08', vehicle: mockVehicles[2], unitLabel: 'Honda BR-V Unit 01',
    pickupAt: atHour(-2, 9), returnAt: atHour(1, 9), deliveryMethod: 'shop_pickup', pickupLocation: MOCK_POLICY.shopAddress, deliveryAddress: null, destination: 'Samal Island',
    status: 'active', payment: { method: 'cash', status: 'paid', proofUrl: null },
    pricing: { rentalFee: 7500, deliveryFee: 0, carWashFee: 500, lateReturnFee: 0, extensionFee: 0, downPayment: 1000, total: 8000 },
    requirements: verified, extension: null, canRequestExtension: true, trustScore: 92, createdAt: atHour(-5, 14),
  },
  {
    id: 100, userId: 1, reference: 'ARC-260810-21', vehicle: mockVehicles[1], unitLabel: 'Toyota Vios Unit 01',
    pickupAt: atHour(-50, 10), returnAt: atHour(-48, 10), deliveryMethod: 'shop_pickup', pickupLocation: MOCK_POLICY.shopAddress, deliveryAddress: null, destination: 'Davao City',
    status: 'completed', payment: { method: 'cash', status: 'paid', proofUrl: null },
    pricing: { rentalFee: 3600, deliveryFee: 0, carWashFee: 500, lateReturnFee: 0, extensionFee: 0, downPayment: 1000, total: 4100 },
    requirements: verified, extension: null, canRequestExtension: false, trustScore: 92, createdAt: atHour(-55, 11),
  },
];

export const mockNotifications: (AppNotification & { userId: User['id'] })[] = [
  { id: 3, userId: 1, type: 'rental', title: 'Return deadline reminder', body: 'Your return time is fixed at 09:00 AM. Extension requests close at the deadline.', bookingId: 101, readAt: null, createdAt: atHour(0, 7) },
  { id: 2, userId: 1, type: 'booking', title: 'Booking confirmed', body: 'Your Honda BR-V is ready for pickup.', bookingId: 101, readAt: null, createdAt: atHour(-3, 16) },
  { id: 1, userId: 1, type: 'payment', title: 'Payment reminder', body: 'Bring your ₱1,000 down payment and required documents to pickup.', bookingId: 101, readAt: atHour(-4, 9), createdAt: atHour(-4, 8) },
];

export const mockAgreement: RentalAgreement = {
  version: 'mock-2026-09',
  title: 'ARC Car Rental Agreement',
  clauses: [
    'The pickup time is also the fixed return time and cannot be manually changed.',
    'Extensions must be requested before the scheduled return date and time and require ARC Car Rental approval.',
    'A ₱1,000 down payment is required to reserve a unit. Payment proof does not confirm a booking until verified.',
    'A fixed ₱500 car wash fee applies separately to every completed rental.',
    'Customers are responsible for the vehicle, documents, fuel, traffic rules, and returning the unit on time.',
    'Late returns incur a predefined late-return fee based on delayed hours. Expired rentals cannot be extended.',
  ],
};

export const mockPaymentMethods: PaymentMethodOption[] = [
  { method: 'online', label: 'Online Payment', description: 'Pay through an e-wallet, then upload the receipt.', requiresProof: true, instructions: 'Account details will be provided by ARC Car Rental.' },
  { method: 'bank_transfer', label: 'Bank Transfer', description: 'Transfer to the ARC bank account, then upload the receipt.', requiresProof: true, instructions: 'Account details will be provided by ARC Car Rental.' },
  { method: 'cash', label: 'Cash In Person', description: 'Pay the down payment at the ARC shop before pickup.', requiresProof: false, instructions: null },
];
