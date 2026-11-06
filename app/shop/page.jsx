'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ArrowUpDown,
  Package,
  Layers,
  Info,
  RotateCcw,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import ProductCard from '@/components/ui/ProductCard';
import Button from '@/components/ui/Button';
import { products, CATEGORIES, DEMO_PRICING_DISCLAIMER } from '@/data/products';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category');

  // Match initial category if provided via query string
  const initialCategory = useMemo(() => {
    if (!initialCategoryParam) return 'All Categories';
    const found = CATEGORIES.find(
      (cat) => cat.toLowerCase() === initialCategoryParam.toLowerCase()
    );
    return found || 'All Categories';
  }, [initialCategoryParam]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [availability, setAvailability] = useState('all');
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Category
    if (selectedCategory !== 'All Categories') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // 2. Availability
    if (availability === 'in-stock') {
      list = list.filter((p) => p.inStock);
    } else if (availability === 'made-to-order') {
      list = list.filter((p) => !p.inStock);
    }

    // 3. Best sellers toggle
    if (onlyBestSellers) {
      list = list.filter((p) => p.isBestSeller);
    }

    // 4. New products toggle
    if (onlyNew) {
      list = list.filter((p) => p.isNew);
    }

    // 5. Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.fabricWeight.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.colors && p.colors.some((c) => c.name.toLowerCase().includes(q)))
      );
    }

    // 6. Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price-desc':
        list.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
        break;
      case 'bestsellers':
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'moq-asc':
        list.sort((a, b) => a.moq - b.moq);
        break;
      case 'featured':
      default:
        list.sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
        });
        break;
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy, availability, onlyBestSellers, onlyNew]);

  const hasActiveFilters =
    selectedCategory !== 'All Categories' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'featured' ||
    availability !== 'all' ||
    onlyBestSellers ||
    onlyNew;

  const handleResetFilters = () => {
    setSelectedCategory('All Categories');
    setSearchQuery('');
    setSortBy('featured');
    setAvailability('all');
    setOnlyBestSellers(false);
    setOnlyNew(false);
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen pb-24">
      {/* Editorial Catalog Hero Header */}
      <section className="border-b border-[#E8DDCA] bg-[#F7F5EF] pt-10 pb-12 sm:pt-14 sm:pb-16">
        <Container>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#68745A] font-sans uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-[#3D4935] hover:underline transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#3D4935] font-semibold">Product Catalog</span>
            {selectedCategory !== 'All Categories' && (
              <>
                <span>/</span>
                <span className="text-[#A88B66]">{selectedCategory}</span>
              </>
            )}
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8DDCA]/60 border border-[#A88B66]/40 text-[#3D4935] text-xs uppercase tracking-[0.2em] font-medium font-sans">
              <Package className="w-3.5 h-3.5 text-[#68745A]" />
              Wholesale Master Registry • Bengal Direct Mills
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#252720] leading-[1.1] font-medium">
              B2B Sustainable <span className="italic text-[#3D4935]">Jute Bag Catalog</span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#252720]/80 leading-relaxed font-light">
              Explore India’s benchmark biodegradable commercial carriers across 6 specialized wholesale categories. All silhouettes feature reinforced load ratings, direct mill pricing tiers, and custom branding options.
            </p>
          </div>

          {/* Wholesale Demo Pricing Advisory Banner */}
          <div className="mt-8 p-4 bg-[#E8DDCA]/40 border border-[#A88B66]/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#3D4935] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#252720]/80 font-sans leading-relaxed">
              <strong className="text-[#3D4935] font-semibold uppercase tracking-wider block mb-0.5">
                Demonstration Wholesale Rate Structure:
              </strong>
              {DEMO_PRICING_DISCLAIMER} Every product supports 3 distinct quantity-based tiers: <strong>50–99 units (Base wholesale)</strong>, <strong>100–499 units (Discounted volume)</strong>, and <strong>500+ units (Custom factory quotation)</strong>.
            </div>
          </div>
        </Container>
      </section>

      {/* Main Filter & Products Section */}
      <section className="pt-8 sm:pt-12">
        <Container>
          {/* Top Search & Filter Bar */}
          <div className="space-y-6">
            {/* Search Input and Quick Toggles */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68745A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by model, fabric weight, material, or color..."
                  className="w-full pl-10 pr-10 py-3 bg-[#FFFFFF] border border-[#E8DDCA] focus:border-[#3D4935] focus:ring-1 focus:ring-[#3D4935] text-xs font-sans text-[#252720] placeholder:text-[#252720]/40 outline-none transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#252720]/40 hover:text-[#252720] p-0.5"
                    aria-label="Clear search query"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Quick Status Toggles & Reset */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
                {/* Best Sellers toggle button */}
                <button
                  type="button"
                  onClick={() => setOnlyBestSellers(!onlyBestSellers)}
                  className={`px-3 py-2.5 border transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                    onlyBestSellers
                      ? 'bg-[#3D4935] text-[#FFFFFF] border-[#3D4935]'
                      : 'bg-[#FFFFFF] text-[#252720] border-[#E8DDCA] hover:border-[#A88B66]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Best Sellers Only</span>
                </button>

                {/* Newest Arrivals toggle button */}
                <button
                  type="button"
                  onClick={() => setOnlyNew(!onlyNew)}
                  className={`px-3 py-2.5 border transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                    onlyNew
                      ? 'bg-[#3D4935] text-[#FFFFFF] border-[#3D4935]'
                      : 'bg-[#FFFFFF] text-[#252720] border-[#E8DDCA] hover:border-[#A88B66]'
                  }`}
                >
                  <span>Newest</span>
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-2.5 text-xs text-[#3D4935] hover:text-[#252720] underline decoration-[#A88B66] underline-offset-4 flex items-center gap-1 cursor-pointer font-medium ml-auto md:ml-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs (6 required categories + All) */}
            <div className="border-y border-[#E8DDCA] py-3.5 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2 min-w-max">
                <span className="text-[11px] uppercase tracking-wider text-[#68745A] font-medium mr-2 font-sans flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#A88B66]" />
                  Category:
                </span>
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-1.5 text-xs font-sans transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[#3D4935] text-[#FFFFFF] border-[#3D4935] font-semibold shadow-xs'
                          : 'bg-[#FFFFFF] text-[#252720]/80 border-[#E8DDCA] hover:border-[#A88B66] hover:text-[#252720]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Toolbar: Sort Dropdown & Availability Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2">
              <div className="text-xs text-[#68745A] font-sans">
                Showing{' '}
                <span className="font-bold text-[#252720]">{filteredProducts.length}</span>{' '}
                of <span className="font-bold text-[#252720]">{products.length}</span> commercial models
                {selectedCategory !== 'All Categories' && (
                  <span> in <strong className="text-[#3D4935]">{selectedCategory}</strong></span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Availability Filter */}
                <div className="flex items-center gap-1.5 text-xs font-sans">
                  <span className="text-[#68745A] uppercase tracking-wider text-[10px]">Stock:</span>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="bg-[#FFFFFF] border border-[#E8DDCA] px-3 py-1.5 text-xs text-[#252720] focus:border-[#3D4935] outline-none cursor-pointer"
                  >
                    <option value="all">All Availability</option>
                    <option value="in-stock">Mill Ready / In Stock</option>
                    <option value="made-to-order">Made to Order / Custom Run</option>
                  </select>
                </div>

                {/* Price & Parameter Sorting */}
                <div className="flex items-center gap-1.5 text-xs font-sans">
                  <span className="text-[#68745A] uppercase tracking-wider text-[10px]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#FFFFFF] border border-[#E8DDCA] px-3 py-1.5 text-xs text-[#252720] focus:border-[#3D4935] outline-none cursor-pointer font-medium"
                  >
                    <option value="featured">Curated Mill Picks</option>
                    <option value="bestsellers">Best Sellers First</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="moq-asc">MOQ: Low to High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid (Responsive: 1 col mobile, 2 col tablet, 3 col desktop) */}
          <div className="mt-8">
            {filteredProducts.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-12 text-center space-y-4 max-w-lg mx-auto my-12">
                <div className="w-12 h-12 bg-[#E8DDCA]/40 rounded-full flex items-center justify-center mx-auto text-[#68745A]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#252720]">No Products Found</h3>
                <p className="text-xs text-[#252720]/70 font-sans max-w-sm mx-auto leading-relaxed">
                  We couldn’t find any silhouettes matching your current search query or filter selection. Try resetting filters or adjusting search keywords.
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleResetFilters}
                    icon={RotateCcw}
                    className="text-xs uppercase tracking-wider font-semibold"
                  >
                    Reset All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Bottom Wholesale Sourcing Consultation Callout */}
      <section className="mt-20 border-t border-[#E8DDCA] pt-16">
        <Container>
          <div className="bg-[#3D4935] text-[#F7F5EF] p-8 sm:p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#E8DDCA] font-medium font-sans block">
                Bespoke Manufacturing & Custom Weaves
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#FFFFFF] leading-tight">
                Need Custom Dimensions, Liners or Specific GSM Weights?
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#E8DDCA]/80 leading-relaxed font-light">
                Our vertically integrated Bengal mills manufacture custom bags tailored precisely to your brand guidelines. We offer certified food-grade water-resistant coatings, custom Pantone handle dyes, and embossed metallic foil plates.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/#bulk-orders"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#E8DDCA] text-[#252720] hover:bg-[#FFFFFF] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Request Custom Factory Quotation
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[#E8DDCA]/50 text-[#F7F5EF] hover:bg-[#FFFFFF]/10 text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center p-12">
          <div className="text-center space-y-3 font-sans">
            <div className="inline-block w-8 h-8 border-2 border-[#3D4935] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#68745A]">
              Loading Wholesale Catalog...
            </p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
