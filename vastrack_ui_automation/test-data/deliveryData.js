// Test data for delivery scenarios. Kept separate from tests and page objects.

// Required fields: data-testid prefix -> the validation message expected when it is empty
const requiredFields = [
  // Pickup section
  ['pickup-name', 'Pickup name is required'],
  ['pickup-phone', 'Pickup phone is required'],
  ['pickup-address', 'Pickup address is required'],
  // Drop-off section
  ['dropoff-name', 'Drop-off name is required'],
  ['dropoff-phone', 'Drop-off phone is required'],
  ['dropoff-address', 'Drop-off address is required'],
  // Package section
  ['package-description', 'Package description is required'],
  ['package-weight', 'Weight is required'],
];

// Fee rule from the brief (1500 + 200 x kg), formatted like the dashboard (e.g. "1,900.00")
const expectedFee = (weightKg) => (1500 + 200 * weightKg).toLocaleString('en-NG', { minimumFractionDigits: 2 });

// Build a valid delivery; unique addresses per call stop tests colliding; overrides change specific fields
function validDelivery(overrides = {}) {
  // Unique suffix from timestamp plus a random number
  const n = `${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
  // Return the delivery details
  return {
    pickupName: 'Ada Store',
    pickupPhone: '08031234567',
    pickupAddress: `12 Allen Ave, Ikeja ${n}`,
    dropoffName: 'Tunde Bello',
    dropoffPhone: '08099887766',
    dropoffAddress: `5 Admiralty Way, Lekki ${n}`,
    description: 'Box of shoes',
    weight: '2',
    // Apply any overrides last so they win
    ...overrides,
  };
}

// Login credentials from environment variables, with sandbox defaults
const credentials = () => ({
  email: process.env.BUSINESS_EMAIL || 'business1@sandbox.test',
  password: process.env.BUSINESS_PASSWORD || 'Password123!',
});

// Export everything the tests need
module.exports = { requiredFields, expectedFee, validDelivery, credentials };
