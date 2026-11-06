'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { whyChooseJutonPillars } from '@/data/products';
import { Leaf, Factory, Sparkles, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';

/**
 * Section 7: Why choose JUTON?
 * Show:
 * - Sustainable materials
 * - Bulk manufacturing
 * - Custom branding
 * - Quality craftsmanship
 * - India-wide shipping
 */
export default function WhyChooseJuton() {
  const iconMap = {
    Leaf: Leaf,
    Factory: Factory,
    Sparkles: Sparkles,
    ShieldCheck: ShieldCheck,
    Truck: Truck,
  };

  return (
    <section id="why-choose-juton" className="scroll-mt-24 py-16 sm:py-24 bg-[#F7F5EF] border-b border-[#E8DDCA]">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.22em] text-[#68745A] font-semibold font-sans block">
            The Manufacturer Advantage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#252720] tracking-tight">
            Why Choose JUTON?
          </h2>
          <p className="text-xs sm:text-sm text-[#252720]/75 font-sans leading-relaxed max-w-lg mx-auto">
            From the fertile Gangetic delta straight to your commercial doorstep, discover how our vertically integrated operations redefine ethical packaging across India.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {whyChooseJutonPillars.map((pillar, idx) => {
            const IconComponent = iconMap[pillar.icon] || Leaf;

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className={`p-6 sm:p-8 bg-[#FFFFFF] border border-[#E8DDCA] hover:border-[#A88B66] transition-all duration-300 flex flex-col justify-between space-y-5 ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar with Icon & Stat */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-[#3D4935] text-[#F7F5EF] flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#E8DDCA]" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#A88B66] font-semibold bg-[#F7F5EF] px-2.5 py-1 border border-[#E8DDCA]">
                      {pillar.stat}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#252720] mb-1">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-sans font-semibold text-[#68745A] uppercase tracking-wider">
                      {pillar.subtitle}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#252720]/75 font-sans leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DDCA]/60 flex items-center gap-1.5 text-[11px] text-[#3D4935] font-semibold font-sans uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A88B66]" />
                  <span>JUTON Verified Protocol</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
