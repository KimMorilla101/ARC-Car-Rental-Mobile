import { ApiError } from '@/services/api';
import type { BookingApi } from '@/services/bookingApi';
import type { PaymentApi } from '@/services/paymentApi';
import type { RentalApi } from '@/services/rentalApi';
import type { Booking, BookingListFilter, BookingQuotePayload, BookingStatus } from '@/types/booking';
import type { ExtensionOption } from '@/types/rental';

import { MOCK_POLICY, mockAgreement, mockBookings, mockPaymentMethods, mockVehicles, requirementTemplate } from './mockDb';
import { currentMockUser, mockDelay, mockNotFound, withoutPrivate } from './mockUtils';

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
  if (!(duration > 0)) throw new ApiError('validation', 'The return date must be after the pickup date.', 422, { returnAt: ['The return date must be after the pickup date.'] });
  const rentalDays = Math.max(1, Math.ceil(duration / DAY));
  const rentalFee = rentalDays * vehicle.rates.daily;
  const deliveryFee = payload.deliveryMethod === 'delivery' ? MOCK_POLICY.deliveryFee : 0;
  return {
    vehicle,
    rentalDays,
    available: vehicle.availableUnits > 0,
    pricing: { rentalFee, deliveryFee, carWashFee: MOCK_POLICY.carWashFee, lateReturnFee: 0, extensionFee: 0, downPayment: MOCK_POLICY.downPayment, total: rentalFee + deliveryFee + MOCK_POLICY.carWashFee },
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
    return mockDelay(result.sort((a, b) => b.pickupAt.localeCompare(a.pickupAt)));
  },

  async show(id) {
    return mockDelay(present(findOwnBooking(id)));
  },

  async quote(payload) {
    currentMockUser();
    const { rentalDays, available, pricing } = quote(payload);
    const requirements = requirementTemplate().map(({ type, label, description }) => ({ type, label, description }));
    return mockDelay({ rentalDays, available, pricing, requirements }, 350);
  },

  async create(payload) {
    const user = currentMockUser();
    const { vehicle, available, pricing } = quote(payload);
    if (!available) throw new ApiError('validation', 'No unit of this vehicle is available for those dates.', 422, { vehicleId: ['No unit is available for those dates.'] });
    const pickup = new Date(payload.pickupAt);
    const reference = `ARC-${pickup.toISOString().slice(2, 10).replace(/-/g, '')}-${String(mockBookings.length + 1).padStart(2, '0')}`;
    const booking: StoredBooking = {
      id: Math.max(...mockBookings.map((item) => Number(item.id))) + 1,
      userId: user.id,
      reference,
      vehicle,
      unitLabel: null,
      pickupAt: payload.pickupAt,
      returnAt: payload.returnAt,
      deliveryMethod: payload.deliveryMethod,
      pickupLocation: payload.deliveryMethod === 'delivery' ? (payload.deliveryAddress ?? '') : MOCK_POLICY.shopAddress,
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
  const base = new Date(booking.returnAt);
  const plus = (ms: number) => new Date(base.getTime() + ms).toISOString();
  const nextMonth = new Date(base);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const { rates } = booking.vehicle;
  return [
    { type: 'hourly', durationLabel: '2 hours', fee: rates.hourly * 2, requestedReturnAt: plus(2 * HOUR) },
    { type: 'daily', durationLabel: '1 day', fee: rates.daily, requestedReturnAt: plus(DAY) },
    { type: 'monthly', durationLabel: '1 month', fee: rates.monthly, requestedReturnAt: nextMonth.toISOString() },
  ];
}

export const mockRentalApi: RentalApi = {
  async extensionOptions(bookingId) {
    const booking = findOwnBooking(bookingId);
    return mockDelay({ deadline: booking.returnAt, currentReturnAt: booking.returnAt, options: extensionOptionsFor(booking) });
  },

  async requestExtension(bookingId, { type }) {
    const booking = findOwnBooking(bookingId);
    if (!present(booking).canRequestExtension) {
      throw new ApiError('validation', 'Extension requests are closed for this rental.', 422);
    }
    const option = extensionOptionsFor(booking).find((item) => item.type === type);
    if (!option) throw mockNotFound();
    booking.extension = { id: Date.now(), type, requestedReturnAt: option.requestedReturnAt, fee: option.fee, status: 'pending', createdAt: new Date().toISOString() };
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
      shopAddress: MOCK_POLICY.shopAddress,
    });
  },
};
