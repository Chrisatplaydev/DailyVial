# Reminders, visit prep and Gemini preparation

## Available in this update

Home and Profile now expose reminders: one-time, daily and selected weekdays; local-time schedules, edit, pause/resume, due/overdue state, ten-minute snooze, dismissal and calendar `.ics` export. Browser notifications are opt-in and contain generic text with no product/dose names. The app checks while open and when brought back into view; background tabs can be delayed and closed-app alerts are not guaranteed. Calendar files can be imported into the user’s own calendar. No alert marks a dose as taken or earns points.

Visit prep saves appointment questions locally. A Plus feature preview downloads a 7-, 30- or 90-day HTML report of actual dated journal entries; the user can open and print it as PDF. It makes no adherence/clinical-effectiveness claim and explicitly excludes undated meals. New manual meals receive timestamps.

Nova now uses the actual cosmic droplet mascot. The meal-photo flow supports local capture/upload preview, resized/re-encoded upload copies, portion notes, explicit photo-sharing consent and an editable per-food review before saving. Calories are estimates with an original plausible range and qualitative uncertainty, not guaranteed measurements. No fake estimates are generated while Gemini is unconnected.

## Backend status

A Firebase project and web app are registered, and the backend package is prepared for Google sign-in verification, Secret Manager, Gemini calls and transactional quotas. Live deployment, secret entry, account testing and review of provider terms still require the project owner. The deployed GitHub Pages app keeps AI disabled until an actual service endpoint is configured. Firebase is a separate backend; the website address remains the same.

Billing, rewarded ads, cloud backup/sync and closed-app push are not connected in this update. Existing payment screens are previews and do not sell a subscription. Proposed AI limits and lifetime access terms must be finalized before charging anyone.

## Validation

`plus-tools.test.cjs` covers local recurrence through a DST transition, weekly/one-time behavior, calendar privacy, meal validation, missing Gemini configuration, authentication, access denial, minimum-data forwarding and failure refund callbacks. Browser QA checks saving a real due reminder, reload persistence, snooze, notes and local photo preview without transmitting a photo or key. Firebase SDK dependencies are installed and the handler loads; no live Gemini inference or deployed Cloud Functions test has been performed.
