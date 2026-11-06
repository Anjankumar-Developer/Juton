'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Printer,
  Truck,
  Building,
  Mail,
  Phone,
  MapPin,
  PackageCheck,
  Download,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutModal() {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    items,
    totals,
    clearCart,
    activeCurrency,
    getSupabasePayload
  } = useCart();

  const [form, setForm] = useState({
    companyName: '',
    gstin: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    pincode: '',
    poNumber: '',
    paymentTerms: '30_advance_70_dispatch',
  });

  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  if (!checkoutModalOpen) return null;

  const validate = () => {
    const errors = {};
    if (!form.companyName.trim()) errors.companyName = 'Business or company name is required';
    if (!form.contactPerson.trim()) errors.contactPerson = 'Contact person name is required';
    if (!form.email.trim() || !form.email.includes('@')) errors.email = 'Valid corporate email is required';
    if (!form.phone.trim() || form.phone.length < 10) errors.phone = 'Valid 10-digit mobile / WhatsApp is required';
    if (!form.address.trim()) errors.address = 'Complete delivery destination address is required';
    if (!form.state.trim()) errors.state = 'Delivery state is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    // Simulate generation of B2B Proforma Invoice with ready-to-integrate Supabase payload
    setTimeout(() => {
      const orderRef = `JUTON-PF-${Date.now().toString().slice(-6)}`;
      const supabasePayload = getSupabasePayload({
        companyName: form.companyName,
        gstin: form.gstin,
        email: form.email,
        phone: form.phone,
        shippingAddress: `${form.address}, ${form.state} - ${form.pincode}`,
      });

      console.log('Supabase Ready Order Payload:', supabasePayload);

      setSubmittedOrder({
        ref: orderRef,
        ...form,
        totals,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      });
      setIsSubmitting(false);
      clearCart();
    }, 800);
  };

  const handleClose = () => {
    setCheckoutModalOpen(false);
    setSubmittedOrder(null);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#252720]/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-[#F7F5EF] border-2 border-[#A88B66] shadow-2xl my-auto max-h-[92vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="bg-[#FFFFFF] p-5 sm:p-6 border-b border-[#E8DDCA] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#68745A] font-sans font-semibold block">
                B2B Commercial Wholesale Desk
              </span>
              <h3 id="checkout-modal-title" className="font-serif text-xl sm:text-2xl text-[#252720]">
                {submittedOrder ? 'Official Proforma Invoice Generated' : 'Request Commercial Proforma Invoice'}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-[#252720] hover:bg-[#E8DDCA]/60 transition-colors border border-[#E8DDCA]"
              aria-label="Close checkout modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {submittedOrder ? (
              // Submitted Order Confirmation State
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-[#E8DDCA]/70 text-[#3D4935] rounded-full flex items-center justify-center mx-auto border border-[#A88B66]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-[#68745A] font-sans font-medium">
                    Proforma Document Reference
                  </span>
                  <div className="font-mono text-xl font-bold text-[#3D4935] tracking-wider">
                    {submittedOrder.ref}
                  </div>
                  <p className="text-xs text-[#252720]/80 font-sans max-w-md mx-auto pt-1 leading-relaxed">
                    Thank you, <strong className="text-[#252720]">{submittedOrder.companyName}</strong>. Your commercial proforma invoice has been created and transmitted to our Bengal mill production desk.
                  </p>
                </div>

                {/* Order Summary Snapshot */}
                <div className="bg-[#FFFFFF] p-5 border border-[#E8DDCA] text-left text-xs font-sans space-y-2.5 max-w-lg mx-auto">
                  <div className="flex justify-between border-b border-[#E8DDCA]/60 pb-2">
                    <span className="text-[#68745A]">Registered Client:</span>
                    <span className="font-semibold text-[#252720]">{submittedOrder.companyName}</span>
                  </div>
                  {submittedOrder.gstin && (
                    <div className="flex justify-between border-b border-[#E8DDCA]/60 pb-2">
                      <span className="text-[#68745A]">GSTIN:</span>
                      <span className="font-mono font-semibold text-[#252720]">{submittedOrder.gstin}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-[#E8DDCA]/60 pb-2">
                    <span className="text-[#68745A]">Total Units:</span>
                    <span className="font-semibold text-[#3D4935]">{submittedOrder.totals.totalUnits} pieces</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8DDCA]/60 pb-2">
                    <span className="text-[#68745A]">Volume Discount Applied:</span>
                    <span className="font-semibold text-[#68745A]">
                      - {formatCurrency(submittedOrder.totals.tierDiscount, activeCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold">
                    <span className="text-[#252720]">Proforma Net Total:</span>
                    <span className="font-serif text-[#3D4935] text-base">
                      {formatCurrency(submittedOrder.totals.netTotal, activeCurrency)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFFFFF] border border-[#3D4935] text-[#3D4935] text-xs uppercase tracking-widest font-semibold hover:bg-[#3D4935] hover:text-[#FFFFFF] transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Proforma Document</span>
                  </button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleClose}
                    className="text-xs uppercase tracking-widest font-semibold"
                  >
                    Done & Return to Catalog
                  </Button>
                </div>
              </div>
            ) : (
              // Checkout Entry Form
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Order Summary Strip */}
                <div className="p-4 bg-[#FFFFFF] border border-[#E8DDCA] flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#68745A] block">
                      Wholesale Batch Summary
                    </span>
                    <span className="font-semibold text-[#252720] mt-0.5 block">
                      {totals.totalItems} Models • {totals.totalUnits} Units
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#68745A] block">
                      Tier Savings
                    </span>
                    <span className="font-semibold text-[#68745A] mt-0.5 block">
                      - {formatCurrency(totals.tierDiscount, activeCurrency)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#68745A] block">
                      Estimated Grand Total
                    </span>
                    <span className="font-serif text-lg font-bold text-[#3D4935]">
                      {formatCurrency(totals.netTotal, activeCurrency)}
                    </span>
                  </div>
                </div>

                {/* Company & GST Details */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#3D4935] font-semibold font-sans flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#A88B66]" />
                    <span>Company & Business Information</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                        Company / Business Name *
                      </label>
                      <input
                        type="text"
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        placeholder="e.g. Bombay Retailers Pvt Ltd"
                        className={`w-full px-3 py-2 bg-[#FFFFFF] border text-xs font-sans text-[#252720] outline-none ${
                          formErrors.companyName ? 'border-red-500' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                        }`}
                      />
                      {formErrors.companyName && (
                        <span className="text-[10px] text-red-600 font-sans block mt-0.5">
                          {formErrors.companyName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                        GSTIN (Optional for tax invoice)
                      </label>
                      <input
                        type="text"
                        value={form.gstin}
                        onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                        placeholder="e.g. 27AAACB1234F1Z8"
                        className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:border-[#3D4935] text-xs font-sans text-[#252720] outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#3D4935] font-semibold font-sans flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#A88B66]" />
                    <span>Procurement Contact Coordinates</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        value={form.contactPerson}
                        onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                        placeholder="e.g. Ananya Sen"
                        className={`w-full px-3 py-2 bg-[#FFFFFF] border text-xs font-sans text-[#252720] outline-none ${
                          formErrors.contactPerson ? 'border-red-500' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="procurement@company.com"
                        className={`w-full px-3 py-2 bg-[#FFFFFF] border text-xs font-sans text-[#252720] outline-none ${
                          formErrors.email ? 'border-red-500' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                        Mobile / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98300 00000"
                        className={`w-full px-3 py-2 bg-[#FFFFFF] border text-xs font-sans text-[#252720] outline-none ${
                          formErrors.phone ? 'border-red-500' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Pan-India Delivery Destination */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-[#3D4935] font-semibold font-sans flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#A88B66]" />
                    <span>Pan-India Mill Freight Destination</span>
                  </h4>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                        Warehouse / Delivery Address *
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Building, street, industrial estate, city..."
                        className={`w-full px-3 py-2 bg-[#FFFFFF] border text-xs font-sans text-[#252720] outline-none ${
                          formErrors.address ? 'border-red-500' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                          State / Union Territory *
                        </label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          placeholder="e.g. Maharashtra, West Bengal, Karnataka"
                          className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:border-[#3D4935] text-xs font-sans text-[#252720] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                          Postal PIN Code
                        </label>
                        <input
                          type="text"
                          value={form.pincode}
                          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                          placeholder="e.g. 400001"
                          className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:border-[#3D4935] text-xs font-sans text-[#252720] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and PO Reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                      Purchase Order (PO) / Client Ref
                    </label>
                    <input
                      type="text"
                      value={form.poNumber}
                      onChange={(e) => setForm({ ...form, poNumber: e.target.value })}
                      placeholder="e.g. PO-2026-BOMBAY-01"
                      className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:border-[#3D4935] text-xs font-sans text-[#252720] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans font-medium text-[#252720] block mb-1">
                      Payment Terms
                    </label>
                    <select
                      value={form.paymentTerms}
                      onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCA] focus:border-[#3D4935] text-xs font-sans text-[#252720] outline-none"
                    >
                      <option value="30_advance_70_dispatch">
                        30% Mill Advance / 70% against BL/Dispatch
                      </option>
                      <option value="100_advance_proforma">
                        100% Advance against Verified Proforma
                      </option>
                      <option value="corporate_net_30">
                        Corporate Net 30 (Approved Accounts Only)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-[#E8DDCA]">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full text-xs uppercase tracking-widest font-semibold justify-center py-4"
                  >
                    {isSubmitting ? 'Generating Proforma Invoice...' : 'Generate B2B Proforma Invoice'}
                  </Button>
                  <p className="text-[10px] text-center text-[#68745A] font-sans mt-2">
                    Official GST Proforma Invoices are issued with 100% tax credit eligibility. No immediate online credit card debit required.
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
