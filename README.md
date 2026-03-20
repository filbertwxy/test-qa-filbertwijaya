# ReqRes API — Cypress + Cucumber (JavaScript)

API contract checks against [ReqRes API docs](https://reqres.in/api-docs) and [OpenAPI](https://reqres.in/openapi.json), using [Cypress](https://docs.cypress.io/) and [Gherkin](https://cucumber.io/docs/gherkin/reference/) via [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor).

## Setup

```bash
npm install
npx cypress install
```

The `cypress` CLI is not on your shell `PATH` unless you install it globally. Use **`npx cypress install`** (not bare `cypress install`) so npm downloads the Cypress app into `~/Library/Caches/Cypress/<version>/` on macOS.

## Configuration

- **Base URL:** `https://reqres.in` (see `cypress.config.js`).
- **API keys (live):** See `cypress/support/api-defaults.js`. **`REQRES_API_KEY`** (env: `CYPRESS_REQRES_API_KEY`, default in `cypress.config.js`) is merged on typical **`cy.request`** calls. **`REQRES_MANAGE_API_KEY`** (`CYPRESS_REQRES_MANAGE_API_KEY`) is used for **`apiKeyHeaders()`** steps — collections, **`/api/app-users`**, custom paths, etc. If `REQRES_MANAGE_API_KEY` is unset, those steps fall back to **`REQRES_API_KEY`**.

Copy `cypress.env.example` → `cypress.env.json` (gitignored) and set your **Owner manage key** for live app-user tests:

```json
{
  "REQRES_API_KEY": "reqres_0414e572c1c844d282a63bd9570200f1",
  "REQRES_MANAGE_API_KEY": "your_owner_manage_key_from_app_reqres_in"
}
```

Or export: `CYPRESS_REQRES_MANAGE_API_KEY=…` before `npm test`.

**Why two keys?** Live **`GET /api/app-users`** can return **403** `manage_key_required` with the public demo key only. ReqRes may require an **Owner manage key** for app-user admin ([API keys / get started](https://app.reqres.in/api-keys)). Easiest live setup: put **only** your manage key in **`REQRES_API_KEY`** and leave **`REQRES_MANAGE_API_KEY`** empty (everything uses one key).

## Run

<h1 style="font-size: 3em;">RUN NPM TEST to run the test</h1>

> [!WARNING]
> This API key is limited to **150 requests per day**.
> If tests fail due to hitting the limit, you must wait **24 hours** before running live tests again.

Against **live** `https://reqres.in`:

```bash
npm test
# or
npx cypress open
```

Against a **local stub** (stable; no CDN). Same specs, `baseUrl` = `http://127.0.0.1:4050`:

```bash
npm run test:stub
# or UI:
npm run cypress:open:stub
```

Stub handlers live in `scripts/reqres-stub-server.js`.

If you see **“No version of Cypress is installed”** / **“Cypress executable not found”**, run `npx cypress install` again from this folder (after `npm install`).

### Cloudflare / HTML instead of JSON

`cy.request` runs from Node. ReqRes sits behind Cloudflare; you may see **403** or **HTML** (“Just a moment…”, marketing pages) instead of API JSON. All API steps merge **`Accept: application/json`**, a **desktop Chrome `User-Agent`**, and optional **`x-api-key`** (`cypress/support/api-defaults.js`). If many specs fail live, try **`npm run test:stub`** or another network.

## Layout

| Feature file | API area |
|--------------|----------|
| `cypress/e2e/legacy-users.feature` | `/api/users` (legacy) |
| `cypress/e2e/legacy-unknown.feature` | `/api/unknown` (legacy) |
| `cypress/e2e/users.feature` | `GET /api/users` |
| `cypress/e2e/authentication.feature` | `/api/register`, `/api/login`, `/api/logout`, `/api/redirect` |
| `cypress/e2e/collections.feature` | `/api/collections` (+ project app-users helpers) |
| `cypress/e2e/app-users.feature` | `/api/app-users`, sessions |
| `cypress/e2e/app-session-routes.feature` | `/app/me`, `/app/collections` |
| `cypress/e2e/custom-endpoints.feature` | `/api/custom/{path}` |
| `cypress/e2e/templates.feature` | `/templates` |
| `cypress/e2e/onboarding.feature` | `/api/onboarding/*` |
| `cypress/e2e/figma.feature` | `/api/figma/*` |

Shared steps live under `cypress/e2e/step-definitions/`.
