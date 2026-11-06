'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Sparkles, ArrowRight, Plus, Check } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatMOQ } from '@/lib/utils';
import { useBrand } from '@/context/BrandContext';

/**
 * Reusable Luxury Editorial Product Card
 * Complies with Prompt 3:
 * - Product image
 * - Product name
 * - Product category
 * - Starting price (with demo note)
 * - Minimum order quantity
 * - Available colors
 * - View details button
 */
export default function ProductCard({ product }) {
  const { addToQuote, activeCurrency } = useBrand();
  const [isAdded, setIsAdded] = useState(false);

  const startingPrice =
    activeCurrency === 'USD' ? (product.priceUSD || 3.5) : (product.priceINR || 145);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : 'Natural';
    addToQuote(product, product.moq, defaultColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col bg-[#FFFFFF] border border-[#E8DDCA] transition-all duration-300 hover:border-[#A88B66] hover:shadow-[0_12px_36px_rgba(37,39,32,0.07)]"
    >
      {/* Product Image Stage */}
      <Link
        href={`/shop/${product.id}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8DDCA]/30 block focus:outline-none"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none z-10">
          <Badge variant="moq" size="sm" icon={Package}>
            {formatMOQ(product.moq)}
          </Badge>

          {product.badge && (
            <Badge variant="jute" size="sm" icon={Sparkles}>
              {product.badge}
            </Badge>
          )}
        </div>

        {/* Availability tag */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium border font-sans ${
              product.inStock
                ? 'bg-[#F7F5EF]/90 text-[#3D4935] border-[#A88B66]/40'
                : 'bg-[#E8DDCA]/90 text-[#68745A] border-[#A88B66]/40'
            }`}
          >
            {product.inStock ? 'Mill Ready' : 'Made to Order'}
          </span>
        </div>
      </Link>

      {/* Product Body Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 bg-[#FFFFFF]">
        {/* Category & Fabric Weight Spec */}
        <div className="flex items-center justify-between text-xs text-[#68745A] font-medium tracking-wide mb-2 uppercase font-sans">
          <span>{product.category}</span>
          <span className="text-[#A88B66]">{product.fabricWeight.split(' ')[0]} GSM</span>
        </div>

        {/* Product Heading */}
        <h3 className="font-serif text-xl text-[#252720] leading-snug tracking-tight mb-2 group-hover:text-[#3D4935] transition-colors">
          <Link href={`/shop/${product.id}`} className="hover:underline decoration-[#A88B66] underline-offset-4">
            {product.name}
          </Link>
        </h3>

        {/* Available Colors (Prompt 3 requirement) */}
        <div className="py-2.5 border-t border-[#E8DDCA]/50">
          <div className="flex items-center justify-between gap-2 text-[11px] font-sans">
            <span className="text-[#68745A] uppercase tracking-wider text-[10px]">
              Available Colors:
            </span>
            <div className="flex items-center gap-1.5" title={product.colors?.map(c => c.name).join(', ')}>
              {product.colors && product.colors.map((color) => (
                <span
                  key={color.name}
                  className="w-3.5 h-3.5 rounded-full border shadow-2xs transition-transform hover:scale-125"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: color.border || '#A88B66'
                  }}
                  title={color.name}
                />
              ))}
              <span className="text-[10px] text-[#68745A] ml-1 font-medium">
                ({product.colors?.length || 1})
              </span>
            </div>
          </div>
        </div>

        {/* Starting Price & Minimum Order Quantity */}
        <div className="pt-3 border-t border-[#E8DDCA]/70 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#68745A] block font-sans">
              Starting Wholesale Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-serif font-bold text-[#252720]">
                {formatCurrency(startingPrice, activeCurrency)}
              </span>
              <span className="text-xs text-[#252720]/60 font-sans">/ pc</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#68745A] block font-sans">
              Minimum Order
            </span>
            <span className="text-xs font-semibold text-[#3D4935] font-sans">
              {product.moq} pieces
            </span>
          </div>
        </div>

        {/* Demo pricing disclaimer badge */}
        <div className="mt-1 text-[10px] text-[#A88B66] italic font-sans">
          *Sample demo rate (Volume discounts at 100+ units)
        </div>

        {/* Action Buttons: View Details (Required by prompt) + Quick Add to Bulk Quote */}
        <div className="grid grid-cols-2 gap-2 pt-4 mt-auto">
          <Link
            href={`/shop/${product.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider font-semibold border border-[#3D4935] text-[#3D4935] bg-transparent hover:bg-[#3D4935] hover:text-[#FFFFFF] transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Button
            variant={isAdded ? 'secondary' : 'primary'}
            size="sm"
            icon={isAdded ? Check : Plus}
            onClick={handleQuickAdd}
            className="text-xs uppercase tracking-wider font-semibold"
          >
            {isAdded ? 'Added' : 'Add to Quote'}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
