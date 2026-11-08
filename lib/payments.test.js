import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PAYMENT_STATUS_VALUES,
  normalizePaymentStatus,
  validateTransactionReference,
  validatePaymentAction,
  buildPaymentRecord,
  getPaymentInstructions,
} from './payments.js';

test('payment status values expose the supported transaction states', () => {
  assert.deepEqual(PAYMENT_STATUS_VALUES, ['pending', 'submitted', 'verified', 'failed', 'refunded']);
});

test('manual UPI references are validated before submission', () => {
  const valid = validateTransactionReference('UPI', 'UPI-REF-20261108-7783');
  assert.equal(valid.valid, true);

  const invalid = validateTransactionReference('UPI', 'bad');
  assert.equal(invalid.valid, false);
  assert.match(invalid.error, /valid reference/i);
});

test('customer cannot verify UPI or COD payments without admin role', () => {
  const customerUpi = validatePaymentAction({
    paymentMethod: 'UPI',
    currentStatus: 'submitted',
    nextStatus: 'verified',
    actorRole: 'customer',
  });
  assert.equal(customerUpi.valid, false);
  assert.match(customerUpi.error, /admins/i);

  const adminCod = validatePaymentAction({
    paymentMethod: 'COD',
    currentStatus: 'pending',
    nextStatus: 'verified',
    actorRole: 'admin',
  });
  assert.equal(adminCod.valid, true);
});

test('payment records normalize to the required status and metadata fields', () => {
  const record = buildPaymentRecord({
    orderId: 'ord_123',
    userId: 'user_456',
    paymentMethod: 'UPI',
    amount: 1550,
    status: 'submitted',
    transactionReference: 'UPI-REF-20261108-7783',
    providerName: 'Paytm UPI',
    notes: 'Awaiting verification',
  });

  assert.equal(record.payment_method, 'UPI');
  assert.equal(record.payment_status, 'submitted');
  assert.equal(record.currency, 'INR');
  assert.equal(record.transaction_reference, 'UPI-REF-20261108-7783');
  assert.equal(record.refund_status, 'not_requested');
});

test('manual payment instructions are exposed without hardcoded secrets', () => {
  const instructions = getPaymentInstructions('UPI');
  assert.equal(instructions.title, 'Manual UPI Verification');
  assert.ok(instructions.beneficiary.includes('@') || instructions.beneficiary.includes('upi'));
  assert.match(instructions.description, /transfer/i);
});
