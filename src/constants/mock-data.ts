export type ExtensionType = 'Hourly' | 'Daily' | 'Monthly';
export type PaymentMethod = 'Online Payment' | 'Bank Transfer' | 'Cash In Person';
export type RentalStatus = 'Pending' | 'Pending Verification' | 'Confirmed' | 'Active Rental' | 'Extension Requested' | 'Extension Approved' | 'Extension Declined' | 'Return Vehicle' | 'Returned' | 'Rental Expired' | 'Completed';

export type Car = {
  id: string;
  name: string;
  category: 'SUV' | 'Sedan' | 'MPV' | 'Hatchback' | 'Pickup';
  price: number;
  hourlyPrice: number;
  monthlyPrice: number;
  image: string;
  gallery?: string[];
  seats: number;
  transmission: string;
  fuel: string;
  rating: string;
  description: string;
  features: string[];
  units: string[];
  match?: number;
};

export type BookingRequirement = {
  id: 'license' | 'billing' | 'validId' | 'downPayment';
  label: string;
  detail: string;
  uploaded: boolean;
  status: 'Missing' | 'Pending Verification' | 'Verified';
};

export type Booking = {
  id: string;
  car: Car;
  unit: string;
  pickup: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  location: string;
  deliveryType: 'ARC Car Rental shop' | 'Vehicle delivery';
  deliveryAddress?: string;
  destination: string;
  status: RentalStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Awaiting payment' | 'Pending Verification' | 'Verified' | 'Paid';
  total: number;
  rentalFee: number;
  pickupDeliveryFee: number;
  carWashFee: number;
  lateReturnFee: number;
  requirements: BookingRequirement[];
  extensionStatus: 'Not requested' | 'Pending' | 'Approved' | 'Declined';
  trustScore: number;
  agreementAcknowledged: boolean;
};

const carImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85';

export const cars: Car[] = [
  { id: 'toyota-rav4', name: 'Toyota RAV4', category: 'SUV', price: 2800, hourlyPrice: 350, monthlyPrice: 56000, image: carImage, gallery: [carImage, carImage], seats: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: '4.9', description: 'A confident SUV with flexible space for city drives and longer trips.', features: ['Toyota Safety Sense', 'Apple CarPlay', 'Backup camera', 'Large cargo area'], units: ['Toyota RAV4 Unit 01', 'Toyota RAV4 Unit 02', 'Toyota RAV4 Unit 03'], match: 96 },
  { id: 'toyota-vios', name: 'Toyota Vios', category: 'Sedan', price: 1800, hourlyPrice: 250, monthlyPrice: 36000, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85', seats: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: '4.9', description: 'A dependable sedan with a quiet cabin and easy city handling.', features: ['Air conditioning', 'Bluetooth audio', 'Backup camera', 'USB charging'], units: ['Toyota Vios Unit 01', 'Toyota Vios Unit 02'], match: 95 },
  { id: 'honda-brv', name: 'Honda BR-V', category: 'SUV', price: 2500, hourlyPrice: 320, monthlyPrice: 50000, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85', seats: 7, transmission: 'Automatic', fuel: 'Gasoline', rating: '4.8', description: 'Room for the whole family with flexible seating and generous cargo space.', features: ['7 seats', 'Apple CarPlay', 'Cruise control', 'Large cargo area'], units: ['Honda BR-V Unit 01'], match: 92 },
  { id: 'mitsubishi-xpander', name: 'Mitsubishi Xpander', category: 'MPV', price: 2300, hourlyPrice: 300, monthlyPrice: 46000, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=85', seats: 7, transmission: 'Automatic', fuel: 'Gasoline', rating: '4.7', description: 'A comfortable people mover built for family trips and airport runs.', features: ['7 seats', 'Rear air vents', 'Smart entry', 'Spacious interior'], units: ['Mitsubishi Xpander Unit 01'], match: 88 },
  { id: 'toyota-hilux', name: 'Toyota Hilux', category: 'Pickup', price: 3000, hourlyPrice: 380, monthlyPrice: 60000, image: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1000&q=85', seats: 5, transmission: 'Manual', fuel: 'Diesel', rating: '4.8', description: 'A durable pickup for work trips, equipment, and open-road travel.', features: ['Bed liner', '4x2 drive', 'Hill start assist', 'Bluetooth audio'], units: ['Toyota Hilux Unit 01'], match: 82 },
  { id: 'honda-city', name: 'Honda City Hatchback', category: 'Hatchback', price: 1900, hourlyPrice: 260, monthlyPrice: 38000, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85', seats: 5, transmission: 'Automatic', fuel: 'Gasoline', rating: '4.7', description: 'A compact and efficient hatchback for easy city exploration.', features: ['Rear camera', 'Keyless entry', 'Bluetooth audio', 'Air conditioning'], units: ['Honda City Hatchback Unit 01'], match: 80 },
];

const requirements: BookingRequirement[] = [
  { id: 'license', label: "Driver's License", detail: 'Front and back, clear and valid', uploaded: true, status: 'Pending Verification' },
  { id: 'billing', label: 'Proof of Billing', detail: 'Water, electric, or internet bill', uploaded: false, status: 'Missing' },
  { id: 'validId', label: 'Primary Valid ID', detail: 'Government-issued identification', uploaded: true, status: 'Pending Verification' },
  { id: 'downPayment', label: '₱1,000 Down-Payment Proof', detail: 'Required to reserve the unit', uploaded: false, status: 'Missing' },
];

export const bookings: Booking[] = [
  { id: 'ARC-260924-08', car: cars[2], unit: 'Honda BR-V Unit 01', pickup: 'Sep 24, 2026', pickupTime: '09:00 AM', returnDate: 'Sep 28, 2026', returnTime: '09:00 AM', location: 'Davao City', deliveryType: 'ARC Car Rental shop', destination: 'Samal Island', status: 'Active Rental', paymentMethod: 'Cash In Person', paymentStatus: 'Awaiting payment', total: 10500, rentalFee: 10000, pickupDeliveryFee: 0, carWashFee: 500, lateReturnFee: 0, requirements, extensionStatus: 'Not requested', trustScore: 92, agreementAcknowledged: true },
  { id: 'ARC-260810-21', car: cars[1], unit: 'Toyota Vios Unit 01', pickup: 'Aug 10, 2026', pickupTime: '10:00 AM', returnDate: 'Aug 12, 2026', returnTime: '10:00 AM', location: 'Davao City', deliveryType: 'ARC Car Rental shop', destination: 'Davao City', status: 'Completed', paymentMethod: 'Cash In Person', paymentStatus: 'Paid', total: 4100, rentalFee: 3600, pickupDeliveryFee: 0, carWashFee: 500, lateReturnFee: 0, requirements, extensionStatus: 'Not requested', trustScore: 92, agreementAcknowledged: true },
];

export const notifications = [
  { id: '1', title: 'Booking confirmed', body: 'Your Honda BR-V is ready for pickup on September 28.', time: '2 hours ago', unread: true },
  { id: '2', title: 'Return deadline reminder', body: 'Your return time is fixed at 09:00 AM. Extension requests close at the deadline.', time: 'Yesterday', unread: true },
  { id: '3', title: 'Payment reminder', body: 'Bring your ₱1,000 down payment and required documents to pickup.', time: 'Sep 20', unread: false },
];

export const rentalPolicies = [
  'The pickup time is also the fixed return time and cannot be manually changed.',
  'Extensions must be requested before the scheduled return date and time and require ARC Car Rental approval.',
  'A ₱1,000 down payment is required to reserve a unit. Payment proof does not confirm a booking until verified.',
  'A fixed ₱500 car wash fee applies separately to every completed rental.',
  'Customers are responsible for the vehicle, documents, fuel, traffic rules, and returning the unit on time.',
  'Late returns incur a predefined late-return fee based on delayed hours. Expired rentals cannot be extended.',
];
