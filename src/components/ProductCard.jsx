import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ProductCard({ product }) {
  const { toggleFavorite, isFavorite, addToCart } = useStore();
  const favorited = isFavorite(product.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id, product.name);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      shape: product.shapes ? product.shapes[0] : 'Universal',
      size: 'M',
      quantity: 1
    });
  };

  return (
    <div className="group relative bg-glass-card rounded-3xl p-3 sm:p-4 border border-[#D8C6C3] shadow-sm hover:shadow-md hover:border-[#9C5550] transition-all duration-300 flex flex-col justify-between">
      
      {/* Product Image Container (Consistent 4:5 Portrait Aspect Ratio & Neutral Background) */}
      <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F4ECE6] mb-4">
        <Link to={`/product/${product.id}`} className="block w-full h-full" aria-label={`View ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width="320"
            height="400"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `
                <div class="w-full h-full flex flex-col items-center justify-center bg-[#F4ECE6] text-[#9C5550] p-4 text-center">
                  <span class="text-3xl mb-1">💅</span>
                  <span class="text-xs font-medium text-[#313851]">${product.name}</span>
                </div>
              `;
            }}
          />
        </Link>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          aria-pressed={favorited}
          className={`
            absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center
            backdrop-blur-md transition-all duration-200 active:scale-90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]
            ${favorited 
              ? 'bg-[#9C5550] text-[#FFFDFC] shadow-sm' 
              : 'bg-[#FFFDFC]/95 text-[#313851] hover:text-[#9C5550] hover:bg-[#FFFDFC] shadow-xs'
            }
          `}
        >
          <Heart className={`w-4 h-4 transition-transform ${favorited ? 'fill-[#FFFDFC] scale-110' : ''}`} />
        </button>

        {/* Category & Badge Tags (Sentence Case) */}
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

          {/* Product Name (Cormorant Garamond Serif Heading) */}
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
                <button
                  onClick={handleQuickAdd}
                  aria-label={`Quick add ${product.name} to cart`}
                  className="p-2.5 rounded-full bg-[#F4ECE6] text-[#9C5550] hover:bg-[#9C5550] hover:text-[#FFFDFC] transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
                  title="Quick Add to Bag"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#FFFDFC] border border-[#313851] text-[#313851] hover:bg-[#313851] hover:text-[#FFFDFC] transition-all shadow-2xs"
                >
                  Details
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
