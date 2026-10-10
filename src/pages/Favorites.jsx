import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';

export default function Favorites() {
  const { favorites, clearFavorites } = useStore();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getProducts();
        if (mounted) setAllProducts(data);
      } catch (err) {
        console.error('Failed to load products for favorites', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Filter products by current favorited IDs
  const favoritedProducts = allProducts.filter(p => favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SEO
        title="Saved Favorites & Wishlist"
        description="View your saved Nailsbyhelina handcrafted press-on sets and studio favorites. Keep track of your dream nail wardrobe."
      />
      
      {/* Header with Title and Clear Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#D8C6C3]/60">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#793D39]">
            <Heart className="w-3.5 h-3.5 fill-[#9C5550] text-[#9C5550]" />
            <span>Wishlist & moodboard</span>
          </div>
          <h1 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851] flex items-center gap-3">
            <span>Saved Favorites</span>
            {favoritedProducts.length > 0 && (
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[#F4ECE6] text-[#793D39] border border-[#D8C6C3]">
                {favoritedProducts.length} {favoritedProducts.length === 1 ? 'set' : 'sets'}
              </span>
            )}
          </h1>
          <p className="text-sm text-[#786866]">
            Your curated collection of press-ons and nail art kits. Saved across your visits.
          </p>
        </div>

        {favoritedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearFavorites}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-[#786866] bg-[#F4ECE6] hover:text-[#8A4743] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-[#FFFDFC] bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] hover:opacity-95 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
            >
              <span>Explore more</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFFDFC]" />
            </Link>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-3xl bg-[#FFFDFC] p-4 border border-[#D8C6C3] animate-pulse space-y-4"
            >
              <div className="aspect-[4/5] rounded-2xl bg-[#F4ECE6]" />
              <div className="h-4 bg-[#F4ECE6] rounded w-3/4" />
              <div className="h-4 bg-[#F4ECE6] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : favoritedProducts.length === 0 ? (
        <EmptyState
          icon="✨"
          title="Your moodboard is currently empty"
          description="You haven't saved any nail art sets yet. Click the heart icon on any design in our shop to create your custom inspiration board."
          actionLabel="Explore Nail Art Sets"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoritedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
