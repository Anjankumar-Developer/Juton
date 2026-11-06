import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateInquiryForm,
  generateInquiryRef,
  buildWhatsAppInquiryUrl,
  serializeInquiryForApi,
  QUANTITY_TIERS,
  PRINTING_OPTIONS,
  INQUIRY_CATEGORIES,
  WHATSAPP_CORPORATE_NUMBER
} from './inquiry.js';

test('validateInquiryForm rejects missing required fields', () => {
  const empty = validateInquiryForm({});
  assert.equal(empty.valid, false);
  assert.ok(empty.errors.fullName);
  assert.ok(empty.errors.companyName);
  assert.ok(empty.errors.email);
  assert.ok(empty.errors.mobile);
  assert.ok(empty.errors.category);
  assert.ok(empty.errors.quantity);
  assert.ok(empty.errors.customPrinting);
  assert.ok(empty.errors.deliveryCity);
});

test('validateInquiryForm accepts valid wholesale RFQ submission', () => {
  const valid = validateInquiryForm({
    fullName: 'Ananya Sen',
    companyName: 'Bengal Organic Grocers Pvt Ltd',
    email: 'procurement@bengalorganics.in',
    mobile: '9830048821',
    category: 'Shopping Bags',
    quantity: '500-999',
    customPrinting: 'Screen Printing',
    deliveryCity: 'Kolkata',
    additionalRequirements: 'Need 2-color custom logo print and water-resistant starched lining.'
  });

  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('generateInquiryRef creates expected JTN-RFQ-2026 format', () => {
  const ref = generateInquiryRef();
  assert.match(ref, /^JTN-RFQ-2026-\d{4}$/);
});

test('buildWhatsAppInquiryUrl formats valid click-to-chat URL with corporate number', () => {
  const url = buildWhatsAppInquiryUrl({
    companyName: 'FabIndia Retail',
    fullName: 'Rahul Sharma',
    productName: 'The Grand Market Shopping Tote',
    quantity: '1000+',
    customPrinting: 'Metallic Foil Stamping',
    deliveryCity: 'Bengaluru'
  });

  assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_CORPORATE_NUMBER}`));
  assert.ok(url.includes('FabIndia%20Retail'));
  assert.ok(url.includes('The%20Grand%20Market%20Shopping%20Tote'));
  assert.ok(url.includes('1000%2B'));
  assert.ok(url.includes('Bengaluru'));
});

test('serializeInquiryForApi outputs standard API-ready structure with timestamp and status', () => {
  const payload = serializeInquiryForApi({
    fullName: 'Vikramaditya Roy',
    companyName: 'Tata Starbucks India',
    email: 'procurement@starbucks.in',
    mobile: '9820012345',
    category: 'Corporate Bags',
    quantity: '1000+',
    customPrinting: 'Water-Based Eco Screen Printing',
    deliveryCity: 'Mumbai',
    additionalRequirements: 'GOTS certified handles only'
  }, 'JTN-RFQ-2026-9999');

  assert.equal(payload.reference_id, 'JTN-RFQ-2026-9999');
  assert.equal(payload.company_name, 'Tata Starbucks India');
  assert.equal(payload.status, 'received_pending_quote');
  assert.equal(payload.source, 'web_wholesale_inquiry');
  assert.ok(payload.created_at);
});

test('quantity options and printing options cover all prompt requirements', () => {
  const ids = QUANTITY_TIERS.map(t => t.id);
  assert.ok(ids.includes('50-99'));
  assert.ok(ids.includes('100-499'));
  assert.ok(ids.includes('500-999'));
  assert.ok(ids.includes('1000+'));
  assert.equal(QUANTITY_TIERS.length, 4);

  assert.ok(INQUIRY_CATEGORIES.includes('Shopping Bags'));
  assert.ok(INQUIRY_CATEGORIES.includes('Tote Bags'));
  assert.ok(INQUIRY_CATEGORIES.includes('Gift Bags'));
  assert.ok(INQUIRY_CATEGORIES.includes('Corporate Bags'));
});
