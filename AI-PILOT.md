# AI pilot paused

The current manual-tracking release disables Firebase, Google sign-in and live AI. Photo estimates and live Nova AI show Coming soon. Manual logging and the built-in app guide remain available. The notes below describe the previous pilot, not the current release.

# DailyVial AI pilot

Google/Firebase sign-in and an authenticated Gemini backend are connected. AI is restricted to the verified owner account during testing. Profile → Cloud connection → Sign in with Google, then Nova → Use live AI, or Nourish → Scan meal.

Owner limits: 30 helper questions and 10 meal estimates per UTC day; project limit50 attempts/day; one server instance, zero minimum instances. The Gemini key stays in Secret Manager. No automatic journal upload. Review every meal estimate. Built-in guidance and manual logging work without AI.

Billing/ads, account journal sync, shared Circle posts and reliable closed-app push remain unconnected. Paid subscriptions are not being sold by this release. Pilot access is not a production launch.
