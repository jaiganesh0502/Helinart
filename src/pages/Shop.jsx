import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ui/ProductGrid';
import Reveal from '../components/ui/Reveal';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import { categoryService } from '../services/categoryService';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state synced with URL search params
  const categoryParam = searchParams.get('category') || 'All';
  const queryParam = searchParams.get('q') || searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || searchParams.get('filter') || 'featured';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState(sortParam);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    if (searchParams.has('q') || searchParams.has('search')) {
      setSearchQuery(searchParams.get('q') || searchParams.get('search') || '');
    }
    if (searchParams.has('sort') || searchParams.has('filter')) {
      setSortBy(searchParams.get('sort') || searchParams.get('filter') || 'featured');
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [prodData, catsData] = await Promise.all([
          getProducts(),
          categoryService.getCategories({ activeOnly: true })
        ]);
        if (mounted) {
          setAllProducts(prodData);
          if (catsData && catsData.length > 0) setCategories(catsData);
        }
      } catch (err) {
        console.error('Failed to load products or categories', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Filter & Sort Logic
  const products = useMemo(() => {
    let list = [...allProducts];

    // Category filter
    if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
      const target = selectedCategory.toLowerCase().trim();
      list = list.filter((p) => {
        const prodCat = (p.category || '').toLowerCase().trim();
        const prodSlug = prodCat.replace(/[^a-z0-9]+/g, '-');
        const targetSlug = target.replace(/[^a-z0-9]+/g, '-');
        return (
          prodCat === target ||
          prodSlug === targetSlug ||
          prodCat.includes(target) ||
          target.includes(prodCat)
        );
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.shapes && p.shapes.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === 'bestseller' || sortBy === 'bestsellers') {
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.rating - a.rating);
    }

    return list;
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SEO
        title={selectedCategory && selectedCategory !== 'All' ? `Shop ${selectedCategory}` : 'Shop Handcrafted Press-On Nails & Studio Kits'}
        description={`Explore our luxury collection of handcrafted press-on nails, studio-grade gel kits, and Swarovski accents. Over ${products.length} bespoke designs.`}
        keywords={`shop press on nails, ${selectedCategory !== 'All' ? selectedCategory.toLowerCase() + ', ' : ''}gel nail kits, nailsbyhelina shop, bespoke nail sets`}
      />
      
      {/* Header Banner with Smooth Scroll Reveal */}
      <Reveal y={14} className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#793D39]">
          <span>The nail wardrobe</span>
        </div>
        <h1 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl text-[#313851]">
          Shop Nail Art & Press-Ons
        </h1>
        <p className="text-sm sm:text-base text-[#786866] max-w-2xl">
          Explore studio-sculpted reusable sets, DIY professional gel polish kits, high-sparkle Swarovski decals, and strengthening cuticle elixirs.
        </p>
      </Reveal>

      {/* Filter and Search Bar Component */}
      <Reveal y={16} delay={0.04}>
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={products.length}
        />
      </Reveal>

      {/* Product Grid Area with Viewport-based Stagger Reveal */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="rounded-3xl bg-[#FFFDFC] p-4 border border-[#D8C6C3] animate-pulse space-y-4"
            >
              <div className="aspect-[4/5] rounded-2xl bg-[#F4ECE6]" />
              <div className="h-4 bg-[#F4ECE6] rounded w-3/4" />
              <div className="h-4 bg-[#F4ECE6] rounded w-1/2" />
              <div className="h-8 bg-[#F4ECE6] rounded-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon="💅"
          title="No nail designs matched"
          description={`We couldn't find any items matching "${searchQuery || selectedCategory}". Try exploring another category or resetting your search filter.`}
          actionLabel="Reset All Filters"
          onActionClick={handleResetFilters}
        />
      ) : (
        <ProductGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      )}

    </div>
  );
}
