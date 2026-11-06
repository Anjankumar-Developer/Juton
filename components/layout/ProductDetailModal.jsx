'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, ShieldCheck, Check, Sparkles, Layers, Ruler, Truck, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useBrand } from '@/context/BrandContext';
import { formatCurrency, formatMOQ } from '@/lib/utils';

export default function ProductDetailModal() {
  const {
    productDetailModalOpen,
    closeProductDetail,
    activeProductDetail: product,
    activeCurrency,
    addToQuote,
    openSampleRequest,
  } = useBrand();

  const [quantity, setQuantity] = useState(100);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToQuote(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSample = () => {
    closeProductDetail();
    openSampleRequest(product);
  };

  const startingPrice =
    activeCurrency === 'USD' ? (product.priceUSD || 3.5) : (product.priceINR || 145);

  return (
    <AnimatePresence>
      {productDetailModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProductDetail}
            className="fixed inset-0 bg-[#252720]/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-3xl bg-[#F7F5EF] border-2 border-[#A88B66] shadow-2xl p-6 sm:p-8 z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeProductDetail}
              className="absolute top-5 right-5 p-2 text-[#252720] hover:bg-[#E8DDCA]/60 transition-colors border border-[#E8DDCA] z-20 cursor-pointer"
              aria-label="Close product details"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Product Visual */}
              <div className="md:col-span-5 space-y-3">
                <div className="relative aspect-[4/5] w-full bg-[#E8DDCA]/30 border border-[#E8DDCA] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <Badge variant="moq" size="sm" icon={Package}>
                      {formatMOQ(product.moq)}
                    </Badge>
                    {product.badge && (
                      <Badge variant="jute" size="sm" icon={Sparkles}>
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#68745A] font-sans px-1">
                  <span>Authentic Golden Jute</span>
                  <span className="font-semibold text-[#252720]">Direct Bengal Mill Production</span>
                </div>
              </div>

              {/* Product Content & Specs */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-[#68745A] font-semibold font-sans block">
                    {product.category}
                  </span>
                  <h3 id="product-detail-title" className="font-serif text-2xl sm:text-3xl text-[#252720]">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl sm:text-2xl font-serif font-bold text-[#3D4935]">
                      {formatCurrency(startingPrice, activeCurrency)}
                    </span>
                    <span className="text-xs text-[#252720]/60 font-sans">/ unit (Wholesale Base)</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#252720]/75 font-sans leading-relaxed">
                  {product.description}
                </p>

                {/* Technical Specifications */}
                <div className="grid grid-cols-2 gap-2 text-xs font-sans bg-[#FFFFFF] p-3.5 border border-[#E8DDCA]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#68745A] block">Fabric Spec</span>
                    <span className="font-medium text-[#252720]">{product.fabricWeight}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#68745A] block">Dimensions</span>
                    <span className="font-medium text-[#252720]">{product.dimensions}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E8DDCA]/60">
                    <span className="text-[10px] uppercase tracking-wider text-[#68745A] block">Handle Type</span>
                    <span className="font-medium text-[#252720]">{product.handleType}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E8DDCA]/60">
                    <span className="text-[10px] uppercase tracking-wider text-[#68745A] block">Pan-India Transit</span>
                    <span className="font-medium text-[#3D4935]">{product.leadTime}</span>
                  </div>
                </div>

                {/* Volume Tier Table */}
                {product.pricingTiersINR && (
                  <div className="bg-[#E8DDCA]/30 p-3 border border-[#E8DDCA] space-y-1.5 text-xs font-sans">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-[#3D4935]">
                      Tiered Bulk Quotation Matrix (INR)
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {product.pricingTiersINR.map((tier, i) => (
                        <div key={i} className="bg-[#FFFFFF] p-2 border border-[#E8DDCA]">
                          <span className="text-[10px] text-[#68745A] block">
                            {tier.min}{tier.max ? `-${tier.max}` : '+'} pcs
                          </span>
                          <span className="font-bold text-[#252720]">
                            {formatCurrency(tier.price, 'INR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Input & Actions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <label htmlFor="modal-quantity" className="text-xs font-semibold uppercase tracking-wider text-[#252720]">
                      Quantity (Min {product.moq} pcs):
                    </label>
                    <input
                      id="modal-quantity"
                      type="number"
                      min={product.moq}
                      step={25}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value)))}
                      className="w-24 px-2 py-1.5 bg-[#FFFFFF] border border-[#E8DDCA] text-xs font-mono font-bold text-center text-[#252720]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={added ? 'secondary' : 'primary'}
                      size="md"
                      icon={added ? Check : ArrowRight}
                      iconPosition="right"
                      onClick={handleAdd}
                      className="text-xs uppercase tracking-widest font-semibold"
                    >
                      {added ? 'Added to Quote' : 'Add to Bulk Quote'}
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      icon={Sparkles}
                      onClick={handleSample}
                      className="text-xs uppercase tracking-widest font-semibold"
                    >
                      Request Swatch
                    </Button>
                  </div>

                  <div className="pt-2 text-center border-t border-[#E8DDCA]/60">
                    <Link
                      href={`/shop/${product.id}`}
                      onClick={closeProductDetail}
                      className="text-xs uppercase tracking-wider text-[#3D4935] hover:text-[#252720] font-semibold underline decoration-[#A88B66] underline-offset-4"
                    >
                      Open Full Product Specs & Pricing Page →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
