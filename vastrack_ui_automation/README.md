# Routag dashboard – UI automation (Task C)

Playwright + JavaScript (page object model) tests for the sandbox dashboard.

## Run (under 5 minutes)
```bash
# 1. start the sandbox (separate terminal)
docker run --rm -p 4000:4000 ghcr.io/vastrack-tech/qa-sandbox:1.0
# 2. install & run
cp .env.example .env      # adjust if needed
npm install
npx playwright install chromium
npm test
npm run report            # optional HTML report
```

## Config (env vars, see `.env.example`)
`BASE_URL`, `BUSINESS_EMAIL`, `BUSINESS_PASSWORD`. No credentials are committed (`.env` is git-ignored).

## Coverage
1. Business creates a delivery: asserts success message, fee (2 kg → ₦1,900.00), row appears with status `pending`, form resets.
2. Validation: all 8 required fields show their messages on empty submit; a single missing field shows only its own error and creates nothing; whitespace-only counts as missing.

## Design
- Page object (`tests/pages/` (LoginPage, DeliveryPage); test data in `test-data/deliveryData.js`; spec: `tests/createDelivery.spec.js`), `data-testid` locators, web-first assertions – no fixed sleeps.
- Each test logs in fresh and uses unique data, so tests are independent and parallel-safe.

## Assumptions / with more time
- Assumed the sandbox is running at `BASE_URL`; the dashboard creates **and publishes** in one action, so the expected status is `pending`.
- Bonus (status after courier acceptance via API, wallet balance after delivery) not done.
- AI use: Claude Code helped write these tests; I ran them against the sandbox (4/4 pass).
