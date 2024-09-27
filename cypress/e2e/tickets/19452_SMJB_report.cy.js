// /// <reference types="cypress" />

// const portalsData = require('../../fixtures/portals_staging_full.json');
// const selectorsData = require('../../fixtures/selectorsStartPage.json');
// const selectorsAdminAreaData = require('../../fixtures/selectorsAdminArea.json');
// const statsResponse = require('../../fixtures/statsResponse.json')
// const graphQLResponse = require('../../fixtures/graphQLResponse.json')


// describe('SMJB Report', () => {

//     it('Mock GraphQL responce', () => {

//         let requestCount = 0;
    
//         cy.intercept('POST', 'https://stats.staging-k8s.jobl.io/graphql', (req) => {
//           requestCount++;
    
//           if (requestCount === 1) {
//             cy.fixture('graphQLResponse').then((firstMockData) => {
//               req.reply({
//                 statusCode: 200,
//                 body: firstMockData
//               });
//             });
//           } else if (requestCount === 2) {
//             cy.fixture('graphQLResponseStatAppExt').then((secondMockData) => {
//               req.reply({
//                 statusCode: 200,
//                 body: secondMockData
//               });
//             });
//           }
//         }).as('graphqlRequest');
        
//         cy.intercept('GET', 'https://staging-api.joblocal.de/v5/product-bookings/181?include=stats', {
//             statusCode: 200,
//             body: statsResponse
//           }).as('firstRequest');
        
//         // Pass through the first GraphQL request without mocking
//         cy.intercept('POST', 'https://stats.staging-k8s.jobl.io/graphql', (req) => {
//             if (req.body.operationName !== 'SpecificQuery') {
//                 // If the request is not the one we want to mock, allow it to proceed
//                 req.continue();
//             }
//         }).as('passThroughGraphQL');
  
//         // Mock the second GraphQL request with specific query
//         cy.intercept('POST', 'https://stats.staging-k8s.jobl.io/graphql', (req) => {
//             if (req.body.operationName === 'SpecificQuery') {
//             req.reply({
//                 statusCode: 200,
//                 body: { data: { result: 'Mocked response for second GraphQL request' } }
//             });
//             }
//         }).as('mockedGraphQL');

//         let portalName = "AUG"

//         const portal = portalsData.portals.find((item) => item.name === portalName);

//         if (portal) {
//           const { url } = portal;
      
//           cy.visit(url);
//           cy.contains('Anmelden').click()
      
//           cy.origin('https://staging-auth.joblocal.de', () => {
//             cy.fixture('selectorsStartPage').then(selectorsData => {
//                 cy.get(selectorsData.emailInput).type(Cypress.env('ADMIN_LOGIN'));
//                 cy.get(selectorsData.passwordInput).type(Cypress.env('ADMIN_PASSWORD'));
//                 cy.get(selectorsData.loginButton).click();
//             })
//           })
//         //   cy.get(selectorsAdminAreaData.adminAccountMenuButton).should('be.visible').click()
//         //   cy.get(selectorsAdminAreaData.adminAccountMenuInfo).invoke('text').should('contain', Cypress.env('ADMIN_LOGIN'))
//         //   cy.get(selectorsAdminAreaData.adminAccountMenuButton).click()

//           cy.visit(url)
//           cy.setCookie('selected_company_id', '78201');
          
          
//           cy.getCookie('selected_company_id').should('have.property', 'value', '78201');
//           cy.contains('Anmelden').click()

//           cy.visit(url + '/portalManagement/jobs/boosts/181')

//         } else {
//           // Handle the case where no portal with the given name is found
//           cy.log(`No portal found with the name: ${portalName}`);
//         }
//     })

// })


/// <reference types="cypress" />

const portalsData = require('../../fixtures/portals_staging_full.json');
const selectorsData = require('../../fixtures/selectorsStartPage.json');
const selectorsAdminAreaData = require('../../fixtures/selectorsAdminArea.json');
const statsResponse = require('../../fixtures/statsResponse.json');
const graphQLResponse = require('../../fixtures/graphQLResponse.json');
const graphQLResponseStatAppExt = require('../../fixtures/graphQLResponseStatAppExt.json');
const graphQLResponseStatAppPortal = require('../../fixtures/graphQLResponseStatAppPortal.json')

describe('SMJB Report', () => {

    it('Mock GraphQL response with external application form job ad stats', () => {

        let requestCount = 0;

        // Single intercept handling all GraphQL requests
        cy.intercept('POST', 'https://stats.staging-k8s.jobl.io/graphql', (req) => {
            requestCount++;

            if (requestCount === 1) {
                req.reply({
                    statusCode: 200,
                    body: graphQLResponse
                });
            } else if (requestCount === 2) {
                req.reply({
                    statusCode: 200,
                    body: graphQLResponseStatAppExt
                });
            } else {
                req.continue(); // Allow subsequent requests to go through unmocked
            }
        }).as('graphqlRequest');

        // Mocking a GET request
        cy.intercept('GET', 'https://staging-api.joblocal.de/v5/product-bookings/181?include=stats', {
            statusCode: 200,
            body: statsResponse
        }).as('firstRequest');

        let portalName = "AUG";
        const portal = portalsData.portals.find((item) => item.name === portalName);

        if (portal) {
            const { url } = portal;

            cy.visit(url);
            cy.contains('Anmelden').click();

            cy.origin('https://staging-auth.joblocal.de', () => {
                cy.fixture('selectorsStartPage').then(selectorsData => {
                    cy.get(selectorsData.emailInput).type(Cypress.env('ADMIN_LOGIN'));
                    cy.get(selectorsData.passwordInput).type(Cypress.env('ADMIN_PASSWORD'));
                    cy.get(selectorsData.loginButton).click();
                });
            });

            cy.visit(url);
            cy.setCookie('selected_company_id', '78201');

            cy.getCookie('selected_company_id').should('have.property', 'value', '78201');
            cy.contains('Anmelden').click();

            cy.visit(url + '/portalManagement/jobs/boosts/181');
            cy.screenshot()

            cy.get('body > div.container-xxl > div.content > div:nth-child(2) > div:nth-child(2) > div.card-header > nav > a:nth-child(2)').click()
            cy.screenshot()

        } else {
            cy.log(`No portal found with the name: ${portalName}`);
        }
    });

    it('Mock GraphQL response with portal application form job ad stats', () => {

        let requestCount = 0;

        // Single intercept handling all GraphQL requests
        cy.intercept('POST', 'https://stats.staging-k8s.jobl.io/graphql', (req) => {
            requestCount++;

            if (requestCount === 1) {
                req.reply({
                    statusCode: 200,
                    body: graphQLResponse
                });
            } else if (requestCount === 2) {
                req.reply({
                    statusCode: 200,
                    body: graphQLResponseStatAppPortal
                });
            } else {
                req.continue(); // Allow subsequent requests to go through unmocked
            }
        }).as('graphqlRequest');

        // Mocking a GET request
        cy.intercept('GET', 'https://staging-api.joblocal.de/v5/product-bookings/181?include=stats', {
            statusCode: 200,
            body: statsResponse
        }).as('firstRequest');

        let portalName = "AUG";
        const portal = portalsData.portals.find((item) => item.name === portalName);

        if (portal) {
            const { url } = portal;

            cy.visit(url);
            cy.contains('Anmelden').click();

            cy.origin('https://staging-auth.joblocal.de', () => {
                cy.fixture('selectorsStartPage').then(selectorsData => {
                    cy.get(selectorsData.emailInput).type(Cypress.env('ADMIN_LOGIN'));
                    cy.get(selectorsData.passwordInput).type(Cypress.env('ADMIN_PASSWORD'));
                    cy.get(selectorsData.loginButton).click();
                });
            });

            cy.visit(url);
            cy.setCookie('selected_company_id', '78201');

            cy.getCookie('selected_company_id').should('have.property', 'value', '78201');
            cy.contains('Anmelden').click();

            cy.visit(url + '/portalManagement/jobs/boosts/181');
            cy.screenshot()

            cy.get('body > div.container-xxl > div.content > div:nth-child(2) > div:nth-child(2) > div.card-header > nav > a:nth-child(2)').click()
            cy.screenshot()

        } else {
            cy.log(`No portal found with the name: ${portalName}`);
        }
    });

});
