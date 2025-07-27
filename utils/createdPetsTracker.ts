// Simple utility to track created pets for verification
export class CreatedPetsTracker {
  private static createdPets: Array<{
    name: string;
    status?: 'available' | 'pending' | 'sold';
    category?: string;
    tags?: string[];
    imageUploaded: boolean;
  }> = [];

  // Store a created pet
  static storePet(petData: {
    name: string;
    status?: 'available' | 'pending' | 'sold';
    category?: string;
    tags?: string[];
    imageUploaded: boolean;
  }) {
    this.createdPets.push(petData);
    return petData;
  }

  // Get all created pets
  static getAllCreatedPets() {
    return this.createdPets;
  }

  // Clear all pets (for test cleanup)
  static clearAllPets() {
    this.createdPets = [];
  }

  // Get count of pets
  static getCount() {
    return this.createdPets.length;
  }
}
