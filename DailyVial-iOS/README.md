# DailyVial iOS wrapper

This is the cloud-buildable iPhone container for the DailyVial web app.

## What it does today

- Launches the published DailyVial web experience in a native iOS `WebView`.
- Uses the bundle identifier `com.chrisatplay.dailyvial` (availability must be confirmed in Apple Developer before the first build).
- Includes EAS Build profiles for an internal test build and App Store production build.

## Before a production build

1. The Expo project is linked in `app.json`. Sign in to Expo from the build computer before building.
2. Sign in to the Apple Developer account when EAS asks to create or use signing credentials.
3. Create matching In-App Purchase products in App Store Connect.
4. Add RevenueCat/StoreKit purchase handling and a real mobile ad SDK. The web app's current payment buttons and ad settings are not live App Store billing or live ads.
5. Add final 1024x1024 app icon, screenshots, privacy policy, support URL, and App Store privacy answers.

## Build from Windows

```powershell
npm install
npx eas-cli@latest login
npx eas-cli@latest build --platform ios --profile preview
```

The iOS compilation happens on Expo's cloud macOS build machines.
