'use client';

import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';

export default function AccountAddressesPage() {
  const { isAuthenticated, user, savedAddresses } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-20">
        <Container size="sm">
          <div className="bg-white border border-[#E8DDCA] p-8 text-center">
            <p className="font-sans text-sm text-[#252720]/75">You must be signed in to manage saved delivery addresses.</p>
            <Link href="/login" className="inline-flex items-center gap-2 mt-4 text-xs uppercase tracking-wider text-[#3D4935] hover:text-[#252720]">
              <ArrowLeft className="w-4 h-4" />
              Go to Sign In
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-12 sm:py-16">
      <Container size="md">
        <div className="bg-white border border-[#E8DDCA] p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E8DDCA]">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">Delivery Addresses</span>
              <h1 className="font-serif text-3xl text-[#252720] mt-2">Saved Locations</h1>
            </div>
            <Link href="/account" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#3D4935] hover:text-[#252720]">
              <ArrowLeft className="w-4 h-4" />
              Back to Account
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {savedAddresses.length === 0 ? (
              <div className="border border-dashed border-[#E8DDCA] bg-[#F7F5EF] p-6 text-center text-sm text-[#252720]/70 font-sans">
                No delivery addresses have been stored for {user?.fullName || 'this buyer'} yet.
              </div>
            ) : (
              savedAddresses.map((address) => (
                <div key={address.id || `${address.city}-${address.pinCode}`} className="border border-[#E8DDCA] bg-[#F7F5EF] p-5">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#3D4935]" />
                    <div>
                      <p className="font-sans text-sm font-semibold text-[#252720]">{address.label || 'Trade Delivery Address'}</p>
                      <p className="text-xs text-[#252720]/70 font-sans">
                        {address.houseBuilding || address.street || 'Warehouse address'}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#252720]/75 font-sans">
                    {address.street || ''}{address.street && address.city ? ', ' : ''}{address.city || ''}{address.city && address.state ? ', ' : ''}{address.state || ''} {address.pinCode || ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
