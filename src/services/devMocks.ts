import { apiConfig } from '@/constants/api';

type MockServices = typeof import('./mock');

/**
 * Temporary in-memory mock services, or null.
 *
 * This is the only place that loads `services/mock/`. In release builds Metro replaces `__DEV__`
 * with `false` and removes this `require` before bundling, so no mock code, demo login or test data
 * ships in a production app. Do not import `./mock` anywhere else, or that guarantee is lost.
 */
export const devMocks: MockServices | null =
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- must stay a conditional require so release builds drop it
  __DEV__ && apiConfig.useMockApi ? (require('./mock') as MockServices) : null;
