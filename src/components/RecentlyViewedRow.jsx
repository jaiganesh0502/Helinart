import React from 'react';
import { useStore } from '../store/useStore';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import ProductGrid from './ui/ProductGrid';
import Reveal from './ui/Reveal';
import { Eye } from 'lucide-react';

export default function RecentlyViewedRow({ excludeId = null, title = 'Recently Viewed' }) {
  const { recentlyViewed } = useStore();

  // Find products matching the recently viewed IDs
  const matching = (recentlyViewed || [])
    .filter(id => id !== excludeId)
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  if (matching.length === 0) {
    return null;
  }

  return (
    <div className="pt-10 border-t border-[#D8C6C3]/60 space-y-6">
      <Reveal y={14} className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-[#9C5550]" />
        <h3 className="font-heading font-medium text-2xl text-[#313851]">
          {title}
        </h3>
      </Reveal>

      <ProductGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {matching.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </div>
  );
}
