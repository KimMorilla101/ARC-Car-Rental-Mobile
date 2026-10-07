# ARC Ride: customer mobile app

React Native + Expo (SDK 57) + TypeScript app for ARC Car Rental renters. It talks to the Laravel API in
[`ARC-Car-Rental-Backend`](https://github.com/KimMorilla101/ARC-Car-Rental-Backend) over authenticated HTTPS.

> **Backend status:** the Laravel API has not been built yet. The endpoints the app needs are documented in
> [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md). Until they exist, run the app in mock mode (below).

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit if needed
npx expo start
```

The app uses `expo-secure-store`, `expo-image-picker` and `@react-native-community/datetimepicker`, which are all
included in Expo Go. Use a development build if you add other native modules.

### Environment (`.env.local`)

| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Laravel URL including `/api`. Required for production (HTTPS only). Leave empty in development to auto-detect the machine running Metro. |
| `EXPO_PUBLIC_API_PORT` | Port used for auto-detection (default `8000`). |
| `EXPO_PUBLIC_USE_MOCK_API` | `true` = temporary in-memory data in `src/services/mock/`. Ignored in release builds. Demo login: `juan@example.com` / `password123`. |

`EXPO_PUBLIC_*` values are bundled into the app, so never put secrets in them. Base-URL examples for Laragon, the Android
emulator (`10.0.2.2`), the iOS simulator and physical phones are in `.env.example`. For a phone to reach your
PC, start Laravel with `php artisan serve --host=0.0.0.0 --port=8000`.

## Checks

```bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
npx expo-doctor    # dependency/config health
```

## Project structure

```
src/
  app/           Expo Router routes only (thin files that re-export screens)
    _layout.tsx    providers, error boundary, auth route guards (Stack.Protected)
    (auth)/        welcome, login, register, forgot-password: signed-out only
    (app)/         signed-in only: (tabs) + vehicle, booking, profile screens
    about|contact|faq.tsx   public pages
  screens/       one component per screen, grouped by feature
  components/    reusable UI (common/, auth/, dashboard/, vehicles/, booking/, payment/, profile/)
  services/      api.ts (HTTP client, token, 401 handling) + one *Api.ts per feature
    mock/          TEMPORARY mock implementations, only used when EXPO_PUBLIC_USE_MOCK_API=true
  context/       AuthContext (session restore, sign in/out)
  hooks/         data hooks (useApiQuery, useVehicles, useBookings, useNotifications, ...)
  types/         API types shared by services and screens
  utils/         validation, formatters, error handling, file picker, booking dates
  constants/     theme tokens, API config, endpoint map
```

### Styling

- Every component or screen keeps its styles in a sibling file: `VehicleCard.tsx` → `VehicleCard.styles.ts`.
  Component files contain no `StyleSheet` code and no inline style objects. (React Native can't load `.css` files
  on iOS/Android, so styles are `StyleSheet` objects in TypeScript.)
- Colours, fonts, radii, shadows and gradients come from `src/constants/theme.ts`, taken from the Figma design.
  Fonts are DM Serif Display (headings) and Outfit (everything else). Use the `font.*` families instead of `fontWeight`.
- Never add style files inside `src/app/`: Expo Router treats every file there as a screen.

### Connecting a real endpoint

1. Set its path in `src/constants/endpoints.ts`. Every entry is `null` until the backend confirms it, and a `null`
   endpoint shows "Not available yet" instead of calling a guessed URL.
2. Check that the request and response in the matching `src/services/*Api.ts` still match the confirmed contract.
3. Once every endpoint is live, delete `src/services/mock/` and the mock switch in each `*Api.ts`.
