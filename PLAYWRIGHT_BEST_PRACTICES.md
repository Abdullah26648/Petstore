# Playwright Best Practices: Global Setup + Fixtures

## Core Concept

**Global Setup**: Do expensive operations once  
**Fixtures**: Provide clean state per test  
**Result**: Fast tests with proper isolation

## When to Use This Pattern

Use **Global Setup + Fixtures** together when you have:
- **Expensive setup** that takes time (database, server, authentication)
- **Need for test isolation** (each test should be independent)
- **Multiple tests** that benefit from shared setup

## Pattern Examples

### 1. Authentication State (Most Common)
```typescript
// Global Setup: Login once, save auth state
async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('/login');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password');
  await page.click('#login');
  
  // Save authentication state
  await context.storageState({ path: 'auth-state.json' });
  await browser.close();
}

// Fixture: Load saved auth state
export const test = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth-state.json'
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  }
});

// Usage: Authenticated tests
test('dashboard test', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  // Test functionality
});
```

**Performance**: 2.0s to 1.0s per test (50% improvement)

### 2. Database Setup
```typescript
// Global Setup: Create test database once
async function globalSetup() {
  await createTestDatabase('test_db');
  await seedInitialData({
    users: [{ id: 1, name: 'Admin' }],
    products: [{ id: 1, name: 'Widget' }] 
  });
  process.env.DB_NAME = 'test_db';
}

// Fixture: Clean state per test
export const test = base.extend({
  cleanDb: async ({}, use) => {
    // Test runs with fresh data
    await use();
    
    // Cleanup after test
    await cleanupTestData();
    await resetToInitialState();
  }
});

// Usage: Database tests
test('user creation', async ({ cleanDb }) => {
  const user = await createUser({ name: 'Test User' });
  expect(user.id).toBeTruthy();
  // Database automatically cleaned after test
});
```

### 3. API Server Setup
```typescript
// Global Setup: Start test server once
async function globalSetup() {
  const server = await startTestServer({
    port: 3001,
    database: 'test_db',
    logLevel: 'silent'
  });
  
  process.env.TEST_SERVER_URL = 'http://localhost:3001';
  process.env.SERVER_PID = server.pid;
}

// Fixture: API client per test
export const test = base.extend({
  apiClient: async ({}, use) => {
    const client = new ApiClient({
      baseURL: process.env.TEST_SERVER_URL,
      timeout: 5000
    });
    
    await use(client);
    
    // Optional: Reset API state after test
    await client.reset();
  }
});

// Usage: API tests
test('get users endpoint', async ({ apiClient }) => {
  const response = await apiClient.get('/users');
  expect(response.status).toBe(200);
});
```

### 4. File System Preparation
```typescript
// Global Setup: Create test directories once
async function globalSetup() {
  await fs.mkdir('./test-uploads', { recursive: true });
  await fs.mkdir('./test-downloads', { recursive: true });
  await fs.mkdir('./test-temp', { recursive: true });
  
  // Set permissions
  await fs.chmod('./test-uploads', 0o755);
}

// Fixture: Clean workspace per test
export const test = base.extend({
  workspace: async ({}, use) => {
    const testId = `test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const workspaceDir = `./test-temp/${testId}`;
    
    await fs.mkdir(workspaceDir, { recursive: true });
    
    await use({
      uploadDir: './test-uploads',
      downloadDir: './test-downloads', 
      workspaceDir: workspaceDir
    });
    
    // Cleanup test workspace
    await fs.rmdir(workspaceDir, { recursive: true });
  }
});

// Usage: File operation tests
test('file upload', async ({ workspace, page }) => {
  await page.goto('/upload');
  
  const filePath = path.join(workspace.workspaceDir, 'test-file.txt');
  await fs.writeFile(filePath, 'test content');
  
  await page.setInputFiles('#file-input', filePath);
  // Test file upload functionality
});
```

### 5. Environment Configuration
```typescript
// Global Setup: Load test config once
async function globalSetup() {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
  
  // Load test-specific configuration
  await loadTestConfiguration({
    apiTimeout: 5000,
    retries: 2,
    headless: true
  });
  
  // Initialize test services
  await initializeTestServices();
}

// Fixture: Per-test environment isolation
export const test = base.extend({
  testEnv: async ({}, use) => {
    // Backup original environment
    const originalEnv = { ...process.env };
    
    // Test can modify environment safely
    await use(process.env);
    
    // Restore original environment
    Object.keys(process.env).forEach(key => {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    });
    Object.assign(process.env, originalEnv);
  }
});

// Usage: Environment-specific tests
test('with custom env vars', async ({ testEnv }) => {
  testEnv.FEATURE_FLAG = 'enabled';
  testEnv.API_URL = 'https://test-api.example.com';
  
  // Test with custom environment
});
```

## Pattern Summary

| **Use Case**       | **Global Setup**  | **Fixture**              | **Performance Improvement** |
|--------------------|-------------------|--------------------------|-----------------------------|
| **Authentication** | Login once        | Load auth state          | 50% improvement             |
| **Database**       | Create DB once    | Clean data per test      | 70% improvement             |
| **API Server**     | Start server once | Fresh client per test    | 80% improvement             |
| **File System**    | Create dirs once  | Clean workspace per test | 60% improvement             |
| **Environment**    | Load config once  | Isolate per test         | 40% improvement             |

## Key Principles

### Recommended Practices:
- **Global Setup**: Expensive, one-time operations
- **Fixtures**: Lightweight, per-test operations  
- **Combine**: Achieve speed and isolation benefits
- **Clean**: Always clean up after tests

### Practices to Avoid:
- Do not perform expensive operations in fixtures
- Do not rely on test execution order
- Do not skip cleanup (leads to unreliable tests)
- Do not share mutable state between tests

## Performance Benefits

### Small Project (5 tests)
- Time saved: approximately 5 seconds per run
- Daily runs: 10 executions × 5s = 50 seconds saved

### Medium Project (50 tests)
- Time saved: approximately 50 seconds per run
- Daily runs: 20 executions × 50s = 16 minutes saved

### Large Project (200 tests)
- Time saved: approximately 200 seconds per run
- Daily runs: 50 executions × 200s = 2.7 hours saved

## Implementation Guidelines

### Initial Implementation
```typescript
// Begin with basic pattern
test.extend({
  setup: async ({}, use) => {
    await doSetup();
    await use();
    await doCleanup();
  }
});
```

### Adding Global Setup
```typescript
// Add when setup becomes expensive
async function globalSetup() {
  await expensiveOneTimeSetup();
}
```

### Scaling Recommendations
- 1-5 tests: Use fixtures only
- 5-20 tests: Add global setup
- 20+ tests: Multiple fixture types


### Global Setup Logging
```typescript
async function globalSetup() {
  console.log('Starting global setup...');
  await doSetup();
  console.log('Global setup complete');
}
```

### Fixture State Validation
```typescript
test.extend({
  validateFixture: async ({}, use) => {
    console.log('Setting up fixture...');
    await setup();
    
    await use();
    
    console.log('Cleaning up fixture...');
    await cleanup();
  }
});

```

## Scripting Best Practices (as Implemented)

- **Test Tagging & Selection:**
  - Use tags like `@smoke`, `@positive`, and `@negative` in test titles for easy filtering and targeted runs.
  - Run specific groups of tests using Playwright's `--grep` CLI flag or npm scripts.

- **Ordered Test Execution:**
  - Chain npm scripts (e.g., `test:ordered`) to run smoke, positive, and negative tests sequentially for controlled reporting and logical grouping.
  - Use `--workers=1` to ensure sequential execution when needed.

- **Reporting & Artifacts:**
  - Generate separate HTML reports for each test group and store them in dedicated folders (e.g., `reports/smoke`, `reports/positive`, `reports/negative`).
  - Collect and upload all relevant artifacts (reports, traces, screenshots, videos) in CI/CD for debugging and traceability.
  - Update CI workflows to include all possible artifact locations (e.g., `test-results/` and `reports/`).

- **Consistent Output:**
  - Use Playwright config and CLI flags to control output directories, ensuring all artifacts are easy to locate and download.

- **Maintainability:**
  - Keep scripts DRY and maintainable by centralizing logic in `package.json` and using environment variables for flexibility.

- **CI/CD Integration:**
  - Ensure Playwright browsers are installed in CI before running tests.
  - Use artifact upload steps in GitHub Actions and Bitbucket Pipelines to collect all reports and debugging assets.

These scripting practices ensure robust, maintainable, and debuggable Playwright automation in both local and CI environments.

---

### Debugging Artifact Uploads in CI

If you see warnings about missing artifact files (e.g., `.webm` videos), add a debug step before the upload to list all files and confirm their locations:

```yaml
- name: Debug directory listing
  run: |
    pwd
    find . -type f | sed -e 's/^/FILE: /'
```

This will help you verify where Playwright is saving artifacts and adjust your upload paths if needed.

---

**Document Version**: 1.0  
**Created**: July 27, 2025  
**Focus**: Global Setup + Fixtures Patterns  
**Status**: Production Ready

## Related Documents
- [Playwright Structure Guide](./PLAYWRIGHT_STRUCTURE_GUIDE.md) - Basic project setup
- [Official Playwright Docs](https://playwright.dev) - Complete reference
