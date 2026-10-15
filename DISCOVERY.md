# A calmer start, Nova and the orbit-droplet logo

First opening of this release offers an optional six-step tour. Skip, back and completion are supported; the offer does not repeat after reload. Returning users see this new tour offer once too. Replay from Profile → Quick app tour. Tour navigation changes no journal entries, points or subscriptions.

An original vector orbit-droplet replaces the pill-shaped header icon. The logo also appears in the desktop label and the app favicon. Downloadable SVG logo and app icon are included locally.

Nova is currently a built-in app guide with written answers, topic shortcuts and a tab-only conversation. It is clearly labeled as not live AI. Questions do not leave the browser, and are not saved in the journal. Topics cover logging, sites and Undo, food, progress, Stardust, settings, billing and local data.

## Live AI integration still required

`companion-server.cjs` is a portable Web Request → Response adapter for the OpenAI Responses API. It is not deployed by GitHub Pages. It fails closed until a host supplies `APP_ORIGIN`, server-only `OPENAI_API_KEY`, an account-accessible `OPENAI_MODEL`, real `authenticate(request)` and an atomic `consumeQuota(accountId)` implementation. Do not substitute client-controlled identity or a public shared secret. Configure HTTPS, secure account sessions, narrow CORS, origin checks, persistent quotas and spending limits on the chosen host. The adapter does not provide login, session verification, shared quota storage or deployment by itself.

Set `COMPANION_ENDPOINT` in discovery.js only after that service is deployed and tested. The client then exposes a per-question AI checkbox and explains transmission to the provider. It sends only the current question, with no attached journal. The adapter ignores extra client fields, caps request and question sizes, uses `store:false`, limits output, times out upstream calls and returns generic errors. Do not claim zero provider retention; provider data policies and deployment terms still apply. The host must publish appropriate privacy terms before enabling it.

AI instructions focus on app navigation and general education. They exclude personalized prescribing, diagnoses, peptide stacks, reconstitution math, dose selection and injection-location recommendations. Prompts alone are not a complete safety system. Live deployment needs adversarial/safety evaluations and response monitoring before launch.

Official integration references: [authentication](https://developers.openai.com/api/reference/overview) and [text generation](https://developers.openai.com/api/docs/guides/text).

Validation: `node discovery.test.cjs` uses mocks only. It checks help-topic routing, missing configuration, authentication, quotas, question limits, minimum-data forwarding and generic failures. Browser checks cover all tour steps, completion and reload, Nova navigation answers and logo rendering. Live AI has not been tested or enabled.
