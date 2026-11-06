'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Package, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { products } from '@/data/products';
import { useBrand } from '@/context/BrandContext';

/**
 * Interactive Wholesale Sample Request & Custom Quote Modal Form
 */
function SampleForm({ selectedProduct, onClose }) {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    workEmail: '',
    targetQuantity: '250',
    selectedBagId: selectedProduct?.id || (products[0] ? products[0].id : ''),
    customPrinting: 'Screen Print Logo',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  if (submitted) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-14 h-14 bg-[#3D4935] text-[#F7F5EF] rounded-full flex items-center justify-center mx-auto">
          <Check className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#252720]">
          Sample Request Dispatched
        </h3>
        <p className="text-xs sm:text-sm text-[#252720]/80 max-w-md mx-auto font-sans leading-relaxed">
          Thank you, <span className="font-semibold">{formData.businessName || 'partner'}</span>.
          Your dedicated JUTON wholesale specialist will confirm swatch specifications and tracking details within 24 hours.
        </p>
        <div className="text-xs text-[#A88B66] uppercase tracking-widest font-semibold pt-2">
          Zero Obligation • Mill-Direct Support
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 space-y-1 pr-6">
        <div className="flex items-center gap-1.5 text-xs text-[#A88B66] font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complimentary B2B Service</span>
        </div>
        <h3 id="sample-modal-title" className="font-serif text-2xl sm:text-3xl text-[#252720]">
          Request Sample Kit & Spec Dossier
        </h3>
        <p className="text-xs text-[#252720]/70 font-sans">
          Physical material swatches, handle trims, and pre-production proofs tailored to your brand identity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="businessName" className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
              Company / Brand Name *
            </label>
            <input
              type="text"
              id="businessName"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g. Atelier Botanique"
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
            />
          </div>

          <div>
            <label htmlFor="contactName" className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
              Contact Name *
            </label>
            <input
              type="text"
              id="contactName"
              required
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="workEmail" className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
              Corporate Email *
            </label>
            <input
              type="email"
              id="workEmail"
              required
              value={formData.workEmail}
              onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
              placeholder="name@company.com"
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
            />
          </div>

          <div>
            <label htmlFor="targetQuantity" className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
              Estimated Quantity
            </label>
            <select
              id="targetQuantity"
              value={formData.targetQuantity}
              onChange={(e) => setFormData({ ...formData, targetQuantity: e.target.value })}
              className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
            >
              <option value="100 - 250">100 - 250 units (Sample / Pilot)</option>
              <option value="250 - 500">250 - 500 units (Standard Tier)</option>
              <option value="500 - 1000">500 - 1,000 units (Volume Tier)</option>
              <option value="1000 - 5000">1,000 - 5,000 units (Enterprise Tier)</option>
              <option value="5000+">5,000+ units (Mill Direct Contract)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="selectedBagId" className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
            Select Bag Model for Swatches
          </label>
          <select
            id="selectedBagId"
            value={formData.selectedBagId}
            onChange={(e) => setFormData({ ...formData, selectedBagId: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.category} (MOQ: {p.moq} pcs)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="customPrinting" className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
            Custom Branding Method
          </label>
          <select
            id="customPrinting"
            value={formData.customPrinting}
            onChange={(e) => setFormData({ ...formData, customPrinting: e.target.value })}
            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
          >
            <option value="Screen Print Logo">Silk Screen Print (Up to 4 Pantone Colors)</option>
            <option value="Metallic Foil Stamping">Metallic Foil Stamping (Gold/Copper/Silver)</option>
            <option value="Woven Label / Hem Tag">Woven Organic Cotton Hem Label</option>
            <option value="Embroidery">Monogram / Direct Embroidery</option>
            <option value="Unprinted / Plain">Unprinted / Plain Natural Aesthetic</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
            Special Notes or Dimensions
          </label>
          <textarea
            id="notes"
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Include delivery deadline, destination port or custom dimension requests..."
            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs uppercase tracking-wider"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Package}
            className="text-xs uppercase tracking-widest font-semibold px-6"
          >
            Submit Sample Request
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function SampleRequestModal() {
  const { sampleModalOpen, closeSampleRequest, selectedProductForSample } = useBrand();

  // Handle ESC key to close
  useEffect(() => {
    if (!sampleModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSampleRequest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sampleModalOpen, closeSampleRequest]);

  return (
    <AnimatePresence>
      {sampleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSampleRequest}
            className="fixed inset-0 bg-[#252720]/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-[#F7F5EF] border-2 border-[#A88B66] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeSampleRequest}
              className="absolute top-5 right-5 p-2 text-[#252720] hover:bg-[#E8DDCA]/60 transition-colors cursor-pointer border border-[#E8DDCA]"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <SampleForm
              key={selectedProductForSample ? selectedProductForSample.id : 'default'}
              selectedProduct={selectedProductForSample}
              onClose={closeSampleRequest}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
