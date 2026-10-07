# ARC Ride mobile app: expected Laravel API contract

**Status: PROPOSED. None of these endpoints exist yet.** `ARC-Car-Rental-Backend` is still the default
Laravel skeleton (as of 2026-09-30): no `routes/api.php`, no Sanctum, only the `User` model.

This document describes what the mobile app needs from Laravel. Paths and field names are proposals, and
the backend team can change them. When an endpoint is built:

1. Set its path in [`src/constants/endpoints.ts`](../src/constants/endpoints.ts) (every entry is `null` until confirmed).
2. If the real request or response differs from this document, update the matching `src/services/*Api.ts`
   function and the type in `src/types/`. Screens don't need to change.
3. Tick it off in the checklist at the bottom.

While an endpoint is `null`, the app shows "Not available yet" instead of calling a guessed URL. In development
you can set `EXPO_PUBLIC_USE_MOCK_API=true` to use the temporary in-memory mocks in `src/services/mock/`.

---

## 1. Conventions

| Topic | Expectation |
|---|---|
| Base URL | `EXPO_PUBLIC_API_BASE_URL`, including the `/api` prefix, e.g. `https://api.example.com/api`. Production must use HTTPS. |
| Auth | Laravel Sanctum **personal access tokens**, sent as `Authorization: Bearer <token>`. The app does not use cookie/SPA auth. |
| Format | JSON requests and responses, `Accept: application/json`. Keys in **snake_case**; the app converts to and from camelCase automatically. |
| Single resources | Wrapped as `{ "data": { ... } }` (Laravel `JsonResource` default). |
| Collections | `{ "data": [ ... ] }`. Pagination (`links`/`meta`) can be added later; the app currently reads `data` only. |
| Dates | ISO-8601 with offset, e.g. `2026-10-01T09:00:00+08:00`. |
| Money | Numbers in PHP pesos, e.g. `2800` or `2800.50` (not strings, not centavos). |
| IDs | Integers are fine. |
| Validation errors | HTTP **422** in Laravel's default format: `{ "message": "...", "errors": { "field_name": ["..."] } }`. The app shows each message under the matching form field. |
| Auth errors | **401** for a missing, expired or revoked token. The app then deletes the stored token and returns to sign-in. |
| Other errors | 403 (not allowed), 404 (not found or not owned by this user), 429 (throttled), 5xx. The app never shows 5xx messages to the renter. |
| File uploads | `multipart/form-data`. Images (JPEG/PNG/HEIC) up to 5 MB. Laravel must validate MIME type and size. |
| CORS | Native iOS/Android apps are not subject to CORS. Only configure `config/cors.php` if the web build is used. |

---

## 2. Endpoints

`ENDPOINTS` key = the entry in `src/constants/endpoints.ts`. All endpoints need a valid token except those marked **public**.

### Auth

| Key | Proposed | Request | Success response |
|---|---|---|---|
| `auth.login` (public, throttled) | `POST /auth/login` | `{ email, password, device_name }` | `200 { token, user: User }` |
| `auth.register` (public, throttled) | `POST /auth/register` | `{ name, email, phone, password, password_confirmation, device_name }` | `201 { token, user: User }` |
| `auth.logout` | `POST /auth/logout` | none | `204`. Revoke **only the current** token. |
| `auth.me` | `GET /user` | none | `{ data: User }` |
| `auth.forgotPassword` (public, throttled) | `POST /auth/forgot-password` | `{ email }` | `200`. Must not reveal whether the email exists. The reset itself happens via Laravel's emailed link. |

Failed login: return **422** with `errors.email = ["These credentials do not match our records."]` (Laravel default).

### Profile

| Key | Proposed | Request | Success response |
|---|---|---|---|
| `profile.update` | `PUT /user/profile` | `{ name, phone \| null, address \| null }` | `{ data: User }` |
| `profile.avatar` | `POST /user/avatar` | multipart `avatar` | `{ data: User }` with a new `avatar_url` |
| `profile.password` | `PUT /user/password` | `{ current_password, password, password_confirmation }` | `204`. Return 422 on `current_password` if it's wrong. |

The email address is read-only in the app.

### Vehicles

| Key | Proposed | Request | Success response |
|---|---|---|---|
| `vehicles.list` | `GET /vehicles` | query: `search, category, transmission, fuel, min_seats, max_daily_rate, available_only, pickup_at, return_at, sort` (all optional) | `{ data: Vehicle[], meta: { fleet_size } }` (`fleet_size` = whole fleet, for "Showing 4 of 10") |
| `vehicles.show` | `GET /vehicles/{id}` | none | `{ data: Vehicle }` |
| `vehicles.homeFeed` | `GET /vehicles/home-feed` | none | `{ data: { featured: Vehicle[], recommended: Vehicle[] } }` |

`sort` is one of `recommended | price_asc | price_desc | popular | rating`. When `pickup_at` and `return_at` are both
sent, `available_units` must count only units free for that window.

### Bookings

| Key | Proposed | Request | Success response |
|---|---|---|---|
| `bookings.list` | `GET /bookings` | query `status` = `upcoming \| active \| completed \| cancelled` (omit for all) | `{ data: Booking[] }`, the current user's bookings only |
| `bookings.show` | `GET /bookings/{id}` | none | `{ data: Booking }`. Return 404 if it belongs to someone else. |
| `bookings.locations` | `GET /booking-locations` | none | `{ data: { branches: Branch[], delivery_zones: DeliveryZone[] } }` |
| `bookings.quote` | `POST /bookings/quote` | `{ vehicle_id, pickup_at, return_at, delivery_method, branch_id \| null, delivery_zone_id \| null, delivery_address \| null }` | `{ data: BookingQuote }`. Nothing is saved. |
| `bookings.create` | `POST /bookings` | quote fields + `{ destination, payment_method, agreement_version, agreement_accepted: true }` | `201 { data: Booking }` with status `pending` |
| `bookings.agreement` | `GET /rental-agreement` | none | `{ data: { version, title, sections: [{ title, body }] } }` |
| `bookings.uploadRequirement` | `POST /bookings/{id}/requirements` | multipart `type` + `file` | `{ data: Booking }` with that requirement now `pending_verification` |

Filter mapping for `status`: upcoming = `pending, pending_verification, confirmed`; active = `active, return_due`;
completed = `returned, completed`; cancelled = `cancelled`.

Booking flow in the app: **quote → create → upload each requirement → upload payment proof → reload the booking**.
If an upload fails, the booking still exists and the renter can retry from booking details.

### Payments

| Key | Proposed | Request | Success response |
|---|---|---|---|
| `payments.methods` | `GET /payment-methods` | none | `{ data: PaymentMethodOption[] }` |
| `payments.uploadProof` | `POST /bookings/{id}/payment-proof` | multipart `proof` | `{ data: Booking }` with `payment.status = pending_verification` |

Uploaded proof must **never** confirm a booking automatically. Only ARC staff verification changes the status.

### Rentals (extensions and returns)

| Key | Proposed | Request | Success response |
|---|---|---|---|
| `rentals.extensionOptions` | `GET /bookings/{id}/extension-options` | none | `{ data: ExtensionOptions }` |
| `rentals.requestExtension` | `POST /bookings/{id}/extensions` | `{ type: hourly \| daily \| monthly, quantity }` | `{ data: Booking }` with `extension.status = pending` |
| `rentals.returnSummary` | `GET /bookings/{id}/return-summary` | none | `{ data: ReturnSummary }` |

`requestExtension` must return **422** once the fixed return time has passed. The app's check is only a hint.

### Notifications

| Key | Proposed | Request | Success response |
|---|---|---|---|
| `notifications.list` | `GET /notifications` | none | `{ data: AppNotification[] }`, newest first |
| `notifications.markRead` | `POST /notifications/{id}/read` | none | `204` |
| `notifications.markAllRead` | `POST /notifications/read-all` | none | `204` |

### Support

| Key | Proposed | Request | Success response |
|---|---|---|---|
| `support.contact` (public, throttled) | `POST /support/messages` | `{ email, message }` | `204` |

The Contact screen is also reachable while signed out, so this endpoint must accept requests without a token.

---

## 3. Resource shapes

Shown in snake_case (as Laravel sends them). TypeScript versions live in `src/types/`.

```jsonc
// User  (src/types/auth.ts)
{ "id": 1, "name": "Juan Dela Cruz", "email": "juan@example.com", "phone": "09171234567",
  "address": "Davao City", "avatar_url": null, "trust_score": 92 }          // trust_score: 0-100 or null

// Vehicle  (src/types/vehicle.ts)
{ "id": 1, "name": "Toyota Camry 2024", "category": "Sedan",               // Sedan|SUV|MPV|Pickup|Luxury|Hatchback
  "rates": { "hourly": 320, "daily": 2500, "monthly": 50000 },
  "image_url": "https://...", "gallery": ["https://..."],
  "seats": 7, "doors": 4, "transmission": "Automatic", "fuel": "Gasoline", // Automatic|Manual ; Gasoline|Diesel|Hybrid|Electric
  "rating": 4.8, "review_count": 124, "is_popular": true, "description": "...", "features": ["Apple CarPlay"],
  "available_units": 1, "match_score": 92 }                                // match_score: 0-100 or null

// Booking  (src/types/booking.ts)
{ "id": 891, "reference": "BK-2026-0891", "vehicle": { /* Vehicle */ }, "unit_label": "Honda BR-V Unit 01",
  "pickup_at": "2026-09-28T09:00:00+08:00", "return_at": "2026-10-01T09:00:00+08:00", "rental_days": 3,
  "delivery_method": "shop_pickup", "pickup_location": "ARC Davao City Branch – Ecoland Drive (Main)",  // branch name or delivery address
  "delivery_address": null, "destination": "Samal Island",
  "status": "active",   // pending|pending_verification|confirmed|active|return_due|returned|completed|cancelled
  "payment": { "method": "cash", "status": "paid", "proof_url": null },
      // method: online|bank_transfer|cash ; status: awaiting_payment|pending_verification|verified|paid|rejected
  "pricing": { "rental_fee": 7500, "delivery_fee": 0, "car_wash_fee": 350, "late_return_fee": 0,
               "extension_fee": 0, "total": 7850, "down_payment": 1000, "balance_due": 6850 },
  "requirements": [ { "type": "drivers_license", "label": "Driver's License", "description": "...",
                      "status": "verified", "rejection_reason": null } ],
      // type: drivers_license|valid_id|proof_of_billing|down_payment ; status: missing|pending_verification|verified|rejected
  "extension": null,    // or Extension
  "can_request_extension": true,
  "trust_score": 92, "created_at": "2026-09-25T14:00:00+08:00" }

// BookingQuote
{ "rental_days": 3, "available": true, "pricing": { /* as above */ },
  "requirements": [ { "type": "drivers_license", "label": "...", "description": "..." } ] }

// PaymentMethodOption
{ "method": "bank_transfer", "label": "Bank Transfer", "description": "...", "requires_proof": true,
  "accounts": [ { "provider": "BPI", "account_name": "ARC Car Rental Services", "account_number": "1234-5678-90" } ] }  // empty for cash

// Branch and DeliveryZone (GET /booking-locations)
{ "id": 1, "name": "ARC Davao City Branch – Ecoland Drive (Main)", "address": "Ecoland Drive, Matina, Davao City" }
{ "id": 3, "name": "Panabo / Tagum", "fee": 900 }

// Extension
{ "id": 5, "type": "daily", "quantity": 2, "requested_return_at": "...", "fee": 5000, "status": "pending", "created_at": "..." }
// ExtensionOptions
{ "deadline": "...", "current_return_at": "...",
  "options": [ { "type": "daily", "unit_fee": 2500, "unit_label": "day", "max_quantity": 14 } ] }

// ReturnSummary
{ "scheduled_return_at": "...", "delayed_hours": 2, "late_fee_per_hour": 300, "estimated_late_fee": 600,
  "return_location": "ARC SM Lanang Branch" }

// AppNotification
{ "id": 3, "type": "rental",  // booking|payment|rental|extension|late_return|general
  "title": "Return deadline reminder", "body": "...", "booking_id": 101, "read_at": null, "created_at": "..." }
```

---

## 4. Business rules Laravel must own

The app shows these but never decides them:

- **Fixed return time**: the return time equals the pickup time of day. Reject bookings that break this.
- **Pricing**: rental fee, delivery fee (per delivery zone), fixed car wash fee, ₱1,000 down payment, extension and late-return fees. The app only displays `pricing` from quotes and bookings.
- **Availability and unit assignment**: prevent double-booking when creating a booking or approving an extension.
- **Status transitions**, including `return_due` once `return_at` passes with the car still out, and `can_request_extension`.
- **Verification**: documents and payment proof stay pending until staff approve them. Nothing auto-confirms.
- **Trust Score**: computed and managed by ARC. The renter can only view it.
- **Notifications**: created server-side for booking, payment, rental, extension and late-return events.
- **Authorization**: renters can only read or change their own bookings, uploads and notifications (use policies).
- **Throttling**: login, register, forgot-password and support messages.

## 5. Backend setup the app depends on

- `php artisan install:api` (installs Sanctum and creates `routes/api.php`); add `HasApiTokens` to `User`.
- Add `phone`, `address`, `avatar_path` and `trust_score` to `users`; add tables for vehicles, vehicle units, bookings, requirements, payments, extensions and notifications.
- A public storage disk (or signed URLs) for vehicle images and avatars. Keep renter documents **private**, never on a public URL.
- For devices on your Wi-Fi to reach it in development: `php artisan serve --host=0.0.0.0 --port=8000`.

## 6. Confirmation checklist

- [ ] auth.login · [ ] auth.register · [ ] auth.logout · [ ] auth.me · [ ] auth.forgotPassword
- [ ] profile.update · [ ] profile.avatar · [ ] profile.password
- [ ] vehicles.list · [ ] vehicles.show · [ ] vehicles.homeFeed
- [ ] bookings.list · [ ] bookings.show · [ ] bookings.locations · [ ] bookings.quote · [ ] bookings.create · [ ] bookings.agreement · [ ] bookings.uploadRequirement
- [ ] payments.methods · [ ] payments.uploadProof
- [ ] rentals.extensionOptions · [ ] rentals.requestExtension · [ ] rentals.returnSummary
- [ ] notifications.list · [ ] notifications.markRead · [ ] notifications.markAllRead
- [ ] support.contact
