const { defineConfig } = require("cypress");
require('dotenv').config()

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    ...process.env
  },
});
