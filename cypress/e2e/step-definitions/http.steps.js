const { When } = require('@badeball/cypress-cucumber-preprocessor')
const { mergeApiRequestOpts, apiKeyHeaders } = require('../../support/api-defaults')

function resolveUrl(path) {
  const base = Cypress.config('baseUrl').replace(/\/$/, '')
  if (path.startsWith('http')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

function req(opts) {
  return mergeApiRequestOpts(opts)
}

function authorizedHeaders(extra = {}) {
  const token = String(Cypress.env('BEARER_TOKEN') || '').trim()
  return apiKeyHeaders({
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  })
}

When('I send a GET request to {string}', (path) => {
  cy.request(req({ method: 'GET', url: resolveUrl(path) })).as('apiResponse')
})

When('I send a GET request to {string} with authenticated API key', (path) => {
  cy.request(
    req({
      method: 'GET',
      url: resolveUrl(path),
      headers: authorizedHeaders(),
    })
  ).as('apiResponse')
})

When('I send a POST request to {string} with empty body', (path) => {
  cy.request(req({ method: 'POST', url: resolveUrl(path) })).as('apiResponse')
})

When('I send a POST request to {string} with JSON body:', (path, body) => {
  cy.request(
    req({
      method: 'POST',
      url: resolveUrl(path),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.parse(body.trim()),
    })
  ).as('apiResponse')
})

When('I send a PUT request to {string} with JSON body:', (path, body) => {
  cy.request(
    req({
      method: 'PUT',
      url: resolveUrl(path),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.parse(body.trim()),
    })
  ).as('apiResponse')
})

When('I send a PATCH request to {string} with JSON body:', (path, body) => {
  cy.request(
    req({
      method: 'PATCH',
      url: resolveUrl(path),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.parse(body.trim()),
    })
  ).as('apiResponse')
})

When('I send a DELETE request to {string}', (path) => {
  cy.request(req({ method: 'DELETE', url: resolveUrl(path) })).as('apiResponse')
})

When('I send an authenticated GET request to custom path {string}', (customPath) => {
  cy.request(
    req({
      method: 'GET',
      url: resolveUrl(`/api/custom/${customPath}`),
      headers: authorizedHeaders(),
    })
  ).as('apiResponse')
})

When(
  'I send an authenticated POST request to custom path {string} with JSON body:',
  (customPath, body) => {
    cy.request(
      req({
        method: 'POST',
        url: resolveUrl(`/api/custom/${customPath}`),
        headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.parse(body.trim()),
      })
    ).as('apiResponse')
  }
)

When(
  'I send an authenticated POST request to {string} with JSON body:',
  (path, body) => {
    cy.request(
      req({
        method: 'POST',
        url: resolveUrl(path),
        headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.parse(body.trim()),
      })
    ).as('apiResponse')
  }
)

When(
  'I send an authenticated PUT request to {string} with JSON body:',
  (path, body) => {
    cy.request(
      req({
        method: 'PUT',
        url: resolveUrl(path),
        headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.parse(body.trim()),
      })
    ).as('apiResponse')
  }
)

When(
  'I send an authenticated PATCH request to {string} with JSON body:',
  (path, body) => {
    cy.request(
      req({
        method: 'PATCH',
        url: resolveUrl(path),
        headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.parse(body.trim()),
      })
    ).as('apiResponse')
  }
)

When('I send an authenticated DELETE request to {string}', (path) => {
  cy.request(
    req({
      method: 'DELETE',
      url: resolveUrl(path),
      headers: authorizedHeaders(),
    })
  ).as('apiResponse')
})

When('I send a POST request to {string} without following redirects', (path) => {
  cy.request(
    req({
      method: 'POST',
      url: resolveUrl(path),
      followRedirect: false,
    })
  ).as('apiResponse')
})

When(
  'I send a POST request to {string} without following redirects with query {string}',
  (path, query) => {
    cy.request(
      req({
        method: 'POST',
        url: `${resolveUrl(path)}?${query}`,
        followRedirect: false,
      })
    ).as('apiResponse')
  }
)

When('I send a GET request to {string} expecting method not allowed', (path) => {
  cy.request(req({ method: 'GET', url: resolveUrl(path) })).as('apiResponse')
})

When('I send a GET request to {string} without authentication', (path) => {
  cy.request(req({ method: 'GET', url: resolveUrl(path) })).as('apiResponse')
})

When(
  'I send an authenticated GET request to {string} with Bearer token from last login',
  (path) => {
    cy.get('@loginToken').then((token) => {
      cy.request(
        req({
          method: 'GET',
          url: resolveUrl(path),
          headers: { Authorization: `Bearer ${token}` },
        })
      ).as('apiResponse')
    })
  }
)

When(
  'I send an authenticated POST request to {string} with Bearer token from last login and JSON body:',
  (path, body) => {
    cy.get('@loginToken').then((token) => {
      cy.request(
        req({
          method: 'POST',
          url: resolveUrl(path),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.parse(body.trim()),
        })
      ).as('apiResponse')
    })
  }
)

When('I store the login token from the last response', () => {
  cy.get('@apiResponse').then((resp) => {
    expect(resp.body).to.have.property('token')
    cy.wrap(resp.body.token).as('loginToken')
  })
})

When('I send a POST request to {string} with invalid JSON body:', (path, body) => {
  cy.request(
    req({
      method: 'POST',
      url: resolveUrl(path),
      headers: { 'Content-Type': 'application/json' },
      body: body.trim(),
    })
  ).as('apiResponse')
})

When(
  'I send an authenticated POST request to {string} with JSON body and optional header {string}: {string}',
  (path, body, headerName, headerValue) => {
    cy.request(
      req({
        method: 'POST',
        url: resolveUrl(path),
        headers: authorizedHeaders({
          'Content-Type': 'application/json',
          [headerName]: headerValue,
        }),
        body: JSON.parse(body.trim()),
      })
    ).as('apiResponse')
  }
)
