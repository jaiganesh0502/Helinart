import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const DEFAULT_CATEGORIES = ['All', 'Press-ons', 'Gel kits', 'Decals', 'Care'];

export default function FilterBar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalResults
}) {
  const categoryChips = React.useMemo(() => {
    if (!categories || categories.length === 0) {
      return DEFAULT_CATEGORIES;
    }
    const names = categories.map(c => typeof c === 'string' ? c : (c.name || c.slug));
    const unique = ['All', ...names.filter(n => n && n.toLowerCase() !== 'all')];
    return Array.from(new Set(unique));
  }, [categories]);
  return (
    <div className="bg-glass-card rounded-3xl p-4 sm:p-6 border border-[#D8C6C3] shadow-sm space-y-5 mb-8">
      
      {/* Top Search & Sort Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search Input Bar (Section 21) */}
        <div className="relative flex-1">
          <label htmlFor="shop-search-input" className="sr-only">Search products</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786866] pointer-events-none" />
          <input
            id="shop-search-input"
            type="text"
            placeholder="Search luxury press-ons, velvet chrome kits, cuticle oils..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] text-sm text-[#2B2223] placeholder-[#786866] focus:outline-none focus:ring-2 focus:ring-[#9C5550] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#786866] hover:text-[#313851] rounded-full"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          <label htmlFor="shop-sort-select" className="text-xs font-medium text-[#786866] whitespace-nowrap flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#313851]" />
            <span>Sort by</span>
          </label>
          <select
            id="shop-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] text-sm font-medium text-[#313851] focus:outline-none focus:ring-2 focus:ring-[#9C5550] cursor-pointer"
          >
            <option value="featured">Featured Picks</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Drops</option>
          </select>
        </div>

      </div>

      {/* Category Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D8C6C3]/60">
        <div className="flex flex-wrap items-center gap-2">
          {categoryChips.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 active:scale-95
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]
                  ${isSelected
                    ? 'bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] shadow-sm shadow-[#9C5550]/20 scale-[1.02]'
                    : 'bg-[#FFFDFC] text-[#313851] hover:bg-[#F4ECE6] border border-[#D8C6C3]'
                  }
                `}
                aria-pressed={isSelected}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Total Results Label */}
        <span className="text-xs text-[#786866] font-medium">
          Showing <strong className="text-[#313851] font-bold">{totalResults}</strong> designs
        </span>
      </div>

    </div>
  );
}
