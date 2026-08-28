import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // baseUrl diset ke port preview (untuk CI), override dengan --config untuk dev lokal
    baseUrl: "http://localhost:4173",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      // Ambil credentials dari environment variable CI
      config.env.TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || "";
      config.env.TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || "";
      return config;
    },
  },
});
