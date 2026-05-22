# TruckQonnect

A mobile logistics app for Zimbabwe, inspired by inDrive-style freight matching. **Cargo owners** post loads and hire drivers; **truck owners** browse loads, place bids, and run active deliveries with live map tracking.

This repository is a **UI-first prototype**: mock data, local state, and no backend API yet.

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | [Expo](https://expo.dev) SDK 54 |
| Language | TypeScript |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Maps | `react-native-maps` (fallback UI on web) |
| Fonts | Poppins via `@expo-google-fonts/poppins` |
| Storage | `@react-native-async-storage/async-storage` (role & profiles) |

## Design

Brand colors: **yellow** (`#F5D400` / `#F9C600`), **black**, and **white**.  
Design tokens live in `constants/truckq-design.ts` (shipper) and `constants/owner-design.ts` (truck owner).

## Roles & features

### Cargo owner (shipper)

- **Onboarding** → welcome → role selection → separate **Login** / **Sign Up** → OTP
- **Tabs:** Home, Track, Chat, History, Requests
- Post loads (`place-load`), view driver details, track shipments on a map
- Profile editing and logout
- Notification bell with in-app notification sheet

### Truck owner (driver)

- Same auth flow with role-specific signup (truck plate, brand, size, type)
- **Tabs:** Home, **Track** (live navigation map), Loads, Chat, History, Profile
- Browse loads, place bids; accepted bids open **Track** with pickup → dropoff route
- Active delivery timeline, customer call/chat, truck info & settings
- Logout returns to role selection

## App flow

```
Splash → Onboarding → Welcome → Choose role → Login / Sign up → OTP → Main app
```

- **Cargo owner** lands on `/(tabs)`
- **Truck owner** lands on `/(owner-tabs)`

## Getting started

From the `TruckQonnect` app directory (where `package.json` lives):

```bash
npm install
npx expo start
```

Then open the project in:

- **Expo Go** (iOS / Android)
- **Android emulator** or **iOS simulator**
- **Web** (`w` in the terminal) — maps use a static fallback on web

Other scripts:

```bash
npm run android   # expo start --android
npm run ios       # expo start --ios
npm run web       # expo start --web
npm run lint      # expo lint
```

## Demo credentials & tips

| Item | Value |
|------|--------|
| OTP (mock) | `123456` |
| After placing a bid | Alert offers **Open Track** — map shows pickup, truck position, and dropoff |
| Active delivery | Pre-seeded on first load; new jobs are set when a bid is “accepted” in the UI |

## Project structure

```
app/
  (tabs)/          # Shipper bottom tabs
  (owner-tabs)/    # Truck owner bottom tabs (includes Track)
  owner/           # Owner stack: load details, bid, active delivery, chat, etc.
  chat/            # Shipper chat threads
  tracking/        # Shipper live tracking detail
  driver/          # Shipper view of a driver
  login.tsx, signup.tsx, forgot-password.tsx, otp.tsx, …

components/
  truckq/          # Shipper UI, auth, maps, notifications
  owner/           # Truck owner UI, live map, track navigation

context/           # User role, shipper profile, owner profile, active job, posted loads
lib/               # Mock data, map styles, route coordinates
constants/         # Design tokens
assets/images/     # Logo, onboarding art
```

## Key routes

| Route | Purpose |
|-------|---------|
| `/choose-role` | Cargo owner vs truck owner |
| `/login`, `/signup` | Separate auth screens (role from query) |
| `/forgot-password` | Password reset (mock) |
| `/otp` | Phone verification |
| `/(tabs)/track` | Shipper shipment list → tracking map |
| `/(owner-tabs)/track` | Truck owner navigation map for active load |
| `/owner/load/[id]` | Load details & bid entry |
| `/tracking/[id]` | Shipper full-screen tracking map |

## Admin dashboard (HTML)

A separate **premium operations dashboard** lives in the parent [`Admin/`](../Admin/) folder (sibling to this mobile app):

- **Stack:** HTML5, CSS3, Bootstrap 5, Chart.js, vanilla JavaScript (no React/backend)
- **Start:** open `Admin/login.html` in a browser, or run `npx serve Admin` from the repo root
- **Logo:** `Admin/assets/images/logo.png.jpeg`
- **Demo login:** any email/password → redirects to `dashboard.html`
- **25 pages:** auth (login, forgot/reset password, OTP, lock screen) + dashboard, users, drivers, loads, tracking, payments, analytics, fraud monitoring, and more

## Roadmap (not implemented)

- Real authentication and API
- Push notifications
- Payments and bid negotiation backend
- Turn-by-turn navigation SDK integration
- Persistent job history sync

## License

Private project — all rights reserved unless otherwise specified.
