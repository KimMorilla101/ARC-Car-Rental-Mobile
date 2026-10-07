/**
 * TEMPORARY in-memory data used only when EXPO_PUBLIC_USE_MOCK_API=true in a development build.
 * Delete this folder once the Laravel API is live. Nothing outside src/services may import it.
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

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;
const IMG = {
  sedanGrey: photo('photo-1503376780353-7e6692767b70'),
  sedanSilver: photo('photo-1552519507-da3b142c6e3d'),
  suvBlack: photo('photo-1606664515524-ed2f786a0bd6'),
  mpvWhite: photo('photo-1549317661-bd32c8ce0db2'),
  pickup: photo('photo-1551830820-330a71b99659'),
  hatch: photo('photo-1492144534655-ae79c964c9d7'),
  road: photo('photo-1493238792000-8113da705763'),
};

type VehicleSeed = Omit<Vehicle, 'gallery' | 'doors' | 'matchScore'> & { doors?: number; matchScore?: number };
const vehicle = (seed: VehicleSeed): Vehicle => ({ doors: 4, matchScore: null, gallery: [seed.imageUrl, IMG.road], ...seed });

export const mockVehicles: Vehicle[] = [
  vehicle({ id: 1, name: 'Toyota Camry 2024', category: 'Sedan', rates: { hourly: 350, daily: 2500, monthly: 52000 }, imageUrl: IMG.sedanGrey, seats: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.8, reviewCount: 124, isPopular: true, description: 'The Toyota Camry 2024 combines elegant styling with exceptional comfort and reliability. Perfect for business trips and family weekends.', features: ['Apple CarPlay & Android Auto', 'Adaptive cruise control', 'Backup camera', 'Dual-zone climate control'], availableUnits: 2, matchScore: 96 }),
  vehicle({ id: 2, name: 'Honda CR-V 2024', category: 'SUV', rates: { hourly: 420, daily: 3200, monthly: 66000 }, imageUrl: IMG.suvBlack, seats: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.7, reviewCount: 98, isPopular: true, description: 'A roomy, refined SUV with a smooth ride and plenty of cargo space for out-of-town trips.', features: ['Honda Sensing safety suite', 'Large cargo area', 'Apple CarPlay', 'Rear camera'], availableUnits: 1, matchScore: 93 }),
  vehicle({ id: 3, name: 'Toyota Fortuner 2024', category: 'SUV', rates: { hourly: 480, daily: 3800, monthly: 78000 }, imageUrl: IMG.suvBlack, seats: 7, transmission: 'Automatic', fuel: 'Diesel', rating: 4.9, reviewCount: 156, isPopular: true, description: 'A rugged 7-seater built for mountain roads and long family drives.', features: ['7 seats', '4x2 diesel engine', 'Hill start assist', 'Rear air vents'], availableUnits: 1, matchScore: 90 }),
  vehicle({ id: 4, name: 'Honda Civic 2024', category: 'Sedan', rates: { hourly: 330, daily: 2400, monthly: 50000 }, imageUrl: IMG.sedanSilver, seats: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.7, reviewCount: 87, isPopular: false, description: 'Sporty, efficient and easy to park, ideal for city driving.', features: ['Turbo engine', 'Lane keep assist', 'Wireless charging', 'Rear camera'], availableUnits: 0 }),
  vehicle({ id: 5, name: 'Toyota Vios 2024', category: 'Sedan', rates: { hourly: 250, daily: 1800, monthly: 36000 }, imageUrl: IMG.sedanSilver, seats: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.6, reviewCount: 142, isPopular: false, description: 'A dependable, fuel-efficient sedan with a quiet cabin.', features: ['Air conditioning', 'Bluetooth audio', 'Backup camera', 'USB charging'], availableUnits: 3 }),
  vehicle({ id: 6, name: 'Mitsubishi Xpander 2024', category: 'MPV', rates: { hourly: 300, daily: 2300, monthly: 46000 }, imageUrl: IMG.mpvWhite, seats: 7, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.6, reviewCount: 76, isPopular: false, description: 'A comfortable people mover built for family trips and airport runs.', features: ['7 seats', 'Rear air vents', 'Smart entry', 'Spacious interior'], availableUnits: 2 }),
  vehicle({ id: 7, name: 'Toyota Hiace 2024', category: 'MPV', rates: { hourly: 600, daily: 4500, monthly: 90000 }, imageUrl: IMG.mpvWhite, seats: 12, doors: 4, transmission: 'Manual', fuel: 'Diesel', rating: 4.5, reviewCount: 41, isPopular: false, description: 'A 12-seater van for group tours, events and company outings.', features: ['12 seats', 'Dual air conditioning', 'Large luggage space', 'Sliding door'], availableUnits: 1 }),
  vehicle({ id: 8, name: 'Toyota Hilux 2024', category: 'Pickup', rates: { hourly: 400, daily: 3000, monthly: 60000 }, imageUrl: IMG.pickup, seats: 5, transmission: 'Manual', fuel: 'Diesel', rating: 4.7, reviewCount: 63, isPopular: false, description: 'A durable pickup for work trips, equipment and open-road travel.', features: ['Bed liner', '4x2 drive', 'Hill start assist', 'Bluetooth audio'], availableUnits: 1 }),
  vehicle({ id: 9, name: 'Mercedes-Benz C-Class 2024', category: 'Luxury', rates: { hourly: 1100, daily: 8000, monthly: 160000 }, imageUrl: IMG.sedanGrey, seats: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.9, reviewCount: 35, isPopular: false, description: 'Premium comfort for weddings, VIP transfers and special occasions.', features: ['Leather interior', 'Ambient lighting', 'Burmester sound', 'Parking assist'], availableUnits: 1 }),
  vehicle({ id: 10, name: 'Honda City Hatchback 2024', category: 'Hatchback', rates: { hourly: 260, daily: 1900, monthly: 38000 }, imageUrl: IMG.hatch, seats: 5, doors: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: 4.6, reviewCount: 58, isPopular: false, description: 'A compact and efficient hatchback for easy city exploration.', features: ['Rear camera', 'Keyless entry', 'Bluetooth audio', 'Air conditioning'], availableUnits: 2 }),
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

/** A date `days` from now at a fixed hour, so demo bookings stay relevant whenever the app runs. */
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

const withStatus = (status: BookingRequirement['status']) => requirementTemplate().map((item) => ({ ...item, status }));
const MAIN_BRANCH = mockLocations.branches[0].name;

export const mockBookings: (Booking & { userId: User['id'] })[] = [
  {
    id: 795, userId: 1, reference: 'BK-2026-0795', vehicle: mockVehicles[3], unitLabel: 'Honda Civic Unit 02',
    pickupAt: atHour(-3, 14), returnAt: atHour(0, 23), rentalDays: 3, deliveryMethod: 'shop_pickup', pickupLocation: 'ARC SM Lanang Branch', deliveryAddress: null, destination: 'Samal Island',
    status: 'active', payment: { method: 'cash', status: 'paid', proofUrl: null }, pricing: priceFor(7200),
    requirements: withStatus('verified'), extension: null, canRequestExtension: true, trustScore: 92, createdAt: atHour(-6, 10),
  },
  {
    id: 891, userId: 1, reference: 'BK-2026-0891', vehicle: mockVehicles[2], unitLabel: 'Toyota Fortuner Unit 01',
    pickupAt: atHour(2, 9), returnAt: atHour(5, 9), rentalDays: 3, deliveryMethod: 'shop_pickup', pickupLocation: MAIN_BRANCH, deliveryAddress: null, destination: 'Mati City',
    status: 'confirmed', payment: { method: 'bank_transfer', status: 'paid', proofUrl: 'mock://proof' }, pricing: priceFor(12900),
    requirements: withStatus('verified'), extension: null, canRequestExtension: false, trustScore: 92, createdAt: atHour(-4, 15),
  },
  {
    id: 874, userId: 1, reference: 'BK-2026-0874', vehicle: mockVehicles[0], unitLabel: null,
    pickupAt: atHour(8, 9), returnAt: atHour(13, 9), rentalDays: 5, deliveryMethod: 'delivery', pickupLocation: 'Lanang, Davao City', deliveryAddress: 'Lanang, Davao City', destination: 'Davao City',
    status: 'pending_verification', payment: { method: 'online', status: 'pending_verification', proofUrl: 'mock://proof' }, pricing: priceFor(12500, 300),
    requirements: withStatus('pending_verification'), extension: null, canRequestExtension: false, trustScore: 92, createdAt: atHour(-1, 11),
  },
  {
    id: 612, userId: 1, reference: 'BK-2026-0612', vehicle: mockVehicles[1], unitLabel: 'Honda CR-V Unit 01',
    pickupAt: atHour(-58, 9), returnAt: atHour(-53, 9), rentalDays: 5, deliveryMethod: 'shop_pickup', pickupLocation: MAIN_BRANCH, deliveryAddress: null, destination: 'Bukidnon',
    status: 'completed', payment: { method: 'cash', status: 'paid', proofUrl: null }, pricing: priceFor(16000),
    requirements: withStatus('verified'), extension: null, canRequestExtension: false, trustScore: 92, createdAt: atHour(-62, 9),
  },
  {
    id: 540, userId: 1, reference: 'BK-2026-0540', vehicle: mockVehicles[5], unitLabel: null,
    pickupAt: atHour(-80, 9), returnAt: atHour(-78, 9), rentalDays: 2, deliveryMethod: 'shop_pickup', pickupLocation: MAIN_BRANCH, deliveryAddress: null, destination: 'Digos City',
    status: 'cancelled', payment: { method: 'cash', status: 'awaiting_payment', proofUrl: null }, pricing: priceFor(4600),
    requirements: withStatus('missing'), extension: null, canRequestExtension: false, trustScore: 92, createdAt: atHour(-85, 9),
  },
];

export const mockNotifications: (AppNotification & { userId: User['id'] })[] = [
  { id: 6, userId: 1, type: 'late_return', title: 'Return Deadline Approaching', body: 'Reminder: your Honda Civic (BK-2026-0795) is due for return today. Please return it to ARC SM Lanang Branch on time.', bookingId: 795, readAt: null, createdAt: atHour(0, 7) },
  { id: 5, userId: 1, type: 'payment', title: 'Payment Proof Received', body: 'We received your payment proof for BK-2026-0874. Our team is verifying your payment and documents. We will notify you once confirmed.', bookingId: 874, readAt: null, createdAt: atHour(-1, 13) },
  { id: 4, userId: 1, type: 'extension', title: 'Extension Request Submitted', body: 'Your extension request for BK-2026-0795 (Honda Civic) is pending approval. We will notify you once a decision is made.', bookingId: 795, readAt: null, createdAt: atHour(-1, 9) },
  { id: 3, userId: 1, type: 'booking', title: 'Booking Confirmed!', body: 'Your booking BK-2026-0891 for Toyota Fortuner has been confirmed. Pickup is at the ARC Ecoland Branch.', bookingId: 891, readAt: null, createdAt: atHour(-2, 10) },
  { id: 2, userId: 1, type: 'rental', title: 'Rental Completed', body: 'Thanks for renting the Honda CR-V (BK-2026-0612). Your Trust Score has been updated.', bookingId: 612, readAt: atHour(-52, 10), createdAt: atHour(-53, 12) },
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
