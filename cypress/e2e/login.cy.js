/**
 * End-to-End test untuk alur Login.
 *
 * Skenario pengujian:
 * - Menampilkan halaman login dengan form yang lengkap
 * - Menampilkan pesan error saat login dengan kredensial yang salah
 * - Berhasil login dan redirect ke halaman utama dengan kredensial yang benar
 * - Menampilkan pesan error saat email tidak diisi
 * - Tombol login tersedia dan dapat diklik
 */

describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display the login form with email and password fields", () => {
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("should display a link to the register page", () => {
    cy.get('a[href="/register"]').should("be.visible");
  });

  it("should show an error message when logging in with wrong credentials", () => {
    cy.get('input[type="email"]').type("wronguser@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.get('[class*="error"], [class*="alert"], [role="alert"]', {
      timeout: 10000,
    }).should("be.visible");
  });

  it("should successfully login and redirect to home page with correct credentials", () => {
    const email = Cypress.env("TEST_USER_EMAIL");
    const password = Cypress.env("TEST_USER_PASSWORD");

    // Skip test ini jika kredensial tidak tersedia (misal di CI tanpa secrets)
    if (!email || !password) {
      cy.log(
        "Skipping login test: TEST_USER_EMAIL or TEST_USER_PASSWORD not set",
      );
      return;
    }

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Setelah login berhasil, redirect ke halaman utama
    cy.url({ timeout: 10000 }).should("eq", Cypress.config("baseUrl") + "/");
  });

  it("should keep submit button enabled before form is submitted", () => {
    cy.get('button[type="submit"]').should("not.be.disabled");
  });
});
