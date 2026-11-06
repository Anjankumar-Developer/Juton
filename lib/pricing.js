/**
 * Pure Wholesale Pricing & Calculation Logic for JUTON
 */

/**
 * Calculates wholesale price per unit and total price for a given quantity
 * @param {Object} product
 * @param {number} quantity
 * @param {string} currency - 'INR' | 'USD'
 * @returns {{ unitPrice: number, totalPrice: number, validMOQ: boolean, activeTier: Object|null }}
 */
export function calculateWholesalePrice(product, quantity, currency = 'INR') {
  if (!product || !quantity || quantity <= 0) {
    return {
      unitPrice: 0,
      totalPrice: 0,
      validMOQ: false,
      activeTier: null,
    };
  }

  const validMOQ = quantity >= (product.moq || 50);

  // Use INR tiers if currency is INR, else USD tiers
  const tiers = currency === 'USD' ? (product.pricingTiers || []) : (product.pricingTiersINR || []);
  let matchedTier = null;

  for (const tier of tiers) {
    if (quantity >= tier.min && (tier.max === null || quantity <= tier.max)) {
      matchedTier = tier;
      break;
    }
  }

  const fallbackPrice = currency === 'USD' ? (product.priceUSD || product.basePrice || 0) : (product.priceINR || 145);
  const unitPrice = matchedTier ? matchedTier.price : fallbackPrice;
  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  return {
    unitPrice,
    totalPrice,
    validMOQ,
    activeTier: matchedTier,
  };
}

/**
 * Validates a wholesale sample request / quotation inquiry
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateInquiry(data) {
  const errors = {};

  if (!data.businessName || data.businessName.trim().length < 2) {
    errors.businessName = 'Business name is required (minimum 2 characters)';
  }

  if (!data.workEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.workEmail)) {
    errors.workEmail = 'Valid business email is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
