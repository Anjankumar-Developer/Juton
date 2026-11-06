'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Package, ShieldCheck, Leaf } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useBrand } from '@/context/BrandContext';
import { formatCurrency } from '@/lib/utils';

/**
 * Section 3: Large Editorial Hero with premium lifestyle photography
 * Heading: "Carry Nature. Choose Better."
 * Description: "Thoughtfully crafted jute bags for businesses that believe in a sustainable future."
 * Buttons: "Explore Collection", "Request Bulk Pricing"
 */
export default function Hero() {
  const { openSampleRequest, activeCurrency } = useBrand();

  return (
    <section id="home" className="relative overflow-hidden bg-[#F7F5EF] border-b border-[#E8DDCA] pt-12 pb-16 sm:pt-20 sm:pb-28">
      {/* Editorial Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-28 -mt-28 w-[450px] h-[450px] rounded-full bg-[#E8DDCA]/35 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-28 -mb-28 w-[400px] h-[400px] rounded-full bg-[#A88B66]/15 blur-3xl pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E8DDCA]/60 border border-[#A88B66]/40 text-[#3D4935] text-xs uppercase tracking-[0.2em] font-medium font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#68745A]" />
              Luxury Sustainable Jute Wholesale • Bengal Mills
            </div>

            {/* Main Required Heading */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#252720] leading-[1.05] tracking-tight font-medium">
              Carry Nature.{' '}
              <span className="italic font-normal text-[#3D4935] block sm:inline">
                Choose Better.
              </span>
            </h1>

            {/* Required Description */}
            <p className="font-sans text-base sm:text-lg text-[#252720]/80 leading-relaxed max-w-xl font-light">
              Thoughtfully crafted jute bags for businesses that believe in a sustainable future.
            </p>

            {/* Required Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                as="a"
                href="#featured-collections"
                className="text-xs uppercase tracking-widest font-semibold px-8 py-4 shadow-sm"
              >
                Explore Collection
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={Sparkles}
                onClick={() => openSampleRequest(null)}
                className="text-xs uppercase tracking-widest font-semibold px-8 py-4"
              >
                Request Bulk Pricing
              </Button>
            </div>

            {/* Editorial Trust Strip */}
            <div className="pt-8 border-t border-[#E8DDCA] grid grid-cols-3 gap-6 text-xs font-sans">
              <div className="space-y-1">
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#3D4935]">
                  50 pcs
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#68745A] font-medium">
                  Accessible Wholesale MOQ
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#3D4935]">
                  100%
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#68745A] font-medium">
                  Biodegradable Fiber
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#3D4935]">
                  Pan-India
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#68745A] font-medium">
                  Direct Mill Dispatch
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Editorial Lifestyle Photography Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative border-2 border-[#A88B66] bg-[#FFFFFF] p-3 shadow-[0_16px_50px_rgba(37,39,32,0.1)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E8DDCA]/40">
                <Image
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
                  alt="JUTON Sustainable Luxury Jute Bag in Natural Lifestyle Setting"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Editorial Provenance Plaque */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#F7F5EF]/95 backdrop-blur-sm p-4 border border-[#E8DDCA] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-[#68745A] uppercase tracking-wider mb-1 font-sans">
                    <span>Bengal Golden Jute</span>
                    <span className="font-semibold text-[#A88B66]">Direct Wholesale</span>
                  </div>
                  <div className="font-serif text-lg text-[#252720] font-bold">
                    The Grand Market Shopping Tote
                  </div>
                  <div className="text-xs text-[#252720]/75 mt-1 flex justify-between items-center font-sans">
                    <span>340 GSM Heavyweight Fiber</span>
                    <span className="font-bold text-[#3D4935]">
                      From {formatCurrency(activeCurrency === 'USD' ? 3.5 : 145, activeCurrency)} / pc
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
