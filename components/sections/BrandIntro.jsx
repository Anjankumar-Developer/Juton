'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { Leaf, Award, Recycle, CheckCircle2 } from 'lucide-react';

/**
 * Section 4: Brand Introduction
 * Heading: "Naturally Made. Purposefully Designed."
 * Introduces JUTON as a sustainable jute bag brand.
 */
export default function BrandIntro() {
  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#E8DDCA]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Heading and Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-4"
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#A88B66] font-semibold font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#68745A]" />
              The JUTON Manifesto
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#252720] leading-[1.15] tracking-tight">
              Naturally Made.{' '}
              <span className="italic text-[#3D4935] block sm:inline">
                Purposefully Designed.
              </span>
            </h2>

            <p className="font-serif italic text-lg sm:text-xl text-[#3D4935]/90 leading-relaxed pt-1">
              &ldquo;We believe business packaging should honor the earth that harvested it — pure, durable, and completely free of plastic compromise.&rdquo;
            </p>
          </motion.div>

          {/* Right Column: Narrative & Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 space-y-6 text-xs sm:text-sm text-[#252720]/80 font-sans leading-relaxed"
          >
            <p>
              <strong className="text-[#252720] font-semibold">JUTON</strong> is India’s premier manufacturer of high-end sustainable jute bags, designed specifically for forward-thinking enterprises, boutique retailers, organic grocery purveyors, and luxury hospitality brands.
            </p>

            <p>
              Unlike mass-market polyester tote bags and fragile non-woven plastic imposters, our collections are woven directly from pure, unbleached Bengal golden jute fibers. Each piece marries traditional artisanal loomed textures with contemporary Scandinavian silhouettes, reinforced load ratings, and precision branding capabilities.
            </p>

            {/* Micro Pillars */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#E8DDCA]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-[#3D4935] text-base">
                  <Leaf className="w-4 h-4 text-[#A88B66]" />
                  <span>100% Plant Sourced</span>
                </div>
                <p className="text-xs text-[#252720]/70">
                  Naturally decomposes within 90 days of landfill burial without toxic residue.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-[#3D4935] text-base">
                  <Recycle className="w-4 h-4 text-[#A88B66]" />
                  <span>Circular Packaging</span>
                </div>
                <p className="text-xs text-[#252720]/70">
                  Certified carbon-neutral transit with plastic-free shipping cartons.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
