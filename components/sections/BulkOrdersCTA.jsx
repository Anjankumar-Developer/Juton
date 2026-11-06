'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useBrand } from '@/context/BrandContext';
import { Package, Sparkles, ShieldCheck, Clock, FileSpreadsheet } from 'lucide-react';

/**
 * Section 8: Bulk Orders CTA
 * Heading: "Looking for Bags in Bulk?"
 * Include a button to request a wholesale quotation.
 */
export default function BulkOrdersCTA() {
  const { openSampleRequest } = useBrand();

  return (
    <section id="bulk-orders" className="scroll-mt-24 py-16 sm:py-24 bg-[#3D4935] text-[#F7F5EF] relative overflow-hidden">
      {/* Decorative Jute Fiber Texture Hint */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8DDCA_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#252720]/50 border border-[#A88B66]/40 text-[#E8DDCA] text-xs uppercase tracking-[0.25em] font-medium font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A88B66]" />
            Direct Mill Procurement • GST Compliant
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#F7F5EF] tracking-tight leading-[1.1]">
            Looking for Bags in Bulk?
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#E8DDCA]/85 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you require 100 screen-printed shopping bags for an upcoming store launch or 50,000 export-grade totes for pan-India distribution, we deliver mill-direct factory quotes within 24 hours.
          </p>

          {/* Value matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-3xl mx-auto text-left">
            <div className="p-4 bg-[#252720]/40 border border-[#68745A]/40 space-y-1">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#F7F5EF]">
                <Clock className="w-4 h-4 text-[#A88B66]" />
                <span>24-Hour Digital Proofs</span>
              </div>
              <p className="text-[11px] text-[#E8DDCA]/70 font-sans">
                Review your logo mockup on our 3D bag silhouettes before production.
              </p>
            </div>

            <div className="p-4 bg-[#252720]/40 border border-[#68745A]/40 space-y-1">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#F7F5EF]">
                <Package className="w-4 h-4 text-[#A88B66]" />
                <span>Physical Swatch Kits</span>
              </div>
              <p className="text-[11px] text-[#E8DDCA]/70 font-sans">
                Shipped directly to your studio with 220–450 GSM fabric weights.
              </p>
            </div>

            <div className="p-4 bg-[#252720]/40 border border-[#68745A]/40 space-y-1">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#F7F5EF]">
                <FileSpreadsheet className="w-4 h-4 text-[#A88B66]" />
                <span>Volume Tier Pricing</span>
              </div>
              <p className="text-[11px] text-[#E8DDCA]/70 font-sans">
                Direct mill pricing brackets up to 35% below third-party traders.
              </p>
            </div>
          </div>

          {/* Required Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="jute"
              size="lg"
              icon={Sparkles}
              iconPosition="right"
              onClick={() => openSampleRequest(null)}
              className="text-xs uppercase tracking-widest font-semibold px-9 py-4 shadow-lg text-white"
            >
              Request a Wholesale Quotation
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-[11px] text-[#E8DDCA]/70 pt-2 font-sans">
            <span>• GST Tax Invoices Provided</span>
            <span>• Door Delivery Pan-India</span>
            <span>• Zero Obligation Quotes</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
