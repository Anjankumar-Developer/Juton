'use client';

import { Check, Clock, AlertTriangle, Truck, Factory, ShieldCheck } from 'lucide-react';
import { ORDER_PROGRESS_STEPS, getOrderStatusInfo } from '@/lib/dashboard';

/**
 * Visual Order Progress Tracker
 * Renders an editorial stepped timeline for wholesale jute consignments
 */
export default function OrderProgressTracker({ order }) {
  if (!order) return null;

  const statusInfo = getOrderStatusInfo(order.status);
  const currentStep = statusInfo.currentStep; // 0 = Cancelled, 1 = Pending, 2 = Confirmed, 3 = Processing, 4 = Shipped, 5 = Delivered
  const isCancelled = statusInfo.label === 'Cancelled';

  if (isCancelled) {
    return (
      <div className="bg-stone-50 border border-stone-300 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center flex-shrink-0 border border-stone-300">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-stone-200 text-stone-800 text-[10px] font-bold uppercase tracking-wider">
                Production Voided
              </span>
              <span className="text-xs text-[#68745A] font-sans">
                Status: Cancelled
              </span>
            </div>
            <h4 className="font-serif text-lg text-[#252720]">
              Wholesale Order Cancelled
            </h4>
            <p className="text-xs sm:text-sm text-[#252720]/80 font-sans leading-relaxed">
              {order.cancellationReason || 'This order was cancelled prior to loom yarn allocation. Any advance payments or security deposits have been scheduled for full reversal.'}
            </p>
            {order.paymentReference && (
              <p className="text-xs text-[#3D4935] font-sans font-medium pt-1">
                Refund Reference: <span className="font-mono">{order.paymentReference}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Icons for step markers
  const getStepIcon = (stepNum, isCompleted, isCurrent) => {
    if (isCompleted) {
      return <Check className="w-4 h-4 stroke-[2.5]" />;
    }
    if (isCurrent) {
      if (stepNum === 3) return <Factory className="w-4 h-4 animate-pulse" />;
      if (stepNum === 4) return <Truck className="w-4 h-4 animate-pulse" />;
      return <Clock className="w-4 h-4 animate-pulse" />;
    }
    return <span className="text-xs font-mono">{stepNum}</span>;
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DDCA] pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
            Bengal Loom Consignment Tracker
          </span>
          <h4 className="font-serif text-lg sm:text-xl text-[#252720]">
            {statusInfo.headline}
          </h4>
        </div>
        <div className="text-xs text-[#68745A] font-sans">
          <span>Target Dispatch SLA: </span>
          <strong className="text-[#3D4935]">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '5–7 Business Days'}</strong>
        </div>
      </div>

      {/* Stepped Progress Bar */}
      <div className="relative pt-2 pb-4">
        {/* Connector Line Container */}
        <div className="hidden md:block absolute top-6 left-8 right-8 h-0.5 bg-[#E8DDCA] -translate-y-1/2 z-0" />
        
        {/* Dynamic Completed Track */}
        <div
          className="hidden md:block absolute top-6 left-8 h-0.5 bg-[#3D4935] -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, ((currentStep - 1) / (ORDER_PROGRESS_STEPS.length - 1)) * 100))}%`,
          }}
        />

        {/* Step Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
          {ORDER_PROGRESS_STEPS.map((step) => {
            const isCompleted = currentStep > step.step || (currentStep === 5 && step.step === 5);
            const isCurrent = currentStep === step.step && currentStep !== 5;
            const isDeliveredAndCurrent = currentStep === 5 && step.step === 5;

            let circleStyle = 'bg-[#F7F5EF] text-[#68745A] border-[#E8DDCA]';
            if (isCompleted || isDeliveredAndCurrent) {
              circleStyle = 'bg-[#3D4935] text-[#FFFFFF] border-[#3D4935] shadow-xs';
            } else if (isCurrent) {
              circleStyle = 'bg-[#68745A] text-[#FFFFFF] border-[#3D4935] ring-4 ring-[#E8DDCA]';
            }

            return (
              <div key={step.step} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 text-left md:text-center">
                {/* Node Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-all flex-shrink-0 ${circleStyle}`}
                >
                  {getStepIcon(step.step, isCompleted, isCurrent || isDeliveredAndCurrent)}
                </div>

                {/* Node Labels */}
                <div className="space-y-0.5 flex-1 md:flex-initial">
                  <div className="flex items-center gap-2 md:justify-center">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        isCurrent || isCompleted || isDeliveredAndCurrent
                          ? 'text-[#252720]'
                          : 'text-[#68745A]/70'
                      }`}
                    >
                      {step.label}
                    </span>
                    {(isCurrent || isDeliveredAndCurrent) && (
                      <span className="px-1.5 py-0.2 bg-[#3D4935] text-[#F7F5EF] text-[9px] font-bold uppercase rounded-none md:hidden">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#A88B66] font-sans font-medium hidden sm:block">
                    {step.sublabel}
                  </p>
                  <p className="text-[10px] text-[#68745A] font-sans line-clamp-2 md:line-clamp-none max-w-[170px] mx-auto pt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transit & Tracking Badge if Shipped or Delivered */}
      {(order.carrier || order.trackingNumber) && (
        <div className="bg-[#F7F5EF] border border-[#E8DDCA] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-[#3D4935]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#68745A] flex-shrink-0" />
            <div>
              <span className="font-semibold block sm:inline">Freight Logistics: </span>
              <span className="text-[#252720]">{order.carrier || 'Dedicated Mill Freight'}</span>
            </div>
          </div>
          {order.trackingNumber && order.trackingNumber !== 'PENDING-DISPATCH' && (
            <div className="flex items-center gap-2">
              <span className="text-[#68745A]">Consignment AWB:</span>
              <span className="font-mono font-semibold px-2 py-0.5 bg-[#FFFFFF] border border-[#E8DDCA] text-[#252720]">
                {order.trackingNumber}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
