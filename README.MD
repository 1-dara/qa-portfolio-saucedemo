# QA Portfolio: Sauce Demo Test Automation

Manual and automated testing project targeting [Sauce Demo](https://www.saucedemo.com), a demo e-commerce site built for QA practice.

## What this project demonstrates

- Manual test case design (16 test cases covering login, product listing, cart, and checkout)
- Test automation using Playwright + TypeScript (15 automated tests, all passing)
- CI/CD integration via GitHub Actions (tests run automatically on every push)

## Tech stack

- **Playwright** (TypeScript) — test automation
- **GitHub Actions** — CI/CD pipeline
- **Chrome** (via Playwright’s `channel: 'chrome'`) — browser used for test execution

## Project structure

- `tests/example.spec.ts` — Automated test suite (TC-001 to TC-016)
- `test-plan.pdf` — Manual test plan and results
- `playwright.config.ts` — Playwright configuration
- `.github/workflows/` — CI pipeline configuration

## Running the tests locally

```bash
npm install
npx playwright test
```

## Test coverage

|Area            |Test Cases      |Automated  |
|----------------|----------------|-----------|
|Login           |TC-001 to TC-005|Yes        |
|Product Listing |TC-006 to TC-008|Yes        |
|Cart            |TC-010 to TC-013|Yes        |
|Checkout        |TC-014 to TC-016|Yes        |
|Visual bug check|TC-009          |Manual only|

See `test-plan.pdf` for full manual test case details, including expected/actual results.

## CI/CD

Tests run automatically on every push via GitHub Actions. See the Actions tab for build history.

-----

## How to add this file and push everything to GitHub

These are the exact terminal commands to run, in order, from inside your `qa-portfolio-project1` folder.

### 1. Make sure you’re in the right folder

```bash
cd ~/qa-portfolio-project1
```

### 2. Confirm this README.md file and your test-plan.pdf are both sitting in that folder

```bash
ls
```

You should see `README.md`, `test-plan.pdf`, `tests`, `playwright.config.ts`, `package.json` in the list.

### 3. Check what Git sees as changed

```bash
git status
```

This should list `README.md`, `test-plan.pdf`, and any changed test files in red (meaning: not yet staged).

### 4. Stage everything

```bash
git add .
```

### 5. Commit with a message

```bash
git commit -m "Add full automated test suite, test plan, and README"
```

### 6. Push to GitHub

```bash
git push
```

### 7. Verify on GitHub

Go to your repo in the browser:

```
https://github.com/1-dara/qa-portfolio-saucedemo
```

You should now see:

- The README rendering nicely on the main page
- `test-plan.pdf` listed in the files
- A green checkmark on the **Actions** tab (confirms CI passed)

If `git status` in step 3 shows anything unexpected, stop and paste that output before continuing to step 4.