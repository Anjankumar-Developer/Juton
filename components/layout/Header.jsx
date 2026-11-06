'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ShoppingBag, User, ArrowUpRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import { navigationLinks, brandDetails } from '@/data/navigation';
import { useBrand } from '@/context/BrandContext';
import { useAuth } from '@/context/AuthContext';

/**
 * Luxury Editorial Sticky Header & Responsive Navigation for JUTON
 * Prompt 2 compliant:
 * - Announcement: "Crafted Naturally. Delivered Across India."
 * - JUTON logo
 * - Home, Shop, Collections, Bulk Orders, About Us, Contact
 * - Account icon, Shopping cart icon
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const {
    setCartOpen,
    setAccountModalOpen,
    totalQuoteUnits,
    activeCurrency,
    setActiveCurrency,
  } = useBrand();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Announcement Bar */}
      <div className="bg-[#3D4935] text-[#F7F5EF] text-xs font-sans tracking-wider py-2 px-4 border-b border-[#252720]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A88B66] animate-pulse" />
            <span className="font-light tracking-wide">{brandDetails.announcement}</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] uppercase tracking-widest text-[#E8DDCA]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#E8DDCA]/70">Currency:</span>
              <div className="flex gap-1 font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveCurrency('INR')}
                  className={`px-1 rounded cursor-pointer transition-colors ${
                    activeCurrency === 'INR'
                      ? 'text-[#FFFFFF] underline decoration-[#A88B66] underline-offset-4'
                      : 'text-[#E8DDCA]/60 hover:text-white'
                  }`}
                >
                  INR (₹)
                </button>
                <span className="text-[#E8DDCA]/40">/</span>
                <button
                  type="button"
                  onClick={() => setActiveCurrency('USD')}
                  className={`px-1 rounded cursor-pointer transition-colors ${
                    activeCurrency === 'USD'
                      ? 'text-[#FFFFFF] underline decoration-[#A88B66] underline-offset-4'
                      : 'text-[#E8DDCA]/60 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>
            <span className="text-[#E8DDCA]/40">|</span>
            <span className="text-[#E8DDCA]/80">Pan-India Wholesale Support</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with subtle background transition */}
      <nav
        aria-label="Main Navigation"
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F5EF]/95 backdrop-blur-md shadow-md border-b border-[#E8DDCA]'
            : 'bg-[#F7F5EF] border-b border-[#E8DDCA]/80'
        }`}
      >
        <Container className="py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            {/* Brand Logo & Wordmark */}
            <div className="flex flex-col">
              <Link
                href="/"
                className="group inline-flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D4935]"
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#252720] transition-colors group-hover:text-[#3D4935]">
                  {brandDetails.name}
                </span>
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#68745A] font-sans -mt-1 font-medium">
                  Sustainable Luxury
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.16em] text-[#252720]/85 hover:text-[#3D4935] font-medium transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#A88B66] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Action Icons: Account Icon & Cart Icon */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Account Link */}
              <Link
                href={isAuthenticated ? '/account' : '/login'}
                className="p-2 sm:px-3 sm:py-2 text-[#252720] hover:text-[#3D4935] hover:bg-[#E8DDCA]/50 transition-colors border border-transparent hover:border-[#E8DDCA] flex items-center gap-1.5 cursor-pointer"
                aria-label={isAuthenticated ? `Trade Account (${user?.fullName})` : 'Trade Account Portal'}
              >
                <User className="w-5 h-5 text-[#3D4935]" />
                <span className="hidden xl:inline text-xs uppercase tracking-wider font-medium text-[#252720]">
                  {isAuthenticated ? (user?.fullName?.split(' ')[0] || 'Account') : 'Trade Portal'}
                </span>
              </Link>

              {/* Shopping Cart Icon */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 sm:px-3.5 sm:py-2 bg-[#3D4935] hover:bg-[#252720] text-[#F7F5EF] transition-colors flex items-center gap-2 cursor-pointer border border-[#252720]"
                aria-label="View Wholesale Cart and Quotation"
              >
                <ShoppingBag className="w-4 h-4 text-[#E8DDCA]" />
                <span className="hidden sm:inline text-xs uppercase tracking-wider font-medium">
                  Bulk Cart
                </span>
                {totalQuoteUnits > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#A88B66] text-white text-[10px] font-bold rounded-full">
                    {totalQuoteUnits}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#252720] hover:bg-[#E8DDCA]/60 transition-colors cursor-pointer border border-[#E8DDCA]"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-[#E8DDCA] bg-[#F7F5EF] overflow-hidden shadow-xl"
          >
            <Container className="py-6 space-y-4">
              <div className="flex flex-col space-y-2 pb-4 border-b border-[#E8DDCA]">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs uppercase tracking-widest text-[#252720] hover:text-[#3D4935] font-semibold py-2 transition-colors flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#A88B66]" />
                  </Link>
                ))}
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  href={isAuthenticated ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-xs uppercase tracking-widest font-semibold border border-[#3D4935] text-[#3D4935] bg-[#FFFFFF] flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-[#A88B66]" />
                  <span>{isAuthenticated ? `Trade Account (${user?.fullName?.split(' ')[0]})` : 'GST Trade Portal / Sign In'}</span>
                </Link>

                <div className="flex items-center justify-between text-xs text-[#68745A] pt-2 px-1">
                  <span>Pan-India Logistics</span>
                  <span className="font-serif italic font-bold text-[#3D4935]">
                    MOQ From 50 Pcs
                  </span>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
