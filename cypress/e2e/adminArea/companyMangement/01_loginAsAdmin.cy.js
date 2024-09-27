/// <reference types="cypress" />

describe('Login as an admin, create company', () => {

    before(() => {
        //set a list of domains where script should be performed, now - hardcoded
        //let domain = 'AUG'
        //optional company features: bookings, portals, extra managers 
    })
    let domain = 'AUG'
    // let currentDateTime

    it.only('Login as Admin', () => {
        //Log in as an admin
        cy.loginAsAdmin(domain)
        //Navigate to comapny creation flow
        cy.contains('Unternehmen erstellen').click()
        //Create comapny manager
        cy.createCompanyManager()
        //click submit and check next page redirection
        cy.contains('Weiter: Informationen über das Unternehmen').click()
        cy.get('.wizard > .active').invoke('text').should('contain', 'Informationen über das Unternehmen')
        //Create company 
        cy.createCompany(domain).then((companyId) => {
            // Use the companyId in your test code
            cy.log(`Created company with ID: ${companyId}`);
            //Assert company profile on public frontend
        });
        //Book flatrate on home domain
        
        //Login as Admin to Verena area
        //Create job ad (AI generation is enought, missing fields and data provided with hardcoded values)
        //Publish job ad. Assert publication

    })

    it('Csse no. 2', () => {
        //code
    })

    it('Csse no. 3', () => {
        //code
    })
})