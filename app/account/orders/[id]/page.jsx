'use client';

import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, ShieldCheck, UserCheck } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import OrderDetailView from '@/components/dashboard/OrderDetailView';
import { getOrderById } from '@/lib/dashboard';

function StandaloneOrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id ? decodeURIComponent(String(params.id)) : '';

  const {
    user,
    isAuthenticated,
    isAuthLoaded,
    demoOrders,
    loginWithDemo,
  } = useAuth();

  const order = useMemo(() => {
    return getOrderById(demoOrders, orderId);
  }, [demoOrders, orderId]);

  if (!isAuthLoaded) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-24 text-center font-sans">
        <div className="inline-block w-8 h-8 border-2 border-[#3D4935] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#68745A]">
          Loading Consignment Details...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-16 font-sans">
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
                Access Consignment Record
              </h1>
              <p className="text-xs sm:text-sm text-[#252720]/75 max-w-sm mx-auto leading-relaxed">
                Please sign in to view consignment specs, digital tax invoices, and live loom tracking for {orderId}.
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
                className="text-xs text-[#3D4935] hover:text-[#252720] font-semibold underline underline-offset-4 flex items-center gap-1.5 mx-auto cursor-pointer"
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

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10 sm:py-14 font-sans">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#68745A] uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-[#252720] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/account" className="hover:text-[#252720] transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#3D4935] font-semibold">{orderId}</span>
        </nav>

        {/* Demo Mode Notice */}
        <div className="mb-6 p-4 bg-[#E8DDCA]/40 border border-[#A88B66]/40 text-xs text-[#3D4935] flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-[#68745A] flex-shrink-0" />
          <div>
            <strong className="font-semibold">Demonstration Order Record: </strong>
            Live mill progress stages, GST tax calculations, and consignment tracking are simulated for client testing.
          </div>
        </div>

        {/* Detailed Order View */}
        <OrderDetailView
          order={order}
          onBack={() => router.push('/account?tab=orders')}
          standalone
        />
      </Container>
    </div>
  );
}

export default function StandaloneOrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F7F5EF] min-h-screen py-24 text-center font-sans">
          <div className="inline-block w-8 h-8 border-2 border-[#3D4935] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#68745A]">
            Loading Consignment...
          </p>
        </div>
      }
    >
      <StandaloneOrderDetailContent />
    </Suspense>
  );
}
