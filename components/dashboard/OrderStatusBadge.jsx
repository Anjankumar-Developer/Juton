'use client';

import { getOrderStatusInfo } from '@/lib/dashboard';

/**
 * Reusable luxury status badge for wholesale orders
 * Supports: Pending, Confirmed, Processing, Shipped, Delivered, Cancelled
 */
export default function OrderStatusBadge({ status, className = '' }) {
  const info = getOrderStatusInfo(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border rounded-none ${info.badgeBg} ${info.badgeText} ${info.badgeBorder} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${info.dotColor}`} />
      <span>{info.label}</span>
    </span>
  );
}
