'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  CreditCard,
  QrCode,
  User,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Lock,
  Building2,
  Check,
  UserCheck,
  PackageCheck,
  Info
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import {
  INDIAN_STATES,
  validateShippingAddress,
  formatIndianPhone,
  EMAIL_REGEX,
  INDIAN_MOBILE_REGEX,
} from '@/lib/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, clearCart, isLoaded: isCartLoaded, activeCurrency } = useCart();
  const { user, isAuthenticated, isAuthLoaded, loginWithDemo, addDemoOrder } = useAuth();

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    mobile: '',
    businessName: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    houseBuilding: '',
    street: '',
    city: '',
    state: 'West Bengal',
    pinCode: '',
  });

  // Payment Selection: 'COD' | 'UPI'
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiProvider, setUpiProvider] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'custom'
  const [upiId, setUpiId] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmed Order State (Demo Order Confirmation)
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Pre-fill user data when authenticated
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      setCustomerInfo((prev) => ({
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        mobile: prev.mobile || user.mobile || '',
        businessName: prev.businessName || user.businessName || '',
      }));

      if (user.address) {
        setShippingAddress((prev) => ({
          houseBuilding: prev.houseBuilding || user.address.houseBuilding || '',
          street: prev.street || user.address.street || '',
          city: prev.city || user.address.city || '',
          state: prev.state || user.address.state || 'West Bengal',
          pinCode: prev.pinCode || user.address.pinCode || '',
        }));
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleQuickDemoFill = () => {
    loginWithDemo();
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (isSubmitting || confirmedOrder) {
      return;
    }

    setIsSubmitting(true);
    const newErrors = {};

    // Validate Customer Info
    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!customerInfo.email.trim() || !EMAIL_REGEX.test(customerInfo.email.trim())) {
      newErrors.email = 'Valid corporate or personal email is required.';
    }
    if (!customerInfo.mobile.trim() || !INDIAN_MOBILE_REGEX.test(customerInfo.mobile.trim().replace(/[\s-]/g, ''))) {
      newErrors.mobile = 'Valid 10-digit Indian mobile number is required.';
    }

    // Validate Shipping Address (Only Indian Delivery Addresses)
    const addressValidation = validateShippingAddress(shippingAddress);
    if (!addressValidation.valid) {
      Object.assign(newErrors, addressValidation.errors);
    }

    // Validate UPI selection if chosen
    if (paymentMethod === 'UPI' && upiProvider === 'custom') {
      if (!upiId.trim() || !upiId.includes('@')) {
        newErrors.upiId = 'Please enter a valid UPI VPA format (e.g. buyer@okaxis).';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      // Scroll to top of form
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // Construct Demo Order object
    const orderPayload = {
      customer: customerInfo,
      shippingAddress: {
        ...shippingAddress,
        country: 'India',
      },
      paymentMethod:
        paymentMethod === 'COD'
          ? 'Cash on Delivery (Pay at Factory Dispatch / Gate)'
          : `UPI (${upiProvider.toUpperCase()}${upiId ? ` - ${upiId}` : ''})`,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        color: i.selectedColor,
        quantity: i.quantity,
        stockQuantity: i.stockQuantity ?? i.inventory?.available_quantity ?? i.inventory?.availableQuantity ?? 0,
        price: i.financials?.unitPrice || i.priceINR,
        lineTotal: i.financials?.lineSubtotal || 0,
      })),
      totals: {
        baseSubtotal: totals.baseSubtotal,
        discountedSubtotal: totals.subtotal,
        tierSavings: totals.tierDiscount,
        savingsPercent: totals.savingsPercentage,
        gst: totals.estimatedTax,
        shipping: totals.estimatedShipping,
        grandTotal: totals.netTotal,
      },
      totalAmount: totals.netTotal,
      currency: activeCurrency,
    };

    const placed = addDemoOrder(orderPayload);
    if (!placed || placed.success === false) {
      setErrors((prev) => ({
        ...prev,
        form: placed?.error || 'This order could not be processed because stock was no longer available.',
      }));
      setIsSubmitting(false);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    clearCart();
    setConfirmedOrder(placed);
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If order is placed, show Order Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-12 sm:py-16">
        <Container size="md">
          {/* Order Confirmation Card */}
          <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-8 sm:p-12 shadow-sm space-y-8">
            {/* Header Badge */}
            <div className="text-center space-y-3 pb-8 border-b border-[#E8DDCA]">
              <div className="w-16 h-16 bg-[#3D4935] text-[#E8DDCA] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                Official Demo Order Acknowledgment
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#252720] font-normal">
                Wholesale Order Confirmed
              </h1>
              <p className="text-xs sm:text-sm text-[#68745A] font-sans max-w-md mx-auto">
                Your commercial order batch has been registered in the Bengal loom scheduling queue.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F5EF] border border-[#E8DDCA] text-xs font-mono font-bold text-[#3D4935]">
                <span>Order Ref: {confirmedOrder.orderNumber}</span>
              </div>
            </div>

            {/* Demo Phase Advisory Banner */}
            <div className="p-4 bg-[#E8DDCA]/45 border border-[#A88B66]/40 text-xs font-sans text-[#3D4935] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#68745A] flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="block font-medium">Frontend Demonstration Phase</strong>
                This is a simulated order confirmation. No real financial charges occurred, and no real physical goods will be shipped. The demo record is saved in your local account dashboard for review.
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Shipping Details */}
              <div className="p-5 bg-[#F7F5EF] border border-[#E8DDCA] space-y-2 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-[#3D4935] font-semibold uppercase text-[10px] tracking-wider mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Indian Delivery Destination</span>
                </div>
                <strong className="block font-serif text-sm text-[#252720]">
                  {confirmedOrder.customer?.fullName}
                </strong>
                {confirmedOrder.customer?.businessName && (
                  <p className="text-[#68745A]">{confirmedOrder.customer.businessName}</p>
                )}
                <p className="text-[#252720]">{confirmedOrder.shippingAddress?.houseBuilding}</p>
                <p className="text-[#252720]">{confirmedOrder.shippingAddress?.street}</p>
                <p className="text-[#252720]">
                  {confirmedOrder.shippingAddress?.city}, {confirmedOrder.shippingAddress?.state} - {confirmedOrder.shippingAddress?.pinCode}
                </p>
                <p className="text-[#68745A] pt-1">
                  Contact: {formatIndianPhone(confirmedOrder.customer?.mobile)} • {confirmedOrder.customer?.email}
                </p>
              </div>

              {/* Payment & Order Status */}
              <div className="p-5 bg-[#F7F5EF] border border-[#E8DDCA] space-y-2 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-[#3D4935] font-semibold uppercase text-[10px] tracking-wider mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Payment & Logistics State</span>
                </div>
                <div>
                  <span className="text-[#68745A] block uppercase text-[10px]">Payment Method:</span>
                  <span className="font-semibold text-[#252720]">{confirmedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[#68745A] block uppercase text-[10px]">Order Status:</span>
                  <span className="font-semibold text-[#3D4935]">{confirmedOrder.status}</span>
                </div>
                <div>
                  <span className="text-[#68745A] block uppercase text-[10px]">Logistics:</span>
                  <span className="text-[#252720]">Pan-India Surface & Express Freight (Estimated 4–7 Working Days)</span>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="border border-[#E8DDCA] divide-y divide-[#E8DDCA]">
              <div className="p-4 bg-[#F7F5EF] flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#3D4935] font-sans">
                <span>Ordered Wholesale Models</span>
                <span>Subtotal</span>
              </div>
              {confirmedOrder.items?.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="font-semibold text-[#252720]">{item.name}</span>
                    <span className="text-[#68745A] block text-[11px]">
                      {item.color} • {item.quantity} pieces @ {formatCurrency(item.price, confirmedOrder.currency)}/pc
                    </span>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#252720]">
                    {formatCurrency(item.lineTotal, confirmedOrder.currency)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="p-6 bg-[#F7F5EF] border border-[#E8DDCA] space-y-2 max-w-sm ml-auto text-xs font-sans">
              <div className="flex justify-between text-[#68745A]">
                <span>Base Wholesale Value:</span>
                <span>{formatCurrency(confirmedOrder.totals?.baseSubtotal || 0, confirmedOrder.currency)}</span>
              </div>
              {confirmedOrder.totals?.tierSavings > 0 && (
                <div className="flex justify-between text-[#3D4935] font-semibold">
                  <span>Volume Tier Savings:</span>
                  <span>- {formatCurrency(confirmedOrder.totals.tierSavings, confirmedOrder.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#252720]">
                <span>Discounted Subtotal:</span>
                <span>{formatCurrency(confirmedOrder.totals?.discountedSubtotal || 0, confirmedOrder.currency)}</span>
              </div>
              <div className="flex justify-between text-[#68745A]">
                <span>Estimated GST (5%):</span>
                <span>{formatCurrency(confirmedOrder.totals?.gst || 0, confirmedOrder.currency)}</span>
              </div>
              <div className="flex justify-between text-[#68745A]">
                <span>Pan-India Freight:</span>
                <span>
                  {confirmedOrder.totals?.shipping === 0 ? 'Complimentary' : formatCurrency(confirmedOrder.totals?.shipping, confirmedOrder.currency)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E8DDCA] flex justify-between font-serif text-lg font-bold text-[#3D4935]">
                <span>Net Total:</span>
                <span>{formatCurrency(confirmedOrder.totalAmount, confirmedOrder.currency)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8DDCA]">
              <Link
                href={`/account/orders/${confirmedOrder.orderNumber}`}
                className="text-xs uppercase tracking-widest font-semibold text-[#3D4935] hover:text-[#252720] underline underline-offset-4 flex items-center gap-1.5"
              >
                <span>Track Consignment & Progress in Customer Dashboard →</span>
              </Link>
              <Button
                variant="primary"
                size="md"
                as={Link}
                href="/shop"
                className="text-xs uppercase tracking-widest font-semibold"
              >
                Continue Browsing Catalog
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Loading state
  if (!isCartLoaded || !isAuthLoaded) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-24 text-center font-sans">
        <div className="inline-block w-8 h-8 border-2 border-[#3D4935] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#68745A]">
          Loading Commercial Checkout...
        </p>
      </div>
    );
  }

  // If cart is empty, show empty guidance
  if (items.length === 0) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-16">
        <Container size="sm">
          <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-10 sm:p-14 text-center space-y-5">
            <div className="w-16 h-16 bg-[#E8DDCA]/50 text-[#68745A] rounded-full flex items-center justify-center mx-auto border border-[#E8DDCA]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl text-[#252720]">Wholesale Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-[#252720]/75 font-sans max-w-sm mx-auto leading-relaxed">
              You need at least one commercial jute model batch in your cart to proceed with checkout.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                as={Link}
                href="/shop"
                className="text-xs uppercase tracking-widest font-semibold"
              >
                Browse Product Catalog
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // MANDATORY REGISTRATION CHECK: If user is not authenticated, show registration gate
  if (!isAuthenticated) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-12 sm:py-16">
        <Container size="sm">
          <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-[#E8DDCA]/60 text-[#3D4935] rounded-full flex items-center justify-center mx-auto border border-[#E8DDCA]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                Mandatory Trade Registration Required
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#252720]">
                Sign In to Complete Checkout
              </h1>
              <p className="text-xs sm:text-sm text-[#252720]/75 font-sans max-w-md mx-auto leading-relaxed">
                Direct mill shipments require an authenticated commercial profile for GST invoicing, dispatch tracking, and factory batch allocation.
              </p>
            </div>

            {/* Quick 1-click Demo Fill */}
            <div className="p-4 bg-[#F7F5EF] border border-[#E8DDCA] text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#252720] font-sans">
                <UserCheck className="w-4 h-4 text-[#3D4935]" />
                <span>Instant Evaluation Login</span>
              </div>
              <p className="text-[11px] text-[#68745A] font-sans">
                Click below to instantly authenticate as our sample buyer (Vikramaditya Roy / Bengal Organic Grocers) and proceed straight to checkout.
              </p>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="w-full mt-1 px-4 py-2 bg-[#3D4935] text-[#F7F5EF] hover:bg-[#252720] text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer"
              >
                Authenticate as Demo Corporate Buyer
              </button>
            </div>

            {/* Standard Login or Register Links */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                as={Link}
                href="/login"
                className="w-full sm:w-auto text-xs uppercase tracking-widest font-semibold"
              >
                Sign In with Existing Account
              </Button>
              <Button
                variant="secondary"
                size="md"
                as={Link}
                href="/register"
                className="w-full sm:w-auto text-xs uppercase tracking-widest font-semibold"
              >
                Register New Wholesale Profile
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Main Checkout Layout (when authenticated with items in cart)
  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10 sm:py-14">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#68745A] font-sans uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-[#252720] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-[#252720] transition-colors">
            Wholesale Cart
          </Link>
          <span>/</span>
          <span className="text-[#3D4935] font-semibold">Commercial Checkout</span>
        </nav>

        {/* Demo Mode Notice */}
        <div className="mb-6 p-4 bg-[#E8DDCA]/40 border border-[#A88B66]/40 text-xs font-sans text-[#3D4935] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#68745A] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-medium">Frontend Demonstration Phase</strong>
            Orders placed here generate simulated proforma records in browser storage. No real payment will be debited, and no production run will be dispatched.
          </div>
        </div>

        {/* 2-Column Responsive Layout: Form on Left, Order Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Customer Info, Shipping Address, Payment */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handlePlaceOrder} id="checkout-form" noValidate>
              {/* Section 1: Customer Information */}
              <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-5 mb-8">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCA]">
                  <h2 className="font-serif text-xl sm:text-2xl text-[#252720] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#3D4935]" />
                    <span>1. Customer & Procurement Information</span>
                  </h2>
                  <span className="text-[11px] font-sans text-[#68745A]">
                    Logged in as <strong>{user?.fullName}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                    >
                      Full Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={customerInfo.fullName}
                      onChange={handleCustomerChange}
                      placeholder="e.g. Vikramaditya Roy"
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.fullName ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-[11px] text-red-700 font-sans">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                    >
                      Business / Company Name
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={customerInfo.businessName}
                      onChange={handleCustomerChange}
                      placeholder="e.g. Bengal Organic Grocers"
                      className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs sm:text-sm font-sans text-[#252720] focus:border-[#3D4935] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                    >
                      Corporate Email <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={handleCustomerChange}
                      placeholder="procurement@company.com"
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.email ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-[11px] text-red-700 font-sans">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                    >
                      Mobile Number (India) <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={customerInfo.mobile}
                      onChange={handleCustomerChange}
                      placeholder="10 digits (e.g. 9830048821)"
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.mobile ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-[11px] text-red-700 font-sans">{errors.mobile}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping Address (Only Indian Delivery Addresses) */}
              <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-5 mb-8">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCA]">
                  <h2 className="font-serif text-xl sm:text-2xl text-[#252720] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#3D4935]" />
                    <span>2. Indian Shipping Address</span>
                  </h2>
                  <span className="text-[11px] font-sans text-[#A88B66] font-semibold uppercase tracking-wider">
                    Domestic India Only
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="houseBuilding"
                    className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                  >
                    House / Building / Unit / Floor <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="houseBuilding"
                    name="houseBuilding"
                    type="text"
                    required
                    value={shippingAddress.houseBuilding}
                    onChange={handleAddressChange}
                    placeholder="e.g. Godown 4B, Golden Fiber Logistics Hub"
                    className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                      errors.houseBuilding ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                    }`}
                  />
                  {errors.houseBuilding && (
                    <p className="mt-1 text-[11px] text-red-700 font-sans">{errors.houseBuilding}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="street"
                    className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                  >
                    Street Name / Area / Industrial Estate <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="e.g. Strand Bank Road, Posta"
                    className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                      errors.street ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                    }`}
                  />
                  {errors.street && (
                    <p className="mt-1 text-[11px] text-red-700 font-sans">{errors.street}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                    >
                      City / District <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      placeholder="e.g. Kolkata"
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.city ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-[11px] text-red-700 font-sans">{errors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                    >
                      State / UT <span className="text-red-700">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.state ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-[11px] text-red-700 font-sans">{errors.state}</p>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label
                      htmlFor="pinCode"
                      className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                    >
                      PIN Code (6 digits) <span className="text-red-700">*</span>
                    </label>
                    <input
                      id="pinCode"
                      name="pinCode"
                      type="text"
                      required
                      maxLength={6}
                      value={shippingAddress.pinCode}
                      onChange={handleAddressChange}
                      placeholder="e.g. 700001"
                      className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                        errors.pinCode ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                      }`}
                    />
                    {errors.pinCode && (
                      <p className="mt-1 text-[11px] text-red-700 font-sans">{errors.pinCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Options (Cash on Delivery & UPI) */}
              <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-5">
                <div className="pb-3 border-b border-[#E8DDCA]">
                  <h2 className="font-serif text-xl sm:text-2xl text-[#252720] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#3D4935]" />
                    <span>3. Payment Selection</span>
                  </h2>
                  <p className="text-xs text-[#68745A] font-sans mt-0.5">
                    Select your preferred commercial settlement method for this batch.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Option A: Cash on Delivery */}
                  <label
                    className={`block p-4 border transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-[#3D4935] bg-[#F7F5EF]'
                        : 'border-[#E8DDCA] bg-[#FFFFFF] hover:border-[#A88B66]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="mt-1 accent-[#3D4935]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-serif text-[#252720]">
                            Cash on Delivery / Gate Cheque
                          </strong>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#E8DDCA] text-[#3D4935] font-semibold">
                            Zero Advance Required
                          </span>
                        </div>
                        <p className="text-xs text-[#68745A] font-sans mt-1 leading-relaxed">
                          Settle upon physical inspection and handover at your warehouse gate or transport partner depot via RTGS, corporate cheque, or cash.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option B: UPI Selection */}
                  <div
                    className={`p-4 border transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#3D4935] bg-[#F7F5EF]'
                        : 'border-[#E8DDCA] bg-[#FFFFFF]'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="mt-1 accent-[#3D4935]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-serif text-[#252720]">
                            UPI (Unified Payments Interface)
                          </strong>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#68745A]/15 text-[#3D4935] font-semibold">
                            Direct Bank Transfer
                          </span>
                        </div>
                        <p className="text-xs text-[#68745A] font-sans mt-1 leading-relaxed">
                          Instant Indian B2B bank debit via Google Pay, PhonePe, Paytm, BHIM, or corporate VPA.
                        </p>
                      </div>
                    </label>

                    {/* UPI Interactive Selection Interface & Future Integration Placeholder */}
                    {paymentMethod === 'UPI' && (
                      <div className="mt-4 pt-4 border-t border-[#E8DDCA] space-y-4">
                        {/* Mandatory Disclaimer */}
                        <div className="p-3 bg-[#E8DDCA]/60 border border-[#A88B66]/40 text-[11px] font-sans text-[#3D4935] flex items-start gap-2">
                          <Info className="w-4 h-4 text-[#68745A] flex-shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <strong className="block font-semibold">UPI Payment Interface Placeholder</strong>
                            This is an interactive selection interface for future payment gateway integration. In accordance with guidelines, no real debit or simulated fake success transaction occurs.
                          </div>
                        </div>

                        {/* UPI App Selection Chips */}
                        <div>
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#68745A] font-sans block mb-2">
                            Select UPI App or Method:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { id: 'gpay', label: 'Google Pay' },
                              { id: 'phonepe', label: 'PhonePe' },
                              { id: 'paytm', label: 'Paytm UPI' },
                              { id: 'custom', label: 'Other VPA / ID' },
                            ].map((app) => (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() => setUpiProvider(app.id)}
                                className={`px-3 py-2 text-xs font-sans font-medium border text-center transition-colors cursor-pointer ${
                                  upiProvider === app.id
                                    ? 'bg-[#3D4935] text-[#F7F5EF] border-[#3D4935]'
                                    : 'bg-[#FFFFFF] text-[#252720] border-[#E8DDCA] hover:bg-[#F7F5EF]'
                                }`}
                              >
                                {app.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom VPA Input */}
                        {upiProvider === 'custom' && (
                          <div>
                            <label
                              htmlFor="upiId"
                              className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1"
                            >
                              Enter Corporate UPI VPA / ID <span className="text-red-700">*</span>
                            </label>
                            <input
                              id="upiId"
                              type="text"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                if (errors.upiId) {
                                  setErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.upiId;
                                    return next;
                                  });
                                }
                              }}
                              placeholder="e.g. procurement@okaxis"
                              className={`w-full px-3.5 py-2 bg-[#FFFFFF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                                errors.upiId ? 'border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                              }`}
                            />
                            {errors.upiId && (
                              <p className="mt-1 text-[11px] text-red-700 font-sans">{errors.upiId}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button on Mobile */}
              <div className="pt-4 lg:hidden">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full justify-center text-xs uppercase tracking-widest font-semibold"
                >
                  {isSubmitting ? 'Registering Demo Order...' : `Place Wholesale Order (${formatCurrency(totals.netTotal, activeCurrency)})`}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-6 sticky top-28 shadow-xs">
              <div className="pb-3 border-b border-[#E8DDCA]">
                <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                  Procurement Review
                </span>
                <h3 className="font-serif text-2xl text-[#252720]">Wholesale Order Summary</h3>
                <span className="text-xs text-[#68745A] font-sans">
                  {totals.totalItems} model(s) • {totals.totalUnits} total pieces
                </span>
              </div>

              {/* Products List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-[#E8DDCA]/70 pr-1 space-y-3">
                {items.map((item) => (
                  <div key={item.itemKey} className="pt-3 flex gap-3 text-xs font-sans">
                    <div className="relative w-14 h-14 bg-[#E8DDCA]/40 border border-[#E8DDCA] flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-[#252720] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#68745A]">
                        Variant: {item.selectedColor}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-[#252720]">
                          Qty: <strong>{item.quantity}</strong> pcs
                        </span>
                        <span className="font-serif font-bold text-sm text-[#3D4935]">
                          {formatCurrency(item.financials?.lineSubtotal || 0, activeCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Math Breakdown */}
              <div className="pt-4 border-t border-[#E8DDCA] space-y-2 text-xs font-sans">
                <div className="flex justify-between text-[#68745A]">
                  <span>Base Wholesale Value:</span>
                  <span>{formatCurrency(totals.baseSubtotal, activeCurrency)}</span>
                </div>

                {totals.tierDiscount > 0 && (
                  <div className="flex justify-between text-[#3D4935] font-semibold bg-[#E8DDCA]/40 px-2.5 py-1.5 border border-[#E8DDCA]">
                    <span>Volume Tier Savings ({totals.savingsPercentage}%):</span>
                    <span>- {formatCurrency(totals.tierDiscount, activeCurrency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#252720] font-medium pt-1">
                  <span>Discounted Subtotal:</span>
                  <span>{formatCurrency(totals.subtotal, activeCurrency)}</span>
                </div>

                <div className="flex justify-between text-[#68745A]">
                  <span>Estimated GST (5% B2B ITC):</span>
                  <span>{formatCurrency(totals.estimatedTax, activeCurrency)}</span>
                </div>

                <div className="flex justify-between text-[#68745A]">
                  <span>Pan-India Mill Freight:</span>
                  <span>
                    {totals.isFreeShipping
                      ? 'Complimentary Free Freight'
                      : formatCurrency(totals.estimatedShipping, activeCurrency)}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E8DDCA] flex items-baseline justify-between">
                  <span className="font-serif text-base font-bold text-[#252720]">
                    Total Amount:
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#3D4935]">
                    {formatCurrency(totals.netTotal, activeCurrency)}
                  </span>
                </div>
              </div>

              {/* Submit Button on Desktop */}
              <div className="pt-2 hidden lg:block">
                <Button
                  type="submit"
                  form="checkout-form"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full justify-center text-xs uppercase tracking-widest font-semibold"
                >
                  {isSubmitting ? 'Registering Demo Order...' : 'Place Wholesale Order (Demo Mode)'}
                </Button>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-[#E8DDCA] space-y-2 text-[11px] text-[#68745A] font-sans">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3D4935] flex-shrink-0" />
                  <span>GST Tax Invoices for 100% Input Tax Credit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#3D4935] flex-shrink-0" />
                  <span>Only Indian Delivery Addresses Supported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
