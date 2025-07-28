import { faker } from '@faker-js/faker';

export interface PetData {
  name: string;
  status?: 'available' | 'pending' | 'sold';
  category?: string;
  tags?: string[];
  imagePath?: string;
}

export class PetFaker {
  // Generate a random pet with a forced name (for negative/edge cases)
  static generateRandomPetWithName(name: string): PetData {
    const petTypes = Object.keys(this.PET_TYPES) as Array<keyof typeof this.PET_TYPES>;
    const selectedType = faker.helpers.arrayElement(petTypes);
    const petConfig = this.PET_TYPES[selectedType];
    return {
      name,
      status: faker.helpers.arrayElement(['available', 'pending', 'sold']),
      category: selectedType,
      tags: this.generateValidTags(petConfig.tags),
      imagePath: faker.helpers.arrayElement(petConfig.images)
    };
  }
  // Define pet types with their corresponding images and tags
  // Note: Tags are always selected from the corresponding pet type's tag list below (not random words)
  private static readonly PET_TYPES = {
    Dog: {
      images: ['./assets/pet-dog-1.jpg', './assets/pet-dog-2.jpg'],
      tags: ['loyal', 'energetic', 'friendly', 'trained', 'outdoor', 'guard']
    },
    Cat: {
      images: ['./assets/pet-cat-1.jpg', './assets/pet-cat-2.jpg'],
      tags: ['independent', 'quiet', 'indoor', 'cuddly', 'playful', 'clean']
    },
    Bird: {
      images: ['./assets/pet-bird-1.jpg'],
      tags: ['colorful', 'vocal', 'intelligent', 'social', 'active', 'musical']
    },
    Rabbit: {
      images: ['./assets/pet-rabbit-1.jpg'],
      tags: ['gentle', 'quiet', 'soft', 'indoor', 'herbivore', 'hopping']
    },
    Fish: {
      images: ['./assets/pet-fish-1.jpg'],
      tags: ['peaceful', 'aquatic', 'colorful', 'low-maintenance', 'decorative', 'swimming']
    },
    Hamster: {
      images: ['./assets/pet-hamster-1.jpg'],
      tags: ['small', 'active', 'nocturnal', 'curious', 'furry', 'pocket-sized']
    }
  };

  // Generate pet name that meets minimum 3 character requirement
  private static generateValidPetName(): string {
    let name = faker.person.firstName();
    // Ensure name is at least 3 characters long
    while (name.length < 3) {
      name = faker.person.firstName();
    }
    return name;
  }

  // Generate valid tags that meet minimum 3 character requirement
  private static generateValidTags(availableTags: string[]): string[] {
    const validTags = availableTags.filter(tag => tag.length >= 3);
    return faker.helpers.arrayElements(validTags, { min: 1, max: 3 });
  }

  // Generate a single random pet (randomly selects type) with image
  static generateRandomPet(): PetData {
    const petTypes = Object.keys(this.PET_TYPES) as Array<keyof typeof this.PET_TYPES>;
    const selectedType = faker.helpers.arrayElement(petTypes);
    const petConfig = this.PET_TYPES[selectedType];
    
    return {
      name: this.generateValidPetName(),
      status: faker.helpers.arrayElement(['available', 'pending', 'sold']),
      category: selectedType,
      tags: this.generateValidTags(petConfig.tags),
      imagePath: faker.helpers.arrayElement(petConfig.images)
    };
  }

}
