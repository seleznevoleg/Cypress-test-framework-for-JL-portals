/// <reference types="cypress" />

const portalData = require('../../fixtures/portals_staging_full.json')
const selectorsData = require('../../fixtures/selectorsStartPage.json')
import addContext from 'mochawesome/addContext';



describe('Verifying that each occupation on each portal has a mfd suffix in title', () => {
    
    //Now only for one portal, than it could be executed for all
    // const portal = 'https://route:wipeout@test.muenchenerjobs.de'
    const portal = 'https://route:wipeout@test.augsburgerjobs.de'
        
    it(`Check links on portal MUC`, () => {
        
        cy.visit(portal + '/berufe');
        
        cy.get('.list-group-item > a').each(($link, index) => {
            const href = $link.attr('href'); // Get the href attribute
            
            cy.get(selectorsData.keyWordField).should('exist')
            cy.visit(portal + href);
            cy.checkTextContains('.col-md-8.order-last > :nth-child(1) > .col-12', '(m/w/d)');
            // cy.wait(100)
            cy.addContext(href)
            cy.go(-1); // Navigate back to the original page
            // cy.wait(300)
        });
            
    });            
            
})