'use client';

import { useState } from 'react';
import { Mail, Check, ShieldCheck, Leaf, ArrowRight, Instagram, Linkedin, MapPin, Phone, Clock } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { footerColumns, brandDetails } from '@/data/navigation';
import { useBrand } from '@/context/BrandContext';

/**
 * Section 10: Luxury Editorial Footer
 * Compliant with Prompt 2:
 * - Company information
 * - Product categories
 * - Bulk inquiries
 * - Contact information
 * - Social media links
 * - Policies
 * - Newsletter subscription
 */
export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { openSampleRequest } = useBrand();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer id="contact" className="bg-[#252720] text-[#F7F5EF] pt-16 sm:pt-20 pb-12 border-t-2 border-[#A88B66]/50">
      <Container>
        {/* Top Banner: Brand Statement & Corporate Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-[#3D4935] items-start">
          {/* Company Information Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.22em] text-[#F7F5EF] block">
                {brandDetails.name}
              </span>
              <p className="font-serif italic text-base sm:text-lg text-[#E8DDCA]/90">
                {brandDetails.tagline}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#E8DDCA]/75 leading-relaxed font-sans max-w-md">
              {brandDetails.legalName} is India’s dedicated sustainable packaging atelier, supplying premier retail, hospitality, corporate gifting, and luxury export clients nationwide.
            </p>

            {/* Hubs strip */}
            <div className="text-[11px] font-sans text-[#A88B66] uppercase tracking-wider font-semibold">
              {brandDetails.panIndiaDispatchHubs}
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-[#E8DDCA]/60 font-sans">Connect:</span>
              <div className="flex items-center gap-2">
                {brandDetails.socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-[#3D4935] text-[#E8DDCA] hover:bg-[#A88B66] hover:text-[#FFFFFF] transition-colors border border-[#68745A]/40 text-xs font-sans inline-flex items-center gap-1.5"
                    aria-label={`Follow JUTON on ${s.name}`}
                  >
                    {s.name === 'Instagram' && <Instagram className="w-3.5 h-3.5" />}
                    {s.name === 'LinkedIn' && <Linkedin className="w-3.5 h-3.5" />}
                    {s.name === 'Pinterest' && <Leaf className="w-3.5 h-3.5" />}
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Subscription: Lookbook & Trade Updates */}
          <div className="lg:col-span-7 bg-[#3D4935]/40 p-6 sm:p-8 border border-[#68745A]/30 space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#A88B66] font-semibold font-sans block">
                Trade Buyer Access
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-[#F7F5EF]">
                Subscribe to the 2026 Wholesale Lookbook & Spec Sheet
              </h4>
              <p className="text-xs text-[#E8DDCA]/80 font-sans leading-relaxed">
                Receive confidential tiered bulk pricing matrices, GST invoicing guides, and pre-production digital proofing guidelines directly in your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A88B66]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your corporate / work email"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#252720] border border-[#68745A] text-[#F7F5EF] placeholder-[#E8DDCA]/50 focus:outline-none focus:border-[#A88B66]"
                />
              </div>
              <Button
                type="submit"
                variant="jute"
                size="sm"
                icon={subscribed ? Check : ArrowRight}
                iconPosition="right"
                className="text-xs uppercase tracking-widest px-6 py-2.5 font-semibold text-white"
              >
                {subscribed ? 'Lookbook Dispatched' : 'Subscribe'}
              </Button>
            </form>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-[#E8DDCA]/60 font-sans">
              <span>Direct Mill Desk: {brandDetails.contactEmail}</span>
              <button
                type="button"
                onClick={() => openSampleRequest(null)}
                className="text-[#A88B66] hover:underline cursor-pointer text-left sm:text-right"
              >
                Request Free Physical Swatches (All Fabric Weights) &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Middle Navigation Columns: Product categories, Bulk inquiries, Company, Policies */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#3D4935]/60 text-xs font-sans">
          {footerColumns.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h5 className="font-sans uppercase text-[11px] tracking-[0.2em] text-[#A88B66] font-semibold">
                {col.title}
              </h5>
              <ul className="space-y-2">
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-[#E8DDCA]/80 hover:text-white transition-colors block py-0.5"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Information Bar */}
        <div className="py-8 border-b border-[#3D4935]/40 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans text-[#E8DDCA]/80">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#A88B66] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Corporate Atelier & Mill</span>
              <span>{brandDetails.corporateAddress}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-[#A88B66] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Wholesale Helpline & WhatsApp</span>
              <span>{brandDetails.contactPhone}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#A88B66] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Commercial Inquiries Hours</span>
              <span>{brandDetails.supportHours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#E8DDCA]/60 font-sans">
          <div>
            &copy; {new Date().getFullYear()} {brandDetails.legalName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-white transition-colors">
              Wholesale Terms
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              GST Invoicing Policy
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
