'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  AlertTriangle,
  FileText,
  Info,
  Package,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { calculateItemFinancials } from '@/lib/cart';
import CheckoutModal from '@/components/cart/CheckoutModal';

export default function CartPage() {
  const {
    items,
    totals,
    updateQuantity,
    removeFromCart,
    clearCart,
    setCheckoutModalOpen,
    cartFeedback,
    isLoaded,
    activeCurrency,
  } = useCart();

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  return (
    <div className="bg-[#F7F5EF] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="border-b border-[#E8DDCA] bg-[#F7F5EF] pt-10 pb-12 sm:pt-14 sm:pb-16">
        <Container>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#68745A] font-sans uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-[#3D4935] hover:underline transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#3D4935] hover:underline transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-[#3D4935] font-semibold">Wholesale Cart</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8DDCA]/60 border border-[#A88B66]/40 text-[#3D4935] text-xs uppercase tracking-[0.2em] font-medium font-sans">
                <Package className="w-3.5 h-3.5 text-[#68745A]" />
                Commercial Procurement Review
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl text-[#252720] leading-tight font-medium">
                Wholesale <span className="italic text-[#3D4935]">Cart & Order Summary</span>
              </h1>

              <p className="font-sans text-xs sm:text-sm text-[#252720]/80 leading-relaxed font-light">
                Review your commercial jute bag order batches, inspect volume tier rate discounts, and generate official B2B proforma documentation for direct Bengal mill production.
              </p>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmClearOpen(true)}
                  className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Entire Cart</span>
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Clear Confirmation Dialog */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252720]/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] p-6 max-w-sm w-full border-2 border-[#A88B66] shadow-xl space-y-4 font-sans text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#252720]">Clear Entire Cart?</h3>
            <p className="text-xs text-[#252720]/75 leading-relaxed">
              This will remove all {totals.totalItems} line items ({totals.totalUnits} pieces) from your active wholesale order.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 border border-[#E8DDCA] text-xs font-semibold text-[#252720] hover:bg-[#F7F5EF]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setConfirmClearOpen(false);
                }}
                className="px-4 py-2 bg-red-700 text-xs font-semibold text-white hover:bg-red-800"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Cart Content */}
      <section className="pt-8 sm:pt-12">
        <Container>
          {/* Feedback Toast */}
          {cartFeedback && (
            <div
              className={`mb-6 p-4 text-xs font-sans border flex items-center justify-between ${
                cartFeedback.type === 'error'
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : cartFeedback.type === 'warning'
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-[#E8DDCA]/60 text-[#3D4935] border-[#A88B66]/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{cartFeedback.message}</span>
              </div>
            </div>
          )}

          {!isLoaded ? (
            // Loading State
            <div className="py-24 text-center space-y-3 font-sans">
              <div className="inline-block w-8 h-8 border-2 border-[#3D4935] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs uppercase tracking-widest text-[#68745A]">
                Restoring Wholesale Cart Session...
              </p>
            </div>
          ) : items.length === 0 ? (
            // Empty Cart State
            <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-12 sm:p-16 text-center space-y-5 max-w-xl mx-auto my-8">
              <div className="w-20 h-20 bg-[#E8DDCA]/50 text-[#68745A] rounded-full flex items-center justify-center mx-auto border border-[#E8DDCA]">
                <ShoppingBag className="w-9 h-9" />
              </div>
              <h2 className="font-serif text-3xl text-[#252720]">Your Wholesale Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-[#252720]/75 max-w-md mx-auto font-sans leading-relaxed font-light">
                You have not added any commercial jute carrier models to your cart yet. Explore our 6 specialized product collections to configure wholesale batch quantities and unlock tiered factory pricing.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  as={Link}
                  href="/shop"
                  className="text-xs uppercase tracking-widest font-semibold"
                >
                  Browse Full Wholesale Catalog
                </Button>
                <Link
                  href="/"
                  className="px-5 py-2.5 text-xs uppercase tracking-widest font-semibold border border-[#E8DDCA] text-[#3D4935] hover:bg-[#E8DDCA]/50 transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            // Full Cart Layout: Line items on Left, Order summary on Right
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Line Items Table */}
              <div className="lg:col-span-8 space-y-4">
                {/* Free Shipping Alert Box */}
                <div className="p-4 bg-[#FFFFFF] border border-[#E8DDCA] flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#3D4935]" />
                    <span className="text-[#252720]">
                      {totals.isFreeShipping ? (
                        <strong className="text-[#3D4935]">Complimentary Pan-India Mill Freight Unlocked!</strong>
                      ) : (
                        <span>
                          Add <strong>{formatCurrency(totals.amountUntilFreeShipping, activeCurrency)}</strong> more of sustainable jute to unlock Free Pan-India Freight.
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="font-semibold text-[#A88B66] uppercase text-[10px] tracking-wider hidden sm:inline">
                    Direct Mill Logistics
                  </span>
                </div>

                {/* Line Items Container */}
                <div className="border border-[#E8DDCA] bg-[#FFFFFF] divide-y divide-[#E8DDCA]/70">
                  {items.map((item) => {
                    const fin = item.financials || calculateItemFinancials(item, activeCurrency);
                    const isBelowMOQ = item.quantity < (item.moq || 50);
                    const isExceedingStock = item.quantity > (item.stockQuantity || 5000);
                    const isItemUnavailable = !item.inStock || item.stockQuantity === 0;

                    return (
                      <div
                        key={item.itemKey}
                        className={`p-5 sm:p-6 transition-all space-y-4 ${
                          isItemUnavailable
                            ? 'bg-red-50/20'
                            : isBelowMOQ || isExceedingStock
                            ? 'bg-amber-50/20'
                            : ''
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row gap-5">
                          {/* Thumbnail */}
                          <Link
                            href={`/shop/${item.id}`}
                            className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#E8DDCA]/40 flex-shrink-0 overflow-hidden border border-[#E8DDCA] block hover:opacity-95"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="112px"
                              referrerPolicy="no-referrer"
                            />
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-[#68745A] font-sans font-medium block">
                                  {item.category} • {item.fabricWeight}
                                </span>
                                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252720] leading-snug">
                                  <Link
                                    href={`/shop/${item.id}`}
                                    className="hover:underline decoration-[#A88B66]"
                                  >
                                    {item.name}
                                  </Link>
                                </h3>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.itemKey)}
                                className="text-[#252720]/40 hover:text-red-700 p-1.5 transition-colors"
                                title="Remove item"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Color variant & specs */}
                            <div className="text-xs text-[#252720] font-sans flex flex-wrap items-center gap-3 pt-1">
                              {item.selectedColor && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F5EF] border border-[#E8DDCA] text-[11px] font-medium text-[#3D4935]">
                                  <span className="w-2 h-2 rounded-full bg-[#A88B66]" />
                                  Variant: {item.selectedColor}
                                </span>
                              )}

                              <span className="text-[#68745A] text-[11px]">
                                MOQ: {item.moq} pcs
                              </span>
                              <span className="text-[#68745A] text-[11px]">
                                Mill Stock: {item.stockQuantity || 5000} pcs
                              </span>
                            </div>

                            {/* Status Warnings */}
                            {isItemUnavailable && (
                              <div className="text-xs text-red-700 bg-red-50 p-2 border border-red-200 font-sans flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>This model is currently out of stock or custom made-to-order run.</span>
                              </div>
                            )}

                            {isBelowMOQ && (
                              <div className="text-xs text-amber-800 bg-amber-50 p-2 border border-amber-200 font-sans flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>Quantity is below the minimum mill batch size of {item.moq} pieces.</span>
                              </div>
                            )}

                            {isExceedingStock && (
                              <div className="text-xs text-amber-800 bg-amber-50 p-2 border border-amber-200 font-sans flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>Quantity exceeds available inventory ({item.stockQuantity} pieces max).</span>
                              </div>
                            )}

                            {/* Financial breakdown row: Price, Stepper, Subtotal */}
                            <div className="pt-3 border-t border-[#E8DDCA]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              {/* Unit Price & Active Tier */}
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-[#68745A] font-sans block">
                                  Wholesale Rate
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="font-serif text-lg font-bold text-[#252720]">
                                    {formatCurrency(fin.unitPrice || item.priceINR, activeCurrency)}
                                  </span>
                                  <span className="text-xs text-[#252720]/60 font-sans">/ pc</span>
                                </div>
                                <span className="text-[10px] text-[#68745A] font-sans block">
                                  {fin.tierLabel}
                                </span>
                              </div>

                              {/* Quantity Stepper (Features 3, 8, 9) */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-sans text-[#68745A]">Quantity:</span>
                                <div className="flex items-center border border-[#A88B66] bg-[#F7F5EF]">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.itemKey, item.quantity - 25)}
                                    className="p-2 text-[#252720] hover:bg-[#E8DDCA] transition-colors cursor-pointer"
                                    aria-label="Decrease quantity by 25"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>

                                  <input
                                    type="number"
                                    min={item.moq || 50}
                                    max={item.stockQuantity || 5000}
                                    step={25}
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.itemKey, e.target.value)}
                                    className="w-20 text-center py-1.5 bg-transparent font-serif text-sm font-bold text-[#252720] outline-none"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.itemKey, item.quantity + 25)}
                                    className="p-2 text-[#252720] hover:bg-[#E8DDCA] transition-colors cursor-pointer"
                                    aria-label="Increase quantity by 25"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Line Subtotal */}
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] uppercase tracking-wider text-[#68745A] font-sans block">
                                  Line Subtotal
                                </span>
                                <div className="font-serif text-lg font-bold text-[#3D4935] mt-0.5">
                                  {formatCurrency(fin.lineSubtotal || 0, activeCurrency)}
                                </div>
                                {fin.lineSavings > 0 && (
                                  <span className="text-[10px] text-[#68745A] font-sans font-medium block">
                                    Saved {formatCurrency(fin.lineSavings, activeCurrency)} vs Base Rate
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue Shopping Link */}
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#3D4935] hover:text-[#252720] font-semibold underline decoration-[#A88B66] underline-offset-4"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Continue Browsing Products</span>
                  </Link>

                  <span className="text-xs text-[#68745A] font-sans">
                    {totals.totalItems} distinct model(s) in active cart
                  </span>
                </div>
              </div>

              {/* Right Column: Authoritative Order Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#FFFFFF] p-6 sm:p-7 border-2 border-[#A88B66] shadow-sm space-y-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#68745A] font-sans font-semibold block">
                      Pan-India Wholesale Billing
                    </span>
                    <h3 className="font-serif text-2xl text-[#252720] mt-0.5">
                      Order Summary
                    </h3>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="space-y-3 pt-3 border-t border-[#E8DDCA] text-xs font-sans">
                    {/* Raw Base Subtotal */}
                    <div className="flex justify-between text-[#68745A]">
                      <span>Base Wholesale Value:</span>
                      <span className="font-mono">{formatCurrency(totals.baseSubtotal, activeCurrency)}</span>
                    </div>

                    {/* Quantity Tier Discount */}
                    {totals.tierDiscount > 0 && (
                      <div className="flex justify-between text-[#3D4935] font-semibold bg-[#E8DDCA]/40 p-2.5 border border-[#A88B66]/30">
                        <span>Volume Tier Savings ({totals.savingsPercentage}%):</span>
                        <span className="font-mono">- {formatCurrency(totals.tierDiscount, activeCurrency)}</span>
                      </div>
                    )}

                    {/* Discounted Subtotal */}
                    <div className="flex justify-between text-[#252720] font-semibold">
                      <span>Discounted Subtotal:</span>
                      <span className="font-mono">{formatCurrency(totals.subtotal, activeCurrency)}</span>
                    </div>

                    {/* GST Tax */}
                    <div className="flex justify-between text-[#68745A]">
                      <span>Estimated GST (5% B2B Credit):</span>
                      <span className="font-mono">{formatCurrency(totals.estimatedTax, activeCurrency)}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-[#68745A]">
                      <span>Pan-India Mill Freight:</span>
                      <span>
                        {totals.isFreeShipping ? (
                          <span className="text-[#3D4935] font-semibold uppercase">Free Mill Dispatch</span>
                        ) : (
                          <span className="font-mono">{formatCurrency(totals.estimatedShipping, activeCurrency)}</span>
                        )}
                      </span>
                    </div>

                    {/* Total units count */}
                    <div className="flex justify-between text-[#68745A]">
                      <span>Total Piece Count:</span>
                      <span className="font-semibold text-[#252720]">{totals.totalUnits} pieces</span>
                    </div>

                    {/* Net Total */}
                    <div className="flex justify-between items-baseline pt-3 border-t-2 border-[#E8DDCA] font-serif font-bold text-lg text-[#252720]">
                      <span>Estimated Net Total:</span>
                      <span className="text-2xl text-[#3D4935]">
                        {formatCurrency(totals.netTotal, activeCurrency)}
                      </span>
                    </div>
                  </div>

                  {/* Proceed to Checkout Button */}
                  <div className="pt-2 space-y-2.5">
                    <Button
                      variant="primary"
                      size="lg"
                      as={Link}
                      href="/checkout"
                      disabled={totals.hasUnavailableItems}
                      className="w-full text-xs uppercase tracking-widest font-semibold justify-center py-4"
                    >
                      Proceed to B2B Checkout
                    </Button>
                    <button
                      type="button"
                      onClick={() => setCheckoutModalOpen(true)}
                      className="w-full py-2.5 text-center text-xs font-sans text-[#3D4935] hover:text-[#252720] border border-[#E8DDCA] hover:bg-[#F7F5EF] transition-colors font-medium cursor-pointer"
                    >
                      Or Request Proforma Quotation PDF
                    </button>

                    {totals.hasUnavailableItems && (
                      <p className="text-[11px] text-red-700 text-center font-sans">
                        Please remove out-of-stock items before generating proforma invoice.
                      </p>
                    )}
                  </div>

                  {/* Business Reassurance */}
                  <div className="pt-4 border-t border-[#E8DDCA]/70 space-y-2 text-[11px] text-[#68745A] font-sans">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#3D4935] flex-shrink-0" />
                      <span>Official GST Tax Invoices for 100% Input Credit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#3D4935] flex-shrink-0" />
                      <span>Insured surface & air logistics across 28 states</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#3D4935] flex-shrink-0" />
                      <span>Pre-production digital proofs provided within 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* B2B Checkout Modal */}
      <CheckoutModal />
    </div>
  );
}
