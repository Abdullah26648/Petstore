# 🎯 Playwright Basic Project Structure

## Why This Structure?

### Problems with Traditional Approach
```
❌ Hardcoded values scattered everywhere
❌ Same login code repeated in every test  
❌ No centralized data management
❌ Difficult to maintain and update
❌ Environment changes require editing multiple files
```

### Benefits of This Structure
```
✅ Centralized test data in data/ folder
✅ Reusable page objects in pages/ folder
✅ Fixtures eliminate code duplication
✅ Utilities provide common functions
✅ Easy environment switching
✅ Clean and maintainable tests
```

### Key Advantages
- **fixtures/** - Eliminates repetitive setup code
- **pages/** - Reusable page objects with clear methods
- **data/** - Single source of truth for test data
- **utils/** - Common functions used across tests
- **tests/** - Clean, focused test files

## Recommended Structure
```
project-playwright/
├── 📁 fixtures/            # Test fixtures
├── 📁 pages/               # Page objects
├── 📁 setup/               # Global setup
├── 📁 tests/               # Test files
├── 📁 data/                # Test data
├── 📁 utils/               # Utilities
├── 📁 reports/             # Test reports
├── 📁 assets/              # Test assets
├── 📄 playwright.config.ts # Config
├── 📄 package.json         # Dependencies
├── 📄 .gitignore           # Git ignore
└── 📄 .env                 # Environment vars
```

## Quick Setup

### 1. Initialize Project
```bash
mkdir project-playwright
cd project-playwright
npm init -y
npm install -D @playwright/test @types/node typescript
npx playwright install
```

### 2. Create Folders
```bash
mkdir fixtures pages setup tests data utils reports assets
```

### 3. Basic Files

**package.json**
```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

**playwright.config.ts**
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { channel: 'chrome' } },
  ],
});
```

**data/testData.json**
```json
{
  "users": {
    "admin": {
      "username": "admin",
      "password": "password123"
    }
  }
}
```

**utils/dataProvider.ts**
```typescript
import * as fs from 'fs';
import * as path from 'path';

export class DataProvider {
  static getUser(type: string) {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/testData.json'), 'utf8'));
    return data.users[type];
  }
}
```

**pages/loginPage.ts**
```typescript
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('#login');
  }
}
```

**fixtures/baseTest.ts**
```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
```

**tests/login.spec.ts**
```typescript
import { test, expect } from '../fixtures/baseTest';
import { DataProvider } from '../utils/dataProvider';

test('login test', async ({ page, loginPage }) => {
  const user = DataProvider.getUser('admin');
  await page.goto('/');
  await loginPage.login(user.username, user.password);
  await expect(page).toHaveURL('/dashboard');
});
```

**.env**
```
BASE_URL=http://localhost:3000
```

### 4. Run Tests
```bash
npm test
```

That's it! Basic structure is ready. Users can enhance as needed.**

After completing the build, verify your implementation:

```bash
# 1. Structure Validation
ls -la fixtures/ pages/ setup/ tests/ data/ utils/ reports/ assets/

# 2. TypeScript Compilation
npm run type-check

# 3. Test Execution
npm run test:smoke

# 4. Report Generation
npm run allure:generate
```

#### **🚨 Common Issues & Solutions**

**Issue**: `DataProvider.getUser is not a function`
```bash
# Solution: Ensure proper export in dataProvider.ts
export class DataProvider {  // Must be 'export class'
```

**Issue**: `Cannot find module '../fixtures/baseTest'`
```bash
# Solution: Check import paths - ensure relative paths are correct
import { test } from '../fixtures/baseTest';  // Correct path
```

**Issue**: `storageState file not found`
```bash
# Solution: Ensure global setup runs before tests
# Check playwright.config.ts has: globalSetup: 'setup/globalSetup.ts'
```

**Issue**: `Authentication failed in global setup`
```bash
# Solution: Verify data/loginData.json has correct credentials
# Check .env file has correct BASE_URL
```

#### **📊 Success Metrics Tracking**

**Week 1 - Foundation:**
- [ ] All folders created correctly
- [ ] TypeScript compilation successful
- [ ] Basic test execution works

**Week 2 - Implementation:**
- [ ] All fixtures working properly  
- [ ] Data provider loading test data
- [ ] Global setup authenticating successfully

**Week 3 - Optimization:**
- [ ] Test execution time under 2 minutes for smoke tests
- [ ] All utilities functioning correctly
- [ ] Reports generating properly

**Week 4 - Team Adoption:**
- [ ] Team members can write new tests using fixtures
- [ ] Environment switching working seamlessly
- [ ] CI/CD pipeline integrated successfully

### **Build Execution Flow**

#### **Development Workflow:**
```bash
# Day-to-day development cycle
npm run test:headed           # Run tests with browser visible
npm run test:debug           # Debug specific test issues
npm run test:login          # Test specific features
npm run report              # Review detailed test results
```

#### **CI/CD Pipeline:**
```bash
# Continuous Integration flow
npm install                 # Install dependencies
npm run install-browsers   # Install browser binaries
npm test                   # Run full test suite
npm run report             # Generate reports
```

#### **Environment Testing:**
```bash
# Test different environments
BASE_URL=https://staging.app.example.com npm test    # Staging
BASE_URL=https://prod.app.example.com npm test       # Production
```

---

### **Build Success Metrics**

#### **After Following This Guide:**
- **Setup Time**: Faster than traditional approach
- **Test Writing Speed**: Significantly faster than traditional approach
- **Maintenance Time**: Faster updates
- **Environment Flexibility**: Switch environments in seconds
- **Team Collaboration**: Reduced merge conflicts on configuration
- **Type Safety**: Catch errors at compile time
- **Performance**: Tests run faster with global setup

#### **Final Project Structure:**
```
project-playwright/                    # Professional comprehensive structure
├── 📁 fixtures/                       # Custom test fixtures
│   └── baseTest.ts                    # Base test extensions and login operations
├── 📁 pages/                          # Page Object Model
│   ├── loginPage.ts                   # Login page actions and elements
│   └── homePage.ts                    # Home/Dashboard specific actions
├── 📁 setup/                          # Global setup and teardown
│   ├── globalSetup.ts                 # Global authentication setup
│   └── globalTeardown.ts              # Post-test cleanup operations
├── 📁 tests/                          # Test scenarios and specifications
│   ├── login.spec.ts                  # Login functionality tests
│   ├── home.spec.ts                   # Home/Dashboard tests
│   └── ...                            # Other feature-based test files
├── 📁 data/                           # External test data sources
│   └── loginData.json                 # User credentials and test inputs
├── 📁 utils/                          # Utility functions and helpers
│   ├── dataProvider.ts                # Load data from JSON/CSV sources
│   ├── formatOptions.ts               # Date/number/currency formatting
│   ├── randomDataGenerator.ts         # Generate random test data
│   └── helpers.ts                     # General-purpose utility functions
├── 📁 reports/                        # Test reports and results
│   └── allure-results/                # Allure test results for reporting
├── 📁 assets/                         # Static assets for testing
│   ├── images/                        # Test images for upload/validation
│   ├── documents/                     # Test documents (PDFs, Word docs)
│   └── mockData/                      # Mock API responses and fixtures
├── 📄 playwright.config.ts            # Playwright configuration with Allure
├── 📄 tsconfig.json                   # TypeScript configuration
├── 📄 package.json                    # Dependencies and npm scripts
├── 📄 .gitignore                      # Git ignore file for version control
└── 📄 .env                            # Environment variables
```

**This structure provides a professional, scalable, maintainable Playwright test automation framework.**

---

**Document Version**: 1.0  
**Created**: July 24, 2025  
**Status**: Ready for Implementation
