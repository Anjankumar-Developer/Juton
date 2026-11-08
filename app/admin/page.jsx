'use client';

import Link from 'next/link';
import { ShieldCheck, LogOut, LayoutDashboard, ArrowUpRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-12 sm:py-16">
      <Container size="md">
        <div className="bg-white border border-[#E8DDCA] p-8 sm:p-12 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E8DDCA]">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                Admin Access
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#252720] font-normal mt-2">Operations Dashboard</h1>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#E8DDCA] bg-[#F7F5EF] text-[#252720] text-xs uppercase tracking-wider hover:bg-[#E8DDCA] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="border border-[#E8DDCA] bg-[#F7F5EF] p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-[#3D4935]" />
                <span className="text-xs uppercase tracking-widest text-[#3D4935] font-semibold">Authorized Admin</span>
              </div>
              <p className="font-serif text-2xl text-[#252720]">{user?.fullName || 'Administrator'}</p>
              <p className="mt-2 text-sm text-[#252720]/75 font-sans">{user?.email || 'admin@juton.local'}</p>
            </div>

            <div className="border border-[#E8DDCA] bg-[#F7F5EF] p-6">
              <div className="flex items-center gap-3 mb-4">
                <LayoutDashboard className="w-6 h-6 text-[#3D4935]" />
                <span className="text-xs uppercase tracking-widest text-[#3D4935] font-semibold">Operational Status</span>
              </div>
              <p className="font-sans text-sm text-[#252720]/75 leading-relaxed">
                The admin workspace is reserved for authorized wholesale operations, pricing review, and vendor management.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/account" className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D4935] text-[#F7F5EF] text-xs uppercase tracking-wider hover:bg-[#252720] transition-colors">
              Customer Account
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
