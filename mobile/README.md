# NutriSnap Mobile (Android)

Expo / React Native app for NutriSnap. Uses your existing Next.js backend for AI analysis and Supabase for meal storage.

## Setup

1. Copy env file and fill in values from the web app's `.env.local`:

```bash
cp .env.example .env
```

2. Start the Next.js backend (from project root):

```bash
npm run dev
```

3. Start the mobile app:

```bash
cd mobile
npm start
```

Press `a` to open on Android emulator, or scan the QR code with Expo Go on a physical device.

## Configuration

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Next.js server URL. Use `http://10.0.2.2:3000` for Android emulator, or your machine's LAN IP for a physical device (e.g. `http://192.168.1.5:3000`) |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL (`https://xxx.supabase.co` — no `/rest/v1/`) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

## Architecture

```
Android App (Expo)
    ├── Camera / Gallery → photo
    ├── POST /api/analyze → Next.js (Gemini AI)
    └── Supabase → meals, dashboard, history
```

## Building for Play Store

```bash
npx eas build --platform android
```

Requires an [Expo account](https://expo.dev) and EAS CLI.
