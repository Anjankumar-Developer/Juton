import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWholesalePrice, validateInquiry } from './pricing.js';
import { products, CATEGORIES, getProductById, filterAndSortProducts } from '../data/products.js';

const mockDemoProduct = {
  id: 'demo-bag',
  name: 'Demo Jute Bag',
  moq: 50,
  priceINR: 145,
  priceUSD: 3.50,
  pricingTiersINR: [
    { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 165 },
    { min: 100, max: 499, label: '100–499 units (Discounted)', price: 145 },
    { min: 500, max: null, label: '500+ units (Custom quotation)', price: 125 },
  ],
};

test('calculateWholesalePrice calculates 3-tier quantity-based demo pricing accurately', () => {
  // Below MOQ
  const belowMOQ = calculateWholesalePrice(mockDemoProduct, 25, 'INR');
  assert.equal(belowMOQ.validMOQ, false);

  // Tier 1: 50-99 units (Base wholesale price = 165)
  const tier1 = calculateWholesalePrice(mockDemoProduct, 75, 'INR');
  assert.equal(tier1.validMOQ, true);
  assert.equal(tier1.unitPrice, 165);
  assert.equal(tier1.totalPrice, 75 * 165);

  // Tier 2: 100-499 units (Discounted price = 145)
  const tier2 = calculateWholesalePrice(mockDemoProduct, 250, 'INR');
  assert.equal(tier2.validMOQ, true);
  assert.equal(tier2.unitPrice, 145);
  assert.equal(tier2.totalPrice, 250 * 145);

  // Tier 3: 500+ units (Custom quotation / Deep discount = 125)
  const tier3 = calculateWholesalePrice(mockDemoProduct, 1000, 'INR');
  assert.equal(tier3.validMOQ, true);
  assert.equal(tier3.unitPrice, 125);
  assert.equal(tier3.totalPrice, 1000 * 125);
});

test('validateInquiry validates corporate email and business name correctly', () => {
  const invalid = validateInquiry({
    businessName: '',
    workEmail: 'invalid-email',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.businessName);
  assert.ok(invalid.errors.workEmail);

  const valid = validateInquiry({
    businessName: 'Tata Consumer Products',
    workEmail: 'procurement@tataconsumer.com',
  });
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.errors, {});
});

test('centralized catalog contains all 6 required categories', () => {
  const expectedCategories = [
    'Shopping Bags',
    'Tote Bags',
    'Gift Bags',
    'Promotional Bags',
    'Custom Printed Bags',
    'Corporate Bags'
  ];

  for (const cat of expectedCategories) {
    assert.ok(
      CATEGORIES.includes(cat),
      `CATEGORIES list must include "${cat}"`
    );
    const count = products.filter((p) => p.category === cat).length;
    assert.ok(
      count > 0,
      `At least one product must exist in category "${cat}"`
    );
  }
});

test('every product in catalog has mandatory fields for Prompt 3', () => {
  for (const p of products) {
    assert.ok(p.id, `Product ${p.id} must have an ID`);
    assert.ok(p.name, `Product ${p.id} must have a name`);
    assert.ok(p.category, `Product ${p.id} must have a category`);
    assert.ok(p.startingPrice > 0, `Product ${p.id} startingPrice must be positive`);
    assert.ok(p.moq >= 50, `Product ${p.id} MOQ must be at least 50`);
    assert.ok(Array.isArray(p.colors) && p.colors.length > 0, `Product ${p.id} must have colors array`);
    assert.ok(p.image, `Product ${p.id} must have an image`);
    assert.ok(p.dimensions, `Product ${p.id} must have dimensions`);
    assert.ok(p.material, `Product ${p.id} must have material spec`);
    assert.ok(Array.isArray(p.pricingTiersINR) && p.pricingTiersINR.length === 3, `Product ${p.id} must have 3 pricing tiers`);
  }
});

test('filterAndSortProducts correctly filters by category and search', () => {
  const toteBags = filterAndSortProducts({ category: 'Tote Bags' });
  assert.ok(toteBags.length > 0);
  assert.ok(toteBags.every((p) => p.category === 'Tote Bags'));

  const searchResults = filterAndSortProducts({ searchQuery: 'folio' });
  assert.ok(searchResults.length > 0);
  assert.ok(searchResults.some((p) => p.id === 'executive-conference-folio'));
});
