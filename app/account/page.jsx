'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Building2,
  Package,
  MapPin,
  Settings,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserCheck,
  FileText
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ProfileView from '@/components/dashboard/ProfileView';
import OrdersListView from '@/components/dashboard/OrdersListView';
import OrderDetailView from '@/components/dashboard/OrderDetailView';
import SavedAddressesView from '@/components/dashboard/SavedAddressesView';
import AccountSettingsView from '@/components/dashboard/AccountSettingsView';

function AccountDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const initialOrderId = searchParams.get('order');

  const {
    user,
    isAuthenticated,
    isAuthLoaded,
    logout,
    loginWithDemo,
    updateProfile,
    demoOrders,
    savedAddresses,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultSavedAddress,
    userSettings,
    updateUserSettings,
    resetDemoData,
  } = useAuth();

  // Active section tab: 'overview' | 'profile' | 'orders' | 'order-details' | 'addresses' | 'settings'
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Synchronize initial order query parameter if provided
  useEffect(() => {
    if (initialOrderId && demoOrders.length > 0) {
      const found = demoOrders.find(
        (o) => (o.orderNumber || '').toLowerCase() === initialOrderId.toLowerCase()
      );
      if (found) {
        const timer = setTimeout(() => {
          setSelectedOrder(found);
          setActiveTab('order-details');
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [initialOrderId, demoOrders]);

  // Loading State
  if (!isAuthLoaded) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-24 text-center font-sans">
        <div className="inline-block w-8 h-8 border-2 border-[#3D4935] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#68745A]">
          Loading Wholesale Dashboard...
        </p>
      </div>
    );
  }

  // Unauthenticated State: Show Sign In / Register Prompt with Instant 1-Click Demo Login
  if (!isAuthenticated) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-16">
        <Container size="sm">
          <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-[#E8DDCA]/50 text-[#3D4935] rounded-full flex items-center justify-center mx-auto border border-[#E8DDCA]">
              <User className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                Trade Authentication Required
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#252720]">
                Customer Dashboard Access
              </h1>
              <p className="text-xs sm:text-sm text-[#252720]/75 font-sans max-w-sm mx-auto leading-relaxed">
                Please sign in to access your direct-mill wholesale orders, visual progress tracking, delivery hubs, and business profile.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                as={Link}
                href="/login"
                className="w-full sm:w-auto text-xs uppercase tracking-widest font-semibold"
              >
                Sign In to Account
              </Button>
              <Button
                variant="secondary"
                size="md"
                as={Link}
                href="/register"
                className="w-full sm:w-auto text-xs uppercase tracking-widest font-semibold"
              >
                Register Trade Profile
              </Button>
            </div>

            <div className="pt-4 border-t border-[#E8DDCA]">
              <button
                type="button"
                onClick={loginWithDemo}
                className="text-xs font-sans text-[#3D4935] hover:text-[#252720] font-semibold underline underline-offset-4 flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Continue Instantly with Demo Account (Vikramaditya Roy)</span>
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setActiveTab('order-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
    setActiveTab('orders');
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey !== 'order-details') {
      setSelectedOrder(null);
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'profile', label: 'My Profile', icon: User },
    { key: 'orders', label: 'My Orders', icon: Package, badge: demoOrders.length },
    { key: 'addresses', label: 'Saved Addresses', icon: MapPin, badge: savedAddresses.length },
    { key: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10 sm:py-14 font-sans">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#68745A] uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-[#252720] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#3D4935] font-semibold">Customer Dashboard</span>
          {activeTab === 'order-details' && selectedOrder && (
            <>
              <span>/</span>
              <span className="text-[#252720] font-medium">{selectedOrder.orderNumber}</span>
            </>
          )}
        </nav>

        {/* Frontend Demonstration Notice Bar */}
        <div className="mb-6 p-4 bg-[#E8DDCA]/40 border border-[#A88B66]/40 text-xs text-[#3D4935] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#68745A] flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block font-medium">Verified Commercial B2B Session (Demo Mode)</strong>
              All 6 demonstration order statuses (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled) and delivery addresses are interactive and persistent in your browser.
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#E8DDCA] text-[11px] font-semibold text-red-700 hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Top Editorial Header & Tabs Navigation */}
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DDCA]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[#68745A]/15 text-[#3D4935] text-[10px] font-semibold uppercase tracking-wider">
                  Verified Wholesale Partner
                </span>
                <span className="text-[11px] text-[#68745A]">
                  Client ID: {user.id || 'usr_demo_001'}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#252720] font-normal">
                {user.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-[#68745A] font-sans mt-0.5">
                {user.businessName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                as={Link}
                href="/shop"
                className="text-xs uppercase tracking-widest font-semibold"
              >
                Browse Catalog
              </Button>
              <Button
                variant="secondary"
                size="sm"
                as={Link}
                href="/bulk-orders"
                className="text-xs uppercase tracking-widest font-semibold"
              >
                Request RFQ
              </Button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex gap-2 sm:gap-6 pt-4 text-xs font-sans uppercase tracking-wider font-semibold overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`pb-2.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#3D4935] text-[#3D4935]'
                      : 'border-transparent text-[#68745A] hover:text-[#252720]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                        isActive
                          ? 'bg-[#3D4935] text-[#FFFFFF]'
                          : 'bg-[#E8DDCA] text-[#3D4935]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {activeTab === 'order-details' && (
              <button
                type="button"
                className="pb-2.5 border-b-2 border-[#3D4935] text-[#3D4935] flex items-center gap-2 whitespace-nowrap cursor-default"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Order Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Contents */}
        {activeTab === 'overview' && (
          <DashboardOverview
            user={user}
            orders={demoOrders}
            savedAddresses={savedAddresses}
            onNavigateTab={handleTabChange}
            onSelectOrder={handleSelectOrder}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView user={user} onUpdateProfile={updateProfile} />
        )}

        {activeTab === 'orders' && (
          <OrdersListView orders={demoOrders} onSelectOrder={handleSelectOrder} />
        )}

        {activeTab === 'order-details' && (
          <OrderDetailView
            order={selectedOrder || demoOrders[0]}
            onBack={handleBackToOrders}
          />
        )}

        {activeTab === 'addresses' && (
          <SavedAddressesView
            addresses={savedAddresses}
            onAddAddress={addSavedAddress}
            onUpdateAddress={updateSavedAddress}
            onDeleteAddress={deleteSavedAddress}
            onSetDefault={setDefaultSavedAddress}
          />
        )}

        {activeTab === 'settings' && (
          <AccountSettingsView
            user={user}
            orders={demoOrders}
            savedAddresses={savedAddresses}
            userSettings={userSettings}
            onUpdateSettings={updateUserSettings}
            onResetDemoData={resetDemoData}
            onLogout={logout}
          />
        )}
      </Container>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F7F5EF] min-h-screen py-24 text-center font-sans">
          <div className="inline-block w-8 h-8 border-2 border-[#3D4935] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#68745A]">
            Loading Wholesale Dashboard...
          </p>
        </div>
      }
    >
      <AccountDashboardContent />
    </Suspense>
  );
}
