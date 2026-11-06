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

export const FREE_SHIPPING_THRESHOLD_INR = 25000;
export const FREE_SHIPPING_THRESHOLD_USD = 300;
export const FLAT_SHIPPING_RATE_INR = 850;
export const FLAT_SHIPPING_RATE_USD = 15;
export const GST_RATE_PERCENT = 5; // 5% GST for Indian textile/jute packaging

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
