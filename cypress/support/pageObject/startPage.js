const selectorsData = require('../../fixtures/selectorsStartPage.json')

export class StartPage {

    verifyKeywordSuggestionList(){
        cy.get(selectorsData.keyWordField).clear().type('Ver')
        cy.get(selectorsData.dropdownElement).should('be.visible')
        cy.get(selectorsData.suggestionList).then(suggestionList => {
            cy.wrap(suggestionList).should('contain', 'Ver')
        })
    }

    verifyLocationSuggestionList(){
        cy.get(selectorsData.locationField).clear().type('Da')
        cy.get(selectorsData.dropdownElement).should('be.visible')
        cy.get(selectorsData.suggestionList).then(suggestionList => {
            cy.wrap(suggestionList).should('contain', 'Da') 
        })
    }

    // compareNumberOfRegions(){
        
    // }
    regionCount() {
        let count1;
        let count2;
      
        cy.get(selectorsData.regionItemPills).children().its('length').then(length => {
          count2 = length;
        });
      
        cy.get(selectorsData.regionItemsList).children().its('length').then(length => {
          count1 = length;
        });
      
        return cy.wrap().then(() => {
          return {
            count1: count1,
            count2: count2
          };
        });
    }

    //clear all fav job ads
    clearAllFavoriteJobAds(){
      const clearFavJobFromTheList = (element) => {
        cy.wrap(element).click()

        cy.get('.FavoritesList').then(favItems => {
          for (let i = 0; i < favItems.length; i++) {
            cy.wrap(favItems.eq(0)).find('.bi-trash-fill').click();
            cy.wait(100)
          }
        });
        cy.get(selectorsData.favJobListDropdown).should('not.exist');

      }
      cy.checkIfElementExists(selectorsData.favJobListDropdown, clearFavJobFromTheList)
    }    

    //click of on fav icon and check if it is changed
    clickFavAndCheck(){
      //If needed, fav button could be the function parameter
      
      let favCount = 0

      //Defining function: click on job ad, assert favicon
      const favClickandCheck = (element) => {
        cy.wrap(element).click()
        cy.wrap(element).find('.bi-heart-fill').should('exist')
        favCount++
      }
      
      cy.checkIfElementExists(selectorsData.favButtonStart, favClickandCheck)
      
      cy.get(selectorsData.favJobListDropdown).invoke('text').then((text) => {
        // Extract the numeric value using regular expression
        const numericValue = parseInt(text.match(/\d+/)[0]);
      
        // Assert the numeric value with the existing variable favCount
        cy.wrap(numericValue).should('eq', favCount);
      });
      
    }

    //Waiting until DR-19224 will be fixed
    favJobadsLinkCheck() {
      //Expand list
      cy.get(selectorsData.favJobListDropdown).click()
      cy.checkElementLinkHealth('element selector')
      //Collapse list
      cy.get(selectorsData.favJobListDropdown).click()
    }

    favJobadsLogoCheck() {
      //Expand list
      cy.get(selectorsData.favJobListDropdown).click()
      cy.checkImageHealth(selectorsData.favJobAdLogo)
      //Collapse list
      cy.get(selectorsData.favJobListDropdown).click()
    }

    removeFavJobFromJobAdDesc () {
      //Put one job ad to favourite list
      cy.get(selectorsData.favButtonStart).first().click()
      //Navigate to publication, check if it has fav icon selected
      cy.get(selectorsData.favJobListDropdown).click()
      cy.get(selectorsData.favJobAditem).first().click()
      //Check that Gemerkt is selected
      cy.get(selectorsData.favButtonJobAd).find('.bi-heart-fill').should('exist')
      //Deselect fav icon, assert deselection
      cy.get(selectorsData.favButtonJobAd).click()
        .find('.bi-heart').should('exist')
      cy.get(selectorsData.favJobListDropdown).should('not.exist')
    }
    
}

export const onStartPage = new StartPage()