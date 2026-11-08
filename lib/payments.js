export const PAYMENT_METHODS = ['COD', 'UPI'];
export const PAYMENT_STATUS_VALUES = ['pending', 'submitted', 'verified', 'failed', 'refunded'];
export const REFUND_STATUS_VALUES = ['not_requested', 'requested', 'processed', 'rejected', 'completed'];

export function normalizePaymentStatus(value, fallback = 'pending') {
  const nextValue = String(value || '').trim().toLowerCase();
  return PAYMENT_STATUS_VALUES.includes(nextValue) ? nextValue : fallback;
}

export function normalizeRefundStatus(value, fallback = 'not_requested') {
  const nextValue = String(value || '').trim().toLowerCase();
  return REFUND_STATUS_VALUES.includes(nextValue) ? nextValue : fallback;
}

export function validateTransactionReference(paymentMethod, reference) {
  const trimmed = String(reference || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'A payment transaction reference is required.' };
  }

  if (paymentMethod === 'UPI') {
    const isValidFormat = /[A-Za-z0-9._-]{6,}/.test(trimmed) && trimmed.length >= 6;
    if (!isValidFormat) {
      return { valid: false, error: 'UPI transaction reference must be a valid reference code or VPA trace ID.' };
    }
  }

  return { valid: true, value: trimmed };
}

export function validatePaymentAction({ paymentMethod, currentStatus, nextStatus, actorRole = 'customer' }) {
  const normalizedCurrent = normalizePaymentStatus(currentStatus, 'pending');
  const normalizedNext = normalizePaymentStatus(nextStatus, 'pending');
  const sanctionedRole = String(actorRole || 'customer').toLowerCase();

  if (!PAYMENT_STATUS_VALUES.includes(normalizedNext)) {
    return { valid: false, error: 'Unsupported payment status.' };
  }

  if (normalizedCurrent === normalizedNext) {
    return { valid: false, error: 'Payment status has not changed.' };
  }

  if (sanctionedRole !== 'admin' && normalizedNext === 'verified') {
    return { valid: false, error: 'Only authorized admins can verify a payment.' };
  }

  if (sanctionedRole !== 'admin' && normalizedNext === 'failed') {
    return { valid: false, error: 'Only authorized admins can reject a payment.' };
  }

  if (paymentMethod === 'UPI') {
    if (sanctionedRole === 'customer' && normalizedNext === 'submitted' && normalizedCurrent !== 'pending') {
      return { valid: false, error: 'UPI payment can only be submitted once from a pending state.' };
    }

    if (sanctionedRole === 'customer' && normalizedNext === 'verified') {
      return { valid: false, error: 'UPI payments cannot be marked as verified by customers.' };
    }
  }

  if (paymentMethod === 'COD') {
    if (sanctionedRole === 'customer' && normalizedNext === 'verified') {
      return { valid: false, error: 'COD collection must be verified by an admin.' };
    }
  }

  return { valid: true };
}

export function buildPaymentRecord({
  orderId,
  userId,
  paymentMethod = 'COD',
  amount = 0,
  currency = 'INR',
  status = 'pending',
  transactionReference = '',
  providerName = '',
  notes = '',
  providerReference = '',
}) {
  const normalizedMethod = String(paymentMethod || 'COD').toUpperCase();
  const normalizedStatus = normalizePaymentStatus(status, 'pending');

  return {
    order_id: orderId,
    user_id: userId,
    payment_method: normalizedMethod,
    payment_status: normalizedStatus,
    amount: Number(amount || 0),
    currency: String(currency || 'INR').toUpperCase(),
    transaction_reference: String(transactionReference || '').trim(),
    provider_name: String(providerName || '').trim(),
    provider_reference: String(providerReference || '').trim(),
    notes: String(notes || '').trim(),
    paid_at: normalizedStatus === 'verified' ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    verified_by: null,
    verified_at: null,
    verification_notes: '',
    refund_status: 'not_requested',
  };
}

export function getConfiguredUpiId() {
  return process.env.NEXT_PUBLIC_JUTON_UPI_ID || 'your-business-vpa@upi';
}

export function getPaymentInstructions(paymentMethod = 'UPI') {
  if (paymentMethod === 'COD') {
    return {
      title: 'Cash on Delivery',
      description: 'Collect payment from the consignee at the time of delivery. Payment is kept pending until admin collection is confirmed.',
    };
  }

  return {
    title: 'Manual UPI Verification',
    beneficiary: getConfiguredUpiId(),
    description: 'Transfer the exact amount to the configured business UPI ID and submit the transaction reference for admin verification.',
  };
}
