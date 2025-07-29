import negativePetData from '../data/negativePetData.json';
import { PetFaker } from '../utils/petDataProvider';
import { test, expect } from '../fixtures/baseTest';
import { CreatedPetsTracker } from '../utils/createdPetsTracker';

test.describe('Add Pet Tests', () => {
  
  test.beforeEach(async () => {
    // Clear any previously stored pets for clean test state
    CreatedPetsTracker.clearAllPets();
  });

  test(' [@positive] Create a random pet successfully', async ({ petsPage }) => {
    // Generate random pet data (could be dog, cat, bird, rabbit, fish, or hamster)
    const petData = PetFaker.generateRandomPet();
    console.log('Creating random pet with data:', petData);

    // Navigate to pets page
    await petsPage.goToPets();

    // Create the pet and get the actual data used
    const createdPetData = await petsPage.createNewPet(petData);

    // Store the created pet for verification
    const storedPet = CreatedPetsTracker.storePet(createdPetData);

    // Verify pet was created successfully (data)
    expect(storedPet.name).toBe(petData.name);
    expect(storedPet.category).toBe(petData.category);
    expect(storedPet.status).toBe(petData.status);
    expect(storedPet.name.length).toBeGreaterThanOrEqual(3);

    // UI Verification: Search for the pet and check the table
    await petsPage.selectFindPet();
    await petsPage.selectSearchAttribute('Status');
    await petsPage.clickNextOnSearchDialog();
    await petsPage.selectStatusInSearchDialog(storedPet.status ?? 'available');
    await petsPage.clickSearchOnSearchDialog();
    await petsPage.reverseTableByPetId();
    await expect(petsPage.getFirstPetRowCell('name')).toHaveText(storedPet.name);
    await expect(petsPage.getFirstPetRowCell('category')).toHaveText(storedPet.category ?? '');
    await expect(petsPage.getFirstPetRowCell('status')).toContainText(storedPet.status ?? '');

    console.log(`Random pet "${storedPet.name}" (${storedPet.category}) created successfully`);
    console.log(`Image uploaded: ${storedPet.imageUploaded}`);
  });

  test(' [@negative] Should not allow creating a pet with a 2-character name (static data)', async ({ petsPage }) => {
    // Use static invalid pet data from JSON
    const invalidPet = negativePetData.invalidPet;

    await petsPage.goToPets();
    await petsPage.selectAddNewPet();
    await petsPage.openGeneralInfoSection();
    await petsPage.fillPetName(invalidPet.name);
    await petsPage.selectStatus(invalidPet.status ?? 'available');
    const errorText = await petsPage.getNameFieldError();
    await petsPage.fillPetCategory(invalidPet.category);

    // Assert that the Create button is disabled
    const isCreateEnabled = await petsPage.isCreateButtonEnabled();
    expect(isCreateEnabled).toBe(false);

    // Check for the exact validation error message
    expect(errorText?.trim()).toBe("Your pet's name has to be at least 3 characters long!");
  });

  test.afterEach(async () => {
    // Log final state for debugging
    const petCount = CreatedPetsTracker.getCount();
    if (petCount > 0) {
      console.log(`Test completed with ${petCount} pets tracked`);
    }
  });
});