describe("Movie page tests", () => {
  it("Movie page should display correct data", () => {
    cy.visit("/movies/550");

    cy.contains(`Fight Club`).should("be.visible");
    cy.contains(`1999`).should("be.visible");
    cy.contains(`2h 19m`).should("be.visible");
    cy.contains(`Add to favourites`).should("be.visible");

    cy.get('[data-cy="movieTopCast"]').scrollIntoView();
    cy.contains(`Brad Pitt`).should("be.visible");
    cy.contains(`Tyler Durden`).should("be.visible");
    cy.contains(`Jared Leto`).should("be.visible");

    cy.get('[data-cy="recommendations"]').scrollIntoView();
    cy.get(".posterCard");
    cy.get(".swiper-btn-next");
  });
});
