'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import CollectionCard from '@/components/ui/CollectionCard';
import { collectionsData } from '@/data/products';

/**
 * Section 5: Featured Collections
 * Cards for:
 * - Jute Shopping Bags
 * - Jute Tote Bags
 * - Gift Bags
 * - Custom Printed Bags
 * - Corporate Bags
 */
export default function FeaturedCollections() {
  return (
    <section id="featured-collections" className="scroll-mt-24 py-16 sm:py-24 bg-[#F7F5EF] border-b border-[#E8DDCA]">
      <Container>
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.22em] text-[#68745A] font-semibold font-sans block">
            Core B2B Disciplines
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#252720] tracking-tight">
            Featured Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#252720]/75 font-sans leading-relaxed max-w-lg mx-auto">
            From high-volume commercial shopping carriers to bespoke executive portfolios, explore our signature jute silhouettes designed for Indian and international business.
          </p>
        </div>

        {/* 5 Collections Grid: 2 top large cards, 3 bottom cards for harmonious luxury layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collectionsData.map((collection, index) => (
            <div
              key={collection.id}
              className={index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
            >
              <CollectionCard collection={collection} index={index} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
