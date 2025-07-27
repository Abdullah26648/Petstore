import { test, expect } from '../fixtures/baseTest';
import { PetFaker } from '../utils/petDataProvider';
import { CreatedPetsTracker } from '../utils/createdPetsTracker';

test.describe('Add Pet Tests', () => {
  
  test.beforeEach(async () => {
    // Clear any previously stored pets for clean test state
    CreatedPetsTracker.clearAllPets();
  });

  test('Create a random pet successfully', async ({ petsPage }) => {
    // Generate random pet data (could be dog, cat, bird, rabbit, fish, or hamster)
    const petData = PetFaker.generateRandomPet();
    console.log('Creating random pet with data:', petData);

    // Navigate to pets page
    await petsPage.goToPets();

    // Create the pet and get the actual data used
    const createdPetData = await petsPage.createNewPet(petData);

    // Store the created pet for verification
    const storedPet = CreatedPetsTracker.storePet(createdPetData);

    // Verify pet was created successfully
    expect(storedPet.name).toBe(petData.name);
    expect(storedPet.category).toBe(petData.category);
    expect(storedPet.status).toBe(petData.status);
    expect(storedPet.name.length).toBeGreaterThanOrEqual(3);
    
    console.log(`Random pet "${storedPet.name}" (${storedPet.category}) created successfully`);
    console.log(`Image uploaded: ${storedPet.imageUploaded}`);
  });

  test('Create multiple random pets successfully', async ({ petsPage }) => {
    // Generate multiple random pets
    const petDataArray = PetFaker.generateMultipleRandomPets(3);
    console.log('Creating multiple random pets:', petDataArray.map(p => `${p.name} (${p.category})`));

    // Navigate to pets page
    await petsPage.goToPets();

    // Create each pet and track them
    for (const petData of petDataArray) {
      const createdPetData = await petsPage.createNewPet(petData);
      CreatedPetsTracker.storePet(createdPetData);
    }

    // Verify all pets are tracked
    expect(CreatedPetsTracker.getCount()).toBe(3);
    
    // Log all created pets
    const allPets = CreatedPetsTracker.getAllCreatedPets();
    console.log(`Successfully created and tracked ${allPets.length} pets:`);
    allPets.forEach(pet => {
      console.log(`  - ${pet.name} (${pet.category}) - Image: ${pet.imageUploaded}`);
    });
  });

  test.afterEach(async () => {
    // Log final state for debugging
    const petCount = CreatedPetsTracker.getCount();
    if (petCount > 0) {
      console.log(`Test completed with ${petCount} pets tracked`);
    }
  });
});