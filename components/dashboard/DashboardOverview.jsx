'use client';

import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  MapPin,
  Plus
} from 'lucide-react';
import Button from '@/components/ui/Button';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency } from '@/lib/utils';
import { calculateDashboardStats } from '@/lib/dashboard';

/**
 * Overview section for JUTON customer dashboard
 */
export default function DashboardOverview({
  user,
  orders = [],
  savedAddresses = [],
  onNavigateTab,
  onSelectOrder,
}) {
  const stats = calculateDashboardStats(orders);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-8 font-sans">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[#68745A]">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Total Batches
            </span>
            <Package className="w-4 h-4 text-[#A88B66]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[#252720]">
            {stats.totalOrders}
          </div>
          <p className="text-[11px] text-[#68745A]">
            {stats.activeCount} currently active in loom/transit
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[#68745A]">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Units Manufactured
            </span>
            <Layers className="w-4 h-4 text-[#68745A]" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[#3D4935]">
            {stats.totalUnits.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#68745A]">
            Certified biodegradable jute bags
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[#68745A]">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Lifetime Spend
            </span>
            <span className="text-xs font-mono font-bold text-[#A88B66]">INR</span>
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[#252720]">
            {formatCurrency(stats.totalSpent)}
          </div>
          <p className="text-[11px] text-emerald-800">
            100% Eligible for 5% GST ITC
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[#68745A]">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Delivered Orders
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-[#252720]">
            {stats.deliveredCount}
          </div>
          <p className="text-[11px] text-[#68745A]">
            Accepted at client receiving bays
          </p>
        </div>
      </div>

      {/* Enterprise Procurement Status Banner */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#E8DDCA]/50 text-[#3D4935] flex items-center justify-center flex-shrink-0 border border-[#E8DDCA]">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#3D4935] text-[#F7F5EF] text-[10px] font-bold uppercase tracking-wider">
                Direct-Mill Tier
              </span>
              <span className="text-xs text-[#68745A]">
                Contract Account ID: {user?.id || 'usr_demo_001'}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#252720]">
              {user?.businessName || 'Bengal Organic Grocers Private Limited'}
            </h3>
            <p className="text-xs sm:text-sm text-[#252720]/75 leading-relaxed max-w-xl">
              Your account enjoys direct cooperative loom pricing, locked volume tier-3 discounts, and dedicated logistics coordinators for multi-hub dispatches.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:self-center">
          <Button
            variant="primary"
            size="sm"
            as={Link}
            href="/shop"
            className="text-xs uppercase tracking-wider font-semibold whitespace-nowrap"
          >
            Create New Batch
          </Button>
          <Button
            variant="secondary"
            size="sm"
            as={Link}
            href="/bulk-orders"
            className="text-xs uppercase tracking-wider font-semibold whitespace-nowrap"
          >
            Request Custom RFQ
          </Button>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8DDCA] pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Recent Procurement
            </span>
            <h3 className="font-serif text-xl text-[#252720]">Recent Wholesale Orders</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#3D4935] hover:text-[#252720] transition-colors flex items-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Package className="w-10 h-10 text-[#A88B66] mx-auto opacity-70" />
            <p className="text-xs text-[#68745A]">No wholesale batches placed yet.</p>
            <Button variant="primary" size="sm" as={Link} href="/shop">
              Explore Jute Catalog
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-[#E8DDCA]">
            {recentOrders.map((order) => {
              const totalUnitsOrder = Array.isArray(order.items)
                ? order.items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)
                : 0;

              return (
                <div
                  key={order.orderNumber}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectOrder(order)}
                        className="font-serif text-base sm:text-lg text-[#252720] hover:text-[#3D4935] hover:underline transition-colors text-left font-medium cursor-pointer"
                      >
                        {order.orderNumber}
                      </button>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-xs text-[#68745A] flex flex-wrap items-center gap-2">
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-[#3D4935]">{totalUnitsOrder} units</span>
                      <span>•</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                    <p className="text-xs text-[#252720]/80 line-clamp-1">
                      {order.items?.map((i) => i.name).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-0 border-[#E8DDCA]/60 pt-2 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#68745A] block uppercase">
                        Invoice Total
                      </span>
                      <span className="font-serif text-lg text-[#3D4935] font-semibold">
                        {formatCurrency(order.summary?.totalAmount || order.totalAmount)}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSelectOrder(order)}
                      className="text-[11px] uppercase tracking-wider font-semibold"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Section: Saved Addresses Snapshot & Direct Mill Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DDCA] pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                Logistics Setup
              </span>
              <h4 className="font-serif text-lg text-[#252720]">Saved Delivery Hubs</h4>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('addresses')}
              className="text-xs text-[#3D4935] hover:underline font-semibold uppercase tracking-wider cursor-pointer"
            >
              Manage ({savedAddresses.length})
            </button>
          </div>

          <div className="space-y-3">
            {savedAddresses.slice(0, 2).map((addr) => (
              <div key={addr.id} className="p-3 bg-[#F7F5EF] border border-[#E8DDCA] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#252720]">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="px-1.5 py-0.2 bg-[#3D4935] text-[#F7F5EF] text-[9px] font-bold uppercase">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-[#68745A]">
                  {addr.houseBuilding}, {addr.street}, {addr.city}, {addr.state} - {addr.pinCode}
                </p>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('addresses')}
            className="w-full text-xs uppercase tracking-wider font-semibold justify-center"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Destination Hub
          </Button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 space-y-4">
          <div className="border-b border-[#E8DDCA] pb-3">
            <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Bengal Mills Concierge
            </span>
            <h4 className="font-serif text-lg text-[#252720]">Direct Wholesale Mill Desk</h4>
          </div>

          <div className="space-y-3 text-xs text-[#252720]/80 leading-relaxed">
            <p>
              Need immediate digital vector proofing, customized dye-lot dipping, or split pan-India shipping manifests? Connect directly with our Kolkata commercial desk.
            </p>
            <div className="p-3 bg-[#E8DDCA]/40 border border-[#A88B66]/30 space-y-1">
              <div className="font-medium text-[#3D4935]">
                Commercial Coordinator: Snehashish Sen
              </div>
              <div className="text-[11px] text-[#68745A]">
                Kolkata Mill Direct: +91 (033) 2489-JUTON / +91 98300 48821
              </div>
              <div className="text-[11px] text-[#68745A]">
                Dispatch Hours: Mon–Sat 9:30 AM to 7:00 PM IST
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            as={Link}
            href="/bulk-orders"
            className="w-full text-xs uppercase tracking-wider font-semibold justify-center"
          >
            Submit Formal RFQ
          </Button>
        </div>
      </div>
    </div>
  );
}
