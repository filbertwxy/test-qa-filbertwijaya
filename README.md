# ReqRes API — Cypress + Cucumber (JavaScript)

API contract checks against ReqRes API docs and OpenAPI, using Cypress and Gherkin via @badeball/cypress-cucumber-preprocessor.

## Setup

```bash
npm install
npx cypress install
```

> Note: The `cypress` CLI is not on your shell `PATH` unless installed globally. Always use `npx cypress install` to ensure Cypress is properly downloaded.

---

## Configuration

* **Base URL:** `https://reqres.in` (see `cypress.config.js`).

### API Key (Free Tier)

This project uses a **free ReqRes API key** for testing.

* Default key is already configured in the project.
* You may override it using environment variables:

```json
{
  "REQRES_API_KEY": "reqres_0414e572c1c844d282a63bd9570200f1"
}
```

> ⚠️ **Important Limitation**
> The free API key is limited to **150 requests per day**.
>
> * If you exceed this limit, API requests will start failing.
> * The limit resets after **24 hours**.
> * If tests suddenly fail, this is the most likely reason.

---

## Run Tests

After completing setup (`npm install` and `npx cypress install`), run:

```bash
npm test
```

or

```bash
npx cypress run
```

To open Cypress UI:

```bash
npx cypress open
```

---

## Troubleshooting

If you see:

* “No version of Cypress is installed”
* “Cypress executable not found”

Run:

```bash
npx cypress install
```

---

## Project Structure

| Feature file                             | API area                                                      |
| ---------------------------------------- | ------------------------------------------------------------- |
| `cypress/e2e/legacy-users.feature`       | `/api/users` (legacy)                                         |
| `cypress/e2e/legacy-unknown.feature`     | `/api/unknown` (legacy)                                       |
| `cypress/e2e/users.feature`              | `GET /api/users`                                              |
| `cypress/e2e/authentication.feature`     | `/api/register`, `/api/login`, `/api/logout`, `/api/redirect` |
| `cypress/e2e/collections.feature`        | `/api/collections`                                            |
| `cypress/e2e/app-users.feature`          | `/api/app-users`, sessions                                    |
| `cypress/e2e/app-session-routes.feature` | `/app/me`, `/app/collections`                                 |
| `cypress/e2e/custom-endpoints.feature`   | `/api/custom/{path}`                                          |
| `cypress/e2e/templates.feature`          | `/templates`                                                  |
| `cypress/e2e/onboarding.feature`         | `/api/onboarding/*`                                           |
| `cypress/e2e/figma.feature`              | `/api/figma/*`                                                |

Shared step definitions are located in:

```
cypress/e2e/step-definitions/
```

---

## Notes

* Tests are written using **Gherkin (BDD)** format.
* Focus is on **API contract validation**, **status codes**, and **response structure**.
* Designed to be **readable, maintainable, and scalable**.
