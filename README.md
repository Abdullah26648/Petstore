# Petstore Playwright E2E Test Suite

This repository contains end-to-end (E2E) UI tests for the Petstore application using Playwright. The project is structured for maintainability, scalability, and best practices in test automation.

## Features
- **Playwright Test Framework**: E2E testing with fixtures, expect assertions, and parallelization.
- **Page Object Model (POM)**: All UI interactions are encapsulated in page objects for reusability and clarity.
- **Test Data Management**: Static JSON files are used for negative test scenarios, ensuring deterministic and repeatable tests.
- **Test Tagging**: Tests are tagged as `@smoke`, `@positive`, or `@negative` for easy selection and reporting.
- **Custom Scripts**: NPM scripts allow running tests by tag or in a specific order (smoke → positive → negative).
- **Reporting**: HTML reports are generated for each test group and stored in separate folders for easy access.
- **Best Practices**: Includes global setup, authentication state reuse, and robust selectors.

## Project Structure
```
assets/           # Pet images for test data
fixtures/         # Custom Playwright fixtures
pages/            # Page Object Model classes
setup/            # Global setup scripts
utils/            # Utilities and data providers
data/             # Static test data (e.g., negativePetData.json)
tests/            # Test specs (addPet.spec.ts, listPets.spec.ts, etc.)
reports/          # HTML reports for each test group
playwright.config.ts # Playwright configuration
package.json      # NPM scripts and dependencies
```

## How to Run Tests
1. **Install dependencies:**
   ```
   npm install
   ```
2. **Install Playwright browsers:**
   ```
   npx playwright install --with-deps
   ```
3. **Run all tests in default mode:**
   ```
   npm test
   ```
4. **Run tests by tag:**
   - Smoke tests: `npm run smoke`
   - Positive tests: `npm run positive`
   - Negative tests: `npm run negative`
5. **Run tests in order (smoke → positive → negative, each sequentially):**
   ```
   npm run test:ordered
   ```
   - Each group will run with a single worker for sequential execution.
6. **View Reports:**
   - After running `test:ordered`, open the HTML reports in `reports/smoke`, `reports/positive`, and `reports/negative`.
   - Or run `npm run report` to open the latest report (overwrites previous by default).
## CI/CD Notes

For CI environments (GitHub Actions, Bitbucket Pipelines), add a step to install Playwright browsers before running tests:

```
npx playwright install --with-deps
```

**GitHub Actions:**
```yaml
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
```

**Bitbucket Pipelines:**
```yaml
    script:
      - npm ci
      - npx playwright install --with-deps
      - npm run test:ordered
```

## Tagging and Test Selection
- Tests are tagged in their titles, e.g.:
  ```js
  test('[@smoke][@positive] should add a new pet', async () => { ... })
  ```
- Use `--grep @tag` to run only tests with a specific tag.

## Best Practices Followed
- All UI actions use public helpers in page objects.
- Static data is used for negative tests to ensure repeatability.
- Test scripts are DRY and maintainable.
- Reports are separated for each test group.

## Customization
- Update `playwright.config.ts` for base URL, reporters, or other settings.
- Add new tags as needed for your workflow.

