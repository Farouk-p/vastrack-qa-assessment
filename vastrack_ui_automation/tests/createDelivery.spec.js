// Import Playwright's test runner and its assertion library
const { test, expect } = require('@playwright/test');
// Import the page object that handles logging in
const { LoginPage } = require('./pages/LoginPage');
// Import the page object that handles the create-delivery form and list
const { DeliveryPage } = require('./pages/DeliveryPage');
// Import test data (required fields, fee helper, delivery generator, credentials) from the separate folder
const { requiredFields, expectedFee, validDelivery, credentials } = require('../test-data/deliveryData');

// Group all the tests below under the name "createDelivery"
test.describe('createDelivery', () => {
  // Shared variable holding the DeliveryPage object for the current test
  let delivery;

  // Run before every test so each test starts logged in and independent
  test.beforeEach(async ({ page }) => {
    // Open the dashboard and log in as the business user (waits until the wallet has loaded)
    await new LoginPage(page).login(credentials());
    // Create the delivery page object bound to this test's browser page
    delivery = new DeliveryPage(page);
  });

  // Scenario 1: happy path
  test('business successfully creates a delivery', async () => {
    // Generate a valid delivery with unique addresses
    const data = validDelivery();
    // Fill in the form and click "Create and publish delivery"
    await delivery.createDelivery(data);

    // Work out the expected fee for the weight entered (1500 + 200 x kg)
    const fee = expectedFee(Number(data.weight));
    // The success banner should say a delivery was created
    await expect(delivery.successMessage).toContainText(/Delivery .+ created/);
    // The success banner should show the correct fee
    await expect(delivery.successMessage).toContainText(fee);
    // No general error should be displayed
    await expect(delivery.errorMessage).toBeEmpty();

    // Find the new delivery's row in the table using its unique drop-off address
    const row = delivery.rowByAddress(data.dropoffAddress);
    // Exactly one matching row should exist
    await expect(row).toHaveCount(1);
    // The delivery should be published, so its status is "pending"
    await expect(row.getByTestId('delivery-status')).toHaveText('pending');
    // The row should show the same fee
    await expect(row).toContainText(fee);

    // The form should be cleared after success: pickup name is empty
    await expect(delivery.pickupName).toHaveValue('');
    // The form should be cleared after success: weight is empty
    await expect(delivery.weight).toHaveValue('');
  });

  // Scenario 2: submitting an empty form
  test('shows validation errors for every missing required field', async () => {
    // Click submit without filling anything in
    await delivery.submit();
    // Loop over every required field and its expected message
    for (const [id, message] of requiredFields) {
      // Each field's error element must show exactly its message
      await expect(delivery.fieldError(id)).toHaveText(message);
    }
    // Nothing should have been created, so there is no success message
    await expect(delivery.successMessage).toBeEmpty();
  });

  // Only one field missing: only that field should complain
  test('shows an error only for the single missing field', async () => {
    // Generate valid data
    const data = validDelivery();
    // Fill the whole form
    await delivery.fillForm(data);
    // Remove just the drop-off phone
    await delivery.dropoffPhone.clear();
    // Try to submit
    await delivery.submit();

    // The drop-off phone field shows its error
    await expect(delivery.fieldError('dropoff-phone')).toHaveText('Drop-off phone is required');
    // Loop over all the other required fields
    for (const [id] of requiredFields.filter(([id]) => id !== 'dropoff-phone')) {
      // None of them should show an error
      await expect(delivery.fieldError(id)).toBeEmpty();
    }
    // No delivery with this address should have been created
    await expect(delivery.rowByAddress(data.dropoffAddress)).toHaveCount(0);
  });

  // A value of only spaces should count as empty
  test('whitespace-only values are treated as missing', async () => {
    // Fill the form with valid data but spaces in the pickup name
    await delivery.fillForm(validDelivery({ pickupName: '   ' }));
    // Try to submit
    await delivery.submit();
    // The pickup name field should show its required error
    await expect(delivery.fieldError('pickup-name')).toHaveText('Pickup name is required');
  });
});
