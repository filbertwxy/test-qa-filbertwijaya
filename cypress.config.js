const { defineConfig } = require('cypress')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://reqres.in',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      )
      return config
    },
    env: {
      REQRES_API_KEY:
        process.env.CYPRESS_REQRES_API_KEY ||
        'reqres_ff4c66c4907f4df1ae03a0d8945faeec',
    },
  },
})
