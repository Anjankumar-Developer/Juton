'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Leaf,
  Truck,
  RotateCcw,
  Info,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProductCard from '@/components/ui/ProductCard';
import {
  getProductById,
  getRelatedProducts,
  DEMO_PRICING_DISCLAIMER,
  products
} from '@/data/products';
import { formatCurrency, formatMOQ } from '@/lib/utils';
import { useBrand } from '@/context/BrandContext';
import { calculateWholesalePrice } from '@/lib/pricing';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;

  const product = useMemo(() => {
    return getProductById(productId);
  }, [productId]);

  const relatedProducts = useMemo(() => {
    return getRelatedProducts(productId, 3);
  }, [productId]);

  const {
    activeCurrency,
    addToQuote,
    openSampleRequest,
    setCartOpen
  } = useBrand();

  // Active Gallery Image state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Selected Color state
  const [selectedColor, setSelectedColor] = useState(
    product?.colors && product.colors.length > 0 ? product.colors[0].name : 'Natural Golden Jute'
  );

  // Quantity selection state (defaults to product.moq)
  const [quantity, setQuantity] = useState(product?.moq || 100);
  const [isAdded, setIsAdded] = useState(false);

  // Fallback if product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-8">
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-10 max-w-md text-center space-y-4">
          <div className="w-12 h-12 bg-[#E8DDCA]/60 rounded-full flex items-center justify-center mx-auto text-[#68745A]">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl text-[#252720]">Product Not Found</h2>
          <p className="text-xs text-[#252720]/70 font-sans leading-relaxed">
            The requested jute bag silhouette could not be located in our master catalog registry.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#3D4935] text-[#FFFFFF] text-xs uppercase tracking-widest font-semibold hover:bg-[#252720] transition-colors"
            >
              Browse Full Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate pricing based on current quantity and currency
  const pricingCalculation = calculateWholesalePrice(product, quantity, activeCurrency);
  const currentUnitPrice = pricingCalculation.unitPrice;
  const currentTotalPrice = pricingCalculation.totalPrice;
  const isMOQMet = quantity >= (product.moq || 50);

  // Handle quantity changes
  const handleQuantityChange = (newQty) => {
    const val = parseInt(newQty, 10);
    if (isNaN(val)) {
      setQuantity(product.moq || 50);
      return;
    }
    setQuantity(Math.max(1, val));
  };

  const incrementQuantity = (step = 25) => {
    setQuantity((prev) => prev + step);
  };

  const decrementQuantity = (step = 25) => {
    setQuantity((prev) => Math.max(product.moq || 50, prev - step));
  };

  const handleAddToCart = () => {
    addToQuote(product, quantity, selectedColor);
    setIsAdded(true);
    setCartOpen(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBulkInquiry = () => {
    openSampleRequest({
      ...product,
      requestedQuantity: quantity,
      chosenColor: selectedColor
    });
  };

  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const activeImage = galleryImages[activeImageIndex] || product.image;

  return (
    <div className="bg-[#F7F5EF] min-h-screen pb-24">
      {/* Editorial Breadcrumbs & Header Bar */}
      <div className="border-b border-[#E8DDCA] bg-[#F7F5EF] py-4">
        <Container>
          <nav className="flex items-center gap-2 text-xs text-[#68745A] font-sans uppercase tracking-widest overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#3D4935] hover:underline transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#3D4935] hover:underline transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/shop?category=${encodeURIComponent(product.category)}`}
              className="hover:text-[#3D4935] hover:underline transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#3D4935] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </Container>
      </div>

      {/* Main Product Showcase Section */}
      <section className="pt-8 sm:pt-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Interactive Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image Stage */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full bg-[#FFFFFF] border-2 border-[#A88B66] overflow-hidden p-2 shadow-[0_12px_40px_rgba(37,39,32,0.06)]">
                <div className="relative w-full h-full overflow-hidden bg-[#E8DDCA]/30">
                  <Image
                    src={activeImage}
                    alt={`${product.name} - View ${activeImageIndex + 1}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 pointer-events-none">
                    <Badge variant="moq" size="md" icon={Package}>
                      {formatMOQ(product.moq)}
                    </Badge>
                    {product.badge && (
                      <Badge variant="jute" size="md" icon={Sparkles}>
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Stock Availability status tag */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-[#F7F5EF]/95 border border-[#A88B66] text-[11px] uppercase tracking-wider font-semibold text-[#3D4935] font-sans">
                      {product.inStock ? 'In Stock • Ready to Dispatch' : 'Made to Order Custom Run'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gallery Thumbnails Selector */}
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={img + idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square border-2 overflow-hidden bg-[#FFFFFF] transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#3D4935] shadow-sm scale-102'
                          : 'border-[#E8DDCA] opacity-75 hover:opacity-100 hover:border-[#A88B66]'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Mill Quality Assurance Callout */}
              <div className="p-4 bg-[#E8DDCA]/40 border border-[#E8DDCA] flex items-center justify-between text-xs text-[#3D4935] font-sans">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#68745A]" />
                  <span>Cross-Box Reinforced Stitching (20kg+ Load Tested)</span>
                </div>
                <span className="font-semibold text-[#A88B66]">Bengal Golden Mills</span>
              </div>
            </div>

            {/* Right Column: Product Specs, Pricing Tiers & Order Configuration */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category & Weight Spec */}
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#68745A] font-sans font-medium">
                <span className="px-2.5 py-1 bg-[#E8DDCA]/60 border border-[#A88B66]/30 text-[#3D4935]">
                  {product.category}
                </span>
                <span>•</span>
                <span>{product.fabricWeight}</span>
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#252720] leading-tight font-medium">
                {product.name}
              </h1>

              {/* Starting Price & Minimum Order Line */}
              <div className="p-4 bg-[#FFFFFF] border border-[#E8DDCA] flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#68745A] font-sans block">
                    Starting Wholesale Unit Price
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-serif font-bold text-[#252720]">
                      {formatCurrency(currentUnitPrice, activeCurrency)}
                    </span>
                    <span className="text-xs text-[#252720]/60 font-sans">/ pc</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#68745A] font-sans block">
                    Minimum Order Quantity
                  </span>
                  <span className="text-sm font-bold text-[#3D4935] font-sans mt-0.5 block">
                    {product.moq} pieces
                  </span>
                </div>
              </div>

              {/* Editorial Description */}
              <div className="space-y-2">
                <h2 className="text-xs uppercase tracking-widest text-[#68745A] font-semibold font-sans">
                  Description & Commercial Purpose
                </h2>
                <p className="font-sans text-sm text-[#252720]/80 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Core Material & Dimensions Quick Strip */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#E8DDCA] text-xs font-sans">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#68745A] block">
                    Material
                  </span>
                  <span className="font-semibold text-[#252720] mt-0.5 block">
                    {product.material}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#68745A] block">
                    Dimensions
                  </span>
                  <span className="font-semibold text-[#252720] mt-0.5 block">
                    {product.dimensions}
                  </span>
                </div>
              </div>

              {/* Available Colors Selector (Prompt 3 requirement) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-[#68745A] uppercase tracking-wider font-semibold">
                    Available Colors:
                  </span>
                  <span className="text-[#3D4935] font-bold">
                    Selected: {selectedColor}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.colors && product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-2 px-3 py-2 border transition-all cursor-pointer font-sans text-xs ${
                          isSelected
                            ? 'bg-[#FFFFFF] border-[#3D4935] ring-2 ring-[#3D4935]/20 font-semibold shadow-xs'
                            : 'bg-[#FFFFFF]/70 border-[#E8DDCA] hover:border-[#A88B66] text-[#252720]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border shadow-2xs"
                          style={{
                            backgroundColor: color.hex,
                            borderColor: color.border || '#A88B66'
                          }}
                        />
                        <span>{color.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#3D4935]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wholesale Quantity-Based Price Tiers Table (Prompt 3 requirement) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs uppercase tracking-widest text-[#68745A] font-semibold font-sans flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#A88B66]" />
                    Wholesale Price Tiers (Quantity-Based)
                  </h2>
                  <span className="text-[10px] uppercase tracking-wider text-[#A88B66] font-medium font-sans">
                    Tiered Volume Matrix
                  </span>
                </div>

                <div className="border border-[#E8DDCA] bg-[#FFFFFF] overflow-hidden">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#E8DDCA]/50 text-[#3D4935] uppercase text-[10px] tracking-wider border-b border-[#E8DDCA]">
                      <tr>
                        <th className="py-2.5 px-3.5 font-semibold">Tier Volume Bracket</th>
                        <th className="py-2.5 px-3.5 font-semibold">Unit Price ({activeCurrency})</th>
                        <th className="py-2.5 px-3.5 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DDCA]/60">
                      {/* Tier 1: 50-99 units */}
                      <tr
                        className={`transition-colors ${
                          quantity >= 50 && quantity <= 99
                            ? 'bg-[#E8DDCA]/40 font-semibold'
                            : 'hover:bg-[#F7F5EF]/60'
                        }`}
                      >
                        <td className="py-2.5 px-3.5">
                          <span className="text-[#252720]">50–99 units</span>
                          <span className="text-[10px] text-[#68745A] block">Base wholesale tier</span>
                        </td>
                        <td className="py-2.5 px-3.5 font-serif font-bold text-[#252720]">
                          {formatCurrency(
                            activeCurrency === 'USD' ? 4.0 : (product.pricingTiersINR?.[0]?.price || 165),
                            activeCurrency
                          )} / pc
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          {quantity >= 50 && quantity <= 99 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#3D4935]">
                              <CheckCircle2 className="w-3 h-3 text-[#68745A]" /> Active Tier
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#68745A]/70">Standard Rate</span>
                          )}
                        </td>
                      </tr>

                      {/* Tier 2: 100-499 units */}
                      <tr
                        className={`transition-colors ${
                          quantity >= 100 && quantity <= 499
                            ? 'bg-[#E8DDCA]/40 font-semibold'
                            : 'hover:bg-[#F7F5EF]/60'
                        }`}
                      >
                        <td className="py-2.5 px-3.5">
                          <span className="text-[#252720]">100–499 units</span>
                          <span className="text-[10px] text-[#68745A] block">Discounted volume tier</span>
                        </td>
                        <td className="py-2.5 px-3.5 font-serif font-bold text-[#3D4935]">
                          {formatCurrency(
                            activeCurrency === 'USD' ? 3.5 : (product.pricingTiersINR?.[1]?.price || 145),
                            activeCurrency
                          )} / pc
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          {quantity >= 100 && quantity <= 499 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#3D4935]">
                              <CheckCircle2 className="w-3 h-3 text-[#68745A]" /> Active Tier
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#68745A]">Save ~12%</span>
                          )}
                        </td>
                      </tr>

                      {/* Tier 3: 500+ units */}
                      <tr
                        className={`transition-colors ${
                          quantity >= 500
                            ? 'bg-[#E8DDCA]/40 font-semibold'
                            : 'hover:bg-[#F7F5EF]/60'
                        }`}
                      >
                        <td className="py-2.5 px-3.5">
                          <span className="text-[#252720]">500+ units</span>
                          <span className="text-[10px] text-[#68745A] block">Custom quotation / Deep volume</span>
                        </td>
                        <td className="py-2.5 px-3.5 font-serif font-bold text-[#3D4935]">
                          {formatCurrency(
                            activeCurrency === 'USD' ? 2.95 : (product.pricingTiersINR?.[2]?.price || 125),
                            activeCurrency
                          )} / pc
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          {quantity >= 500 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#3D4935]">
                              <CheckCircle2 className="w-3 h-3 text-[#68745A]" /> Active Tier
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#68745A]">Deep Bulk Factory Direct</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Explicit Demonstration Label Notice (Required by prompt) */}
                <div className="p-2.5 bg-[#E8DDCA]/30 border border-[#A88B66]/40 flex items-start gap-2 text-[11px] text-[#68745A] font-sans">
                  <Info className="w-3.5 h-3.5 text-[#3D4935] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Demo Data Notice:</strong> Sample prices shown as demonstration data until actual pricing and official GST trade invoices are configured.
                  </span>
                </div>
              </div>

              {/* Quantity Selector & Proforma Calculator */}
              <div className="p-4 bg-[#FFFFFF] border border-[#E8DDCA] space-y-3">
                <div className="flex items-center justify-between text-xs font-sans">
                  <label htmlFor="order-quantity" className="text-[#68745A] uppercase tracking-wider font-semibold">
                    Select Order Quantity (Units):
                  </label>
                  <span className="text-[11px] text-[#68745A]">
                    MOQ Requirement: <strong className="text-[#3D4935]">{product.moq} pcs</strong>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#A88B66] bg-[#F7F5EF] w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => decrementQuantity(25)}
                      className="p-3 text-[#252720] hover:bg-[#E8DDCA] transition-colors cursor-pointer"
                      aria-label="Decrease quantity by 25"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      id="order-quantity"
                      type="number"
                      min="1"
                      step="25"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-24 text-center py-2.5 bg-transparent font-serif text-lg font-bold text-[#252720] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => incrementQuantity(25)}
                      className="p-3 text-[#252720] hover:bg-[#E8DDCA] transition-colors cursor-pointer"
                      aria-label="Increase quantity by 25"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick increment chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.moq || 100)}
                      className="px-2.5 py-2 border border-[#E8DDCA] hover:border-[#3D4935] bg-[#FFFFFF] text-[11px] font-medium"
                    >
                      MOQ ({product.moq})
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuantity(250)}
                      className="px-2.5 py-2 border border-[#E8DDCA] hover:border-[#3D4935] bg-[#FFFFFF] text-[11px] font-medium"
                    >
                      250 pcs
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuantity(500)}
                      className="px-2.5 py-2 border border-[#E8DDCA] hover:border-[#3D4935] bg-[#FFFFFF] text-[11px] font-medium"
                    >
                      500 pcs
                    </button>
                  </div>
                </div>

                {/* Validation warning if below MOQ */}
                {!isMOQMet && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 p-2 border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Order quantity is below the mill minimum of {product.moq} pcs for this model.</span>
                  </div>
                )}

                {/* Proforma Total calculation */}
                <div className="pt-2 border-t border-[#E8DDCA]/60 flex items-center justify-between text-xs font-sans">
                  <span className="text-[#68745A]">Estimated Batch Subtotal:</span>
                  <div className="text-right">
                    <span className="font-serif text-xl font-bold text-[#3D4935]">
                      {formatCurrency(currentTotalPrice, activeCurrency)}
                    </span>
                    <span className="text-[10px] text-[#68745A] block">
                      ({quantity} pcs @ {formatCurrency(currentUnitPrice, activeCurrency)}/pc)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart + Bulk Inquiry (Prompt 3 requirements) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant={isAdded ? 'secondary' : 'primary'}
                  size="lg"
                  icon={isAdded ? Check : Plus}
                  onClick={handleAddToCart}
                  className="w-full text-xs uppercase tracking-widest font-semibold justify-center py-4"
                >
                  {isAdded ? 'Added to Quote' : 'Add to Wholesale Cart'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  icon={FileText}
                  as={Link}
                  href={`/bulk-orders?product=${product.id}#inquiry-form`}
                  className="w-full text-xs uppercase tracking-widest font-semibold justify-center py-4 border-[#3D4935] text-[#3D4935]"
                >
                  Request Bulk Quotation
                </Button>
              </div>

              {/* Dispatch & Compliance reassurance */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#68745A] font-sans pt-1">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#3D4935]" />
                  <span>Dispatch: {product.leadTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#68745A]" />
                  <span>100% Biodegradable & Compostable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Specifications Section */}
          <div className="mt-16 sm:mt-24 border-t border-[#E8DDCA] pt-12 sm:pt-16">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#68745A] font-sans font-semibold">
                  Engineering & Mill Specifications
                </span>
                <h2 className="font-serif text-3xl text-[#252720]">
                  Technical Craftsmanship Details
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#252720]/70 max-w-xl mx-auto font-light">
                  Direct mill specs to ensure compatibility with your corporate storage, retail display racks, and logistic requirements.
                </p>
              </div>

              <div className="border border-[#E8DDCA] bg-[#FFFFFF] divide-y divide-[#E8DDCA]/70 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-semibold text-[#3D4935] uppercase tracking-wider text-[11px]">
                    Base Material & Provenance
                  </span>
                  <span className="sm:col-span-2 text-[#252720] mt-1 sm:mt-0">
                    {product.material}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-semibold text-[#3D4935] uppercase tracking-wider text-[11px]">
                    Fabric Density & GSM
                  </span>
                  <span className="sm:col-span-2 text-[#252720] mt-1 sm:mt-0">
                    {product.fabricWeight}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-semibold text-[#3D4935] uppercase tracking-wider text-[11px]">
                    Dimensions & Capacity
                  </span>
                  <span className="sm:col-span-2 text-[#252720] mt-1 sm:mt-0">
                    {product.dimensions}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-semibold text-[#3D4935] uppercase tracking-wider text-[11px]">
                    Handle Specifications
                  </span>
                  <span className="sm:col-span-2 text-[#252720] mt-1 sm:mt-0">
                    {product.handleType}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-semibold text-[#3D4935] uppercase tracking-wider text-[11px]">
                    Closure Mechanism
                  </span>
                  <span className="sm:col-span-2 text-[#252720] mt-1 sm:mt-0">
                    {product.closure}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-semibold text-[#3D4935] uppercase tracking-wider text-[11px]">
                    Internal Lining & Coating
                  </span>
                  <span className="sm:col-span-2 text-[#252720] mt-1 sm:mt-0">
                    {product.lining}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-semibold text-[#3D4935] uppercase tracking-wider text-[11px]">
                    Available Color Options
                  </span>
                  <span className="sm:col-span-2 text-[#252720] mt-1 sm:mt-0">
                    {product.colors?.map(c => c.name).join(', ') || 'Natural Jute'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-semibold text-[#3D4935] uppercase tracking-wider text-[11px]">
                    Certifications & Audits
                  </span>
                  <div className="sm:col-span-2 flex flex-wrap gap-2 mt-1 sm:mt-0">
                    {product.certifications?.map((cert) => (
                      <span
                        key={cert}
                        className="px-2.5 py-0.5 bg-[#E8DDCA]/50 border border-[#A88B66]/30 text-[11px] text-[#3D4935] font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                  <span className="font-semibold text-[#3D4935] uppercase tracking-wider text-[11px]">
                    Pan-India Mill Turnaround
                  </span>
                  <span className="sm:col-span-2 text-[#252720] mt-1 sm:mt-0">
                    {product.leadTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section (Prompt 3 requirement) */}
          <div className="mt-20 sm:mt-28 border-t border-[#E8DDCA] pt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#68745A] font-semibold font-sans">
                  Curated Catalog Pairing
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#252720] mt-1">
                  Related Silhouettes
                </h2>
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#3D4935] hover:text-[#252720] font-semibold underline decoration-[#A88B66] underline-offset-4"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
