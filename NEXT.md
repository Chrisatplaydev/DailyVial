# Care Drops, a simpler peptide routine, and nearby food

This update continues the current light-blue build. It does not restore any old application or billing code.

## Care Drops

The old lightning bolt and dose counter are replaced by a custom blue droplet-and-star mark. Tapping the balance opens a rewards wallet.

- Daily check-in: 5 drops, once per UTC day.
- Every seventh consecutive check-in day: 10 extra drops.
- Plus day: 120 drops for 24 hours of the local Plus feature preview (goals, insights, exports).
- Sunrise theme: 60 drops; Starlight theme: 100 drops. Themes remain available on that device and can be changed back to blue.
- Proposed bonuses for each verified successful payment: week pass 15, monthly 50, annual 150, lifetime 250. Renewals can earn a bonus for each unique successful transaction. Refunds reverse the corresponding bonus, including out-of-order refund notifications. An already-spent balance can become negative after a reversal; new redemptions remain blocked until it recovers.

There are no rewards for medication quantities, extra doses, weight loss, or eating less. Drops have no cash value and are not transferable in this build.

**Wallet status:** browser-local preview. Account login, server time, cross-device balances, live payment events, and production premium grants are not connected. The app does not fabricate purchase bonuses. A redeemed Plus day opens only working local features; it does not connect AI scanning, ads, or billing. Do not treat localStorage as a trusted entitlement. `care-drops.cjs` contains the shared domain rules and `node care-drops.test.cjs` checks them; production callers still need account-scoped transactional storage, verified purchase/refund callbacks, and server-controlled time.

## Guided peptide setup

The Peptides page has one Injection journal / Open map entry rather than duplicate map buttons. The old DV bottle is replaced by a detailed glass-vial SVG with an aluminum crimp and flip-off cap.

Add Peptides opens one guided screen containing the peptide dropdown/custom search, prescribed route, front/back body map, selected area, and save action. Areas are enabled only for the selected route. The user confirms that the area matches their clinician's directions. Saving creates a routine with a selected area, not a dose or an injection record. A later Log action prefills the selected area. Supplements retain their separate picker.

The map describes broad regions, not exact needle placement. No route, dose, or suitability is inferred from a catalog name. The existing per-product site journal and rotation settings remain available from the single journal entry.

## Nearby food

Nourish now includes an optional nearby-food search. It works with one-time browser location access or a selection of public city centers, without a GPS permission.

- Location access happens only after the user presses Use my location. Coordinates are rounded to two decimals and shared with OpenStreetMap's public Overpass API for that search. No continuous location watch is used and DailyVial does not put the user's location in persistent storage.
- Results use named restaurant, cafe, and fast-food map entries within about 3 km of the rounded search center, capped at 100 returned map entries. The app displays up to 20 per filter with approximate straight-line distances. Results are cached only in page memory; Clear search cancels an in-flight fetch and clears that cache.
- Plant options filter uses explicit diet/cuisine tags. It does not infer that a restaurant is healthy or safe for a particular person. Nutrition picks filter matches a small set of chains with published US menu snapshots.
- Menu/website links are shown when the map has them. Dish calories are not available for most independent restaurants and are clearly marked unavailable.
- Initial published picks: Chick-fil-A 8-count Grilled Nuggets (130 kcal, 25g protein), Grilled Chicken Sandwich (390 kcal), and Starbucks Egg White & Roasted Red Pepper Egg Bites (170 kcal). Each links to the official source and is labeled a US snapshot checked October 14, 2026. Portions, customizations, allergens, local availability, and nutrition can change.
- No food-service API key is required for this limited public-map implementation. The public service can be busy or unavailable; the app handles empty/failed searches and keeps the published menu collection accessible. At scale, move to a supported provider or a rate-limited cached backend; the public instance is not a commercial availability guarantee.

Sources: [Overpass public-instance guidance](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html), [OpenStreetMap attribution/license](https://www.openstreetmap.org/copyright), [Chick-fil-A nutrition](https://www.chick-fil-a.com/nutrition-allergens), [Chick-fil-A sandwich](https://www.chick-fil-a.com/menu/entrees/grilled-chicken-sandwich), [Starbucks egg bites](https://www.starbucks.com/menu/product/2122117/single).

## Checks

Syntax and domain checks cover duplicate check-ins, UTC/streak boundaries, redemption cost/expiry, repeated and out-of-order verified payment/refund events, insufficient balances, route-aware map eligibility, safe menu links, distances, and chain matching. Browser checks use synthetic local routine entries and a public Austin city-center search; the user's current location was not requested during testing.
