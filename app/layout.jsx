import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { BrandProvider } from '@/context/BrandContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SampleRequestModal from '@/components/layout/SampleRequestModal';
import CartDrawer from '@/components/layout/CartDrawer';
import AccountModal from '@/components/layout/AccountModal';
import ProductDetailModal from '@/components/layout/ProductDetailModal';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'JUTON | Sustainable Jute Bags Wholesale • Crafted Naturally. Delivered Across India.',
  description:
    'Carry Nature. Choose Better. JUTON designs luxury sustainable jute bags, totes, wine carriers, and corporate conference folios for businesses across India.',
  openGraph: {
    title: 'JUTON | Sustainable Luxury Jute Bags Wholesale',
    description: 'Carry Nature. Choose Better. Crafted Naturally. Delivered Across India.',
    type: 'website',
    siteName: 'JUTON India',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JUTON | Sustainable Luxury Jute Bags Wholesale',
    description: 'Carry Nature. Choose Better. Crafted Naturally. Delivered Across India.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F7F5EF] text-[#252720] antialiased" suppressHydrationWarning>
        <BrandProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <SampleRequestModal />
          <CartDrawer />
          <AccountModal />
          <ProductDetailModal />
        </BrandProvider>
      </body>
    </html>
  );
}
