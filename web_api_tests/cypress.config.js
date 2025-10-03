const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5123',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    requestTimeout: 10000,
    responseTimeout: 10000,
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})