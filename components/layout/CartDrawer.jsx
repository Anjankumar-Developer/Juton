'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Truck,
  FileText,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { calculateItemFinancials } from '@/lib/cart';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Wholesale Cart Drawer"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-[#252720]/65 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="w-screen max-w-md bg-[#F7F5EF] shadow-2xl flex flex-col border-l border-[#A88B66]"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#E8DDCA] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#68745A] font-sans font-semibold block">
                  Wholesale Procurement
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#252720]">
                  Commercial Cart ({totals.totalUnits} Units)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] uppercase tracking-wider text-[#68745A] hover:text-red-700 font-sans font-medium px-2 py-1 transition-colors"
                    title="Clear entire wholesale cart"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-[#252720] hover:bg-[#E8DDCA]/60 transition-colors border border-[#E8DDCA]"
                  aria-label="Close cart drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cart Feedback Notification Toast */}
            {cartFeedback && (
              <div
                className={`px-4 py-2.5 text-xs font-sans border-b flex items-center gap-2 ${
                  cartFeedback.type === 'error'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : cartFeedback.type === 'warning'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-[#E8DDCA]/60 text-[#3D4935] border-[#A88B66]/40'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{cartFeedback.message}</span>
              </div>
            )}

            {/* Free Shipping Progress Indicator */}
            {items.length > 0 && (
              <div className="bg-[#E8DDCA]/35 px-5 py-3 border-b border-[#E8DDCA] text-xs font-sans">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-[#3D4935] font-medium flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#68745A]" />
                    {totals.isFreeShipping
                      ? 'Complimentary Pan-India Mill Freight Unlocked!'
                      : `Add ${formatCurrency(totals.amountUntilFreeShipping, activeCurrency)} more for Free Shipping`}
                  </span>
                  <span className="font-bold text-[#252720]">
                    {Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100))}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#E8DDCA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3D4935] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (totals.subtotal / totals.freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Cart Body: Item List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {!isLoaded ? (
                // Loading / Restoring State
                <div className="py-20 text-center space-y-3 font-sans">
                  <div className="inline-block w-8 h-8 border-2 border-[#3D4935] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs uppercase tracking-widest text-[#68745A]">
                    Restoring Wholesale Cart...
                  </p>
                </div>
              ) : items.length === 0 ? (
                // Empty Cart State
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-[#E8DDCA]/50 text-[#68745A] rounded-full flex items-center justify-center mx-auto border border-[#E8DDCA]">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-2xl text-[#252720]">Your Wholesale Cart is Empty</h4>
                  <p className="text-xs text-[#252720]/75 max-w-xs mx-auto font-sans leading-relaxed font-light">
                    Select from our commercial jute tote, grocery, wine, and corporate conference collections to configure your volume quotation.
                  </p>
                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsCartOpen(false)}
                      as={Link}
                      href="/shop"
                      className="text-xs uppercase tracking-widest"
                    >
                      Explore Wholesale Catalog
                    </Button>
                  </div>
                </div>
              ) : (
                // Line Items List
                items.map((item) => {
                  const fin = item.financials || calculateItemFinancials(item, activeCurrency);
                  const isBelowMOQ = item.quantity < (item.moq || 50);
                  const isExceedingStock = item.quantity > (item.stockQuantity || 5000);
                  const isItemUnavailable = !item.inStock || item.stockQuantity === 0;

                  return (
                    <div
                      key={item.itemKey}
                      className={`bg-[#FFFFFF] p-4 border transition-all space-y-3 relative ${
                        isItemUnavailable
                          ? 'border-red-300 bg-red-50/20'
                          : isBelowMOQ || isExceedingStock
                          ? 'border-amber-300'
                          : 'border-[#E8DDCA] hover:border-[#A88B66]'
                      }`}
                    >
                      {/* Top Item Row */}
                      <div className="flex gap-3.5">
                        {/* Thumbnail */}
                        <Link
                          href={`/shop/${item.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="relative w-18 h-18 bg-[#E8DDCA]/40 flex-shrink-0 overflow-hidden border border-[#E8DDCA] block hover:opacity-90"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="72px"
                            referrerPolicy="no-referrer"
                          />
                        </Link>

                        {/* Title, Color, Unit Price */}
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="font-serif text-sm font-bold text-[#252720] truncate">
                            <Link
                              href={`/shop/${item.id}`}
                              onClick={() => setIsCartOpen(false)}
                              className="hover:underline decoration-[#A88B66]"
                            >
                              {item.name}
                            </Link>
                          </h4>

                          {item.selectedColor && (
                            <div className="text-[11px] text-[#A88B66] font-medium font-sans">
                              Variant: {item.selectedColor}
                            </div>
                          )}

                          {/* Unit price with tier badge */}
                          <div className="text-[11px] text-[#68745A] font-sans flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="font-semibold text-[#252720]">
                              {formatCurrency(fin.unitPrice || item.priceINR, activeCurrency)} / pc
                            </span>
                            <span>•</span>
                            <span className="text-[10px] uppercase text-[#3D4935]">
                              {fin.tierLabel || 'Standard'}
                            </span>
                          </div>

                          {/* Line subtotal */}
                          <div className="text-xs font-serif font-bold text-[#3D4935] mt-1 flex items-center justify-between">
                            <span>Subtotal: {formatCurrency(fin.lineSubtotal || 0, activeCurrency)}</span>
                            {fin.lineSavings > 0 && (
                              <span className="text-[10px] text-[#68745A] font-sans font-medium">
                                (Saved {formatCurrency(fin.lineSavings, activeCurrency)})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.itemKey)}
                          className="absolute top-3 right-3 text-[#252720]/40 hover:text-red-700 p-1 transition-colors"
                          aria-label={`Remove ${item.name} from wholesale cart`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Stock / MOQ Warning Banners */}
                      {isItemUnavailable && (
                        <div className="text-[10px] text-red-700 bg-red-50 p-1.5 border border-red-200 font-sans flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                          <span>Product currently unavailable or made-to-order run.</span>
                        </div>
                      )}

                      {isBelowMOQ && (
                        <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 border border-amber-200 font-sans flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                          <span>Below MOQ requirement ({item.moq} pcs minimum).</span>
                        </div>
                      )}

                      {isExceedingStock && (
                        <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 border border-amber-200 font-sans flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                          <span>Exceeds available stock ({item.stockQuantity} pcs max).</span>
                        </div>
                      )}

                      {/* Quantity Stepper Controls (Feature 3, 8, 9) */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E8DDCA]/60 text-xs">
                        <div className="text-[11px] text-[#68745A] font-sans">
                          <span>MOQ: {item.moq}</span>
                          <span className="mx-1">•</span>
                          <span>Max: {item.stockQuantity || 5000}</span>
                        </div>

                        <div className="flex items-center border border-[#E8DDCA] bg-[#F7F5EF]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.itemKey, item.quantity - 25)}
                            className="p-1.5 hover:bg-[#E8DDCA] text-[#252720] transition-colors cursor-pointer"
                            aria-label="Decrease quantity by 25"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            type="number"
                            min={item.moq || 50}
                            max={item.stockQuantity || 5000}
                            step={25}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.itemKey, e.target.value)}
                            className="w-16 py-1 font-mono font-bold text-xs text-center text-[#252720] bg-transparent outline-none"
                            aria-label={`Quantity for ${item.name}`}
                          />

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.itemKey, item.quantity + 25)}
                            className="p-1.5 hover:bg-[#E8DDCA] text-[#252720] transition-colors cursor-pointer"
                            aria-label="Increase quantity by 25"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Order Summary & Actions */}
            {items.length > 0 && (
              <div className="bg-[#FFFFFF] p-5 sm:p-6 border-t border-[#E8DDCA] space-y-3.5 shadow-lg">
                {/* Financial Breakdown Table */}
                <div className="space-y-2 text-xs font-sans">
                  {/* Raw Base Subtotal */}
                  <div className="flex justify-between text-[#68745A]">
                    <span>Base Wholesale Value:</span>
                    <span>{formatCurrency(totals.baseSubtotal, activeCurrency)}</span>
                  </div>

                  {/* Quantity Tier Discount */}
                  {totals.tierDiscount > 0 && (
                    <div className="flex justify-between text-[#3D4935] font-medium bg-[#E8DDCA]/40 px-2 py-1">
                      <span>Volume Tier Savings ({totals.savingsPercentage}%):</span>
                      <span>- {formatCurrency(totals.tierDiscount, activeCurrency)}</span>
                    </div>
                  )}

                  {/* Subtotal after discount */}
                  <div className="flex justify-between text-[#252720] font-semibold">
                    <span>Discounted Subtotal:</span>
                    <span>{formatCurrency(totals.subtotal, activeCurrency)}</span>
                  </div>

                  {/* GST Tax */}
                  <div className="flex justify-between text-[#68745A]">
                    <span>Estimated GST (5% B2B Credit):</span>
                    <span>{formatCurrency(totals.estimatedTax, activeCurrency)}</span>
                  </div>

                  {/* Freight */}
                  <div className="flex justify-between text-[#68745A]">
                    <span>Pan-India Freight:</span>
                    <span>
                      {totals.isFreeShipping ? (
                        <span className="text-[#3D4935] font-semibold uppercase">Free Mill Dispatch</span>
                      ) : (
                        formatCurrency(totals.estimatedShipping, activeCurrency)
                      )}
                    </span>
                  </div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#E8DDCA] font-serif text-base font-bold text-[#252720]">
                    <span>Estimated Proforma Total:</span>
                    <span className="text-xl text-[#3D4935]">
                      {formatCurrency(totals.netTotal, activeCurrency)}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-1">
                  <Button
                    variant="primary"
                    size="lg"
                    as={Link}
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    disabled={totals.hasUnavailableItems}
                    className="w-full text-xs uppercase tracking-widest font-semibold justify-center py-3.5"
                  >
                    Proceed to B2B Checkout
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="px-3 py-2 text-center text-xs uppercase tracking-wider font-semibold border border-[#E8DDCA] text-[#3D4935] hover:bg-[#E8DDCA]/50 transition-colors"
                    >
                      View Full Cart Page
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="px-3 py-2 text-center text-xs uppercase tracking-wider font-semibold border border-transparent text-[#68745A] hover:text-[#252720] transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#68745A] uppercase tracking-wider font-sans pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3D4935]" />
                  <span>GST Invoicing • Pan-India Door Delivery • Zero Public Rate Leak</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
