import { test, expect } from '../fixtures/baseTest';

test.describe('List Pets Tests', () => {

  test('List all available pets', async ({  petsPage }) => {
    // Navigate to pets page
    await petsPage.goToPets();

    // Open the search dialog and search for available pets
    await petsPage.selectFindPet();
    await petsPage.selectSearchAttribute('Status');
    await petsPage.clickNextOnSearchDialog();
    await petsPage.selectStatusInSearchDialog('available');
    await petsPage.clickSearchOnSearchDialog();

    // Wait for the table to be visible and check that at least one row exists
    const petRows = await petsPage.getPetTableRows();
    const rowCount = await petRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Assert all pets in the table have status 'available'
    for (let i = 0; i < rowCount; i++) {
      const status = await petRows.nth(i).locator('#pet-row__status').textContent();
      expect(status?.toLowerCase()).toContain('available');
      // Optionally, log the names
      const name = await petRows.nth(i).locator('#pet-row__name').textContent();
      console.log(`Available pet: ${name?.trim()}`);
    }
  });
});
