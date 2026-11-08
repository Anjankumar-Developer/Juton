import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateQuantity,
  validateCartItem,
  getApplicableTier,
  calculateItemFinancials,
  calculateCartTotals,
  serializeCartForSupabase,
  buildOrderIdempotencyKey,
  reserveOrderStock,
  releaseOrderStockReservation,
  FREE_SHIPPING_THRESHOLD_INR,
  FLAT_SHIPPING_RATE_INR,
  GST_RATE_PERCENT
} from './cart.js';

const mockProduct = {
  id: 'the-grand-market-tote',
  name: 'The Grand Market Shopping Tote',
  moq: 100,
  stockQuantity: 2500,
  inStock: true,
  priceINR: 145,
  priceUSD: 3.50,
  pricingTiersINR: [
    { min: 50, max: 99, label: '50–99 units (Base wholesale)', price: 165 },
    { min: 100, max: 499, label: '100–499 units (Discounted)', price: 145 },
    { min: 500, max: null, label: '500+ units (Custom quotation)', price: 125 },
  ],
};

const mockOutOfStockProduct = {
  id: 'metallic-foil-luxury-carrier',
  name: 'Metallic Gold & Copper Foil Debossed Tote',
  moq: 100,
  stockQuantity: 0,
  inStock: false,
};

const storage = new Map();
globalThis.localStorage = {
  getItem(key) {
    return storage.has(key) ? storage.get(key) : null;
  },
  setItem(key, value) {
    storage.set(String(key), String(value));
  },
  removeItem(key) {
    storage.delete(String(key));
  },
  clear() {
    storage.clear();
  },
};

test('validateQuantity prevents quantities below minimum order quantity (MOQ)', () => {
  const result = validateQuantity(mockProduct, 40);
  assert.equal(result.valid, false);
  assert.equal(result.isBelowMOQ, true);
  assert.equal(result.sanitizedQuantity, 100);
  assert.match(result.error, /below minimum batch size/i);
});

test('validateQuantity prevents quantities exceeding available stock', () => {
  const result = validateQuantity(mockProduct, 3000);
  assert.equal(result.valid, false);
  assert.equal(result.isAboveStock, true);
  assert.equal(result.sanitizedQuantity, 2500);
  assert.match(result.error, /exceeds available mill inventory/i);
});

test('validateQuantity rejects out-of-stock or unavailable products', () => {
  const result = validateQuantity(mockOutOfStockProduct, 100);
  assert.equal(result.valid, false);
  assert.equal(result.isUnavailable, true);
  assert.match(result.error, /out of stock/i);
});

test('validateQuantity accepts valid quantity within MOQ and stock bounds', () => {
  const result = validateQuantity(mockProduct, 250);
  assert.equal(result.valid, true);
  assert.equal(result.sanitizedQuantity, 250);
  assert.equal(result.error, null);
});

test('validateCartItem enforces backend pricing and stock validation rules', () => {
  const result = validateCartItem({
    ...mockProduct,
    is_active: true,
    inventory: { available_quantity: 500 },
  }, 200);

  assert.equal(result.valid, true);
  assert.equal(result.unitPrice, 145);
  assert.equal(result.tier.label, '100–499 units (Discounted)');

  const invalid = validateCartItem({
    ...mockProduct,
    is_active: true,
    inventory: { available_quantity: 0 },
  }, 200);

  assert.equal(invalid.valid, false);
  assert.equal(invalid.isUnavailable, true);
});

test('getApplicableTier returns the correct quantity-based wholesale tier', () => {
  const tier = getApplicableTier(mockProduct, 1000, 'INR');
  assert.equal(tier.unitPrice, 125);
  assert.equal(tier.label, '500+ units (Custom quotation)');
});

test('calculateItemFinancials computes base vs discounted tiers and savings accurately', () => {
  // 75 units: Base Tier @ 165 -> no discount compared to base
  const finTier1 = calculateItemFinancials({ ...mockProduct, quantity: 75 }, 'INR');
  assert.equal(finTier1.unitPrice, 165);
  assert.equal(finTier1.baseUnitPrice, 165);
  assert.equal(finTier1.lineSubtotal, 75 * 165);
  assert.equal(finTier1.lineSavings, 0);

  // 200 units: Discounted Tier @ 145 -> Base was 165, saved 20/pc
  const finTier2 = calculateItemFinancials({ ...mockProduct, quantity: 200 }, 'INR');
  assert.equal(finTier2.unitPrice, 145);
  assert.equal(finTier2.baseUnitPrice, 165);
  assert.equal(finTier2.lineSubtotal, 200 * 145);
  assert.equal(finTier2.rawBaseSubtotal, 200 * 165);
  assert.equal(finTier2.lineSavings, 200 * (165 - 145)); // 4000
  assert.equal(finTier2.isDiscounted, true);

  // 1000 units: Deep Bulk Tier @ 125 -> Base was 165, saved 40/pc
  const finTier3 = calculateItemFinancials({ ...mockProduct, quantity: 1000 }, 'INR');
  assert.equal(finTier3.unitPrice, 125);
  assert.equal(finTier3.lineSubtotal, 1000 * 125); // 125000
  assert.equal(finTier3.rawBaseSubtotal, 1000 * 165); // 165000
  assert.equal(finTier3.lineSavings, 40000);
});

test('calculateCartTotals computes subtotal, tier discounts, GST, and shipping thresholds', () => {
  // Below free shipping threshold: 100 pcs @ 145 = 14500 (Base was 16500)
  const cartSmall = [{ ...mockProduct, quantity: 100 }];
  const totalsSmall = calculateCartTotals(cartSmall, 'INR');

  assert.equal(totalsSmall.baseSubtotal, 16500);
  assert.equal(totalsSmall.subtotal, 14500);
  assert.equal(totalsSmall.tierDiscount, 2000);
  assert.equal(totalsSmall.savingsPercentage, 12);
  assert.equal(totalsSmall.isFreeShipping, false);
  assert.equal(totalsSmall.estimatedShipping, FLAT_SHIPPING_RATE_INR);
  const expectedTax = Math.round(14500 * (GST_RATE_PERCENT / 100)); // 725
  assert.equal(totalsSmall.estimatedTax, expectedTax);
  assert.equal(totalsSmall.netTotal, 14500 + expectedTax + FLAT_SHIPPING_RATE_INR);

  // Above free shipping threshold: 300 pcs @ 145 = 43500 (> 25000)
  const cartLarge = [{ ...mockProduct, quantity: 300 }];
  const totalsLarge = calculateCartTotals(cartLarge, 'INR');

  assert.equal(totalsLarge.subtotal, 43500);
  assert.equal(totalsLarge.isFreeShipping, true);
  assert.equal(totalsLarge.estimatedShipping, 0);
  assert.equal(totalsLarge.amountUntilFreeShipping, 0);
});

test('serializeCartForSupabase generates schema compliant with Supabase order payloads', () => {
  const cart = [{ ...mockProduct, quantity: 100, itemKey: 'grand-market-natural', selectedColor: 'Natural Jute' }];
  const totals = calculateCartTotals(cart, 'INR');
  const serialized = serializeCartForSupabase(cart, totals, {
    companyName: 'FabIndia Packaging Pvt Ltd',
    gstin: '19AAACF1234F1Z8',
    email: 'procurement@fabindia.com'
  });

  assert.equal(serialized.order_type, 'B2B_WHOLESALE_PROFORMA');
  assert.equal(serialized.company_name, 'FabIndia Packaging Pvt Ltd');
  assert.equal(serialized.gstin, '19AAACF1234F1Z8');
  assert.equal(serialized.line_items.length, 1);
  assert.equal(serialized.line_items[0].color, 'Natural Jute');
  assert.equal(serialized.line_items[0].quantity, 100);
  assert.ok(serialized.financials.grand_total > 0);
});

test('reserveOrderStock prevents duplicate reservations and avoids overselling in local storage', () => {
  storage.clear();

  const orderItems = [{
    id: 'prod_reserve_1',
    name: 'Bamboo Utility Tote',
    quantity: 120,
    stockQuantity: 500,
  }];

  const key = buildOrderIdempotencyKey({
    customer: { email: 'buyer@juton.in' },
    items: orderItems,
    totals: { grandTotal: 1200 },
  });

  const firstReservation = reserveOrderStock(orderItems, key);
  assert.equal(firstReservation.ok, true);
  assert.equal(firstReservation.alreadyReserved, false);

  const duplicateReservation = reserveOrderStock(orderItems, key);
  assert.equal(duplicateReservation.ok, true);
  assert.equal(duplicateReservation.alreadyReserved, true);

  const oversellAttempt = reserveOrderStock([
    { ...orderItems[0], quantity: 600 },
  ], 'reserve_key_oversell');
  assert.equal(oversellAttempt.ok, false);
  assert.match(oversellAttempt.error, /Insufficient stock/i);

  const released = releaseOrderStockReservation(key);
  assert.equal(released.ok, true);
  assert.equal(released.released, true);
});
