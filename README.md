# DailyVial

The new light-blue DailyVial build: a peptide and supplement journal with a droplet mascot, generated meal photography, personal progress, and an organized quick-action menu.

**[Open DailyVial](https://chrisatplaydev.github.io/DailyVial/)**

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
