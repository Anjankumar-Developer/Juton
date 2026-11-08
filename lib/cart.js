/**
 * JUTON Centralized Shopping Cart & Financial Calculation Logic
 * 
 * Strict architectural rule:
 * All financial calculations, quantity boundaries, tier discounts,
 * tax estimates, and shipping thresholds MUST be calculated exclusively here.
 * Never duplicate financial calculations across UI components.
 * 
 * Schema is structured for seamless export to Supabase / PostgreSQL.
 */

export const LOCAL_STORAGE_CART_KEY = 'juton_wholesale_cart_v1';
export const LOCAL_STORAGE_ORDER_RESERVATIONS_KEY = 'juton_order_reservations_v1';
export const LOCAL_STORAGE_ORDER_IDEMPOTENCY_KEY = 'juton_order_idempotency_v1';

export const FREE_SHIPPING_THRESHOLD_INR = 25000;
export const FREE_SHIPPING_THRESHOLD_USD = 300;
export const FLAT_SHIPPING_RATE_INR = 850;
export const FLAT_SHIPPING_RATE_USD = 15;
export const GST_RATE_PERCENT = 5; // 5% GST for Indian textile/jute packaging

export function getApplicableTier(product, requestedQty, currency = 'INR') {
  const tiers = Array.isArray(currency === 'USD' ? product?.pricingTiersUSD : product?.pricingTiersINR)
    ? (currency === 'USD' ? product.pricingTiersUSD : product.pricingTiersINR)
    : [];

  const fallbackPrice = currency === 'USD' ? (Number(product?.priceUSD ?? product?.startingPrice ?? 0)) : (Number(product?.priceINR ?? product?.startingPrice ?? 0));

  if (tiers.length === 0) {
    return {
      tier: null,
      unitPrice: fallbackPrice,
      label: 'Standard Batch',
      baseUnitPrice: fallbackPrice,
    };
  }

  const normalized = [...tiers]
    .map((tier) => ({
      ...tier,
      min: Number(tier.min ?? tier.min_quantity ?? 1),
      max: tier.max ?? tier.max_quantity ?? null,
      price: Number(tier.price ?? tier.unit_price ?? fallbackPrice),
    }))
    .sort((a, b) => a.min - b.min);

  const matchedTier = normalized.find((tier) => requestedQty >= tier.min && (tier.max === null || requestedQty <= tier.max)) || normalized[0];

  return {
    tier: matchedTier || null,
    unitPrice: Number(matchedTier ? matchedTier.price : fallbackPrice),
    label: matchedTier?.label || 'Standard Batch',
    baseUnitPrice: Number(normalized[0]?.price ?? fallbackPrice),
  };
}

export function validateCartItem(product, requestedQty, options = {}) {
  const currency = options.currency || 'INR';

  if (!product || !product.id) {
    return {
      valid: false,
      sanitizedQuantity: 0,
      error: 'Product information is missing.',
      isBelowMOQ: false,
      isAboveStock: false,
      isUnavailable: true,
      hasInvalidPrice: true,
      tier: null,
      unitPrice: 0,
    };
  }

  const stockQuantity = Number(
    product.inventory?.available_quantity ?? product.stockQuantity ?? (product.inStock ? 5000 : 0)
  );

  const baseProduct = {
    ...product,
    moq: Number(product.moq ?? product.minimumOrderQuantity ?? 50),
    stockQuantity,
    inStock: product.inStock !== false && (product.is_active !== false) && stockQuantity > 0,
  };

  if (!baseProduct.inStock || baseProduct.stockQuantity <= 0) {
    return {
      valid: false,
      sanitizedQuantity: 0,
      error: 'This product is currently unavailable or out of stock.',
      isBelowMOQ: false,
      isAboveStock: true,
      isUnavailable: true,
      hasInvalidPrice: false,
      tier: null,
      unitPrice: 0,
    };
  }

  const parsed = Number(requestedQty);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return {
      valid: false,
      sanitizedQuantity: 0,
      error: 'Quantity must be a positive whole number.',
      isBelowMOQ: false,
      isAboveStock: false,
      isUnavailable: false,
      hasInvalidPrice: false,
      tier: null,
      unitPrice: 0,
    };
  }

  if (parsed < baseProduct.moq) {
    return {
      valid: false,
      sanitizedQuantity: baseProduct.moq,
      error: `Order quantity cannot be below the minimum batch size of ${baseProduct.moq} pieces.`,
      isBelowMOQ: true,
      isAboveStock: false,
      isUnavailable: false,
      hasInvalidPrice: false,
      tier: null,
      unitPrice: 0,
    };
  }

  if (parsed > baseProduct.stockQuantity) {
    return {
      valid: false,
      sanitizedQuantity: baseProduct.stockQuantity,
      error: `Requested quantity exceeds available stock (${baseProduct.stockQuantity} pieces max).`,
      isBelowMOQ: false,
      isAboveStock: true,
      isUnavailable: false,
      hasInvalidPrice: false,
      tier: null,
      unitPrice: 0,
    };
  }

  const tierInfo = getApplicableTier(baseProduct, parsed, currency);
  if (!tierInfo.tier) {
    return {
      valid: false,
      sanitizedQuantity: baseProduct.moq,
      error: 'A valid wholesale tier was not found for this quantity.',
      isBelowMOQ: false,
      isAboveStock: false,
      isUnavailable: false,
      hasInvalidPrice: true,
      tier: null,
      unitPrice: 0,
    };
  }

  return {
    valid: true,
    sanitizedQuantity: parsed,
    error: null,
    isBelowMOQ: false,
    isAboveStock: false,
    isUnavailable: false,
    hasInvalidPrice: false,
    tier: tierInfo.tier,
    unitPrice: tierInfo.unitPrice,
  };
}

/**
 * Validates and clamps quantity against a product's MOQ and stock limit
 * @param {Object} product
 * @param {number} requestedQty
 * @returns {{
 *   valid: boolean,
 *   sanitizedQuantity: number,
 *   error: string|null,
 *   isBelowMOQ: boolean,
 *   isAboveStock: boolean,
 *   isUnavailable: boolean
 * }}
 */
export function validateQuantity(product, requestedQty) {
  if (!product) {
    return {
      valid: false,
      sanitizedQuantity: 0,
      error: 'Product information is missing',
      isBelowMOQ: false,
      isAboveStock: false,
      isUnavailable: true,
    };
  }

  const moq = product.moq || 50;
  const stock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 5000 : 0);
  const isUnavailable = !product.inStock || stock <= 0;

  if (isUnavailable) {
    return {
      valid: false,
      sanitizedQuantity: 0,
      error: 'This model is currently out of stock or custom made-to-order.',
      isBelowMOQ: false,
      isAboveStock: true,
      isUnavailable: true,
    };
  }

  const parsed = parseInt(requestedQty, 10);
  const rawQty = isNaN(parsed) ? moq : parsed;

  if (rawQty < moq) {
    return {
      valid: false,
      sanitizedQuantity: moq,
      error: `Order quantity cannot be below minimum batch size of ${moq} pieces.`,
      isBelowMOQ: true,
      isAboveStock: false,
      isUnavailable: false,
    };
  }

  if (rawQty > stock) {
    return {
      valid: false,
      sanitizedQuantity: stock,
      error: `Requested quantity exceeds available mill inventory (${stock} pieces max).`,
      isBelowMOQ: false,
      isAboveStock: true,
      isUnavailable: false,
    };
  }

  return {
    valid: true,
    sanitizedQuantity: rawQty,
    error: null,
    isBelowMOQ: false,
    isAboveStock: false,
    isUnavailable: false,
  };
}

/**
 * Calculates line-item wholesale tier, savings, and subtotal
 * @param {Object} item
 * @param {string} currency - 'INR' | 'USD'
 * @returns {{
 *   unitPrice: number,
 *   baseUnitPrice: number,
 *   lineSubtotal: number,
 *   rawBaseSubtotal: number,
 *   lineSavings: number,
 *   tierLabel: string,
 *   isDiscounted: boolean,
 *   validMOQ: boolean,
 *   exceedsStock: boolean,
 *   isUnavailable: boolean
 * }}
 */
export function calculateItemFinancials(item, currency = 'INR') {
  if (!item || !item.quantity || item.quantity <= 0) {
    return {
      unitPrice: 0,
      baseUnitPrice: 0,
      lineSubtotal: 0,
      rawBaseSubtotal: 0,
      lineSavings: 0,
      tierLabel: 'N/A',
      isDiscounted: false,
      validMOQ: false,
      exceedsStock: false,
      isUnavailable: true,
    };
  }

  const isUSD = currency === 'USD';
  const tiers = isUSD ? (item.pricingTiersUSD || []) : (item.pricingTiersINR || []);
  const baseFallback = isUSD ? (item.priceUSD || 3.5) : (item.priceINR || 145);

  // Base tier price (first tier price or fallback)
  const baseUnitPrice = tiers.length > 0 ? tiers[0].price : baseFallback;

  // Find matching tier for current quantity
  let matchedTier = null;
  for (const tier of tiers) {
    if (item.quantity >= tier.min && (tier.max === null || item.quantity <= tier.max)) {
      matchedTier = tier;
      break;
    }
  }

  const unitPrice = matchedTier ? matchedTier.price : baseFallback;
  const lineSubtotal = Number((unitPrice * item.quantity).toFixed(2));
  const rawBaseSubtotal = Number((baseUnitPrice * item.quantity).toFixed(2));
  const lineSavings = Math.max(0, Number((rawBaseSubtotal - lineSubtotal).toFixed(2)));

  const moq = item.moq || 50;
  const stock = typeof item.stockQuantity === 'number' ? item.stockQuantity : (item.inStock ? 5000 : 0);
  const isUnavailable = item.inStock === false || stock <= 0;
  const validMOQ = item.quantity >= moq;
  const exceedsStock = item.quantity > stock;

  let tierLabel = 'Standard Batch';
  if (matchedTier?.label) {
    tierLabel = matchedTier.label;
  } else if (item.quantity >= 500) {
    tierLabel = '500+ Deep Volume Tier';
  } else if (item.quantity >= 100) {
    tierLabel = '100–499 Discounted Tier';
  } else {
    tierLabel = '50–99 Base Wholesale';
  }

  return {
    unitPrice,
    baseUnitPrice,
    lineSubtotal,
    rawBaseSubtotal,
    lineSavings,
    tierLabel,
    isDiscounted: lineSavings > 0,
    validMOQ,
    exceedsStock,
    isUnavailable,
  };
}

/**
 * Calculates authoritative cart financial totals
 * Central source of truth for CartDrawer, CartPage, and CheckoutModal.
 * @param {Array} items
 * @param {string} currency - 'INR' | 'USD'
 * @returns {Object}
 */
export function calculateCartTotals(items = [], currency = 'INR') {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      baseSubtotal: 0,
      subtotal: 0,
      tierDiscount: 0,
      savingsPercentage: 0,
      estimatedTax: 0,
      estimatedShipping: 0,
      netTotal: 0,
      totalUnits: 0,
      totalItems: 0,
      isFreeShipping: false,
      freeShippingThreshold: currency === 'USD' ? FREE_SHIPPING_THRESHOLD_USD : FREE_SHIPPING_THRESHOLD_INR,
      amountUntilFreeShipping: currency === 'USD' ? FREE_SHIPPING_THRESHOLD_USD : FREE_SHIPPING_THRESHOLD_INR,
      hasUnavailableItems: false,
      hasInvalidQuantities: false,
      itemsWithFinancials: [],
    };
  }

  const isUSD = currency === 'USD';
  const freeThreshold = isUSD ? FREE_SHIPPING_THRESHOLD_USD : FREE_SHIPPING_THRESHOLD_INR;
  const flatShipping = isUSD ? FLAT_SHIPPING_RATE_USD : FLAT_SHIPPING_RATE_INR;

  let baseSubtotal = 0;
  let subtotal = 0;
  let totalUnits = 0;
  let hasUnavailableItems = false;
  let hasInvalidQuantities = false;

  const itemsWithFinancials = items.map((item) => {
    const fin = calculateItemFinancials(item, currency);
    baseSubtotal += fin.rawBaseSubtotal;
    subtotal += fin.lineSubtotal;
    totalUnits += (item.quantity || 0);

    if (fin.isUnavailable) hasUnavailableItems = true;
    if (!fin.validMOQ || fin.exceedsStock) hasInvalidQuantities = true;

    return {
      ...item,
      financials: fin,
    };
  });

  const tierDiscount = Math.max(0, Number((baseSubtotal - subtotal).toFixed(2)));
  const savingsPercentage = baseSubtotal > 0 ? Math.round((tierDiscount / baseSubtotal) * 100) : 0;

  // 5% GST for INR wholesale transactions (B2B Tax Credit Eligible)
  const estimatedTax = isUSD ? 0 : Math.round(subtotal * (GST_RATE_PERCENT / 100));

  const isFreeShipping = subtotal >= freeThreshold;
  const estimatedShipping = subtotal === 0 ? 0 : (isFreeShipping ? 0 : flatShipping);
  const amountUntilFreeShipping = Math.max(0, freeThreshold - subtotal);

  const netTotal = Number((subtotal + estimatedTax + estimatedShipping).toFixed(2));

  return {
    baseSubtotal: Number(baseSubtotal.toFixed(2)),
    subtotal: Number(subtotal.toFixed(2)),
    tierDiscount,
    savingsPercentage,
    estimatedTax,
    estimatedShipping,
    netTotal,
    totalUnits,
    totalItems: items.length,
    isFreeShipping,
    freeShippingThreshold: freeThreshold,
    amountUntilFreeShipping: Number(amountUntilFreeShipping.toFixed(2)),
    hasUnavailableItems,
    hasInvalidQuantities,
    itemsWithFinancials,
  };
}

/**
 * Serializes the cart into a clean format ready for future Supabase DB insertion
 * @param {Array} items
 * @param {Object} totals
 * @param {Object} customerInfo
 * @returns {Object}
 */
export function serializeCartForSupabase(items, totals, customerInfo = {}) {
  return {
    order_type: 'B2B_WHOLESALE_PROFORMA',
    currency: totals.currency || 'INR',
    company_name: customerInfo.companyName || '',
    gstin: customerInfo.gstin || '',
    contact_email: customerInfo.email || '',
    contact_phone: customerInfo.phone || '',
    shipping_address: customerInfo.shippingAddress || '',
    financials: {
      base_subtotal: totals.baseSubtotal,
      subtotal: totals.subtotal,
      volume_discount: totals.tierDiscount,
      estimated_gst_tax: totals.estimatedTax,
      estimated_shipping: totals.estimatedShipping,
      grand_total: totals.netTotal,
      total_units: totals.totalUnits,
    },
    line_items: items.map((item) => ({
      item_key: item.itemKey,
      product_id: item.id || item.productId,
      name: item.name,
      category: item.category,
      color: item.selectedColor || 'Natural',
      quantity: item.quantity,
      unit_price: item.financials?.unitPrice || item.priceINR,
      line_total: item.financials?.lineSubtotal || 0,
      moq: item.moq,
    })),
    created_at: new Date().toISOString(),
  };
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
}

export function buildOrderIdempotencyKey(orderData = {}) {
  const stableItems = Array.isArray(orderData.items) ? orderData.items.map((item) => ({
    id: item.id || item.productId || item.product_id,
    quantity: Number(item.quantity || item.qty || 0),
    color: item.selectedColor || item.color || 'Natural',
  })) : [];

  const normalized = {
    customer: orderData.customer || {},
    email: String(orderData.customer?.email || orderData.email || '').trim().toLowerCase(),
    mobile: String(orderData.customer?.mobile || orderData.mobile || '').trim(),
    address: orderData.shippingAddress || orderData.address || {},
    items: stableItems,
    totals: orderData.totals || {},
    paymentMethod: orderData.paymentMethod || orderData.payment_method || 'COD',
  };

  const payload = JSON.stringify(normalized);
  return `order_${hashString(payload)}`;
}

export function readStorageJSON(storageKey, fallback = {}) {
  const store = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
  if (!store) {
    return fallback;
  }

  try {
    const raw = store.getItem(storageKey);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed || fallback;
  } catch (error) {
    console.warn('Failed to read storage JSON:', error);
    return fallback;
  }
}

export function writeStorageJSON(storageKey, nextValue) {
  const store = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
  if (!store) {
    return nextValue;
  }

  try {
    store.setItem(storageKey, JSON.stringify(nextValue));
    return nextValue;
  } catch (error) {
    console.warn('Failed to write storage JSON:', error);
    return nextValue;
  }
}

export function reserveOrderStock(items = [], idempotencyKey) {
  if (!idempotencyKey) {
    return { ok: false, error: 'Missing idempotency key to reserve stock.' };
  }

  const inventoryMap = readStorageJSON(LOCAL_STORAGE_ORDER_RESERVATIONS_KEY, {});
  const existingKey = inventoryMap[idempotencyKey];

  if (existingKey) {
    return { ok: true, alreadyReserved: true, reservationKey: idempotencyKey, reservation: existingKey };
  }

  const reservationSummary = {};

  for (const item of items) {
    const itemId = item.id || item.productId || item.product_id;
    const quantity = Number(item.quantity || item.qty || 0);
    if (!itemId || quantity <= 0) {
      continue;
    }

    const productStock = Number(
      item.stockQuantity ?? item.inventory?.available_quantity ?? item.inventory?.availableQuantity ?? 0
    );

    const existingReserved = Number((reservationSummary[itemId] || 0));
    const remaining = Math.max(0, productStock - existingReserved);

    if (remaining < quantity) {
      return {
        ok: false,
        error: `Insufficient stock remains for ${item.name || itemId}.`,
        itemId,
        requestedQuantity: quantity,
        availableStock: remaining,
      };
    }

    reservationSummary[itemId] = existingReserved + quantity;
  }

  const nextReservations = {
    ...inventoryMap,
    [idempotencyKey]: {
      idempotencyKey,
      reservedAt: new Date().toISOString(),
      items: Object.entries(reservationSummary).map(([productId, reservedQty]) => ({
        productId,
        reservedQty,
      })),
    },
  };

  writeStorageJSON(LOCAL_STORAGE_ORDER_RESERVATIONS_KEY, nextReservations);
  return { ok: true, alreadyReserved: false, reservationKey: idempotencyKey, reservation: nextReservations[idempotencyKey] };
}

export function releaseOrderStockReservation(idempotencyKey) {
  const reservations = readStorageJSON(LOCAL_STORAGE_ORDER_RESERVATIONS_KEY, {});
  if (!reservations[idempotencyKey]) {
    return { ok: true, released: false };
  }

  const nextReservations = { ...reservations };
  delete nextReservations[idempotencyKey];
  writeStorageJSON(LOCAL_STORAGE_ORDER_RESERVATIONS_KEY, nextReservations);
  return { ok: true, released: true };
}

export function getExistingOrderByIdempotencyKey(idempotencyKey, orders = []) {
  if (!idempotencyKey || !Array.isArray(orders)) {
    return null;
  }

  return orders.find((order) => order.idempotencyKey === idempotencyKey) || null;
}
