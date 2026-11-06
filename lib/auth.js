/**
 * JUTON Authentication, Validation & Demo Checkout Logic
 * Pure business rules module for mock authentication and Indian delivery address validation.
 */

// Regex patterns for Indian postal and telecommunications format
export const INDIAN_PIN_REGEX = /^[1-9][0-9]{5}$/;
export const INDIAN_MOBILE_REGEX = /^(?:(?:\+|0{0,2})91[\s-]?)?[6-9]\d{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const LOCAL_STORAGE_AUTH_KEY = 'juton_auth_user_v1';
export const LOCAL_STORAGE_ORDERS_KEY = 'juton_demo_orders_v1';

/**
 * Standard Demo User for rapid preview testing
 */
export const DEMO_USER = {
  id: 'usr_demo_001',
  fullName: 'Vikramaditya Roy',
  businessName: 'Bengal Organic Grocers Private Limited',
  email: 'procurement@bengalorganics.in',
  mobile: '9830048821',
  gstin: '19AAACB1234F1Z5',
  createdAt: '2026-02-10T09:30:00Z',
  address: {
    houseBuilding: 'Godown 4B, Golden Fiber Logistics Hub',
    street: 'Strand Bank Road, Posta',
    city: 'Kolkata',
    state: 'West Bengal',
    pinCode: '700001'
  }
};

/**
 * Validates registration input
 * @param {Object} fields
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateRegistration(fields = {}) {
  const errors = {};

  const fullName = (fields.fullName || '').trim();
  if (!fullName) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  const email = (fields.email || '').trim();
  if (!email) {
    errors.email = 'Corporate or personal email is required.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address (e.g. buyer@company.in).';
  }

  const mobile = (fields.mobile || '').trim().replace(/[\s-]/g, '');
  if (!mobile) {
    errors.mobile = 'Mobile number is required for dispatch updates.';
  } else if (!INDIAN_MOBILE_REGEX.test(mobile)) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).';
  }

  const password = fields.password || '';
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  const confirmPassword = fields.confirmPassword || '';
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates login input
 * @param {Object} fields
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateLogin(fields = {}) {
  const errors = {};

  const email = (fields.email || '').trim();
  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  const password = fields.password || '';
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates forgot password email
 * @param {string} email
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateForgotPassword(email = '') {
  const cleaned = (email || '').trim();
  if (!cleaned) {
    return { valid: false, error: 'Please enter your registered email address.' };
  }
  if (!EMAIL_REGEX.test(cleaned)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true, error: null };
}

/**
 * Validates Indian shipping address
 * @param {Object} address
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateShippingAddress(address = {}) {
  const errors = {};

  const houseBuilding = (address.houseBuilding || '').trim();
  if (!houseBuilding) {
    errors.houseBuilding = 'House / flat / building name or floor is required.';
  }

  const street = (address.street || '').trim();
  if (!street) {
    errors.street = 'Street name, industrial estate, or landmark is required.';
  }

  const city = (address.city || '').trim();
  if (!city) {
    errors.city = 'City or district is required.';
  }

  const state = (address.state || '').trim();
  if (!state) {
    errors.state = 'State / Union Territory selection is required.';
  } else if (!INDIAN_STATES.includes(state)) {
    errors.state = 'Please select a valid Indian State or Union Territory.';
  }

  const pinCode = (address.pinCode || '').trim();
  if (!pinCode) {
    errors.pinCode = '6-digit Indian PIN code is required.';
  } else if (!INDIAN_PIN_REGEX.test(pinCode)) {
    errors.pinCode = 'Enter a valid 6-digit Indian postal PIN code (e.g. 700001).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Generates formatted demo order number
 * @returns {string} e.g. JTN-DEMO-2026-7842
 */
export function generateDemoOrderNumber() {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `JTN-DEMO-2026-${suffix}`;
}

/**
 * Formats Indian phone for display
 * @param {string} phone
 * @returns {string}
 */
export function formatIndianPhone(phone = '') {
  const digits = String(phone).replace(/\D/g, '').slice(-10);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}
