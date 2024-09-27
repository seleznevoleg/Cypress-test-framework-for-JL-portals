export class TestDataGeneration {
    //This method creates job ad draft
    createJobAdDraft () {
        //For now job ad content would be static, without media
        //Only company id required
        //Application method hardcoded - onsite
        //Method returns job ad id

        cy.fixture('apiEndpoints.json').then((endpoints) => {
            const jobAdCreationEndpointUrl = endpoints.apiEndpointList.jobAdCreation

            cy.fixture('testCompanies').then((companies) => {
            
                const randomCompanyId = Cypress._.sample(companies.companies)
                
                cy.fixture('jobAdCreationBody.json').then((reqestBody) => {
                    
                    reqestBody.data.attributes.company_id = randomCompanyId;
                    reqestBody.data.relationships.company.data.id = randomCompanyId;

                    cy.request({
                        method: 'POST',
                        url: jobAdCreationEndpointUrl, // Use the jobAdCreation endpoint URL
                        headers: {
                          'x-api-key': Cypress.env('API_KEY'), // Read API key from .env file
                          'Content-Type': 'application/json',
                        },
                        body: requestBody,
                      }).then((response) => {
                        // Handle the response
                        if (response.status === 200) {
                            const jobAdId = response.body.id 
                            cy.log(`Test data created successfully, job ad ID is ${jobAdId}`);

                            return jobAdId
                        } else {
                            cy.log(`Failed to create test data: ${response.status}`);
                        }
                    });  
    
                })
    
            })

        })


    }

    //This method publishes job ad draft
    publishJobAd (companyId, jobAdId, domainId, period) {
        //Company id??? Maybe jobadid is enoght
        //Domain id and period are mandatory
        //Method returns publication id 
    }

    //This method creates application to job ad
    createApplication (domainId, companyId, jobAdId, ){
        //Check if jobAdId is enough
        //company_name, job_title, job_location can be fetched in company service with jobAdId (apparently)

    }

}

export const generateTestData = new TestDataGeneration ()