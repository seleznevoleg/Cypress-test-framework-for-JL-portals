// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { should } from 'chai';
import addContext from 'mochawesome/addContext';
const portalsData = require('../fixtures/portals_staging_full.json');
const selectorsData = require('../fixtures/selectorsStartPage.json');
const selectorsAdminAreaData = require('../fixtures/selectorsAdminArea.json');

Cypress.Commands.add('addContext', (context) => {
  cy.once('test:after:run', (test) => addContext({ test }, context));
});


Cypress.Commands.add('checkElementLinkHealth', (selector) => {
  // Get all elements matching the selector
  cy.get(selector).each(($element) => {
    // Get the href attribute of the element
    cy.wrap($element).invoke('attr', 'href').then((href) => {
      // Check if href exists
      if (href) {
        // Make an HTTP request to the link URL
        cy.request(href).then((response) => {
          // Check the response status code
          if (response.status === 200) {
            // Link is alive
            cy.log('Link is alive');
          } else {
            // Link is dead or returned an error status code
            cy.log(`Link is dead or returned status code: ${response.status}`);
          }
        });
      } else {
        // href attribute is not found
        cy.log('Link href attribute is not found');
      }
    });
  });
});

Cypress.Commands.add('checkImageHealth', (selector) => {
  // Get all elements matching the selector
  cy.get(selector).each(($element) => {
    // Get the currentSrc property of the image
    cy.wrap($element).invoke('prop', 'currentSrc').then((src) => {
      // Check if src exists
      if (src) {
        // Make an HTTP request to the image URL
        cy.request(src).then((response) => {
          // Check the response status code
          if (response.status === 200) {
            // Image is loaded
            cy.log('Image is loaded');
          } else {
            // Image failed to load or returned an error status code
            cy.log(`Image failed to load or returned status code: ${response.status}`);
          }
        });
      } else {
        // currentSrc property is not found
        cy.log('Image currentSrc property is not found');
      }
    });
  });
});

Cypress.Commands.add('getElementOrError', (selector) => {
  cy.get(selector)
    .then(($element) => {
      if ($element.length === 0) {
        throw new Error(`Element with selector '${selector}' not found`);
      }
      return $element;
    });
});


Cypress.Commands.add('acceptAllCookies', () => {
  cy.contains('Cookie Einstellungen').click()
  cy.contains('Alle akzeptieren').should('be.visible')
  cy.contains('Alle akzeptieren').click()
});

//this is an experemental implementation to cover case when there's no element on the page
Cypress.Commands.add('checkIfElementExists', (selector, callback = null, existMessage = '', notExistMessage = '') => {
  // Use JavaScript DOM manipulation to check if the element exists
  cy.document().then(doc => {
    const elements = doc.querySelectorAll(selector);
    if (elements.length > 0) {
      // Elements exist
      elements.forEach((element, index) => {
        if (typeof callback === 'function') {
          // Execute the callback function for each element
          callback(element, index); 
        } else {
          const logMessage = existMessage ? existMessage : `Element '${selector}' exists`;
          cy.log(logMessage);
        }
      });
    } else {
      // Elements do not exist
      const logMessage = notExistMessage ? notExistMessage : `Element '${selector}' does not exist`;
      cy.log(logMessage);
    }
  });
});

Cypress.Commands.add('softAssert', (condition, message) => {
  if (!condition) {
    cy.log(`Soft assertion failed: ${message}`);
  }
});

Cypress.Commands.add('checkTextContains', (selector, expectedText) => {
  cy.get(selector).invoke('text').then((text) => {
    try {
      expect(text).to.include(expectedText);
      cy.addContext('Test passed, here is additional info:')
    } catch (error) {
      cy.addContext('Test failed, here is additional info:')
    }
  });
});

Cypress.Commands.add('executeScriptForPortals', (scenario, portalNames) => {
  
    const executeScriptForPortal = (portal) => {
      // Execute your script here for the provided portal
      console.log(`Executing script for portal: ${portal.name}`);
      // Replace the console.log statement with your actual script execution logic
    };
  
    switch (scenario) {
      case 'all':
        portalsData.portals.forEach((portal) => {
          executeScriptForPortal(portal);
        });
        break;
      case 'random':
        const randomIndex = Math.floor(Math.random() * portalsData.portals.length);
        executeScriptForPortal(portalsData.portals[randomIndex]);
        break;
      case 'list':
        portalNames.forEach((portalName) => {
          const portal = portalsData.portals.find((p) => p.name === portalName);
          if (portal) {
            executeScriptForPortal(portal);
          } else {
            console.log(`Portal with name "${portalName}" not found.`);
          }
        });
        break;
      case 'type':
        const type = portalNames[0];
        const portalsOfType = portalsData.portals.filter((portal) => portal.type === type);
        portalsOfType.forEach((portal) => {
          executeScriptForPortal(portal);
        });
        break;
      default:
        console.log('Invalid scenario');
    }
  });

//commands for admin area

Cypress.Commands.add('loginAsAdmin', (portalName) => {
  // Find the portal object with the matching name
  const portal = portalsData.portals.find((item) => item.name === portalName);

  if (portal) {
    const { url } = portal;

    cy.visit(url);
    cy.contains('Anmelden').click()

    cy.origin('https://staging-auth.joblocal.de', () => {
      cy.fixture('selectorsStartPage').then(selectorsData => {
        cy.get(selectorsData.emailInput).type(Cypress.env('ADMIN_LOGIN'));
        cy.get(selectorsData.passwordInput).type(Cypress.env('ADMIN_PASSWORD'));
        cy.get(selectorsData.loginButton).click();
      })
    })
    cy.get(selectorsAdminAreaData.adminAccountMenuButton).should('be.visible').click()
    cy.get(selectorsAdminAreaData.adminAccountMenuInfo).invoke('text').should('contain', Cypress.env('ADMIN_LOGIN'))
    cy.get(selectorsAdminAreaData.adminAccountMenuButton).click()
  } else {
    // Handle the case where no portal with the given name is found
    cy.log(`No portal found with the name: ${portalName}`);
  }
})

Cypress.Commands.add('getCurrentDateTime', () =>{
  const now = new Date();
  const year = now.getFullYear().toString().substr(-2); // Get last two digits of the year
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
})

Cypress.Commands.add('generateUserData', () => {
  // Define the endpoint URL of the external API
  const api_key = Cypress.env('NAME_PARSER_API_KEY')

  const apiUrl = `https://api.parser.name/?api_key=${api_key}&endpoint=generate&country_code=DE`;

  // Make a request to the external API
  return cy.request(apiUrl).then((response) => {
    // Check if the request was successful
    if (response.status === 200) {
      // Return the generated user data from the response body
      const userData = response.body.data[0];
      const salutation = userData.salutation.salutation;
      const firstName = userData.name.firstname.name;
      const lastName = userData.name.lastname.name;

      return { salutation, firstName, lastName };

    } else {
      // Log an error message if the request fails
      Cypress.log({
        name: 'Generate User Data',
        message: `Failed to generate user data. Status code: ${response.status}`,
      });
      // Return null or throw an error, depending on your preference
      return null;
      // throw new Error(`Failed to generate user data. Status code: ${response.status}`);
    }
  });
});


Cypress.Commands.add('createCompanyManager', () => {
  
  //Get current date for naming
  cy.getCurrentDateTime().then((data) => {


    //generate test data for user, type it in forms
    cy.generateUserData().then((userData) => {
      const { salutation, firstName, lastName } = userData
      cy.get(selectorsAdminAreaData.managerCreationTitelField).type(salutation)
        .invoke('prop','value').should('not.be.empty')
      cy.get(selectorsAdminAreaData.managerCreationVornameField).type(firstName)
        .invoke('prop','value').should('not.be.empty')
      cy.get(selectorsAdminAreaData.managerCreationNachnameField).type(lastName)
        .invoke('prop','value').should('not.be.empty')
    })
    cy.get(selectorsAdminAreaData.managerCreationEmailField).type('olegseleznevjl+'+data+'@gmail.com')
      .invoke('prop','value').should('not.be.empty')
    cy.get(selectorsAdminAreaData.managerCreationFirstCheckbox).click()
      .invoke('prop','checked').should('be.true')
    cy.get(selectorsAdminAreaData.managerCreationActivationCheckbox).click()
      .invoke('prop','checked').should('be.false')
    
    return cy.wrap('olegseleznevjl+'+data+'@gmail.com')
  });
  
})


Cypress.Commands.add('createCompany', (portalName) => {

  const portal = portalsData.portals.find((item) => item.name === portalName);

  //recursive function to set dateTime from params or generate it

    cy.getCurrentDateTime().then((currentDateTime) => {

      if (portal) {
        const { city, street, houseNumber,zipCode } = portal;
        const randomNumber = Math.floor(Math.random() * 100) + 1;
    
        cy.get(selectorsAdminAreaData.companyCreationName).type('testCompany_' + currentDateTime)
          .invoke('prop','value').should('not.be.empty')
        cy.get(selectorsAdminAreaData.companyCreationActivated)
          .invoke('prop','checked').should('be.true')
        cy.get(selectorsAdminAreaData.companyAddressSrteet).type(street + ', ' + houseNumber)
          .invoke('prop','value').should('not.be.empty')
        cy.get(selectorsAdminAreaData.companyAddressPostcode).type(zipCode)
          .invoke('prop','value').should('not.be.empty')
        cy.get(selectorsAdminAreaData.companyAddressCity).type(city)
          .invoke('prop','value').should('not.be.empty')
        cy.get(selectorsAdminAreaData.companyAddressCountry)
          .invoke('prop','value').should('not.be.empty')
        cy.get(selectorsAdminAreaData.companyEmployeeNumber).type(randomNumber.toString())
          .invoke('prop','value').should('not.be.empty')
        cy.get(selectorsAdminAreaData.companyShowEmployeeNumber)
          .invoke('prop','checked').should('be.true')
        cy.get(selectorsAdminAreaData.companyUpdateEmployeeNumber)
          .invoke('prop','checked').should('be.false')
    
        cy.get(selectorsAdminAreaData.companyCreationSubmitButton).click()

        cy.get('.headline > small').invoke('text').then((text) => {
          const companyIdMatch = text.match(/#(\d+)/);
          const companyId = companyIdMatch ? companyIdMatch[1] : null; // Extract companyId from the text
          
          // Return the companyId using cy.wrap()
          return cy.wrap(companyId);
        });
    
        // cy.get('.headline > small').invoke('text').then((text) => {
    
        //   const companyId = text.match(/#(\d+)/);
    
        // });
    
      } else {
        // Handle the case where no portal with the given name is found
        cy.log(`No portal found with the name: ${portalName}`);
      }      

    });

});


//job ad creation
//Find location outside geofence: used a domain address that is for sure otside geofence - 200+ km out of domain's address

//Book products

//delete company



//commands for verena area

//log in as a verena
