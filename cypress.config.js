import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Port 5173 untuk dev server, 4173 untuk preview (CI)
    // Override via: cypress run --config baseUrl=http://localhost:4173
    baseUrl: "http://localhost:5173",
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
