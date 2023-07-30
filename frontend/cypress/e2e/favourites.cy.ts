describe("Favourites", () => {
  it("Adding and removing movie favourites should work correctly", () => {
    cy.login("tester", "tester");
    cy.visit("/movies/238");
    cy.get('[data-cy="favouriteBtn"]').click();
    cy.contains(`Add to favourites`).should("be.visible");
    cy.contains(`"The Godfather" has been added to your favourites`).should(
      "be.visible"
    );
    cy.contains("Remove from favourites").should("be.visible");

    cy.visit("/favourites");
    cy.contains("The Godfather").should("be.visible");
    cy.get("div").contains("The Godfather").click();
    cy.get('[data-cy="favouriteBtn"]').click();
    cy.contains(`"The Godfather" has been removed from your favourites`).should(
      "be.visible"
    );
    cy.contains("Add to favourites").should("be.visible");

    cy.visit("/favourites");
    cy.contains("No results found").should("be.visible");
  });
});
