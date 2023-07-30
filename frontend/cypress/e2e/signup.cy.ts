describe("Signup tests", () => {
  it("User should be able to signup", () => {
    cy.clearLocalStorage();
    cy.visit("/");
    cy.get('[data-cy="openSignup"]').click();
    const username = `test-${Date.now().toString()}`;
    cy.get('[data-cy="username"]').type(username);
    cy.get('[data-cy="password"]').type("password");
    cy.get('[data-cy="passwordConfirm"]').type("password");
    cy.get('[data-cy="submit"]').click();
    cy.contains(`Hello ${username}`).should("be.visible");
  });
});
