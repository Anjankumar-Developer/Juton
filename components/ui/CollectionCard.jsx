'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBrand } from '@/context/BrandContext';
import { formatCurrency } from '@/lib/utils';

/**
 * Editorial Collection Card for JUTON
 */
export default function CollectionCard({ collection, index }) {
  const router = useRouter();
  const { setSelectedCategory, activeCurrency } = useBrand();

  const handleSelectCollection = () => {
    setSelectedCategory(collection.category || collection.name);
    router.push(`/shop?category=${encodeURIComponent(collection.category || collection.name)}`);
  };

  const startingPrice =
    activeCurrency === 'USD'
      ? Math.round(collection.startingPrice / 40 * 100) / 100
      : collection.startingPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={handleSelectCollection}
      className="group relative overflow-hidden bg-[#FFFFFF] border border-[#E8DDCA] transition-all duration-300 hover:border-[#A88B66] hover:shadow-[0_12px_36px_rgba(37,39,32,0.08)] cursor-pointer flex flex-col"
    >
      {/* Visual Canvas */}
      <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#E8DDCA]/30">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[11px] font-sans font-medium uppercase tracking-wider bg-[#F7F5EF]/90 text-[#3D4935] px-2.5 py-1 border border-[#E8DDCA]">
            From {collection.moq}
          </span>
        </div>

        {/* Floating Arrow Accent */}
        <div className="absolute bottom-3 right-3 w-9 h-9 bg-[#F7F5EF] text-[#252720] border border-[#E8DDCA] flex items-center justify-center transition-transform duration-300 group-hover:bg-[#3D4935] group-hover:text-[#F7F5EF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5 sm:p-6 bg-[#FFFFFF] flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="text-[11px] uppercase tracking-widest text-[#68745A] font-semibold font-sans">
            {collection.itemCount}
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#252720] group-hover:text-[#3D4935] transition-colors leading-snug">
            {collection.name}
          </h3>
          <p className="text-xs text-[#252720]/75 font-sans leading-relaxed line-clamp-2">
            {collection.description}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E8DDCA]/60 flex items-center justify-between text-xs font-sans">
          <span className="text-[#68745A]">Starting from</span>
          <span className="font-serif text-lg font-bold text-[#3D4935]">
            {formatCurrency(startingPrice, activeCurrency)} <span className="text-xs font-normal text-[#252720]/60">/ pc</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
