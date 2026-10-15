# DailyVial — peptide journal and Plus design

The new light-blue DailyVial build continues independently of the retired application. No old app or subscription code has been brought back.

## Included now

- Home / Peptides / Progress / Nourish / Circle navigation, Add Peptides on Home, and a clearer chicken drumstick protein icon.
- AI-generated salmon plate and berry smoothie images, alongside the existing chicken bowl, yogurt parfait, and droplet mascot.
- A searchable dropdown catalog with 54 peptide names and 50 supplement names. A user can enter any custom name. Catalog inclusion is not an approval or treatment recommendation; no amounts or routes are inferred from names.
- Saved prescribed route and amount fields, editable product details, and product-specific approved site settings.
- Front/back body journal, dated site history, and rotation candidates that prioritize a different approved region and then the least recently logged alternative. Route changes clear approved sites. Site-only entries and dose entries both update the journal. Regions are not exact needle-placement instructions or a safety assessment.
- Plus plan selection: $2.99 one-time seven-day pass, $9.99 monthly renewal, $49.99 annual renewal, $79.99 lifetime unlock.
- Session-only Plus feature preview for custom goals, recorded-data insights, and CSV exports. This is explicitly a preview, never a purchase or a verified entitlement.
- Local camera/photo selection for the meal-photo step. No invented calorie estimate is shown.

## Live service status

Purchases, rewarded ads, and AI image analysis are **not connected**. The current app runs on GitHub Pages with browser-local storage; there is no account backend. Pricing can be reviewed but nobody is charged. The rewarded-ad button stays disabled. Manual meal entry remains available for everyone.

The independent `access-policy.cjs` module implements server-side entitlement and scan-credit domain rules for the future service. It is not a deployed server, provider integration, or security boundary by itself. Run its checks with `node access-policy.test.cjs`.

## Free rewarded scan policy

One provider-verified completed rewarded ad grants one photo scan, up to four rewards per account per UTC day. Credits expire at UTC midnight. Reserving a scan consumes one credit; a failed analysis refunds it. Duplicate reward callbacks and repeated completion events are idempotent. Live enforcement requires account identity, durable transaction storage, provider verification, and a published premium fair-use quota.

## Next service connection work

1. Confirm the initial launch platform (iPhone, web, or both).
2. Configure live products in the chosen billing provider. On iPhone use an auto-renewable monthly/annual product, a non-renewing week pass, and a non-consumable lifetime purchase. Validate transactions on the server, including expiry, refunds/revocations, restoration, and renewal notifications.
3. Deploy account authentication and transactional storage. Do not unlock paid services from editable localStorage or a client-provided `verified` flag. The feature-preview switch is for preview only and must not authorize backend calls.
4. Connect the rewarded-ad SDK and verified provider callbacks. Validate signature, account ID, unique transaction ID, reward type, timestamp, and replay protection. Grant and reserve credits transactionally. Cross-midnight processing must not resurrect expired credits.
5. Add a server-held AI service key and authenticated image endpoint. Validate file size/type, strip metadata, request photo-processing consent, rate-limit requests, and publish retention rules. Never expose service keys in the HTML or repository.
6. Return editable estimates with recognized ingredients, portion assumptions, and confidence/uncertainty. Require review before adding to the journal. Photos cannot establish exact calories.
7. Set an economical premium AI quota before offering a lifetime deal; premium app access does not imply unlimited lifetime inference costs.

## References used for design constraints

- [FDA label: Zepbound prescribing information](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/217806s037lbl.pdf): subcutaneous route and product-specific injection areas/rotation. These directions are not generalized to all peptides.
- [FDA: concerns with unapproved GLP-1 drugs](https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss): library names do not establish product approval, safety, or suitability.
- [Apple: in-app purchase types](https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/in-app-purchase-types): non-renewing passes, subscriptions, and lifetime products are different product types.
- [Google: rewarded-ad server-side verification](https://developers.google.com/admob/android/ssv): live credits need verified reward events.

## Validation

Inline JavaScript syntax; 54 unique peptide names and 50 supplement names; scoped rotation and route restrictions; verified/unverified rewards; duplicate callbacks; four-per-day cap; midnight reset; failed-scan credit refunds; entitlement expiry/revocation. Browser checks covered catalog search/selection, saved site history, alternative region suggestions, personalized dashboard goals, CSV download, and all four meal image cards. Local browser checks use synthetic entries, not user medical records.
