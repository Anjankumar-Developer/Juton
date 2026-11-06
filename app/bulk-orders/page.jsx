'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Factory,
  Sparkles,
  Gift,
  Megaphone,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageCircle,
  Clock,
  ShieldCheck,
  Truck,
  ArrowRight,
  UserCheck,
  Send,
  HelpCircle,
  PhoneCall,
  RotateCcw
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { getProductById, products } from '@/data/products';
import {
  QUANTITY_TIERS,
  PRINTING_OPTIONS,
  INQUIRY_CATEGORIES,
  WHATSAPP_CORPORATE_NUMBER,
  validateInquiryForm,
  generateInquiryRef,
  buildWhatsAppInquiryUrl,
  serializeInquiryForApi,
  LOCAL_STORAGE_RFQ_KEY
} from '@/lib/inquiry';
import { formatCurrency } from '@/lib/utils';
import { formatIndianPhone } from '@/lib/auth';

function WholesaleInquiryContent() {
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get('product');

  // Product-specific inquiry state derived from query params
  const targetProduct = useMemo(() => {
    return productIdParam ? getProductById(productIdParam) : null;
  }, [productIdParam]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    mobile: '',
    category: 'Shopping Bags',
    quantity: '100-499',
    customPrinting: 'Water-Based Eco Screen Printing (1–4 Colors)',
    deliveryCity: '',
    additionalRequirements: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfq, setSubmittedRfq] = useState(null);

  // Synchronize category if coming from targeted /shop/[id]
  useEffect(() => {
    if (targetProduct?.category) {
      const timer = setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          category: targetProduct.category,
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [targetProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFillDemo = () => {
    setFormData({
      fullName: 'Vikramaditya Roy',
      companyName: 'Bengal Organic Grocers Private Limited',
      email: 'procurement@bengalorganics.in',
      mobile: '9830048821',
      category: targetProduct ? targetProduct.category : 'Shopping Bags',
      quantity: '500-999',
      customPrinting: 'Water-Based Eco Screen Printing (1–4 Colors)',
      deliveryCity: 'Kolkata, West Bengal',
      additionalRequirements:
        'Require custom 2-color brand logo on front panel, plant-based starch moisture barrier coat, and reinforced cotton rope handles for 20kg retail capacity.',
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateInquiryForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      // Scroll to form errors
      const formEl = document.getElementById('inquiry-form');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Generate RFQ Reference & Payload
    const rfqRef = generateInquiryRef();
    const serialized = serializeInquiryForApi(
      {
        ...formData,
        productId: targetProduct?.id || null,
        productName: targetProduct?.name || null,
      },
      rfqRef
    );

    // Save to local storage for persistence across turns
    try {
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_RFQ_KEY) || '[]');
        window.localStorage.setItem(LOCAL_STORAGE_RFQ_KEY, JSON.stringify([serialized, ...existing]));
      }
    } catch (err) {
      console.warn('Failed to save RFQ to localStorage:', err);
    }

    setSubmittedRfq(serialized);
    setIsSubmitting(false);

    // Scroll to success view
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // WhatsApp click-to-chat URL
  const whatsAppUrl = buildWhatsAppInquiryUrl({
    companyName: formData.companyName,
    fullName: formData.fullName,
    productName: targetProduct?.name,
    category: formData.category,
    quantity: formData.quantity,
    customPrinting: formData.customPrinting,
    deliveryCity: formData.deliveryCity,
  });

  return (
    <div className="bg-[#F7F5EF] min-h-screen pb-24">
      {/* 1. Wholesale Hero Section */}
      <section className="relative border-b border-[#E8DDCA] bg-[#F7F5EF] pt-14 pb-16 sm:pt-20 sm:pb-24">
        <Container>
          <div className="max-w-3xl space-y-4">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8DDCA]/70 border border-[#A88B66]/40 text-xs font-sans text-[#3D4935] uppercase tracking-widest font-semibold">
              <span>Bengal Loom Capacity • Commercial Procurement</span>
            </div>

            {/* Prompt 6 Required Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#252720] font-normal leading-[1.1] tracking-tight">
              Bulk Orders. <span className="italic font-normal text-[#3D4935]">Better Possibilities.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#252720]/80 font-sans leading-relaxed max-w-2xl font-light">
              Direct-from-mill manufacturing for businesses that believe plastic has no place in commercial packaging. From 50 units for boutique retail launches to 50,000+ monthly export batches, JUTON delivers certified sustainable jute packaging across India with factory-direct wholesale pricing.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                as="a"
                href="#inquiry-form"
                className="text-xs uppercase tracking-widest font-semibold"
              >
                Request Custom Quotation
              </Button>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#3D4935] hover:bg-[#252720] text-[#F7F5EF] text-xs uppercase tracking-widest font-semibold border border-[#252720] transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#A88B66]" />
                <span>WhatsApp Commercial Desk</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#E8DDCA] mt-6 text-xs font-sans">
              <div>
                <span className="block font-serif text-2xl font-bold text-[#3D4935]">50 Pcs</span>
                <span className="text-[#68745A]">Lowest Mill MOQ</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#3D4935]">24 Hours</span>
                <span className="text-[#68745A]">Digital Proof SLA</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#3D4935]">28 States</span>
                <span className="text-[#68745A]">Insured Freight</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#3D4935]">100% ITC</span>
                <span className="text-[#68745A]">GST Tax Invoicing</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Explanations: 5 Core Wholesale Pillars (Prompt 6 Requirements) */}
      <section className="py-16 sm:py-20 border-b border-[#E8DDCA] bg-[#FFFFFF]">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Direct Mill Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252720]">
              Built for Commercial Scale & Enterprise Standards
            </h2>
            <p className="text-xs sm:text-sm text-[#252720]/75 font-sans leading-relaxed">
              Explore how JUTON partners with retailers, hotels, corporations, and export houses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Bulk Manufacturing */}
            <div className="p-6 bg-[#F7F5EF] border border-[#E8DDCA] space-y-3.5 hover:border-[#A88B66] transition-colors">
              <div className="w-12 h-12 bg-[#3D4935] text-[#E8DDCA] flex items-center justify-center">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252720]">
                Bulk Manufacturing
              </h3>
              <p className="text-xs text-[#252720]/80 font-sans leading-relaxed">
                Operating directly within the Golden Fiber Corridor of West Bengal, our partner cooperative mills feature heavy-duty automated cutting, computerized edge serging, and reinforced 4-point cross-box stitching tested for 20kg+ carrying loads without fraying.
              </p>
              <ul className="text-[11px] text-[#68745A] font-sans space-y-1.5 pt-2 border-t border-[#E8DDCA]">
                <li>• Scalable from 50 to 50,000+ units per production run</li>
                <li>• Certified 280 to 450 GSM pure unbleached golden jute</li>
                <li>• Batch QC inspection certificates with each shipment</li>
              </ul>
            </div>

            {/* Pillar 2: Custom Branding */}
            <div className="p-6 bg-[#F7F5EF] border border-[#E8DDCA] space-y-3.5 hover:border-[#A88B66] transition-colors">
              <div className="w-12 h-12 bg-[#3D4935] text-[#E8DDCA] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252720]">
                Custom Branding & Printing
              </h3>
              <p className="text-xs text-[#252720]/80 font-sans leading-relaxed">
                Bring your brand to life with premium reproduction techniques designed for natural textiles. We utilize water-based AZO-free screen printing, metallic gold and silver foil embossing, embroidered woven labels, and debossed vegan leatherette patches.
              </p>
              <ul className="text-[11px] text-[#68745A] font-sans space-y-1.5 pt-2 border-t border-[#E8DDCA]">
                <li>• Exact Pantone® shade matching for corporate colors</li>
                <li>• Digital pre-production proofs delivered within 24 hours</li>
                <li>• Physical pre-production sample couriered for large batches</li>
              </ul>
            </div>

            {/* Pillar 3: Corporate Gifting */}
            <div className="p-6 bg-[#F7F5EF] border border-[#E8DDCA] space-y-3.5 hover:border-[#A88B66] transition-colors">
              <div className="w-12 h-12 bg-[#3D4935] text-[#E8DDCA] flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252720]">
                Corporate Gifting
              </h3>
              <p className="text-xs text-[#252720]/80 font-sans leading-relaxed">
                Elevate your executive hampers, annual shareholder gifts, and luxury hotel amenities. JUTON creates bespoke gift carriers lined with plant-based moisture-proof starch coats, satin ribbon closures, and wooden toggle buttons that recipients cherish for years.
              </p>
              <ul className="text-[11px] text-[#68745A] font-sans space-y-1.5 pt-2 border-t border-[#E8DDCA]">
                <li>• Custom dividers for wine, gourmet jars, and folios</li>
                <li>• Tailored festive packaging (Diwali, New Year, ESG milestones)</li>
                <li>• Sustainable keepsake value with zero single-use plastics</li>
              </ul>
            </div>

            {/* Pillar 4: Promotional Merchandise */}
            <div className="p-6 bg-[#F7F5EF] border border-[#E8DDCA] space-y-3.5 hover:border-[#A88B66] transition-colors">
              <div className="w-12 h-12 bg-[#3D4935] text-[#E8DDCA] flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252720]">
                Promotional Merchandise
              </h3>
              <p className="text-xs text-[#252720]/80 font-sans leading-relaxed">
                Transform trade show attendee bags, conference folios, and retail promotional totes into walking billboards for your brand. Jute bags are reused over 200 times on average, providing superior impressions per rupee compared to single-use paper or non-woven bags.
              </p>
              <ul className="text-[11px] text-[#68745A] font-sans space-y-1.5 pt-2 border-t border-[#E8DDCA]">
                <li>• High-utility everyday tote silhouettes for conferences</li>
                <li>• Fast turnaround batches for time-sensitive marketing events</li>
                <li>• Volume-tiered rates starting as low as ₹65 / piece</li>
              </ul>
            </div>

            {/* Pillar 5: Business Partnerships */}
            <div className="p-6 bg-[#F7F5EF] border border-[#E8DDCA] space-y-3.5 hover:border-[#A88B66] transition-colors md:col-span-2">
              <div className="w-12 h-12 bg-[#3D4935] text-[#E8DDCA] flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#252720]">
                Enterprise & Retail Business Partnerships
              </h3>
              <p className="text-xs text-[#252720]/80 font-sans leading-relaxed">
                We structure annual procurement contracts for national supermarket chains, luxury department stores, hotel groups, and organic retail boutiques. Enjoy dedicated account management, locked tier-3 factory pricing, scheduled monthly batch dispatches, and corporate credit payment terms.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-[#3D4935] font-sans">
                <div className="p-2.5 bg-[#FFFFFF] border border-[#E8DDCA]">
                  <strong>Locked Annual Pricing</strong>
                  <span className="block text-[#68745A] text-[10px]">Hedge against jute crop fluctuations</span>
                </div>
                <div className="p-2.5 bg-[#FFFFFF] border border-[#E8DDCA]">
                  <strong>Corporate Net 30 Terms</strong>
                  <span className="block text-[#68745A] text-[10px]">Available for verified GST trade accounts</span>
                </div>
                <div className="p-2.5 bg-[#FFFFFF] border border-[#E8DDCA]">
                  <strong>Staggered Pan-India Dispatches</strong>
                  <span className="block text-[#68745A] text-[10px]">Direct delivery to multiple retail hubs</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Product-Specific Inquiry Alert (if navigated with ?product=<id>) */}
      {targetProduct && (
        <section className="pt-10">
          <Container size="md">
            <div className="p-4 bg-[#FFFFFF] border-2 border-[#A88B66] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-[#E8DDCA] border border-[#E8DDCA] flex-shrink-0 overflow-hidden">
                  <Image
                    src={targetProduct.image}
                    alt={targetProduct.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A88B66] font-semibold block">
                    Product-Specific Bulk Inquiry
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#252720]">
                    {targetProduct.name}
                  </h4>
                  <p className="text-xs text-[#68745A] font-sans">
                    Category: {targetProduct.category} • Factory Base Rate: ₹{targetProduct.priceINR}/pc • MOQ: {targetProduct.moq} pcs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/shop/${targetProduct.id}`}
                  className="px-3 py-1.5 text-xs text-[#3D4935] border border-[#E8DDCA] hover:bg-[#F7F5EF] transition-colors"
                >
                  View Catalog Specs
                </Link>
                <button
                  type="button"
                  onClick={() => setTargetProduct(null)}
                  className="p-1 text-xs text-[#68745A] hover:text-red-700"
                  title="Clear targeted product"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 4. Bulk Inquiry Form Section */}
      <section id="inquiry-form" className="pt-12 sm:pt-16">
        <Container size="md">
          {/* Main Card */}
          <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-8 sm:p-12 shadow-xs">
            {/* Form Header */}
            <div className="text-center space-y-2 mb-8">
              <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                Official Commercial RFQ
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#252720] font-normal">
                Request a Wholesale Quotation
              </h2>
              <p className="text-xs sm:text-sm text-[#252720]/75 font-sans max-w-lg mx-auto leading-relaxed">
                Submit your project specifications below. Our Bengal mill commercial desk prepares formal GST quotations, digital layout proofs, and fabric swatches within 24 business hours.
              </p>
            </div>

            {/* Quick Demo Pre-Fill */}
            <div className="mb-8 flex items-center justify-center">
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-4 py-2 text-xs font-sans font-medium text-[#3D4935] bg-[#F7F5EF] hover:bg-[#E8DDCA] border border-[#A88B66]/40 transition-colors cursor-pointer flex items-center gap-2"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#68745A]" />
                <span>Fill Sample Wholesale Buyer Details</span>
              </button>
            </div>

            {/* Success State */}
            {submittedRfq ? (
              <div className="p-8 bg-[#F7F5EF] border-2 border-[#3D4935] space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-[#3D4935] text-[#E8DDCA] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                    Inquiry Transmitted to Bengal Mill Desk
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#252720]">
                    Quotation Request Confirmed
                  </h3>
                  <div className="inline-block px-3 py-1 bg-[#FFFFFF] border border-[#E8DDCA] text-xs font-mono font-bold text-[#3D4935]">
                    Reference ID: {submittedRfq.reference_id}
                  </div>
                </div>

                {/* Submission Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans bg-[#FFFFFF] p-5 border border-[#E8DDCA]">
                  <div>
                    <span className="text-[#68745A] block uppercase text-[10px]">Client / Enterprise:</span>
                    <strong className="text-[#252720]">{submittedRfq.company_name}</strong>
                    <span className="text-[#68745A] block text-[11px]">
                      Contact: {submittedRfq.full_name} • {submittedRfq.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#68745A] block uppercase text-[10px]">Requested Volume:</span>
                    <strong className="text-[#3D4935]">{submittedRfq.estimated_quantity} units</strong>
                    <span className="text-[#68745A] block text-[11px]">
                      Category: {submittedRfq.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#68745A] block uppercase text-[10px]">Custom Branding:</span>
                    <span className="text-[#252720]">{submittedRfq.custom_printing}</span>
                  </div>
                  <div>
                    <span className="text-[#68745A] block uppercase text-[10px]">Destination Hub:</span>
                    <span className="text-[#252720]">{submittedRfq.delivery_city}</span>
                  </div>
                </div>

                {/* Direct WhatsApp follow-up action */}
                <div className="p-4 bg-[#E8DDCA]/50 border border-[#A88B66]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
                  <div>
                    <strong className="text-[#252720] block">Need an immediate price quote?</strong>
                    <span className="text-[#68745A]">
                      Connect directly with our Kolkata commercial desk on WhatsApp with your reference number.
                    </span>
                  </div>
                  <a
                    href={buildWhatsAppInquiryUrl(submittedRfq)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#3D4935] hover:bg-[#252720] text-[#F7F5EF] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#A88B66]" />
                    <span>WhatsApp Inquiry ({submittedRfq.reference_id})</span>
                  </a>
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRfq(null);
                      setFormData({
                        fullName: '',
                        companyName: '',
                        email: '',
                        mobile: '',
                        category: 'Shopping Bags',
                        quantity: '100-499',
                        customPrinting: 'Water-Based Eco Screen Printing (1–4 Colors)',
                        deliveryCity: '',
                        additionalRequirements: '',
                      });
                    }}
                    className="text-xs uppercase tracking-widest text-[#3D4935] hover:underline font-semibold"
                  >
                    ← Submit Another Bulk Inquiry
                  </button>
                </div>
              </div>
            ) : (
              /* The Inquiry Form */
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* 1. Contact Info: Full Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                    >
                      Contact Person Full Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Vikramaditya Roy"
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.fullName ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                    >
                      Company / Enterprise Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Bengal Organic Grocers Pvt Ltd"
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.companyName ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.companyName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Contact Coordinates: Email & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                    >
                      Corporate Work Email <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="procurement@company.com"
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.email ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                    >
                      Mobile / WhatsApp Number (India) <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile (e.g. 9830048821)"
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.mobile ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.mobile}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Product Category & Estimated Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                    >
                      Product Category <span className="text-red-700">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs sm:text-sm font-sans text-[#252720] focus:border-[#3D4935] focus:outline-none"
                    >
                      {INQUIRY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Options (Prompt 6: 50-99, 100-499, 500-999, 1000+) */}
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                    >
                      Estimated Order Quantity <span className="text-red-700">*</span>
                    </label>
                    <select
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs sm:text-sm font-sans text-[#252720] focus:border-[#3D4935] focus:outline-none"
                    >
                      {QUANTITY_TIERS.map((tier) => (
                        <option key={tier.id} value={tier.id}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Custom Printing Requirement & Delivery City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="customPrinting"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                    >
                      Custom Printing Requirement <span className="text-red-700">*</span>
                    </label>
                    <select
                      id="customPrinting"
                      name="customPrinting"
                      value={formData.customPrinting}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs sm:text-sm font-sans text-[#252720] focus:border-[#3D4935] focus:outline-none"
                    >
                      {PRINTING_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="deliveryCity"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                    >
                      Delivery Destination City (India) <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="deliveryCity"
                      name="deliveryCity"
                      type="text"
                      required
                      value={formData.deliveryCity}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai, Bengaluru, Delhi, Kolkata..."
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.deliveryCity ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.deliveryCity && (
                      <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.deliveryCity}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 5. Additional Requirements */}
                <div>
                  <label
                    htmlFor="additionalRequirements"
                    className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                  >
                    Additional Specifications & Requirements <span className="text-[#68745A] font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    id="additionalRequirements"
                    name="additionalRequirements"
                    rows={4}
                    value={formData.additionalRequirements}
                    onChange={handleChange}
                    placeholder="Provide details on custom dimensions (W x H x Gusset), target in-hand deadline, handle preferences (cotton rope, padded webbing), inner lining, or Pantone codes."
                    className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs sm:text-sm font-sans text-[#252720] focus:border-[#3D4935] focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 justify-center text-xs uppercase tracking-widest font-semibold py-4"
                  >
                    {isSubmitting ? 'Transmitting RFQ...' : 'Submit Wholesale Quotation Request'}
                  </Button>

                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-4 bg-[#3D4935] hover:bg-[#252720] text-[#F7F5EF] text-xs font-semibold uppercase tracking-widest border border-[#252720] flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#A88B66]" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#68745A] font-sans pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3D4935]" />
                  <span>Confidential Mill Pricing • Official GST Invoicing • Zero Public Disclosure</span>
                </div>
              </form>
            )}
          </div>
        </Container>
      </section>

      {/* 5. Frequently Asked Procurement Questions */}
      <section className="pt-16 sm:pt-20">
        <Container size="md">
          <div className="border border-[#E8DDCA] bg-[#FFFFFF] p-8 sm:p-10 space-y-6">
            <h3 className="font-serif text-2xl text-[#252720] border-b border-[#E8DDCA] pb-4">
              Wholesale Procurement FAQs
            </h3>

            <div className="space-y-4 text-xs font-sans divide-y divide-[#E8DDCA]">
              <div className="pt-3 space-y-1">
                <strong className="text-sm font-serif text-[#252720] block">
                  What is the minimum order quantity (MOQ) for custom printed bags?
                </strong>
                <p className="text-[#252720]/80 leading-relaxed">
                  Our minimum batch size is 50 pieces for plain or standard bags, and 100 pieces for custom screen-printed or foil-stamped orders. For high volume runs (500+ and 1,000+ units), deep factory volume discounts apply.
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <strong className="text-sm font-serif text-[#252720] block">
                  How quickly will we receive digital proofs and physical swatches?
                </strong>
                <p className="text-[#252720]/80 leading-relaxed">
                  Digital layout vector proofs are provided within 24 business hours of submitting vector artwork (AI/EPS/PDF). Fabric swatch cards (featuring 280 to 450 GSM weaves) can be dispatched via express air courier upon request.
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <strong className="text-sm font-serif text-[#252720] block">
                  Can JUTON ship to multiple corporate retail stores across India?
                </strong>
                <p className="text-[#252720]/80 leading-relaxed">
                  Yes. We handle split pan-India dispatches from our logistics hubs in Mumbai, Delhi-NCR, Bengaluru, Kolkata, and Hyderabad with door-to-door transit insurance and GST e-way bills.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default function BulkOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F7F5EF] min-h-screen py-24 text-center font-sans">
          <div className="inline-block w-8 h-8 border-2 border-[#3D4935] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#68745A]">
            Loading Wholesale Desk...
          </p>
        </div>
      }
    >
      <WholesaleInquiryContent />
    </Suspense>
  );
}
