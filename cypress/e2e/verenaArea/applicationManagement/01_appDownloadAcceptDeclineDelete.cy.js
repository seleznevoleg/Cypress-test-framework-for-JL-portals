/// <reference types="cypress" />

import { generateTestData } from "../../../support/testDataGeneration"

describe('Verena application management', () => {
    beforeEach('Setting up test data: creating job ad, publication & application, asserting it in Verena area', () => {
        //We have a test company id.
        //Via API creating job ad and publication, asserting it
        //Creating job ad
        generateTestData.createJobAdDraft()
        //Via API creating application, asserting it
    })

    it('Page validation: application list, filters', () => {
        //code
    })

    it('Case no. 2', () => {
        //code
    })

    it('Case no. 3', () => {
        //code
    })

    // afterEach('Clean up the test data', () => {
    //     //Asserting that application was deleted (soft deletion is enough)
    //     //Removing job ad and publication
    // })
})