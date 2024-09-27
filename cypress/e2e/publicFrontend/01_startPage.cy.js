/// <reference types="cypress" />

const portalsData = require('../../fixtures/portals.json');
const { onStartPage } = require('../../support/pageObject/startPage');
const selectorsData = require('../../fixtures/selectorsStartPage.json');

//No it's hardcoded. Later it would be selected regarding user's option (random / specific, staging / prod)
let portalIndex = 1;

describe('Start page validation', () => {

  beforeEach(() => {
    // Execute the script based on the scenario parameter from the environment
    cy.visit(portalsData.portals[portalIndex].url)
  });
  
  it('Testing keyword input', () => {
    //We use test data and check if suggestion function works
    onStartPage.verifyKeywordSuggestionList()
  })

  it('Testing location input', () => {
    //We use test data and check if suggestion function works. Ideally, each portal has it's own location test data but for now I'll just use 1 - 3 letters and tryin' to fetch suggestions
    onStartPage.verifyLocationSuggestionList ()
  })

  // it.only('Additional links section check', () => {
  //   //Just check if it is exist and pills links are alive
  //   cy.checkIfElementExists(selectorsData.additionaLinkElement, cy.checkElementLinkHealth(selectorsData.additionalLinksPills))
  // })

  it('Additional links section check', () => {
    // Define the callback function to check additional links health

    const additionalLinksCheck = () => {
      // Check the health of additional links pills
      cy.checkElementLinkHealth(selectorsData.additionalLinksPills);
    };
  
    // Just check if the additional links section exists and execute the callback function
    cy.checkIfElementExists(selectorsData.additionalLinkElement, additionalLinksCheck);
  });
  

  it('Comparing Region list with location pills', () => {
    //Check region dropdown visibility
    cy.get(selectorsData.regionsList).click()
    //cy.get('#navbarDropdownMenuLink').click({forced:  true})
    cy.get(selectorsData.regionsDropDown).should('be.visible')

    onStartPage.regionCount().then(({ count1, count2 }) => {
      expect(count1).to.equal(count2);
      cy.log(`Number of region items: ${count1}`);
      cy.log(`Number of region item pills: ${count2}`);
    });

  })

  it('Asserting popular search queries', () => {
    //Debatable is it nessesary to do this check
    const checkPills = () => {
      cy.checkElementLinkHealth(selectorsData.popularSearchQueriesLinks)
    }

    cy.checkIfElementExists(selectorsData.popularSearchQueries, checkPills)
  })

  // it('Asserting slider moving', () => {
  //   // I decided to skip this case. Technically it's tricky and will take a lot of time to run.
  //   // Is it make sence to test it?
  // })

  it('Asserting slider logos and banners', () => {
    //Currently without cheking if company able to show it's logo in slider. Checking if link is alive and if image is exist
    cy.get(selectorsData.sliderSection).should('be.visible')
    cy.checkElementLinkHealth(selectorsData.sliderElements)
    cy.checkImageHealth(selectorsData.sliderElementsImage)
  })

  it('Asserting company profile video', () => {
    //Video wouldn't be shown - for now I can't accept cookies. I need some time to figure out how to allow web app use external api
    //This check written not so perfect - same logos and company links checked multiple times
    const videoElementCheck = () => {
      cy.get('.card > .card-body > .d-flex > img').then(content => {
        cy.checkImageHealth(content)
      })
      cy.get('.card > .card-body > .d-flex > a').then(content => {
        cy.checkElementLinkHealth(content)
      })

    }
    cy.checkIfElementExists(selectorsData.newVideoElement, videoElementCheck)
  })

  it('Asserting top job having a top job pills in teaser. link is alive and logo loaded', () => {
    //Think about checking if company has this job ad publication and it has top job additional product
    const topJobItemChecks = (element) => {

      console.log(element)

      //Getting image and checking if it's alive. 
      //I'll skip this scenario - for not I didn't find a way how to make it run if there's no image on job ad card. 
      //Can be solved by writing separate checkIfElementExists for image selector

      //Getting publication link and checking if it's alive
      cy.get('a', { withinSubject: element }).then(link => {
        cy.checkElementLinkHealth(link)
      })  

      //Asserting topjob pill in job ad card 
      cy.contains('Top-Job').should('exist')

    }

    cy.checkIfElementExists(selectorsData.topJobItems, topJobItemChecks)
  })

  it('Testing favourite function for top jobs', () => {
    //Click/unclick fav on every TopJob, assert fav icon and fav number
    onStartPage.clearAllFavoriteJobAds()
    onStartPage.clickFavAndCheck ()
    onStartPage.clearAllFavoriteJobAds()
  })

  //Waiting until DR-19224 will be fixed
  // it.only('Favorite list: asserting job ad links', () => {
  //   //Preparing test data
  //   onStartPage.clearAllFavoriteJobAds()
  //   onStartPage.clickFavAndCheck ()
  //   //Asserting publication links
  //   onStartPage.favJobadsLinkCheck()  
  //   Cleaning fav list
  //   onStartPage.clearAllFavoriteJobAds()

  // })

  it('Favorite list: asserting logos', () => {
    //Preparing test data
    onStartPage.clearAllFavoriteJobAds()
    onStartPage.clickFavAndCheck ()
    
    //Asserting publication logos
    onStartPage.favJobadsLogoCheck ()

    //Cleaning fav list
    onStartPage.clearAllFavoriteJobAds()
  })

  it('Favorite list: deselecting on job ad detail page', () => {
    onStartPage.removeFavJobFromJobAdDesc ()
  })

})