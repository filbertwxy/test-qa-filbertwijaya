/**
 * Shared defaults for cy.request() against reqres.in.
 * - REQRES_API_KEY: sent as x-api-key (default in cypress.config.js) — general endpoints.
 * - REQRES_MANAGE_API_KEY: Owner manage key — live /api/app-users* may reject the demo key;
 *   authenticated steps use manage key when set, else fall back to REQRES_API_KEY.
 */

const DEFAULT_API_HEADERS = {
  Accept: 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
}

function getReqresApiKey() {
  if (typeof Cypress === 'undefined') return ''
  const v = Cypress.env('REQRES_API_KEY')
  return v != null && String(v).trim() !== '' ? String(v).trim() : ''
}

/** x-api-key for steps that send apiKeyHeaders() (collections, app-users, custom, etc.). */
function getAuthenticatedApiKey() {
  if (typeof Cypress === 'undefined') return ''
  const m = Cypress.env('REQRES_MANAGE_API_KEY')
  if (m != null && String(m).trim() !== '') return String(m).trim()
  return getReqresApiKey()
}

/** Extra headers for authenticated routes. Adds Bearer token from pre-login when available. */
function apiKeyHeaders(extra = {}) {
  const apiKey = getAuthenticatedApiKey()
  const bearer =
    typeof Cypress !== 'undefined' && Cypress.env('BEARER_TOKEN')
      ? String(Cypress.env('BEARER_TOKEN')).trim()
      : ''
  return {
    ...(apiKey ? { 'x-api-key': apiKey } : {}),
    ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    ...extra,
  }
}

/** Merge failOnStatusCode: false, browser-like headers, and primary API key into cy.request options. */
function mergeApiRequestOpts(opts) {
  const { headers, ...rest } = opts
  const apiKey = getReqresApiKey()
  return {
    failOnStatusCode: false,
    ...rest,
    headers: {
      ...DEFAULT_API_HEADERS,
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
      ...headers,
    },
  }
}

module.exports = {
  DEFAULT_API_HEADERS,
  mergeApiRequestOpts,
  apiKeyHeaders,
  getReqresApiKey,
  getAuthenticatedApiKey,
}
