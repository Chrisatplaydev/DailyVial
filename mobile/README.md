# DailyVial iPhone release

Version **1.2.1**, build **6**, using the existing `com.chrisatplay.dailyvial` bundle identifier, Expo project and App Store Connect listing.

This directory rebuilds the iPhone wrapper around the current root `DailyVial.html`. The prior iPhone artifact confirmed the bundle identifier and version and provided the full-screen layout adjustments. It is a new wrapper implementation, not recovered original `App.js` source.

The bundled interface works without Firebase or an account. AI meal photos and live Nova AI are marked Coming soon. The app guide and manual journals remain local. Exports open the native share sheet. Progress-photo selection is separate from meal scanning. Nearby food can use the existing optional map service and location permission.

## Prepare and verify

Run these commands in this directory:

```
npm ci
npm run bundle:app
npm test
npm run export:ios
npx expo prebuild --platform ios --no-install
```

The bundler generates `dailyvial-bundle.js`, `dailyvial-pass-artwork.js`, `dailyvial-icon.png` and `bundle-manifest.json`. The manifest records the source SHA-256. The repository-root `.easignore` controls the EAS archive, and `eas-build-post-install` regenerates these files on the builder before prebuild. Dependencies and local build output are excluded. Do not put account credentials or signing files in Git.

## Build and submit

After approving the Expo CLI device login, run from this directory:

```
npm run bundle:app
npx eas-cli build --platform ios --profile production
```

Use the existing distribution credentials for the established app. Upload the resulting **new** build to the existing App Store Connect app (6818886483). Do not submit build 4 as this release.

Native signing, a successful EAS iOS build and on-device testing are still required. The local iOS JavaScript export is not a signed IPA and does not establish that a release has been submitted or approved. Back up tester journals before installing a replacement build; persistence across the reconstructed wrapper must be checked on a device.

The App Store draft also needs screenshots, support URL, privacy responses, age/category details and review contact information completed accurately before submission.

## Apple subscriptions

`DailyVial_premium_monthly` and `DailyVial_premium_annual` are the existing App Store Connect products. The native paywall loads Apple-localized prices. Week/lifetime/ad-free previews are not purchase options. A local Expo Swift module uses StoreKit 2 verified current entitlements, listens for transaction updates, finishes verified transactions, and restores through AppStore.sync(). No Firebase or external purchase backend is needed for these local features. The iPhone build removes the unlimited session-preview unlock; native paid access is held in memory and rechecked on foreground, updates and expiration. Stardust cosmetics remain available, but device-local Plus-day reward balances do not authorize paid iPhone features. The iPhone build hides that preview reward.

Local JavaScript tests do not validate the Swift binary or Apple commerce. Before release: compile on EAS, complete the Paid Apps Agreement and required account setup, finalize product metadata/review screenshots, and test purchase/cancellation, pending approval, restore, expiration, renewal and revocation in StoreKit/Sandbox/TestFlight. No real-money test purchase has been made.
