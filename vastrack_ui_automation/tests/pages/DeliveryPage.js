// Page object for the "Create delivery" form and the deliveries table
class DeliveryPage {
  // Receive the Playwright page and define all locators once
  constructor(page) {
    // Keep a reference to the page for dynamic locators
    this.page = page;
    // Pickup name input
    this.pickupName = page.getByTestId('pickup-name');
    // Pickup phone input
    this.pickupPhone = page.getByTestId('pickup-phone');
    // Pickup address input
    this.pickupAddress = page.getByTestId('pickup-address');
    // Drop-off name input
    this.dropoffName = page.getByTestId('dropoff-name');
    // Drop-off phone input
    this.dropoffPhone = page.getByTestId('dropoff-phone');
    // Drop-off address input
    this.dropoffAddress = page.getByTestId('dropoff-address');
    // Package description input
    this.description = page.getByTestId('package-description');
    // Package weight input
    this.weight = page.getByTestId('package-weight');
    // "Create and publish delivery" button
    this.submitButton = page.getByTestId('delivery-submit');
    // Green success message
    this.successMessage = page.getByTestId('delivery-success');
    // General red error message
    this.errorMessage = page.getByTestId('delivery-error');
    // All rows in the deliveries table
    this.rows = page.getByTestId('delivery-row');
  }

  // Locator for the validation error under a field (e.g. 'pickup-name' -> 'pickup-name-error')
  fieldError(fieldId) { return this.page.getByTestId(`${fieldId}-error`); }
  // Locator for an input by its test id
  field(fieldId) { return this.page.getByTestId(fieldId); }
  // Locator for the table row containing the given address text
  rowByAddress(address) { return this.rows.filter({ hasText: address }); }

  // Fill every field of the form from a data object
  async fillForm(d) {
    // Pickup details
    await this.pickupName.fill(d.pickupName);
    await this.pickupPhone.fill(d.pickupPhone);
    await this.pickupAddress.fill(d.pickupAddress);
    // Drop-off details
    await this.dropoffName.fill(d.dropoffName);
    await this.dropoffPhone.fill(d.dropoffPhone);
    await this.dropoffAddress.fill(d.dropoffAddress);
    // Package details
    await this.description.fill(d.description);
    await this.weight.fill(d.weight);
  }

  // Click the submit button
  async submit() { await this.submitButton.click(); }

  // Fill the form and submit it in one step
  async createDelivery(d) {
    // Enter all the data
    await this.fillForm(d);
    // Submit the form
    await this.submit();
  }
}

// Export the class so specs can import it
module.exports = { DeliveryPage };
