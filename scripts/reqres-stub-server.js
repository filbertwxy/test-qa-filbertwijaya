/**
 * Minimal HTTP stub for Cypress API tests. Avoids Cloudflare / live ReqRes flakiness.
 * Not a full ReqRes clone — only shapes and statuses the feature files assert.
 */
const http = require('http')

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function send(res, status, body, extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders }
  res.writeHead(status, headers)
  res.end(body === undefined || body === null ? '' : JSON.stringify(body))
}

function send204(res) {
  res.writeHead(204)
  res.end()
}

function parseJson(s) {
  try {
    return JSON.parse(s || '{}')
  } catch {
    return {}
  }
}

async function handler(req, res) {
  const url = new URL(req.url || '/', 'http://127.0.0.1')
  const path = url.pathname
  const method = req.method || 'GET'
  const bodyText = ['POST', 'PUT', 'PATCH'].includes(method) ? await readBody(req) : ''
  const json = parseJson(bodyText)

  try {
    // --- Authentication ---
    if (method === 'POST' && path === '/api/register') {
      if (!json.password) return send(res, 400, { error: 'Missing password' })
      return send(res, 200, { id: 1, token: 'stub-register-token' })
    }
    if (method === 'POST' && path === '/api/login') {
      if (!json.password) return send(res, 400, { error: 'Missing password' })
      return send(res, 200, { token: 'stub-login-token' })
    }
    if (method === 'POST' && path === '/api/logout') return send(res, 200, {})
    if (method === 'POST' && path === '/api/redirect') {
      const dest = url.searchParams.get('url') || '/'
      return send(res, 302, '', { Location: dest })
    }

    // --- Legacy /api/users ---
    if (method === 'GET' && path === '/api/users') {
      return send(res, 200, {
        page: 1,
        per_page: 6,
        total: 12,
        total_pages: 2,
        data: [
          {
            id: 1,
            email: 'eve.holt@reqres.in',
            first_name: 'Eve',
            last_name: 'Holt',
            avatar: 'https://reqres.in/img/faces/4-image.jpg',
          },
        ],
      })
    }
    if (method === 'POST' && path === '/api/users') {
      return send(res, 201, {
        name: json.name,
        job: json.job,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
      })
    }
    const legacyUserId = path.match(/^\/api\/users\/(\d+)$/)
    if (legacyUserId) {
      const uid = legacyUserId[1]
      if (method === 'GET') {
        if (uid === '99999')
          return send(res, 404, { error: 'Not found' })
        return send(res, 200, {
          data: {
            id: Number(uid),
            email: 'janet.weaver@reqres.in',
            first_name: 'Janet',
            last_name: 'Weaver',
            avatar: 'https://reqres.in/img/faces/2-image.jpg',
          },
        })
      }
      if (method === 'PUT' || method === 'PATCH') {
        return send(res, 200, {
          name: json.name,
          job: json.job,
          id: uid,
          updatedAt: new Date().toISOString(),
        })
      }
      if (method === 'DELETE') return send204(res)
    }

    // --- Legacy /api/unknown ---
    if (method === 'GET' && path === '/api/unknown') {
      return send(res, 200, {
        page: 1,
        per_page: 6,
        total: 12,
        total_pages: 2,
        data: [
          {
            id: 1,
            name: 'cerulean',
            year: 2000,
            color: '#98B2D1',
            pantone_value: '15-4020',
          },
        ],
      })
    }
    const unknownId = path.match(/^\/api\/unknown\/(\d+)$/)
    if (method === 'GET' && unknownId) {
      const uid = unknownId[1]
      if (uid === '99999') return send(res, 404, { error: 'Not found' })
      return send(res, 200, {
        data: {
          id: Number(uid),
          name: 'fuchsia rose',
          year: 2001,
          color: '#C74375',
          pantone_value: '17-2031',
        },
      })
    }

    // --- App users ---
    if (method === 'GET' && path === '/api/app-users/login') {
      return send(res, 405, { error: 'Method Not Allowed' })
    }
    if (method === 'GET' && path === '/api/app-users') {
      return send(res, 200, { data: [] })
    }
    if (method === 'POST' && path === '/api/app-users') {
      const email = json.email || 'stub@example.com'
      return send(res, 200, {
        data: { id: `au-${Date.now()}`, email, status: 'active' },
      })
    }
    const appUserIdMatch = path.match(/^\/api\/app-users\/([^/]+)$/)
    if (appUserIdMatch) {
      const id = appUserIdMatch[1]
      if (method === 'GET')
        return send(res, 200, {
          data: { id, email: 'stub@example.com', status: 'active' },
        })
      if (method === 'PUT')
        return send(res, 200, {
          data: {
            id,
            email: json.email || 'stub@example.com',
            status: json.status || 'active',
          },
        })
      if (method === 'DELETE') return send(res, 200, {})
    }
    if (method === 'POST' && path === '/api/app-users/login') {
      return send(res, 200, { data: { status: 'sent' } })
    }
    if (method === 'POST' && path === '/api/app-users/verify') {
      if (json.token === 'invalid-token-for-cypress')
        return send(res, 400, { error: 'Invalid token' })
      return send(res, 200, { data: {} })
    }
    const simMatch = path.match(/^\/api\/app-users\/([^/]+)\/sessions\/simulate$/)
    if (method === 'POST' && simMatch && simMatch[1] === 'invalid-id-xyz') {
      return send(res, 400, { error: 'Invalid user' })
    }
    if (method === 'POST' && simMatch) {
      return send(res, 200, { token: 'session-sim' })
    }

    // --- Collections ---
    if (method === 'GET' && path === '/api/collections') {
      return send(res, 200, {
        data: [
          {
            id: 'col-1',
            name: 'Stub',
            slug: 'stub',
            project_id: 'stub-project-1',
          },
        ],
      })
    }
    if (method === 'POST' && path === '/api/collections') {
      const slug = json.slug || 'new-col'
      const name = json.name || 'New'
      return send(res, 201, {
        data: {
          id: `col-${slug}`,
          name,
          slug,
          project_id: 'stub-project-1',
        },
      })
    }
    const colSlugMatch = path.match(/^\/api\/collections\/([^/]+)$/)
    if (colSlugMatch) {
      const slug = colSlugMatch[1]
      if (method === 'GET')
        return send(res, 200, {
          data: {
            id: `col-${slug}`,
            name: 'Stub',
            slug,
            project_id: 'stub-project-1',
          },
        })
      if (method === 'PUT')
        return send(res, 200, {
          data: {
            id: `col-${slug}`,
            name: json.name || 'Updated',
            slug,
            project_id: 'stub-project-1',
          },
        })
      if (method === 'DELETE') return send204(res)
    }
    const recList = path.match(/^\/api\/collections\/([^/]+)\/records$/)
    if (recList) {
      const slug = recList[1]
      if (method === 'GET')
        return send(res, 200, {
          data: [],
          meta: { page: 1, limit: 20, total: 0, pages: 0 },
        })
      if (method === 'POST') {
        const id = `rec-${Date.now()}`
        return send(res, 201, {
          data: { id, data: json.data || {} },
        })
      }
    }
    const recIdMatch = path.match(
      /^\/api\/collections\/([^/]+)\/records\/([^/]+)$/
    )
    if (recIdMatch) {
      const [, , recordId] = recIdMatch
      if (method === 'GET')
        return send(res, 200, {
          data: { id: recordId, data: { title: 'ok' } },
        })
      if (method === 'PUT')
        return send(res, 200, {
          data: { id: recordId, data: json.data || {} },
        })
      if (method === 'DELETE') return send204(res)
    }

    // --- Project app users ---
    const projUsers = path.match(/^\/api\/projects\/([^/]+)\/app-users$/)
    if (method === 'GET' && projUsers && !path.endsWith('/total')) {
      return send(res, 200, { data: [] })
    }
    const projTotal = path.match(/^\/api\/projects\/([^/]+)\/app-users\/total$/)
    if (method === 'GET' && projTotal) {
      return send(res, 200, { total: 0 })
    }

    // --- Custom ---
    if (method === 'GET' && path.startsWith('/api/custom/')) {
      const rest = path.slice('/api/custom/'.length)
      if (rest === 'nonexistent-xyz')
        return send(res, 404, { error: 'Not found' })
      return send(res, 200, { ok: true })
    }
    if (method === 'POST' && path.startsWith('/api/custom/')) {
      return send(res, 200, { echo: json })
    }

    // --- Templates ---
    if (method === 'GET' && path === '/templates') {
      return send(res, 200, {
        templates: [
          {
            id: 1,
            name: 'Stub',
            description: 'Stub template',
          },
        ],
        pagination: { total: 1, limit: 10, offset: 0, pages: 1 },
      })
    }
    if (method === 'GET' && path.startsWith('/templates/')) {
      const id = path.split('/')[2]
      if (id === '999999') return send(res, 404, { error: 'Not found' })
      return send(res, 200, {
        id: Number(id) || 1,
        name: 'E-commerce API',
        description: 'Stub',
      })
    }

    // --- Onboarding (Bearer checks are loose; return JSON) ---
    if (method === 'GET' && path === '/api/onboarding/status') {
      const auth = req.headers.authorization || ''
      if (!auth.startsWith('Bearer '))
        return send(res, 401, { error: 'Unauthorized' })
      return send(res, 200, { complete: false })
    }
    if (
      method === 'POST' &&
      (path === '/api/onboarding/complete' || path === '/api/onboarding/skip')
    ) {
      const auth = req.headers.authorization || ''
      if (!auth.startsWith('Bearer '))
        return send(res, 401, { error: 'Unauthorized' })
      return send(res, 200, { ok: true })
    }

    // --- Figma ---
    if (method === 'POST' && path === '/api/figma/ingest') {
      return send(res, 200, { ingested: true })
    }
    if (method === 'POST' && path === '/api/figma/create') {
      const auth = req.headers.authorization || ''
      if (!auth.startsWith('Bearer '))
        return send(res, 401, { error: 'Unauthorized' })
      return send(res, 200, { created: true })
    }
    if (method === 'GET' && path === '/api/figma/usage') {
      const auth = req.headers.authorization || ''
      if (!auth.startsWith('Bearer '))
        return send(res, 401, { error: 'Unauthorized' })
      return send(res, 200, { used: 0 })
    }

    // --- App session routes ---
    if (method === 'GET' && (path === '/app/me' || path === '/app/collections')) {
      return send(res, 401, { error: 'Unauthorized' })
    }

    send(res, 404, { error: 'Stub: no handler', path, method })
  } catch (e) {
    send(res, 500, { error: String(e.message) })
  }
}

function start(port = 4050) {
  const server = http.createServer(handler)
  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => resolve(server))
    server.on('error', reject)
  })
}

module.exports = { start, handler }
