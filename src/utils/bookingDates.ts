/**
 * ARC rule: the return time is always the same time of day as the pickup time, so the renter only
 * picks a return *date*. The backend enforces this too; these helpers keep the form consistent.
 */
export function withTimeOf(date: Date, timeSource: Date): Date {
  const result = new Date(date);
  result.setHours(timeSource.getHours(), timeSource.getMinutes(), 0, 0);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Tomorrow at 9:00 AM: a sensible default pickup time. */
export function defaultPickup(now = new Date()): Date {
  const pickup = addDays(now, 1);
  pickup.setHours(9, 0, 0, 0);
  return pickup;
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}
