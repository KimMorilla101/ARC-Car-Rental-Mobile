import { ApiError } from '@/services/api';
import type { BookingApi } from '@/services/bookingApi';
import type { PaymentApi } from '@/services/paymentApi';
import type { RentalApi } from '@/services/rentalApi';
import type { Booking, BookingListFilter, BookingQuotePayload, BookingStatus } from '@/types/booking';
import type { ExtensionOption, ExtensionType } from '@/types/rental';

import { MOCK_POLICY, mockAgreement, mockBookings, mockLocations, mockPaymentMethods, mockVehicles, priceFor, requirementTemplate } from './mockDb';
import { currentMockUser, mockDelay, mockNotFound, mockValidationError, withoutPrivate } from './mockUtils';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

type StoredBooking = (typeof mockBookings)[number];

/** Imitates server-computed fields that depend on the current time. */
function present(booking: StoredBooking): Booking {
  const now = Date.now();
  const returnTime = new Date(booking.returnAt).getTime();
  const status: BookingStatus = booking.status === 'active' && now >= returnTime ? 'return_due' : booking.status;
  const canRequestExtension = status === 'active' && now < returnTime && booking.extension?.status !== 'pending';
  return { ...withoutPrivate(booking), status, canRequestExtension };
}

function findOwnBooking(id: Booking['id']): StoredBooking {
  const user = currentMockUser();
  const booking = mockBookings.find((item) => String(item.id) === String(id) && item.userId === user.id);
  if (!booking) throw mockNotFound();
  return booking;
}

const filterStatuses: Record<Exclude<BookingListFilter, 'all'>, BookingStatus[]> = {
  upcoming: ['pending', 'pending_verification', 'confirmed'],
  active: ['active', 'return_due'],
  completed: ['returned', 'completed'],
  cancelled: ['cancelled'],
};

function quote(payload: BookingQuotePayload) {
  const vehicle = mockVehicles.find((item) => String(item.id) === String(payload.vehicleId));
  if (!vehicle) throw mockNotFound();
  const duration = new Date(payload.returnAt).getTime() - new Date(payload.pickupAt).getTime();
  if (!(duration > 0)) throw mockValidationError('returnAt', 'The return date must be after the pickup date.');
  const zone = mockLocations.deliveryZones.find((item) => String(item.id) === String(payload.deliveryZoneId));
  const branch = mockLocations.branches.find((item) => String(item.id) === String(payload.branchId));
  if (payload.deliveryMethod === 'delivery' && !zone) throw mockValidationError('deliveryZoneId', 'Choose a delivery area.');
  if (payload.deliveryMethod === 'shop_pickup' && !branch) throw mockValidationError('branchId', 'Choose a pickup branch.');
  const rentalDays = Math.max(1, Math.ceil(duration / DAY));
  return {
    vehicle,
    branch,
    rentalDays,
    available: vehicle.availableUnits > 0,
    pricing: priceFor(rentalDays * vehicle.rates.daily, payload.deliveryMethod === 'delivery' ? (zone?.fee ?? 0) : 0),
  };
}

/** Moves a pending booking to "pending verification" once every document and proof is in. */
function refreshVerificationStatus(booking: StoredBooking) {
  const docsIn = booking.requirements.every((item) => item.status !== 'missing');
  const paymentIn = booking.payment.method === 'cash' || booking.payment.proofUrl !== null;
  if (booking.status === 'pending' && docsIn && paymentIn) booking.status = 'pending_verification';
}

export const mockBookingApi: BookingApi = {
  async list(filter) {
    const user = currentMockUser();
    const own = mockBookings.filter((item) => item.userId === user.id).map(present);
    const result = filter === 'all' ? own : own.filter((item) => filterStatuses[filter].includes(item.status));
    return mockDelay(result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async show(id) {
    return mockDelay(present(findOwnBooking(id)));
  },

  async locations() {
    return mockDelay(mockLocations, 300);
  },

  async quote(payload) {
    currentMockUser();
    const { rentalDays, available, pricing } = quote(payload);
    const requirements = requirementTemplate().map(({ type, label, description }) => ({ type, label, description }));
    return mockDelay({ rentalDays, available, pricing, requirements }, 350);
  },

  async create(payload) {
    const user = currentMockUser();
    const { vehicle, branch, rentalDays, available, pricing } = quote(payload);
    if (!available) throw mockValidationError('vehicleId', 'No unit of this vehicle is available for those dates.');
    const id = Math.max(...mockBookings.map((item) => Number(item.id))) + 1;
    const booking: StoredBooking = {
      id,
      userId: user.id,
      reference: `BK-${new Date().getFullYear()}-${String(1000 + id).slice(-4)}`,
      vehicle,
      unitLabel: null,
      pickupAt: payload.pickupAt,
      returnAt: payload.returnAt,
      rentalDays,
      deliveryMethod: payload.deliveryMethod,
      pickupLocation: payload.deliveryMethod === 'delivery' ? (payload.deliveryAddress ?? '') : (branch?.name ?? ''),
      deliveryAddress: payload.deliveryAddress,
      destination: payload.destination,
      status: 'pending',
      payment: { method: payload.paymentMethod, status: 'awaiting_payment', proofUrl: null },
      pricing,
      requirements: requirementTemplate(),
      extension: null,
      canRequestExtension: false,
      trustScore: user.trustScore,
      createdAt: new Date().toISOString(),
    };
    mockBookings.push(booking);
    return mockDelay(present(booking), 1000);
  },

  async agreement() {
    return mockDelay(mockAgreement, 300);
  },

  async uploadRequirement(bookingId, type) {
    const booking = findOwnBooking(bookingId);
    const requirement = booking.requirements.find((item) => item.type === type);
    if (!requirement) throw mockNotFound();
    requirement.status = 'pending_verification';
    requirement.rejectionReason = null;
    refreshVerificationStatus(booking);
    return mockDelay(present(booking), 900);
  },
};

export const mockPaymentApi: PaymentApi = {
  async methods() {
    return mockDelay(mockPaymentMethods, 300);
  },

  async uploadProof(bookingId, file) {
    const booking = findOwnBooking(bookingId);
    booking.payment = { ...booking.payment, status: 'pending_verification', proofUrl: file.uri };
    refreshVerificationStatus(booking);
    return mockDelay(present(booking), 900);
  },
};

function extensionOptionsFor(booking: StoredBooking): ExtensionOption[] {
  const { rates } = booking.vehicle;
  return [
    { type: 'hourly', unitFee: rates.hourly, unitLabel: 'hour', maxQuantity: 12 },
    { type: 'daily', unitFee: rates.daily, unitLabel: 'day', maxQuantity: 14 },
    { type: 'monthly', unitFee: rates.monthly, unitLabel: 'month', maxQuantity: 3 },
  ];
}

function addUnits(iso: string, type: ExtensionType, quantity: number): string {
  const date = new Date(iso);
  if (type === 'hourly') date.setHours(date.getHours() + quantity);
  if (type === 'daily') date.setDate(date.getDate() + quantity);
  if (type === 'monthly') date.setMonth(date.getMonth() + quantity);
  return date.toISOString();
}

export const mockRentalApi: RentalApi = {
  async extensionOptions(bookingId) {
    const booking = findOwnBooking(bookingId);
    return mockDelay({ deadline: booking.returnAt, currentReturnAt: booking.returnAt, options: extensionOptionsFor(booking) });
  },

  async requestExtension(bookingId, { type, quantity }) {
    const booking = findOwnBooking(bookingId);
    if (!present(booking).canRequestExtension) throw new ApiError('validation', 'Extension requests are closed for this rental.', 422);
    const option = extensionOptionsFor(booking).find((item) => item.type === type);
    if (!option) throw mockNotFound();
    if (quantity < 1 || quantity > option.maxQuantity) throw mockValidationError('quantity', `Choose between 1 and ${option.maxQuantity}.`);
    booking.extension = {
      id: Date.now(),
      type,
      quantity,
      requestedReturnAt: addUnits(booking.returnAt, type, quantity),
      fee: option.unitFee * quantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    return mockDelay(present(booking), 900);
  },

  async returnSummary(bookingId) {
    const booking = findOwnBooking(bookingId);
    const delayedHours = Math.max(0, Math.ceil((Date.now() - new Date(booking.returnAt).getTime()) / HOUR));
    return mockDelay({
      scheduledReturnAt: booking.returnAt,
      delayedHours,
      lateFeePerHour: MOCK_POLICY.lateFeePerHour,
      estimatedLateFee: delayedHours * MOCK_POLICY.lateFeePerHour,
      returnLocation: booking.deliveryMethod === 'delivery' ? mockLocations.branches[0].name : booking.pickupLocation,
    });
  },
};
