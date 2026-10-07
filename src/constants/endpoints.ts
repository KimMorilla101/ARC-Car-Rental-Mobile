/**
 * Laravel API routes used by the app, relative to apiConfig.baseUrl.
 *
 * Every entry is `null` until the backend confirms the route. A null entry makes the request fail
 * with a clear "not available yet" error instead of calling a guessed URL. The proposed paths and
 * payloads are in docs/API_CONTRACT.md.
 *
 * When an endpoint is confirmed, set its path here (use `{name}` for path parameters, e.g.
 * '/bookings/{id}') and check that the request/response in the matching services/*Api.ts file
 * still match the confirmed contract.
 */
export type Endpoint = string | null;

export const ENDPOINTS = {
  auth: {
    login: null as Endpoint,
    register: null as Endpoint,
    logout: null as Endpoint,
    me: null as Endpoint,
    forgotPassword: null as Endpoint,
  },
  profile: {
    update: null as Endpoint,
    avatar: null as Endpoint,
    password: null as Endpoint,
  },
  vehicles: {
    list: null as Endpoint,
    show: null as Endpoint,
    homeFeed: null as Endpoint,
  },
  bookings: {
    list: null as Endpoint,
    show: null as Endpoint,
    create: null as Endpoint,
    locations: null as Endpoint,
    quote: null as Endpoint,
    agreement: null as Endpoint,
    uploadRequirement: null as Endpoint,
  },
  payments: {
    methods: null as Endpoint,
    uploadProof: null as Endpoint,
  },
  rentals: {
    extensionOptions: null as Endpoint,
    requestExtension: null as Endpoint,
    returnSummary: null as Endpoint,
  },
  notifications: {
    list: null as Endpoint,
    markRead: null as Endpoint,
    markAllRead: null as Endpoint,
  },
  support: {
    contact: null as Endpoint,
  },
};
