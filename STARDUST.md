# Stardust, orbital vial and personal settings

The reward currency is now Stardust, with a star-and-orbit mark. Existing browser-local balances and unlocks are preserved through the same storage key. Check-ins remain 5 per UTC day plus 10 for each seven-day streak. Doses and food intake never earn points.

Visual rewards work in both modes: Deep Orbit is included; Solar Dawn costs 60, Aurora 80, Star Atlas 90, and Nebula 100 Stardust. Star Atlas adds connected constellation lines. A 24-hour local Plus feature preview costs 120. Purchase bonuses remain dependent on verified payment events and are not awarded by preview checkout. These are local previews, not transferable paid entitlements.

Profile → Your space contains an optional display name, default dose unit, reduced animations, free dark/light modes, a customization shop, subscription status and a JSON journal backup. Settings persist on this device. No account sync is connected.

Dose amount and unit are separate controls in peptide setup, supplements, product editing and dose logging. Supported units: mg, mcg, g, mL, IU, syringe units, capsules, tablets and drops, with an Other / as prescribed option for legacy/custom text. No dose calculation or conversion occurs. Previously recorded amounts retain their original text. The preferred unit is only a form default.

The peptide thumbnail is AI-generated product photography with realistic glass, a blue cap and restrained orbital lighting. Artwork is embedded in the app. The cosmic droplet remains the home mascot.

## Billing boundary

Live checkout, payment verification, cancellation, restore, account identity, AI photo estimates and rewarded ads remain unconnected. Subscription settings explicitly show this status and explain how to manage a purchase through its original provider. There is no functional cancel button for an unconnected subscription and no claim that an external purchase was canceled. A session feature preview can be ended here. Existing pricing is retained.

## Validation

Run `node preferences.test.cjs` and `node care-drops.test.cjs`. Browser checks cover settings persistence, light/dark rendering, existing wallet balance, locked reward pricing, guided amount preservation and a saved dose with its selected unit. Test entries were made on the local preview origin only.
