import test from 'node:test';
import assert from 'node:assert';
import {
  ORDER_STATUSES,
  ORDER_PROGRESS_STEPS,
  STATUS_CONFIG,
  DEMO_ORDERS,
  DEMO_SAVED_ADDRESSES,
  getOrderStatusInfo,
  calculateDashboardStats,
  filterOrders,
  getOrderById,
  validateAddress,
  validatePasswordChange,
  validateProfileUpdate,
  serializeDashboardDataForApi
} from './dashboard.js';

test('ORDER_STATUSES contains all 6 required demonstration statuses', () => {
  const expected = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const values = Object.values(ORDER_STATUSES);
  for (const exp of expected) {
    assert.ok(values.includes(exp), `Expected status ${exp} to be present in ORDER_STATUSES`);
  }
});

test('STATUS_CONFIG contains progress and badge metadata for all 6 statuses', () => {
  const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  for (const s of statuses) {
    const config = STATUS_CONFIG[s];
    assert.ok(config, `Missing config for ${s}`);
    assert.strictEqual(typeof config.currentStep, 'number');
    assert.ok(config.badgeBg);
    assert.ok(config.badgeText);
  }
});

test('getOrderStatusInfo handles fuzzy and case-insensitive statuses safely', () => {
  const infoShipped = getOrderStatusInfo('Shipped (Bengal Hub Dispatch)');
  assert.strictEqual(infoShipped.label, 'Shipped');
  assert.strictEqual(infoShipped.currentStep, 4);

  const infoCancelled = getOrderStatusInfo('Cancelled by client');
  assert.strictEqual(infoCancelled.label, 'Cancelled');
  assert.strictEqual(infoCancelled.currentStep, 0);

  const infoFallback = getOrderStatusInfo('Unknown Custom Status');
  assert.strictEqual(infoFallback.label, 'Pending');
});

test('ORDER_PROGRESS_STEPS defines 5 sequential non-cancelled stages', () => {
  assert.strictEqual(ORDER_PROGRESS_STEPS.length, 5);
  assert.strictEqual(ORDER_PROGRESS_STEPS[0].step, 1);
  assert.strictEqual(ORDER_PROGRESS_STEPS[4].step, 5);
  assert.strictEqual(ORDER_PROGRESS_STEPS[0].key, 'Pending');
  assert.strictEqual(ORDER_PROGRESS_STEPS[4].key, 'Delivered');
});

test('DEMO_ORDERS contains orders for each of the 6 demonstration statuses', () => {
  assert.ok(DEMO_ORDERS.length >= 6);
  const foundStatuses = new Set(DEMO_ORDERS.map((o) => o.status));
  for (const s of ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']) {
    assert.ok(foundStatuses.has(s), `DEMO_ORDERS missing status ${s}`);
  }
});

test('calculateDashboardStats aggregates totals, active counts, and units accurately', () => {
  const stats = calculateDashboardStats(DEMO_ORDERS);
  assert.strictEqual(stats.totalOrders, DEMO_ORDERS.length);
  assert.ok(stats.totalUnits > 500, 'Total units should be aggregated across all line items');
  assert.ok(stats.totalSpent > 100000, 'Total spent should sum non-cancelled totals');
  assert.ok(stats.deliveredCount >= 1);
  assert.ok(stats.cancelledCount >= 1);
  assert.ok(stats.activeCount >= 1);
});

test('filterOrders filters by status, search keyword, and sorts', () => {
  const deliveredOnly = filterOrders(DEMO_ORDERS, { status: 'Delivered' });
  assert.ok(deliveredOnly.length >= 1);
  assert.ok(deliveredOnly.every((o) => o.status.includes('Delivered')));

  const searchResult = filterOrders(DEMO_ORDERS, { searchQuery: 'JTN-DEMO-2026-8842' });
  assert.strictEqual(searchResult.length, 1);
  assert.strictEqual(searchResult[0].orderNumber, 'JTN-DEMO-2026-8842');

  const productSearch = filterOrders(DEMO_ORDERS, { searchQuery: 'Botanical' });
  assert.ok(productSearch.length >= 1);

  const sortedHighest = filterOrders(DEMO_ORDERS, { sortBy: 'highest-total' });
  const firstTotal = sortedHighest[0].summary.totalAmount;
  const secondTotal = sortedHighest[1].summary.totalAmount;
  assert.ok(firstTotal >= secondTotal);
});

test('getOrderById retrieves exact order by orderNumber or id', () => {
  const found = getOrderById(DEMO_ORDERS, 'JTN-DEMO-2026-7219');
  assert.ok(found);
  assert.strictEqual(found.status, 'Shipped');

  const notFound = getOrderById(DEMO_ORDERS, 'INVALID-ORDER-999');
  assert.strictEqual(notFound, null);
});

test('validateAddress enforces required Indian fields, mobile format, and 6-digit PIN', () => {
  const invalid = validateAddress({});
  assert.strictEqual(invalid.valid, false);
  assert.ok(invalid.errors.label);
  assert.ok(invalid.errors.recipientName);
  assert.ok(invalid.errors.mobile);
  assert.ok(invalid.errors.houseBuilding);
  assert.ok(invalid.errors.city);
  assert.ok(invalid.errors.pinCode);

  const valid = validateAddress({
    label: 'Central Distribution Hub',
    recipientName: 'Kolkata Dispatch Lead',
    mobile: '9830048821',
    houseBuilding: 'Bay 12, Shed 4',
    street: 'Strand Road',
    city: 'Kolkata',
    state: 'West Bengal',
    pinCode: '700001'
  });
  assert.strictEqual(valid.valid, true);
  assert.strictEqual(Object.keys(valid.errors).length, 0);

  const badPin = validateAddress({
    label: 'Warehouse',
    recipientName: 'Lead',
    mobile: '9830048821',
    houseBuilding: 'Bay 12',
    street: 'Road',
    city: 'Kolkata',
    state: 'West Bengal',
    pinCode: '01234' // Invalid PIN
  });
  assert.strictEqual(badPin.valid, false);
  assert.ok(badPin.errors.pinCode);
});

test('validatePasswordChange requires current password, min 8 chars, and matching confirm', () => {
  const short = validatePasswordChange({
    currentPassword: 'oldpassword123',
    newPassword: 'short',
    confirmPassword: 'short'
  });
  assert.strictEqual(short.valid, false);
  assert.ok(short.errors.newPassword);

  const mismatch = validatePasswordChange({
    currentPassword: 'oldpassword123',
    newPassword: 'longpassword123',
    confirmPassword: 'differentpassword123'
  });
  assert.strictEqual(mismatch.valid, false);
  assert.ok(mismatch.errors.confirmPassword);

  const valid = validatePasswordChange({
    currentPassword: 'oldpassword123',
    newPassword: 'newsecurepassword123',
    confirmPassword: 'newsecurepassword123'
  });
  assert.strictEqual(valid.valid, true);
});

test('serializeDashboardDataForApi produces clean schema ready for Supabase or REST API', () => {
  const serialized = serializeDashboardDataForApi(
    { id: 'usr_1', fullName: 'Vikramaditya Roy', email: 'test@bengal.in' },
    DEMO_ORDERS.slice(0, 2),
    DEMO_SAVED_ADDRESSES,
    {}
  );
  assert.strictEqual(serialized.exportVersion, 'juton_b2b_v1');
  assert.strictEqual(serialized.orders.length, 2);
  assert.ok(serialized.orders[0].totalUnits > 0);
  assert.strictEqual(serialized.savedAddresses.length, DEMO_SAVED_ADDRESSES.length);
});
