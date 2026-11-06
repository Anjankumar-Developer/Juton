import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency for Indian Wholesale or Export pricing
 * @param {number} amount
 * @param {string} currency - 'INR' | 'USD'
 * @returns {string}
 */
export function formatCurrency(amount, currency = "INR") {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Format in Indian Rupees with comma grouping (e.g. ₹1,450.00 or ₹145)
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format Minimum Order Quantity (MOQ)
 * @param {number} moq
 * @returns {string}
 */
export function formatMOQ(moq) {
  return `${moq.toLocaleString()} pcs MOQ`;
}
