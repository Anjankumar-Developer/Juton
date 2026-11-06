/**
 * JUTON Wholesale Inquiry & RFQ Logic
 * Business rules module for bulk quotations, WhatsApp links, and form validation.
 */

import { EMAIL_REGEX, INDIAN_MOBILE_REGEX } from './auth.js';

export const LOCAL_STORAGE_RFQ_KEY = 'juton_wholesale_rfqs_v1';
export const WHATSAPP_CORPORATE_NUMBER = '919830048821';

export const QUANTITY_TIERS = [
  { id: '50-99', label: '50–99 units (Base Wholesale MOQ)' },
  { id: '100-499', label: '100–499 units (Volume Tier - Save ~12%)' },
  { id: '500-999', label: '500–999 units (Deep Volume Tier - Save ~24%)' },
  { id: '1000+', label: '1,000+ units (Custom Mill Contract & Export Pricing)' }
];

export const PRINTING_OPTIONS = [
  { id: 'screen', label: 'Water-Based Eco Screen Printing (1–4 Colors)' },
  { id: 'foil', label: 'Metallic Foil Stamping (Gold / Silver / Copper)' },
  { id: 'patch', label: 'Debossed Vegan Leatherette / Cotton Patch' },
  { id: 'none', label: 'Plain Natural Jute (Unprinted Natural Texture)' }
];

export const INQUIRY_CATEGORIES = [
  'Shopping Bags',
  'Tote Bags',
  'Gift Bags',
  'Promotional Bags',
  'Custom Printed Bags',
  'Corporate Bags',
  'Multiple Categories / Custom Dimension Project'
];

/**
 * Validates the wholesale bulk inquiry form fields
 * @param {Object} fields
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateInquiryForm(fields = {}) {
  const errors = {};

  const fullName = (fields.fullName || '').trim();
  if (!fullName) {
    errors.fullName = 'Contact person full name is required.';
  } else if (fullName.length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  }

  const companyName = (fields.companyName || '').trim();
  if (!companyName) {
    errors.companyName = 'Company / Enterprise name is required.';
  } else if (companyName.length < 2) {
    errors.companyName = 'Company name must be at least 2 characters.';
  }

  const email = (fields.email || '').trim();
  if (!email) {
    errors.email = 'Corporate work email is required.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address (e.g. procurement@company.com).';
  }

  const mobile = (fields.mobile || '').trim().replace(/[\s-]/g, '');
  if (!mobile) {
    errors.mobile = 'Mobile or WhatsApp number is required for quote dispatch.';
  } else if (!INDIAN_MOBILE_REGEX.test(mobile)) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
  }

  const category = (fields.category || '').trim();
  if (!category) {
    errors.category = 'Please select a product category.';
  }

  const quantity = (fields.quantity || '').trim();
  if (!quantity) {
    errors.quantity = 'Please select an estimated order quantity.';
  }

  const printing = (fields.customPrinting || '').trim();
  if (!printing) {
    errors.customPrinting = 'Please select your custom branding requirement.';
  }

  const city = (fields.deliveryCity || '').trim();
  if (!city) {
    errors.deliveryCity = 'Destination delivery city is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Generates official RFQ reference number
 * @returns {string} e.g. JTN-RFQ-2026-4821
 */
export function generateInquiryRef() {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `JTN-RFQ-2026-${suffix}`;
}

/**
 * Builds pre-populated WhatsApp click-to-chat URL for commercial desk
 * @param {Object} data
 * @returns {string}
 */
export function buildWhatsAppInquiryUrl(data = {}) {
  const company = data.companyName || 'Business Buyer';
  const person = data.fullName || 'Purchasing Manager';
  const product = data.productName || data.category || 'Wholesale Jute Bags';
  const qty = data.quantity || '100+ units';
  const city = data.deliveryCity || 'India';
  const printing = data.customPrinting || 'Standard';

  const message = [
    `*JUTON Commercial Wholesale Inquiry*`,
    `Company: ${company}`,
    `Contact: ${person}`,
    `Product Requirement: ${product}`,
    `Estimated Volume: ${qty}`,
    `Branding/Printing: ${printing}`,
    `Delivery Destination: ${city}`,
    `Please provide factory quotation, GST matrix, and digital proofing timeline.`
  ].join('\n');

  return `https://wa.me/${WHATSAPP_CORPORATE_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Serializes inquiry payload ready for REST/Supabase backend API
 * @param {Object} fields
 * @param {string} referenceId
 * @returns {Object}
 */
export function serializeInquiryForApi(fields = {}, referenceId = '') {
  return {
    reference_id: referenceId || generateInquiryRef(),
    full_name: fields.fullName?.trim(),
    company_name: fields.companyName?.trim(),
    email: fields.email?.trim().toLowerCase(),
    mobile: fields.mobile?.trim(),
    category: fields.category,
    product_id: fields.productId || null,
    product_name: fields.productName || null,
    estimated_quantity: fields.quantity,
    custom_printing: fields.customPrinting,
    delivery_city: fields.deliveryCity?.trim(),
    additional_requirements: fields.additionalRequirements?.trim() || null,
    status: 'received_pending_quote',
    source: 'web_wholesale_inquiry',
    created_at: new Date().toISOString()
  };
}
