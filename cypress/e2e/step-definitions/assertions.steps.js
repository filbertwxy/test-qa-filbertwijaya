const { Then } = require('@badeball/cypress-cucumber-preprocessor')

Then('the response status should be {int}', (status) => {
  cy.get('@apiResponse').its('status').should('eq', status)
})

Then('the response status should be one of {int} or {int}', (a, b) => {
  cy.get('@apiResponse')
    .its('status')
    .should('be.oneOf', [a, b])
})

Then('the response status should be one of {int}, {int}, or {int}', (a, b, c) => {
  cy.get('@apiResponse')
    .its('status')
    .should('be.oneOf', [a, b, c])
})

Then('the response body should have property {string}', (key) => {
  cy.get('@apiResponse').its('body').should('have.property', key)
})

Then('the response body property {string} should be a non-empty string', (key) => {
  cy.get('@apiResponse')
    .its(`body.${key}`)
    .should('be.a', 'string')
    .and('not.be.empty')
})

Then('the response body should indicate an error', () => {
  cy.get('@apiResponse').its('body').should((body) => {
    expect(body).to.have.property('error')
  })
})

Then('the legacy user list response shape should be valid', () => {
  cy.get('@apiResponse').its('body').should((body) => {
    expect(body).to.include.keys(
      'page',
      'per_page',
      'total',
      'total_pages',
      'data'
    )
    expect(body.data).to.be.an('array')
    if (body.data.length > 0) {
      const u = body.data[0]
      expect(u).to.include.keys(
        'id',
        'email',
        'first_name',
        'last_name',
        'avatar'
      )
    }
  })
})

Then('the legacy single user response shape should be valid', () => {
  cy.get('@apiResponse').its('body.data').should((data) => {
    expect(data).to.include.keys(
      'id',
      'email',
      'first_name',
      'last_name',
      'avatar'
    )
  })
})

Then('the legacy unknown list response shape should be valid', () => {
  cy.get('@apiResponse').its('body').should((body) => {
    expect(body).to.include.keys(
      'page',
      'per_page',
      'total',
      'total_pages',
      'data'
    )
    expect(body.data).to.be.an('array')
    if (body.data.length > 0) {
      const r = body.data[0]
      expect(r).to.include.keys('id', 'name', 'year', 'color', 'pantone_value')
    }
  })
})

Then('the legacy unknown single resource shape should be valid', () => {
  cy.get('@apiResponse').its('body.data').should((data) => {
    expect(data).to.include.keys('id', 'name', 'year', 'color', 'pantone_value')
  })
})

Then('the users list response should be valid', () => {
  cy.get('@apiResponse').its('body').should((body) => {
    expect(body).to.include.keys(
      'page',
      'per_page',
      'total',
      'total_pages',
      'data'
    )
    expect(body.data).to.be.an('array')
  })
})

Then('the collections list response should have a data array', () => {
  cy.get('@apiResponse').its('body.data').should('be.an', 'array')
})

Then('the collection response should include slug {string}', (slug) => {
  cy.get('@apiResponse').its('body.data.slug').should('eq', slug)
})

Then('the collection record response should have id and data object', () => {
  cy.get('@apiResponse').its('body.data').should((data) => {
    expect(data).to.have.property('id')
    expect(data).to.have.property('data')
    expect(data.data).to.be.an('object')
  })
})

Then('the app users list response should have a data array', () => {
  cy.get('@apiResponse').its('body.data').should('be.an', 'array')
})

Then('the app user response should include email', () => {
  cy.get('@apiResponse').its('body.data.email').should('be.a', 'string')
})

Then('the templates response should include templates array', () => {
  cy.get('@apiResponse').its('body').should((body) => {
    expect(body).to.have.property('templates')
    expect(body.templates).to.be.an('array')
  })
})

Then('the template response should include id name and description', () => {
  cy.get('@apiResponse').its('body').should((body) => {
    expect(body).to.have.property('id')
    expect(body).to.have.property('name')
    expect(body).to.have.property('description')
  })
})

Then('the project app users total response should have numeric total', () => {
  cy.get('@apiResponse').its('body.total').should('be.a', 'number')
})

Then('the response body should be an object', () => {
  cy.get('@apiResponse').its('body').should('be.an', 'object')
})

Then('the response headers should include location for redirect', () => {
  cy.get('@apiResponse').its('headers').should((headers) => {
    const loc = headers.location ?? headers.Location
    expect(loc, 'Location header for redirect').to.exist
  })
})

Then('if the response was a redirect the location header should be present', () => {
  cy.get('@apiResponse').then((resp) => {
    if (resp.status === 302) {
      const loc = resp.headers.location ?? resp.headers.Location
      expect(loc, 'Location header when status is 302').to.exist
    }
  })
})
