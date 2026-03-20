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
        'reqres_c225726527424dcf9feb7eeef504adae',
      
    },
  },
})
