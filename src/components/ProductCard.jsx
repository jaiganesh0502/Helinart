import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useStore } from '../store/useStore';
import { productItemVariants } from './ui/ProductGrid';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

export default function ProductCard({ product }) {
  const { toggleFavorite, isFavorite, addToCart } = useStore();
  const favorited = isFavorite(product.id);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const willBeFavorited = !favorited;
    toggleFavorite(product.id, product.name);

    if (willBeFavorited && !shouldReduceMotion) {
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 900);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      shape: product.shapes ? product.shapes[0] : 'Universal',
      size: 'M',
      quantity: 1
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <motion.div
      variants={productItemVariants}
      whileHover={shouldReduceMotion ? {} : {
        y: -4,
        borderColor: 'rgba(201, 143, 138, 0.35)',
        boxShadow: '0 14px 32px rgba(49, 56, 81, 0.10)'
      }}
      transition={{ duration: 0.25, ease: LUXURY_EASE }}
      className="group relative bg-glass-card rounded-3xl p-3 sm:p-4 border border-[#D8C6C3] shadow-sm flex flex-col justify-between"
    >
      {/* Product Image Container (Consistent 4:5 Portrait Aspect Ratio & Neutral Background) */}
      <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F4ECE6] mb-4 select-none">
        <Link to={`/product/${product.id}`} className="block w-full h-full" aria-label={`View ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width="320"
            height="400"
            className="w-full h-full object-cover object-center group-hover:scale-[1.025] transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.parentNode) {
                e.target.parentNode.innerHTML = `
                  <div class="w-full h-full flex flex-col items-center justify-center bg-[#F4ECE6] text-[#9C5550] p-4 text-center">
                    <span class="text-3xl mb-1">💅</span>
                    <span class="text-xs font-medium text-[#313851]">${product.name}</span>
                  </div>
                `;
              }
            }}
          />
        </Link>

        {/* Instagram-style Big Heart Burst Animation when Favorited */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.25, 1], opacity: [0, 0.95, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: LUXURY_EASE }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
              aria-hidden="true"
            >
              <div className="p-4 rounded-full bg-white/40 backdrop-blur-md shadow-lg border border-white/60">
                <Heart className="w-10 h-10 text-[#C98F8A] fill-[#C98F8A] drop-shadow-md" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favorite Heart Button */}
        <motion.button
          onClick={handleFavoriteClick}
          aria-label={favorited ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          aria-pressed={favorited}
          whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
          animate={favorited && !shouldReduceMotion ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.22, ease: LUXURY_EASE }}
          className={`
            absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center
            backdrop-blur-md transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]
            ${favorited 
              ? 'bg-[#9C5550] text-[#FFFDFC] shadow-sm' 
              : 'bg-[#FFFDFC]/95 text-[#313851] hover:text-[#9C5550] hover:bg-[#FFFDFC] shadow-xs'
            }
          `}
        >
          <Heart className={`w-4 h-4 transition-transform ${favorited ? 'fill-[#FFFDFC]' : ''}`} />
        </motion.button>

        {/* Category & Badge Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.inStock === false && (
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-[#313851] text-[#FFFDFC] shadow-xs">
              Sold out
            </span>
          )}
          {product.isBestSeller && product.inStock !== false && (
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-[#9C5550] text-[#FFFDFC] shadow-xs">
              Bestseller
            </span>
          )}
          {product.isNew && product.inStock !== false && (
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-[#262D42] text-[#FFFDFC] shadow-xs">
              New drop
            </span>
          )}
        </div>
      </div>

      {/* Details Area */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#786866] mb-1.5">
            <span className="font-medium text-[11px] px-2 py-0.5 rounded-md bg-[#F4ECE6] text-[#786866] border border-[#D8C6C3]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-semibold text-[#A87F45]">
              <Star className="w-3.5 h-3.5 text-[#A87F45] fill-[#A87F45]" aria-hidden="true" />
              <span>{product.rating}</span>
              <span className="text-[#786866] font-normal">({product.reviewsCount || 42})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-heading font-semibold text-xl text-[#313851] group-hover:text-[#9C5550] transition-colors line-clamp-1 leading-snug">
            <Link to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>

          {/* Shapes tag preview */}
          {product.shapes && product.shapes.length > 0 && (
            <p className="text-xs text-[#786866] line-clamp-1 mt-0.5">
              Shapes: {product.shapes.join(' • ')}
            </p>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-[#D8C6C3]/60 flex items-center justify-between gap-2 mt-2">
          <div>
            <span className="text-[11px] text-[#786866] block -mb-0.5 font-medium">Price</span>
            <span className="font-heading font-semibold text-xl text-[#262D42]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {product.inStock === false ? (
              <Link
                to={`/product/${product.id}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F4ECE6] text-[#793D39] border border-[#D8C6C3] hover:bg-[#9C5550] hover:text-[#FFFDFC] transition-all"
              >
                Notify me
              </Link>
            ) : (
              <>
                <motion.button
                  onClick={handleQuickAdd}
                  aria-label={justAdded ? `Added ${product.name} to cart` : `Quick add ${product.name} to cart`}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  className={`
                    p-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]
                    ${justAdded 
                      ? 'bg-emerald-600 text-[#FFFDFC] shadow-xs' 
                      : 'bg-[#F4ECE6] text-[#9C5550] hover:bg-[#9C5550] hover:text-[#FFFDFC]'
                    }
                  `}
                  title={justAdded ? "Added to Bag ✓" : "Quick Add to Bag"}
                >
                  {justAdded ? (
                    <Check className="w-4 h-4 animate-in zoom-in-50 duration-150" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                </motion.button>
                <Link
                  to={`/product/${product.id}`}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#FFFDFC] border border-[#313851] text-[#313851] hover:bg-[#313851] hover:text-[#FFFDFC] transition-all shadow-2xs hover:-translate-y-0.5"
                >
                  Details
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

    </motion.div>
  );
}
