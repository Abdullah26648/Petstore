import { Page, Locator } from '@playwright/test';

export class PetsPage {
  // Locators for the Pets page
  private readonly petsButton: Locator;
  private readonly petsMenuButton: Locator;
  
  // Menu dropdown options
  private readonly findPetMenuItem: Locator;
  private readonly addNewPetMenuItem: Locator;
  private readonly addNewViewMenuItem: Locator;

  // Add Pet Dialog locators
  private readonly addPetDialog: Locator;
  private readonly generalInfoSection: Locator;
  private readonly categorySection: Locator;
  private readonly tagsSection: Locator;
  private readonly imagesSection: Locator;

  // Form fields
  private readonly petNameField: Locator;
  private readonly petStatusDropdown: Locator;
  private readonly categoryNameField: Locator;
  private readonly tagNameField: Locator;
  private readonly addTagButton: Locator;
  private readonly dragDropArea: Locator;
  
  // Dialog buttons
  private readonly closeButton: Locator;
  private readonly createButton: Locator;

  // --- UI Verification Locators ---
  private readonly searchAttributeSelect: Locator;
  private readonly searchNextButton: Locator;
  private readonly searchStatusSelect: Locator;
  private readonly searchSearchButton: Locator;
  private readonly petIdHeader: Locator;
  private readonly petTable: Locator;
  private readonly petTableRows: Locator;

  constructor(private page: Page) {
    this.petsButton = this.page.locator('#navigation__pets');
    this.petsMenuButton = this.page.locator('#menu');
    
    // Menu items (visible after clicking menu button)
    this.findPetMenuItem = this.page.locator('#menu__search');
    this.addNewPetMenuItem = this.page.locator('#menu-add_pet');
    this.addNewViewMenuItem = this.page.locator('#menu__add-view');

    // Add Pet Dialog
    this.addPetDialog = this.page.locator('mat-dialog-container');
    this.generalInfoSection = this.page.locator('mat-expansion-panel').nth(0);
    this.categorySection = this.page.locator('mat-expansion-panel').nth(1);
    this.tagsSection = this.page.locator('mat-expansion-panel').nth(2);
    this.imagesSection = this.page.locator('mat-expansion-panel').nth(3);

    // Form fields
    this.petNameField = this.page.locator('#general_information__pet-name input');
    this.petStatusDropdown = this.page.locator('#general_information__pet-status mat-select');
    this.categoryNameField = this.page.locator('#category__name input');
    this.tagNameField = this.page.locator('#create-tag__name input');
    this.addTagButton = this.page.locator('#create-tag__name button');
    this.dragDropArea = this.page.locator('#images__drag-drop');

    // Dialog buttons
    this.closeButton = this.page.locator('.form__actions button:has-text("CLOSE")');
    this.createButton = this.page.locator('.form__actions button:has-text("CREATE")');

    // --- UI Verification Locators ---
    this.searchAttributeSelect = this.page.locator('#attribute__select');
    this.searchNextButton = this.page.locator('button[matsteppernext]');
    this.searchStatusSelect = this.page.locator('#status__select');
    this.searchSearchButton = this.page.locator('#actions__search');
    this.petIdHeader = this.page.locator('button.mat-sort-header-button:has-text("Pet Id")');
    this.petTable = this.page.locator('table.mat-table');
    this.petTableRows = this.page.locator('#table__pet-row');
  }
  
  async goToPets() {
    await this.petsButton.click();
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    
    // Confirm navigation succeeded by checking URL
    await this.page.waitForURL('**/pets');
  }

  // Menu interaction methods
  async openPetsMenu() {
    await this.petsMenuButton.click();
    // Wait for menu dropdown to appear
    await this.page.waitForSelector('.mat-menu-content', { state: 'visible' });
  }

  async selectFindPet() {
    await this.openPetsMenu();
    await this.findPetMenuItem.click();
    // Wait for the search dialog container to appear
    await this.page.waitForSelector('mat-dialog-container', { state: 'visible', timeout: 10000 });
  }

  async selectAddNewPet() {
    await this.openPetsMenu();
    await this.addNewPetMenuItem.click();
    // Wait for dialog to appear
    await this.addPetDialog.waitFor({ state: 'visible' });
  }

  // Complete pet creation workflow
  async createNewPet(petData: {
    name: string;
    status?: 'available' | 'pending' | 'sold';
    category?: string;
    tags?: string[];
    imagePath?: string;
  }): Promise<{
    name: string;
    status?: 'available' | 'pending' | 'sold';
    category?: string;
    tags?: string[];
    imagePath?: string;
    imageUploaded: boolean;
  }> {
    // Store the actual data used for creation
    const createdPetData = {
      name: petData.name,
      status: petData.status,
      category: petData.category,
      tags: petData.tags ? [...petData.tags] : undefined, // Create copy of tags array
      imagePath: petData.imagePath,
      imageUploaded: false // Track if image was actually uploaded
    };

    // Open the add pet dialog
    await this.selectAddNewPet();
    
    // Fill general information section
    await this.generalInfoSection.locator('mat-expansion-panel-header').click();
    await this.generalInfoSection.locator('.mat-expansion-panel-content').waitFor({ state: 'visible' });
    await this.petNameField.fill(petData.name);
    
    if (petData.status) {
      await this.petStatusDropdown.click();
      await this.page.locator(`mat-option:has-text("${petData.status}")`).click();
    }
    
    // Fill category section
    if (petData.category) {
      await this.categorySection.locator('mat-expansion-panel-header').click();
      await this.categorySection.locator('.mat-expansion-panel-content').waitFor({ state: 'visible' });
      await this.categoryNameField.fill(petData.category);
    }
    
    // Add tags section
    if (petData.tags) {
      await this.tagsSection.locator('mat-expansion-panel-header').click();
      await this.tagsSection.locator('.mat-expansion-panel-content').waitFor({ state: 'visible' });
      
      for (const tag of petData.tags) {
        await this.tagNameField.fill(tag);
        await this.addTagButton.click();
      }
    }
    
    // Simple drag-and-drop image upload
    if (petData.imagePath) {
      await this.imagesSection.locator('mat-expansion-panel-header').click();
      await this.imagesSection.locator('.mat-expansion-panel-content').waitFor({ state: 'visible' });
      
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.resolve(petData.imagePath);
        
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          const fileName = path.basename(filePath);
          const base64Data = fileBuffer.toString('base64');
          
          await this.page.evaluate(({ base64Data, fileName }) => {
            const element = document.querySelector('#images__drag-drop') as HTMLElement;
            if (!element) throw new Error('Drag drop element not found');
            
            // Convert base64 to blob and create file
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            const file = new File([blob], fileName, { type: 'image/jpeg' });
            
            // Create DataTransfer and dispatch drop event
            const dt = new DataTransfer();
            dt.items.add(file);
            const dropEvent = new DragEvent('drop', {
              bubbles: true,
              dataTransfer: dt
            });
            element.dispatchEvent(dropEvent);
          }, { base64Data, fileName });
          
          createdPetData.imageUploaded = true;
          console.log('File uploaded via drag-drop');
        } else {
          createdPetData.imageUploaded = false;
        }
      } catch (error) {
        console.warn('Image upload failed:', error.message);
        createdPetData.imageUploaded = false;
      }
      
      await this.page.waitForTimeout(1000);
    } else {
      createdPetData.imageUploaded = false;
    }
    
    // Create the pet
    // Wait for CREATE button to become enabled (form validation passes)
    await this.createButton.waitFor({ state: 'visible' });
    
    // Wait for the disabled attribute to be removed
    await this.page.waitForFunction(() => {
      const createButton = document.querySelector('.form__actions button:last-child');
      return createButton && !createButton.hasAttribute('disabled');
    }, { timeout: 10000 });
    
    await this.createButton.click();
    await this.addPetDialog.waitFor({ state: 'hidden' });
    
    // Return the pet data that was actually used for creation
    return createdPetData;
  }

  // Keep a simple close dialog method in case needed
  async closeAddPetDialog() {
    await this.closeButton.click();
    await this.addPetDialog.waitFor({ state: 'hidden' });
  }

  async selectAddNewView() {
    await this.openPetsMenu();
    await this.addNewViewMenuItem.click();
    // Wait for navigation or submenu to appear
    await this.page.waitForLoadState('networkidle');
  }

  // --- UI Verification Helpers ---

  // Interact with the search dialog stepper: select attribute, next, select status, search
  async selectSearchAttribute(attribute: string) {
    await this.searchAttributeSelect.hover();
    await this.searchAttributeSelect.click();
    await this.page.locator(`mat-option:has-text("${attribute}")`).click();
  }

  async clickNextOnSearchDialog() {
    await this.searchNextButton.click();
  }

  async selectStatusInSearchDialog(status: string) {
    await this.searchStatusSelect.click();
    // Status options have ids like #select__available, #select__sold, #select__pending
    const optionId = `#select__${status.toLowerCase()}`;
    await this.page.locator(optionId).click();
    // Close the dropdown by pressing Escape (mat-select closes on Escape)
    await this.page.keyboard.press('Escape');
    // No overlay wait: rely on Escape to close dropdown and proceed
  }

  async clickSearchOnSearchDialog() {
    await this.searchSearchButton.click();
    await this.petTable.waitFor({ state: 'visible' });
  }

  async reverseTableByPetId() {
    await this.petIdHeader.dblclick();
    await this.page.waitForTimeout(500);
  }


  getFirstPetRowCell(column: 'name' | 'category' | 'status') {
    // Use unique cell ids for robust access
    const cellIdMap = {
      name: '#pet-row__name',
      category: '#pet-row__category',
      status: '#pet-row__status',
    };
    return this.petTableRows.first().locator(cellIdMap[column]);
  }

  // Public helpers for negative test
  public async openGeneralInfoSection() {
    await this.generalInfoSection.locator('mat-expansion-panel-header').click();
    await this.generalInfoSection.locator('.mat-expansion-panel-content').waitFor({ state: 'visible' });
  }

  public async fillPetName(name: string) {
    await this.petNameField.fill(name);
  }

  public async isCreateButtonEnabled() {
    return this.createButton.isEnabled();
  }

  public async getNameFieldError() {
    // Looks for a mat-error or .error-message near the name field
    const error = this.generalInfoSection.locator('.mat-error, .error-message').first();
    if (await error.isVisible()) {
      return (await error.textContent())?.trim() || null;
    }
    return null;
  }

  // Public method to get all pet table rows
  public getPetTableRows() {
    return this.petTableRows;
  }

  // Public helper to fill the category section
  public async fillPetCategory(category: string) {
    await this.categorySection.locator('mat-expansion-panel-header').click();
    await this.categorySection.locator('.mat-expansion-panel-content').waitFor({ state: 'visible' });
    await this.categoryNameField.fill(category);
  }
}