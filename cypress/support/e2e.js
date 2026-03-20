// Cypress support file — loads before step definitions

function resolveUrl(path) {
  const base = Cypress.config('baseUrl').replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

beforeEach(() => {
  const apiKey = String(Cypress.env('REQRES_API_KEY') || '').trim()
  const headers = { 'Content-Type': 'application/json' }
  if (apiKey) headers['x-api-key'] = apiKey

  cy.request({
    failOnStatusCode: false,
    method: 'POST',
    url: resolveUrl('/api/login'),
    headers,
    body: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
  }).then((resp) => {
    if (resp.status === 200 && resp.body && resp.body.token) {
      Cypress.env('BEARER_TOKEN', resp.body.token)
    } else {
      Cypress.env('BEARER_TOKEN', '')
    }
  })
})
