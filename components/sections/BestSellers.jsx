'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import ProductCard from '@/components/ui/ProductCard';
import { products, CATEGORIES } from '@/data/products';
import { useBrand } from '@/context/BrandContext';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';

/**
 * Section 6: Best Sellers
 * Compliant with Prompt 2 & Prompt 3:
 * Reusable product cards with:
 * - Product image
 * - Product name
 * - Product category
 * - Starting price
 * - Minimum order quantity
 * - Available colors
 * - View details button
 */
export default function BestSellers() {
  const { selectedCategory, setSelectedCategory } = useBrand();

  const filterTabs = [
    'All',
    'Shopping Bags',
    'Tote Bags',
    'Gift Bags',
    'Promotional Bags',
    'Custom Printed Bags',
    'Corporate Bags',
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? products.filter((p) => p.isBestSeller || p.badge)
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="best-sellers" className="scroll-mt-24 py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#E8DDCA]">
      <Container>
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E8DDCA]">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-[#A88B66] font-semibold font-sans block">
              Proven Commercial Silhouettes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#252720] tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-[#252720]/75 font-sans max-w-lg leading-relaxed">
              Our most ordered jute bags by Indian luxury hospitality groups, boutique fashion brands, and retail departmental stores.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-sans text-[#68745A]">
              <SlidersHorizontal className="w-4 h-4 text-[#3D4935]" />
              <span className="font-medium">Direct Mill Minimums From 50 Pcs</span>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#3D4935] hover:text-[#252720] font-semibold underline decoration-[#A88B66] underline-offset-4"
            >
              <span>Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedCategory(tab)}
              className={`text-xs uppercase tracking-wider px-4 py-2 whitespace-nowrap transition-all cursor-pointer font-medium border ${
                selectedCategory === tab
                  ? 'bg-[#3D4935] text-[#F7F5EF] border-[#252720] shadow-sm'
                  : 'bg-[#F7F5EF] text-[#252720] border-[#E8DDCA] hover:border-[#A88B66]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Reusable Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA to shop page */}
        <div className="mt-12 text-center pt-8 border-t border-[#E8DDCA]/60">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F7F5EF] border border-[#3D4935] text-[#3D4935] hover:bg-[#3D4935] hover:text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold transition-all shadow-2xs"
          >
            <span>Explore All 6 Categories in Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
