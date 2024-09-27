/// <reference types="cypress" />

import { getPortalUrls } from "../../support/utils";

describe('Viewport Tests', () => {
  const portalType = 'RN'; // Define the type of portals to test
  let portals = [];
  let viewports = [];

  // Load the portals and viewports fixtures before running the tests
  before(() => {
    cy.fixture('portals_staging_full').then((data) => {
      portals = data.portals.filter(portal => portal.type === portalType);
    });
    cy.fixture('viewports').then((data) => {
      viewports = data.viewports;
    });
  });

  // Ensure portals and viewports are loaded before running tests
  beforeEach(() => {
    expect(portals).to.have.length.gt(0);
    expect(viewports).to.have.length.gt(0);
  });

  // Define tests directly under the describe block
  it('should take screenshots for each portal in each viewport', function() {
    viewports.forEach(viewport => {
      portals.forEach(portal => {
        // Wrap each test in a Cypress `cy.then` to ensure synchronous execution
        cy.then(() => {
          cy.log(`Testing portal: ${portal.name} in ${viewport.name} viewport`);

          // Set the viewport size
          cy.viewport(viewport.width, viewport.height);

          // Visit the portal URL
          cy.visit(portal.url);
          cy.wait(5000)
          cy.get('body > #cmpbox').then(body => {
            if (body.find('Alle akzeptieren').length>0){
              cy.get('.cmpboxbtns > .cmpboxbtnspan > .cmpboxbtn > #cmpbntyestxt').click();
            }
          })

          // Take a screenshot
          cy.screenshot(`${portal.name}-${viewport.name}`);
        });
      });
    });
  });
});
