const { Given, When } = require('@badeball/cypress-cucumber-preprocessor')
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

Given('a unique collection slug and name for this test run', () => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  cy.wrap({
    slug: `cypress-${suffix}`,
    name: `Cypress Collection ${suffix}`,
  }).as('collectionFixture')
})

When('I create that collection via the API', () => {
  cy.get('@collectionFixture').then(({ slug, name }) => {
    cy.request(
      req({
        method: 'POST',
        url: resolveUrl('/api/collections'),
        headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
        body: { name, slug },
      })
    ).as('apiResponse')
  })
})

When('I fetch the collection by that slug', () => {
  cy.get('@collectionFixture').then(({ slug }) => {
    cy.request(
      req({
        method: 'GET',
        url: resolveUrl(`/api/collections/${slug}`),
        headers: authorizedHeaders(),
      })
    ).as('apiResponse')
  })
})

When('I update that collection name via the API', () => {
  cy.get('@collectionFixture').then(({ slug, name }) => {
    cy.request(
      req({
        method: 'PUT',
        url: resolveUrl(`/api/collections/${slug}`),
        headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
        body: { name: `${name} (updated)` },
      })
    ).as('apiResponse')
  })
})

When('I create a record in that collection with JSON data:', (json) => {
  cy.get('@collectionFixture').then(({ slug }) => {
    cy.request(
      req({
        method: 'POST',
        url: resolveUrl(`/api/collections/${slug}/records`),
        headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.parse(json.trim()),
      })
    ).as('apiResponse')
  })
})

When('I fetch that record by id from the last response', () => {
  cy.get('@apiResponse').then((resp) => {
    const recordId = resp.body.data.id
    cy.wrap(recordId).as('recordId')
  })
  cy.get('@collectionFixture').then(({ slug }) => {
    cy.get('@recordId').then((recordId) => {
      cy.request(
        req({
          method: 'GET',
          url: resolveUrl(`/api/collections/${slug}/records/${recordId}`),
          headers: authorizedHeaders(),
        })
      ).as('apiResponse')
    })
  })
})

When('I update that record with JSON data:', (json) => {
  cy.get('@collectionFixture').then(({ slug }) => {
    cy.get('@recordId').then((recordId) => {
      cy.request(
        req({
          method: 'PUT',
          url: resolveUrl(`/api/collections/${slug}/records/${recordId}`),
          headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.parse(json.trim()),
        })
      ).as('apiResponse')
    })
  })
})

When('I delete that record by id', () => {
  cy.get('@collectionFixture').then(({ slug }) => {
    cy.get('@recordId').then((recordId) => {
      cy.request(
        req({
          method: 'DELETE',
          url: resolveUrl(`/api/collections/${slug}/records/${recordId}`),
          headers: authorizedHeaders(),
        })
      ).as('apiResponse')
    })
  })
})

When('I delete that collection by slug', () => {
  cy.get('@collectionFixture').then(({ slug }) => {
    cy.request(
      req({
        method: 'DELETE',
        url: resolveUrl(`/api/collections/${slug}`),
        headers: authorizedHeaders(),
      })
    ).as('apiResponse')
  })
})

When('I list records for that collection', () => {
  cy.get('@collectionFixture').then(({ slug }) => {
    cy.request(
      req({
        method: 'GET',
        url: resolveUrl(`/api/collections/${slug}/records`),
        headers: authorizedHeaders(),
      })
    ).as('apiResponse')
  })
})

When('I store project_id from the created collection response', () => {
  cy.get('@apiResponse').then((resp) => {
    expect(resp.body.data, 'collection payload').to.have.property('project_id')
    cy.wrap(resp.body.data.project_id).as('projectId')
  })
})

When('I send authenticated GET to project app users for stored project', () => {
  cy.get('@projectId').then((projectId) => {
    cy.request(
      req({
        method: 'GET',
        url: resolveUrl(`/api/projects/${projectId}/app-users`),
        headers: authorizedHeaders(),
      })
    ).as('apiResponse')
  })
})

When('I send authenticated GET to project app users total for stored project', () => {
  cy.get('@projectId').then((projectId) => {
    cy.request(
      req({
        method: 'GET',
        url: resolveUrl(`/api/projects/${projectId}/app-users/total`),
        headers: authorizedHeaders(),
      })
    ).as('apiResponse')
  })
})
