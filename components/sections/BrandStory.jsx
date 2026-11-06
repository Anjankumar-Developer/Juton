'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { brandStoryContent } from '@/data/products';
import { ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';

/**
 * Section 9: Brand Story
 * Editorial image-and-text section celebrating Bengal golden fiber heritage and sustainable manufacturing.
 */
export default function BrandStory() {
  return (
    <section id="brand-story" className="scroll-mt-24 py-16 sm:py-28 bg-[#FFFFFF] border-b border-[#E8DDCA]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Image Mosaic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative border-2 border-[#E8DDCA] bg-[#F7F5EF] p-3 shadow-lg">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E8DDCA]/40">
                <Image
                  src={brandStoryContent.image}
                  alt="Bengal Golden Jute Weaving Heritage"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating quote badge */}
              <div className="mt-3 p-4 bg-[#F7F5EF] border border-[#E8DDCA] text-xs font-sans text-[#252720]/80">
                <div className="flex items-center gap-1.5 font-serif font-bold text-[#3D4935] text-sm mb-1">
                  <Leaf className="w-4 h-4 text-[#A88B66]" />
                  <span>The Ganges Delta Golden Fiber</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Rain-fed cultivation requiring zero synthetic pesticides, naturally replenishing surrounding agricultural soil.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Text Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-[#A88B66] font-semibold font-sans block">
                {brandStoryContent.eyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#252720] leading-[1.15] tracking-tight">
                {brandStoryContent.heading}
              </h2>
            </div>

            {/* Blockquote */}
            <div className="border-l-2 border-[#A88B66] pl-5 py-1">
              <p className="font-serif italic text-base sm:text-lg text-[#3D4935] leading-relaxed">
                {brandStoryContent.quote}
              </p>
            </div>

            {/* Story Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-[#252720]/80 font-sans leading-relaxed">
              {brandStoryContent.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Key Impact Stats */}
            <div className="pt-6 border-t border-[#E8DDCA] grid grid-cols-3 gap-4">
              {brandStoryContent.stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3D4935]">
                    {stat.value}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-[#68745A] font-medium font-sans">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
