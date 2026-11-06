'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building2, Check, ShieldCheck, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useBrand } from '@/context/BrandContext';

export default function AccountModal() {
  const { accountModalOpen, setAccountModalOpen } = useBrand();
  const [isLogin, setIsLogin] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    gstin: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setAccountModalOpen(false);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {accountModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="account-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAccountModalOpen(false)}
            className="fixed inset-0 bg-[#252720]/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-[#F7F5EF] border-2 border-[#A88B66] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setAccountModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#252720] hover:bg-[#E8DDCA]/60 transition-colors border border-[#E8DDCA]"
              aria-label="Close trade account modal"
            >
              <X className="w-4 h-4" />
            </button>

            {formSuccess ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 bg-[#3D4935] text-[#F7F5EF] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-[#252720]">B2B Account Verified</h3>
                <p className="text-xs sm:text-sm text-[#252720]/80 font-sans max-w-sm mx-auto">
                  Welcome to JUTON Wholesale. Tier-1 mill direct rates with GST input tax credit are now activated for your corporate account.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#A88B66] font-semibold mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>B2B Corporate Trade Portal</span>
                </div>
                <h3 id="account-modal-title" className="font-serif text-2xl text-[#252720]">
                  {isLogin ? 'Sign In to Trade Account' : 'Register for Verified GST Pricing'}
                </h3>
                <p className="text-xs text-[#252720]/75 font-sans mb-6">
                  Access confidential tiered rate sheets, download GST proforma invoices, and track dispatched sample kits.
                </p>

                {/* Tab switch */}
                <div className="flex border border-[#E8DDCA] mb-6 bg-[#FFFFFF]">
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium text-center transition-colors ${
                      !isLogin ? 'bg-[#3D4935] text-[#F7F5EF]' : 'text-[#252720] hover:bg-[#E8DDCA]/30'
                    }`}
                  >
                    New B2B Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium text-center transition-colors ${
                      isLogin ? 'bg-[#3D4935] text-[#F7F5EF]' : 'text-[#252720] hover:bg-[#E8DDCA]/30'
                    }`}
                  >
                    Existing Sign In
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                          Company / Business Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          placeholder="e.g. FabIndia Retail Ltd."
                          className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                            GSTIN (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.gstin}
                            onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                            placeholder="e.g. 19AAACJ1234F1Z5"
                            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                            City / Dispatch State *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="e.g. Mumbai, Maharashtra"
                            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="procurement@company.com"
                        className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#252720] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                        Mobile / WhatsApp for Tracking *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98300 00000"
                        className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:outline-none focus:border-[#3D4935] text-[#252720]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full text-xs uppercase tracking-widest font-semibold py-3"
                    >
                      {isLogin ? 'Sign In to Portal' : 'Activate Trade Account'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#68745A] pt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3D4935]" />
                    <span>Authorized Mill Wholesale • Zero Public Pricing Disclosure</span>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
