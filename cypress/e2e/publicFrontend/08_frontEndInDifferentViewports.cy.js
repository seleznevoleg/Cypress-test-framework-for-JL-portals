import { getPortalUrls } from '../../support/utils';
import portalsData from '../../fixtures/portals_staging_full.json'
import viewPortsData from '../../fixtures/viewports.json'

describe('Screenshots', () => {
    const portalType = 'RN';
    const viewports = viewPortsData.viewports
    const portals = portalsData.portals
    const testPortals = getPortalUrls(portals, { types: [portalType] })

    viewports.forEach((viewport) => {
        describe(`Performing test cases in ${viewport.name} viewport for different portals`, () => {
            testPortals.forEach((portalUrl) => {
                it(`Performing test case for ${portalUrl} portal in ${viewport.height} * ${viewport.width} resolution`, () => {
                    //Test script
                    cy.viewport(viewport.width, viewport.height);
                    cy.visit(portalUrl)
                    cy.wait(1000)
                })
            })
        })
   
  })
});