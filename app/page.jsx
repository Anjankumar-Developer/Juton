'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Hero from '@/components/sections/Hero';
import BrandIntro from '@/components/sections/BrandIntro';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import BestSellers from '@/components/sections/BestSellers';
import WhyChooseJuton from '@/components/sections/WhyChooseJuton';
import BulkOrdersCTA from '@/components/sections/BulkOrdersCTA';
import BrandStory from '@/components/sections/BrandStory';
import { useBrand } from '@/context/BrandContext';

/**
 * JUTON Luxury Editorial Homepage
 * Prompt 2 compliant:
 * 1. Announcement bar (Header)
 * 2. Sticky Navigation with Account & Cart icons (Header)
 * 3. Editorial Hero: "Carry Nature. Choose Better."
 * 4. Brand Introduction: "Naturally Made. Purposefully Designed."
 * 5. Featured Collections: Jute Shopping Bags, Jute Tote Bags, Gift Bags, Custom Printed Bags, Corporate Bags
 * 6. Best Sellers with reusable product cards (image, name, starting price, MOQ, view product button)
 * 7. Why choose JUTON? (5 pillars)
 * 8. Bulk Orders CTA: "Looking for Bags in Bulk?"
 * 9. Brand Story (editorial image-and-text)
 * 10. Footer with company info, categories, bulk inquiries, contact, social, policies, newsletter
 */
export default function HomePage() {
  const { notification } = useBrand();

  return (
    <div className="flex flex-col w-full selection:bg-[#A88B66] selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-50 bg-[#3D4935] text-[#F7F5EF] px-4 py-3 shadow-2xl border border-[#A88B66] text-xs font-sans flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 text-[#A88B66] flex-shrink-0" />
          <span className="font-medium">{notification}</span>
        </motion.div>
      )}

      {/* 3. Hero Section */}
      <Hero />

      {/* 4. Brand Introduction */}
      <BrandIntro />

      {/* 5. Featured Collections */}
      <FeaturedCollections />

      {/* 6. Best Sellers */}
      <BestSellers />

      {/* 7. Why choose JUTON? */}
      <WhyChooseJuton />

      {/* 8. Bulk Orders CTA */}
      <BulkOrdersCTA />

      {/* 9. Brand Story */}
      <BrandStory />
    </div>
  );
}
