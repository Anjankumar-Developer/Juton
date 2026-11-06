'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Phone,
  FileText,
  Printer,
  RotateCcw,
  MessageCircle,
  CheckCircle2,
  Package,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import Button from '@/components/ui/Button';
import OrderStatusBadge from './OrderStatusBadge';
import OrderProgressTracker from './OrderProgressTracker';
import { formatCurrency } from '@/lib/utils';
import { WHATSAPP_CORPORATE_NUMBER } from '@/lib/inquiry';

/**
 * Editorial Order Detail View for JUTON customer accounts
 */
export default function OrderDetailView({ order, onBack, standalone = false }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!order) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-12 text-center space-y-4">
        <Package className="w-12 h-12 text-[#A88B66] mx-auto" />
        <h3 className="font-serif text-2xl text-[#252720]">Wholesale Order Not Found</h3>
        <p className="text-xs sm:text-sm text-[#252720]/75 font-sans max-w-md mx-auto">
          The requested consignment reference could not be located in your current session records.
        </p>
        <div className="pt-2">
          {onBack ? (
            <Button variant="primary" size="sm" onClick={onBack}>
              Return to All Orders
            </Button>
          ) : (
            <Button variant="primary" size="sm" as={Link} href="/account">
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  const whatsappInquiryUrl = `https://wa.me/${WHATSAPP_CORPORATE_NUMBER}?text=${encodeURIComponent(
    `*JUTON Order Support*\nOrder Number: ${order.orderNumber}\nStatus: ${order.status}\nTotal Amount: ${formatCurrency(
      order.summary?.totalAmount || order.totalAmount
    )}\nPlease assist with logistics/invoice query.`
  )}`;

  const totalUnits = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    : 0;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header & Actions Bar */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DDCA] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1 text-xs text-[#68745A] hover:text-[#252720] transition-colors cursor-pointer uppercase tracking-wider font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>All Orders</span>
                </button>
              ) : (
                <Link
                  href="/account"
                  className="flex items-center gap-1 text-xs text-[#68745A] hover:text-[#252720] transition-colors uppercase tracking-wider font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
              <span className="text-[#E8DDCA]">|</span>
              <span className="text-xs text-[#68745A] uppercase tracking-wider">
                Consignment Batch
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#252720]">
                {order.orderNumber}
              </h2>
              <OrderStatusBadge status={order.status} />
            </div>

            <p className="text-xs text-[#68745A] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>•</span>
              <span className="text-[#3D4935] font-semibold">{totalUnits} Jute Units</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:self-start">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="px-3.5 py-2 bg-[#FFFFFF] border border-[#E8DDCA] text-xs font-semibold text-[#3D4935] hover:bg-[#F7F5EF] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Invoice Generated (Demo)' : 'Download GST Invoice'}</span>
            </button>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#68745A] text-[#FFFFFF] text-xs font-semibold hover:bg-[#3D4935] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Mill Desk WhatsApp</span>
            </a>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              Demo Tax Invoice #INV-{order.orderNumber.replace('JTN-DEMO-', '')} prepared with GST Input Tax Credit breakdown.
            </span>
          </div>
        )}

        {/* Visual Stepped Progress Tracker */}
        <div className="pt-6">
          <OrderProgressTracker order={order} />
        </div>
      </div>

      {/* Line Items & Specifications */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8DDCA] pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Manufactured Units
            </span>
            <h3 className="font-serif text-xl text-[#252720]">Product Details & Specs</h3>
          </div>
          <span className="text-xs text-[#68745A]">
            {order.items?.length || 0} Distinct Design Lines
          </span>
        </div>

        <div className="divide-y divide-[#E8DDCA]">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-20 bg-[#F7F5EF] border border-[#E8DDCA] flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#A88B66]">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A88B66] font-semibold block">
                    {item.category || 'Jute Bag'}
                  </span>
                  <h4 className="font-serif text-base text-[#252720] font-medium">
                    {item.name}
                  </h4>
                  <div className="text-xs text-[#68745A] flex flex-wrap items-center gap-2">
                    {item.color && (
                      <span className="px-1.5 py-0.5 bg-[#F7F5EF] border border-[#E8DDCA] text-[10px] text-[#3D4935]">
                        {item.color}
                      </span>
                    )}
                    {item.specs && (
                      <span className="text-[11px] text-[#68745A] font-sans">
                        {item.specs}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-0 border-[#E8DDCA]/60 pt-2 sm:pt-0 text-right">
                <div className="text-xs text-[#68745A]">
                  <span className="font-semibold text-[#3D4935]">{item.quantity} units</span> @ {formatCurrency(item.unitPrice || item.price)}/pc
                </div>
                <div className="font-serif text-base font-semibold text-[#252720]">
                  {formatCurrency(item.lineTotal || (item.quantity * (item.unitPrice || item.price)))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="bg-[#F7F5EF] border border-[#E8DDCA] p-4 text-xs font-sans text-[#3D4935] space-y-1">
            <span className="font-semibold block uppercase tracking-wider text-[10px] text-[#A88B66]">
              Atelier Production Note
            </span>
            <p className="leading-relaxed text-[#252720]/80">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Two Column Layout: Shipping Address & Financial Accounting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Destination & Logistics */}
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-4">
          <div className="border-b border-[#E8DDCA] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                Destination Hub
              </span>
              <h3 className="font-serif text-lg text-[#252720]">Dispatch Address</h3>
            </div>
            <MapPin className="w-4 h-4 text-[#68745A]" />
          </div>

          <div className="space-y-2 text-xs font-sans">
            {order.shippingAddress?.label && (
              <span className="inline-block px-2 py-0.5 bg-[#E8DDCA]/60 text-[#3D4935] text-[10px] font-semibold uppercase tracking-wider">
                {order.shippingAddress.label}
              </span>
            )}
            <div className="text-sm font-semibold text-[#252720]">
              {order.shippingAddress?.recipientName || 'Authorized Receiver'}
            </div>
            {order.shippingAddress?.mobile && (
              <div className="text-[#68745A] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 {order.shippingAddress.mobile}</span>
              </div>
            )}
            <div className="text-[#252720]/85 pt-1 leading-relaxed">
              <p>{order.shippingAddress?.houseBuilding}</p>
              <p>{order.shippingAddress?.street}</p>
              <p className="font-medium">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
              </p>
              <p className="text-[11px] text-[#68745A]">India (Insured Freight Route)</p>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="pt-4 border-t border-[#E8DDCA] space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Payment Settlement
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#68745A]">Method:</span>
              <span className="font-semibold text-[#3D4935] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                {order.paymentMethod || 'UPI (B2B VPA)'}
              </span>
            </div>
            {order.paymentReference && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#68745A]">Txn / VPA Reference:</span>
                <span className="font-mono text-[11px] text-[#252720]">
                  {order.paymentReference}
                </span>
              </div>
            )}
            {order.paymentStatus && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#68745A]">Settlement Status:</span>
                <span className="font-semibold text-emerald-800">
                  {order.paymentStatus}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Accounting */}
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-4">
          <div className="border-b border-[#E8DDCA] pb-3">
            <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Financial Summary
            </span>
            <h3 className="font-serif text-lg text-[#252720]">Wholesale Accounting</h3>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="flex justify-between text-[#68745A]">
              <span>Base Mill Price Subtotal:</span>
              <span className="text-[#252720] font-medium">
                {formatCurrency(order.summary?.subtotal || order.subtotal || order.totalAmount)}
              </span>
            </div>

            {(order.summary?.wholesaleDiscount > 0 || order.discount > 0) && (
              <div className="flex justify-between text-emerald-800">
                <span>Volume Wholesale Discount:</span>
                <span className="font-semibold">
                  -{formatCurrency(order.summary?.wholesaleDiscount || order.discount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-[#68745A]">
              <span>Jute Textile GST (5% ITC):</span>
              <span className="text-[#252720]">
                {formatCurrency(order.summary?.gstAmount || Math.round((order.totalAmount || 0) * 0.05))}
              </span>
            </div>

            <div className="flex justify-between text-[#68745A]">
              <span>Pan-India Commercial Freight:</span>
              <span className="text-emerald-800 font-medium">
                {order.summary?.shippingFee === 0 ? 'Complimentary (Enterprise Tier)' : formatCurrency(order.summary?.shippingFee || 0)}
              </span>
            </div>

            <div className="pt-3 border-t border-[#E8DDCA] flex justify-between items-baseline">
              <div>
                <span className="font-serif text-base text-[#252720] block">
                  Total Settlement
                </span>
                <span className="text-[10px] text-[#68745A]">
                  Inclusive of all taxes & insurance
                </span>
              </div>
              <span className="font-serif text-2xl text-[#3D4935] font-semibold">
                {formatCurrency(order.summary?.totalAmount || order.totalAmount)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DDCA] flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              as={Link}
              href="/shop"
              className="w-full text-xs uppercase tracking-wider font-semibold justify-center"
            >
              Order Similar Bag Designs
            </Button>
            <Button
              variant="outline"
              size="sm"
              as={Link}
              href="/bulk-orders"
              className="w-full text-xs uppercase tracking-wider font-semibold justify-center"
            >
              Request Custom Dimensions RFQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
