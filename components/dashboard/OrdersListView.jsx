'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  Package,
  Calendar,
  CreditCard,
  Truck,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency } from '@/lib/utils';
import { filterOrders, ORDER_STATUSES } from '@/lib/dashboard';

/**
 * Comprehensive Order Management UI
 * Displays orders with filterable statuses, keyword search, and detailed line summaries
 */
export default function OrdersListView({ orders = [], onSelectOrder }) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Compute status counts for tab badges
  const statusCounts = useMemo(() => {
    const counts = { all: orders.length };
    for (const s of Object.values(ORDER_STATUSES)) {
      counts[s] = orders.filter((o) => (o.status || '').toLowerCase().includes(s.toLowerCase())).length;
    }
    return counts;
  }, [orders]);

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    return filterOrders(orders, {
      status: selectedStatus,
      searchQuery,
      sortBy,
    });
  }, [orders, selectedStatus, searchQuery, sortBy]);

  const statusTabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'Processing', label: 'Processing' },
    { key: 'Shipped', label: 'Shipped' },
    { key: 'Delivered', label: 'Delivered' },
    { key: 'Cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Search & Sort Filter Toolbar */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#68745A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number (e.g. JTN-DEMO-2026-8842), product name, or AWB..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] placeholder-[#68745A]/70 focus:outline-none focus:border-[#3D4935] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#68745A] hover:text-[#252720] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#68745A]" />
            <label htmlFor="sort-by" className="text-xs text-[#68745A] font-medium whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] px-3 py-2 focus:outline-none focus:border-[#3D4935] cursor-pointer font-medium"
            >
              <option value="newest">Newest Batches First</option>
              <option value="oldest">Oldest Batches First</option>
              <option value="highest-total">Highest Invoice Value</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-[#E8DDCA] text-xs scrollbar-thin">
          {statusTabs.map((tab) => {
            const count = statusCounts[tab.key] || 0;
            const isActive = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-3 py-1.5 whitespace-nowrap transition-all flex items-center gap-2 uppercase tracking-wider text-[11px] font-semibold border cursor-pointer ${
                  isActive
                    ? 'bg-[#3D4935] text-[#FFFFFF] border-[#3D4935]'
                    : 'bg-[#F7F5EF] text-[#68745A] border-[#E8DDCA] hover:border-[#A88B66] hover:text-[#252720]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                    isActive ? 'bg-[#FFFFFF] text-[#3D4935]' : 'bg-[#E8DDCA] text-[#3D4935]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List Content */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-[#A88B66] mx-auto opacity-60" />
          <h3 className="font-serif text-xl text-[#252720]">No Orders Found</h3>
          <p className="text-xs sm:text-sm text-[#252720]/75 max-w-md mx-auto">
            {searchQuery || selectedStatus !== 'all'
              ? 'No wholesale orders matched your current filters. Try resetting the status or clearing your search query.'
              : 'You have not placed any commercial orders in this session yet.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            {(searchQuery || selectedStatus !== 'all') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="text-xs uppercase tracking-wider"
              >
                Reset Filters
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              as={Link}
              href="/shop"
              className="text-xs uppercase tracking-wider"
            >
              Browse Bag Catalog
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const totalUnitsOrder = Array.isArray(order.items)
              ? order.items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)
              : 0;

            const totalAmount = order.summary?.totalAmount || order.totalAmount;

            return (
              <div
                key={order.orderNumber}
                className="bg-[#FFFFFF] border border-[#E8DDCA] hover:border-[#A88B66] transition-all p-6 space-y-5"
              >
                {/* Header row: Order #, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DDCA] pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-serif text-xl text-[#252720] font-medium">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#68745A]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-[#3D4935]">{totalUnitsOrder} units</span>
                  </div>
                </div>

                {/* Body row: Thumbnails and Product Specs */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Product items preview */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-[#F7F5EF] border border-[#E8DDCA]"
                        >
                          <div className="relative w-12 h-14 bg-[#FFFFFF] border border-[#E8DDCA] flex-shrink-0 overflow-hidden">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#A88B66]">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-0.5 text-xs min-w-0">
                            <span className="text-[10px] uppercase tracking-wider text-[#A88B66] font-semibold block truncate">
                              {item.category || 'Jute Bag'}
                            </span>
                            <h5 className="font-serif text-sm text-[#252720] truncate font-normal">
                              {item.name}
                            </h5>
                            <p className="text-[11px] text-[#68745A]">
                              Qty: <strong className="text-[#3D4935]">{item.quantity}</strong> • {formatCurrency(item.unitPrice || item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.carrier && (
                      <div className="text-[11px] text-[#68745A] flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-[#3D4935]" />
                        <span>Logistics: <strong>{order.carrier}</strong></span>
                        {order.trackingNumber && order.trackingNumber !== 'PENDING-DISPATCH' && (
                          <span className="font-mono text-[#252720]">({order.trackingNumber})</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Financial Total & Details CTA */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 border-[#E8DDCA]/60 pt-3 lg:pt-0 gap-3">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-[#68745A] uppercase tracking-wider block">
                        Invoice Total ({order.paymentMethod ? order.paymentMethod.split(' ')[0] : 'UPI'})
                      </span>
                      <span className="font-serif text-xl sm:text-2xl text-[#3D4935] font-semibold">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelectOrder(order)}
                      className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>View Order Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
