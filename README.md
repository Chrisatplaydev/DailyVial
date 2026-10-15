# DailyVial

The DailyVial galaxy build: a peptide and supplement journal with a droplet mascot, generated meal photography, personal progress, and an organized quick-action menu.

**[Open DailyVial](https://chrisatplaydev.github.io/DailyVial/)**

## Tour, Nova and the DailyVial logo

A skippable first-use tour explains six essentials, and can be replayed from Profile. The original orbit-droplet logo replaces the pill-shaped header icon. Nova answers app-navigation questions locally with written guidance and direct feature shortcuts. Live AI is not connected; a server adapter is included for a future authenticated, quota-controlled deployment.

[Current release and AI connection requirements](DISCOVERY.md)

## Stardust and personal settings

Stardust replaces the rewards name and icon while preserving existing local balances. Profile opens saved personal preferences, free Deep Space / Moonlight modes, default dose units, reduced animations, cosmetic rewards, a local journal backup, and subscription status/cancellation guidance. A generated realistic orbital vial replaces the illustrated bottle. Dose forms separate amount from unit and preserve the chosen unit without conversions.

[Current update and limits](STARDUST.md)

## Galaxy identity and site-history controls

Midnight indigo, violet/teal nebula glows, subtle stars, lavender accents, and readable light cards give DailyVial its own background identity.

Open **Peptides → Open map → Edit site history** to remove an entry, or **Reset history** for the selected product. Removal is recoverable with Undo. A linked dose is retained unless its removal is explicitly selected.

[Current release details](GALAXY.md)

## Earlier updates

- **Stardust:** a custom droplet rewards button, daily check-ins, a seven-day bonus, theme rewards, and a 120-drop local Plus-day preview. Purchase bonuses are designed for verified payments and are not issued by the preview checkout.
- **Simpler Peptides:** one injection-journal entry, a new glass-vial illustration, and a guided peptide → prescribed route → selected area → save flow. Saving a routine does not log a dose.
- **Nearby food:** opt-in one-shot location or public city centers, live OpenStreetMap places, menu links, plant-option tags, and a small source-linked collection of published US menu calories. Availability/coverage varies; unknown calories are not invented.

[Current release notes and limits](NEXT.md)

## Current build

Home, Peptides, Progress, Nourish, and Circle. A searchable dropdown contains 54 peptide names and 50 supplements, accepts custom names, and records the user's prescribed route without inferring doses. The front/back body journal stores product-specific site history and uses explicitly approved regions for rotation candidates.

Protein, fiber, and water start at zero. Manual dose, meal, weight, water, and site entries stay in this browser. Circle is a local preview; labeled sample charts remain illustrative.

## DailyVial Plus

- Week pass: $2.99 for seven days, one-time.
- Monthly: $9.99, renewing.
- Annual: $49.99, renewing.
- Lifetime: $79.99, one-time premium unlock.

Pricing screens and session-only feature previews are included. Custom goals, recorded-data insights, and CSV exports work in the feature preview. **Live payments, rewarded ads, AI photo estimates, account sync, and shared Circle posts are not connected.** The app does not charge users or manufacture calorie estimates.

The free scan design is one verified rewarded ad for one photo, capped at four rewards per UTC day. Server domain rules are prepared in `access-policy.cjs`; they need verified provider events, transactional storage, and account identity before deployment. Run `node access-policy.test.cjs` to check those rules.

[Release details and service setup](RELEASE.md) · [Privacy](privacy.html)

## Run

Open `DailyVial.html` directly or serve this directory with any static server. The app embeds its images, styles, and scripts; no build step is required. `index.html` opens the same app. This build uses none of the retired application's code or billing configuration. Earlier versions remain in Git history.
