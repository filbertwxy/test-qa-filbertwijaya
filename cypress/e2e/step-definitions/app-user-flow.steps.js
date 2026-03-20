const { When } = require('@badeball/cypress-cucumber-preprocessor')
const { mergeApiRequestOpts, apiKeyHeaders } = require('../../support/api-defaults')

function resolveUrl(path) {
  const base = Cypress.config('baseUrl').replace(/\/$/, '')
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

When('I create an app user with a unique email via the API', () => {
  const email = `cypress.app.${Date.now()}@example.com`
  cy.wrap(email).as('uniqueAppUserEmail')
  cy.request(
    req({
      method: 'POST',
      url: resolveUrl('/api/app-users'),
      headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
      body: { email },
    })
  ).as('apiResponse')
})

When('I send an app user login with a unique email and project id {string}', (projectId) => {
  const email = `cypress.login.${Date.now()}@example.com`
  cy.request(
    req({
      method: 'POST',
      url: resolveUrl('/api/app-users/login'),
      headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
      body: { email, project_id: projectId },
    })
  ).as('apiResponse')
})

When('I store the app user id from the last response', () => {
  cy.get('@apiResponse').then((resp) => {
    expect(resp.body.data).to.have.property('id')
    cy.wrap(resp.body.data.id).as('appUserId')
  })
})

When('I fetch the stored app user by id', () => {
  cy.get('@appUserId').then((id) => {
    cy.request(
      req({
        method: 'GET',
        url: resolveUrl(`/api/app-users/${id}`),
        headers: authorizedHeaders(),
      })
    ).as('apiResponse')
  })
})

When('I update the stored app user with JSON body:', (body) => {
  cy.get('@appUserId').then((id) => {
    cy.request(
      req({
        method: 'PUT',
        url: resolveUrl(`/api/app-users/${id}`),
        headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.parse(body.trim()),
      })
    ).as('apiResponse')
  })
})

When('I delete the stored app user by id', () => {
  cy.get('@appUserId').then((id) => {
    cy.request(
      req({
        method: 'DELETE',
        url: resolveUrl(`/api/app-users/${id}`),
        headers: authorizedHeaders(),
      })
    ).as('apiResponse')
  })
})
