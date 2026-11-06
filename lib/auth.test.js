import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateShippingAddress,
  generateDemoOrderNumber,
  INDIAN_PIN_REGEX,
  INDIAN_MOBILE_REGEX,
  INDIAN_STATES
} from './auth.js';

test('validateRegistration requires valid name, email, mobile, and matching password', () => {
  const invalid = validateRegistration({});
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.mobile);
  assert.ok(invalid.errors.password);

  const mismatched = validateRegistration({
    fullName: 'Ananya Sen',
    email: 'ananya@juton.in',
    mobile: '9830048821',
    password: 'password123',
    confirmPassword: 'differentPassword'
  });
  assert.equal(mismatched.valid, false);
  assert.equal(mismatched.errors.confirmPassword, 'Passwords do not match.');

  const valid = validateRegistration({
    fullName: 'Ananya Sen',
    businessName: 'Kolkata Sustainable Boutiques',
    email: 'ananya@juton.in',
    mobile: '+91 98300 48821',
    password: 'securePass2026',
    confirmPassword: 'securePass2026'
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('validateLogin rejects malformed emails and short passwords', () => {
  const empty = validateLogin({});
  assert.equal(empty.valid, false);
  assert.ok(empty.errors.email);
  assert.ok(empty.errors.password);

  const shortPass = validateLogin({
    email: 'valid@company.in',
    password: '123'
  });
  assert.equal(shortPass.valid, false);
  assert.ok(shortPass.errors.password);

  const valid = validateLogin({
    email: 'valid@company.in',
    password: 'password123'
  });
  assert.equal(valid.valid, true);
});

test('validateForgotPassword requires valid email', () => {
  assert.equal(validateForgotPassword('').valid, false);
  assert.equal(validateForgotPassword('invalid-email').valid, false);
  assert.equal(validateForgotPassword('trade@company.in').valid, true);
});

test('validateShippingAddress enforces Indian delivery constraints and 6-digit PIN', () => {
  const empty = validateShippingAddress({});
  assert.equal(empty.valid, false);
  assert.ok(empty.errors.houseBuilding);
  assert.ok(empty.errors.street);
  assert.ok(empty.errors.city);
  assert.ok(empty.errors.state);
  assert.ok(empty.errors.pinCode);

  const invalidPin = validateShippingAddress({
    houseBuilding: 'Unit 4',
    street: 'MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '12345' // 5 digits only
  });
  assert.equal(invalidPin.valid, false);
  assert.ok(invalidPin.errors.pinCode);

  const invalidState = validateShippingAddress({
    houseBuilding: 'Unit 4',
    street: 'MG Road',
    city: 'Bengaluru',
    state: 'California',
    pinCode: '560001'
  });
  assert.equal(invalidState.valid, false);
  assert.ok(invalidState.errors.state);

  const valid = validateShippingAddress({
    houseBuilding: 'Building 12, Export Hub',
    street: 'Strand Road, Burrabazar',
    city: 'Kolkata',
    state: 'West Bengal',
    pinCode: '700001'
  });
  assert.equal(valid.valid, true);
});

test('generateDemoOrderNumber produces properly formatted JTN-DEMO string', () => {
  const orderNum = generateDemoOrderNumber();
  assert.match(orderNum, /^JTN-DEMO-2026-\d{4}$/);
});

test('Indian PIN code regex correctly validates 6 digit postal codes', () => {
  assert.equal(INDIAN_PIN_REGEX.test('700001'), true);
  assert.equal(INDIAN_PIN_REGEX.test('110001'), true);
  assert.equal(INDIAN_PIN_REGEX.test('560001'), true);
  assert.equal(INDIAN_PIN_REGEX.test('012345'), false); // Leading zero not valid Indian PIN
  assert.equal(INDIAN_PIN_REGEX.test('12345'), false); // Too short
  assert.equal(INDIAN_PIN_REGEX.test('1234567'), false); // Too long
  assert.equal(INDIAN_PIN_REGEX.test('70000A'), false); // Letters
});

test('INDIAN_STATES covers all major Indian states and territories', () => {
  assert.ok(INDIAN_STATES.includes('West Bengal'));
  assert.ok(INDIAN_STATES.includes('Maharashtra'));
  assert.ok(INDIAN_STATES.includes('Delhi (NCT)'));
  assert.ok(INDIAN_STATES.includes('Karnataka'));
  assert.ok(INDIAN_STATES.includes('Tamil Nadu'));
  assert.ok(INDIAN_STATES.length >= 30);
});
