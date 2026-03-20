#!/usr/bin/env node
/**
 * Starts local ReqRes stub, runs Cypress with CYPRESS_BASE_URL pointing at it, then stops the server.
 */
const { spawn } = require('child_process')
const { start } = require('./reqres-stub-server')

const PORT = parseInt(process.env.STUB_PORT || '4050', 10)
const BASE = `http://127.0.0.1:${PORT}`

async function main() {
  const server = await start(PORT)
  // eslint-disable-next-line no-console
  console.log(`Stub listening on ${BASE}`)

  const cyArgs = process.argv.slice(2).length
    ? process.argv.slice(2)
    : ['cypress', 'run']

  const child = spawn('npx', cyArgs, {
    stdio: 'inherit',
    env: {
      ...process.env,
      CYPRESS_BASE_URL: BASE,
    },
    shell: process.platform === 'win32',
  })

  const done = new Promise((resolve) => {
    child.on('close', (code) => resolve(code ?? 1))
  })

  const code = await done
  await new Promise((r) => server.close(r))
  process.exit(code)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
