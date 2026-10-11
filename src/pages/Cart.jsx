import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Truck, 
  Sparkles, Check, ArrowLeft, Ruler, AlertCircle, RotateCcw
} from 'lucide-react';
import { useStore } from '../store/useStore';
import RecentlyViewedRow from '../components/RecentlyViewedRow';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ui/ProductGrid';
import { products } from '../data/products';
import SEO from '../components/SEO';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, getCartSummary, applyCoupon, removeCoupon, recentlyViewed } = useStore();
  const [couponInput, setCouponInput] = useState('');
  
  const summary = getCartSummary();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  // =========================================================================
  // 1. ACTUAL CART FAILURE STATE (Strictly separated from empty cart state)
  // =========================================================================
  if (!Array.isArray(cart)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <SEO title="Shopping Bag" description="Atelier shopping bag status." />
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-center p-3.5 shadow-inner">
          <AlertCircle className="w-8 h-8 text-[#9C5550]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
            We couldn’t load your cart right now
          </h1>
          <p className="text-sm text-[#786866] max-w-md mx-auto">
            An unexpected connection issue occurred while syncing your shopping bag. Please try again or return to the atelier home.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold uppercase tracking-wider shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center py-3 px-6 rounded-full bg-[#F6F3ED] text-[#313851] text-xs font-semibold uppercase tracking-wider hover:bg-[#EFE9DF] border border-[#D8C6C3] transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. LUXURY EMPTY CART EXPERIENCE (Nailsbyhelina Branded Editorial State)
  // =========================================================================
  if (cart.length === 0) {
    const popularPicks = (products || [])
      .filter((p) => p.isBestSeller)
      .slice(0, 4);

    return (
      <div className="relative min-h-[75vh] flex flex-col justify-between py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <SEO
          title="Shopping Bag"
          description="Your Nailsbyhelina shopping bag is currently waiting for something beautiful. Explore handcrafted press-ons and couture finishes."
        />

        {/* -----------------------------------------------------------------
            A. LARGE SUBTLE BACKGROUND LOGO WATERMARK & AMBIENT RADIAL GLOW
            ----------------------------------------------------------------- */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden -z-10"
          aria-hidden="true"
        >
          {/* Soft ambient champagne & rose radial glow with slow subtle drift */}
          <div 
            className="cart-ambient-glow absolute w-[520px] h-[520px] sm:w-[780px] sm:h-[780px] rounded-full blur-3xl opacity-75 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(201, 143, 138, 0.08) 0%, transparent 35%), radial-gradient(circle at 70% 65%, rgba(200, 164, 106, 0.07) 0%, transparent 32%)'
            }}
          />

          {/* Large delicate logo watermark with extremely slow ambient drift */}
          <img
            src="/helinart-logo.png"
            alt=""
            className="cart-watermark-drift w-72 h-72 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px] object-contain opacity-[0.055] transform-gpu pointer-events-none select-none transition-opacity"
          />
        </div>

        {/* -----------------------------------------------------------------
            B. FOREGROUND LUXURY EMPTY CART GLASS CARD
            ----------------------------------------------------------------- */}
        <div className="relative max-w-xl mx-auto w-full my-auto z-10">
          
          {/* Subtle Decorative Sparkles Around Card (Champagne Gold, Dusty Rose, Soft Blue Grey) */}
          <div className="cart-sparkle-1 absolute -top-4 -left-3 sm:-left-6 pointer-events-none select-none text-[#C8A46A]" aria-hidden="true">
            <Sparkles className="w-5 h-5 opacity-70" />
          </div>
          <div className="cart-sparkle-2 absolute top-1/5 -right-2 sm:-right-6 pointer-events-none select-none text-[#C98F8A]" aria-hidden="true">
            <Sparkles className="w-4 h-4 opacity-60" />
          </div>
          <div className="cart-sparkle-3 absolute top-1/2 -left-4 sm:-left-7 pointer-events-none select-none text-[#C2CBD3]" aria-hidden="true">
            <Sparkles className="w-3.5 h-3.5 opacity-65" />
          </div>
          <div className="cart-sparkle-4 absolute -bottom-3 left-10 pointer-events-none select-none text-[#C8A46A]" aria-hidden="true">
            <Sparkles className="w-4 h-4 opacity-55" />
          </div>
          <div className="cart-sparkle-5 absolute -bottom-4 right-8 sm:right-12 pointer-events-none select-none text-[#C98F8A]" aria-hidden="true">
            <Sparkles className="w-3.5 h-3.5 opacity-60" />
          </div>

          {/* Luxury Glass Card Container with Gentle Hover Shadow */}
          <div 
            className="cart-luxury-card rounded-[28px] p-8 sm:p-12 text-center space-y-6 sm:space-y-7"
            style={{
              background: 'rgba(255, 253, 252, 0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(216, 198, 195, 0.55)',
              boxShadow: '0 14px 36px rgba(49, 56, 81, 0.06)'
            }}
          >
            {/* 1. Stagger Entrance: Boutique Shopping Bag Logo Frame with Subtle Float */}
            <div className="cart-animate-entrance" style={{ animationDelay: '0ms' }}>
              <div className="cart-bag-float flex justify-center">
                <div 
                  className="cart-boutique-bag relative w-[74px] h-[82px] sm:w-[86px] sm:h-[94px] mx-auto select-none"
                  style={{
                    filter: 'drop-shadow(0 8px 22px rgba(49, 56, 81, 0.07))'
                  }}
                >
                  {/* Shopping Bag Vector Silhouette with Dual Curved Handles & Tapered Body */}
                  <svg
                    viewBox="0 0 86 94"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full block"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="boutiqueBagGradient" x1="12" y1="24" x2="74" y2="92" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFFDFC" stopOpacity="0.96" />
                        <stop offset="55%" stopColor="#F4ECE6" stopOpacity="0.92" />
                        <stop offset="100%" stopColor="#EEE6DE" stopOpacity="0.90" />
                      </linearGradient>
                      <linearGradient id="boutiqueHandleFront" x1="26" y1="2" x2="60" y2="28" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#D49E99" />
                        <stop offset="100%" stopColor="#C98F8A" />
                      </linearGradient>
                      <linearGradient id="boutiqueHandleBack" x1="32" y1="6" x2="54" y2="28" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#D6B47E" />
                        <stop offset="100%" stopColor="#C8A46A" />
                      </linearGradient>
                    </defs>

                    {/* Back Handle (Delicate antique-gold curved handle) */}
                    <path
                      d="M 32,26 C 32,7 54,7 54,26"
                      stroke="url(#boutiqueHandleBack)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.85"
                    />

                    {/* Shopping Bag Body (Tapered sides, rounded lower corners, thin luxury outline) */}
                    <path
                      d="M 12,27
                         C 12,25.5 14,24.5 16,24.5
                         L 70,24.5
                         C 72,24.5 74,25.5 74,27
                         L 78.5,72
                         C 79.5,83 71,91 60,91
                         L 26,91
                         C 15,91 6.5,83 7.5,72
                         Z"
                      fill="url(#boutiqueBagGradient)"
                      stroke="rgba(201, 143, 138, 0.35)"
                      strokeWidth="1"
                      strokeLinejoin="round"
                    />

                    {/* Subtle Top Rim Turnover / Atelier Crease Detail */}
                    <path
                      d="M 14,28.5 L 72,28.5"
                      stroke="rgba(201, 143, 138, 0.22)"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                    />

                    {/* Front Handle (Soft rose-gold curved handle) */}
                    <path
                      d="M 27,26 C 27,3 59,3 59,26"
                      stroke="url(#boutiqueHandleFront)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Delicate Metallic Eyelets / Handle Anchors */}
                    <circle cx="27" cy="26.5" r="1.4" fill="#C98F8A" />
                    <circle cx="59" cy="26.5" r="1.4" fill="#C98F8A" />
                  </svg>

                  {/* Centered Nailsbyhelina Logo (Preserving original aspect ratio & artwork) */}
                  <div 
                    className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
                    style={{ top: '24px', bottom: '3px' }}
                  >
                    <img
                      src="/helinart-logo.png"
                      alt="Nailsbyhelina Atelier"
                      className="w-[30px] h-[30px] sm:w-[36px] sm:h-[36px] object-contain drop-shadow-2xs select-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Hierarchy with Staggered Entrance */}
            <div className="space-y-3">
              {/* 2. Stagger Entrance: Small Label */}
              <p 
                className="cart-animate-entrance cart-label-entrance text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#B77F7B]"
                style={{ animationDelay: '80ms' }}
              >
                YOUR SHOPPING BAG
              </p>

              {/* 3. Stagger Entrance: Main Heading */}
              <h1 
                className="cart-animate-entrance cart-heading-entrance font-heading font-medium text-3xl sm:text-4xl text-[#313851] tracking-tight leading-tight"
                style={{ animationDelay: '160ms' }}
              >
                Your cart is empty
              </h1>

              {/* 4. Stagger Entrance: Description Text */}
              <p 
                className="cart-animate-entrance text-sm sm:text-[15px] text-[#786866] leading-relaxed max-w-md mx-auto font-normal"
                style={{ animationDelay: '240ms' }}
              >
                Looks like you haven’t added any nail sets yet. Explore handcrafted press-ons, couture finishes and signature looks made to elevate your style.
              </p>
            </div>

            {/* 5. Stagger Entrance: CTA Buttons with Micro-Interactions */}
            <div 
              className="cart-animate-entrance flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1"
              style={{ animationDelay: '320ms' }}
            >
              <Link
                to="/shop"
                className="cart-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-[#FFFDFC] text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
              >
                <span>Explore Nail Sets</span>
                <ArrowRight className="cart-btn-arrow w-4 h-4 text-[#FFFDFC]" />
              </Link>
              <Link
                to="/shop?sort=bestseller"
                className="cart-btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
              >
                <span>Shop Bestsellers</span>
              </Link>
            </div>

            {/* 6. Stagger Entrance: Lookbook Link with Animated Underline */}
            <div 
              className="cart-animate-entrance pt-0.5"
              style={{ animationDelay: '400ms' }}
            >
              <Link
                to="/#lookbook"
                className="cart-lookbook-link text-xs sm:text-sm font-medium gap-1.5"
              >
                <span>Need inspiration? Explore the Lookbook</span>
                <ArrowRight className="cart-lookbook-arrow w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 7. Stagger Entrance: Quick Action Filter Chips with Hover Lift & Tap Feedback */}
            <div 
              className="cart-animate-entrance pt-4 border-t border-[#D8C6C3]/40 space-y-2.5"
              style={{ animationDelay: '480ms' }}
            >
              <span className="text-[11px] uppercase tracking-wider text-[#786866] font-medium block">
                Popular Aesthetics
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { label: 'Almond', to: '/shop?q=Almond' },
                  { label: 'Chrome / Glaze', to: '/shop?q=Chrome' },
                  { label: 'French Tips', to: '/shop?q=French' },
                  { label: '3D Art', to: '/shop?q=3D' },
                  { label: 'Bridal', to: '/shop?q=Bridal' }
                ].map((chip) => (
                  <Link
                    key={chip.label}
                    to={chip.to}
                    className="cart-category-chip px-3.5 py-1.5 rounded-full text-xs font-medium shadow-2xs"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            C. CURATED ATELIER PICKS / RECENTLY VIEWED ROW
            ----------------------------------------------------------------- */}
        <div className="w-full max-w-7xl mx-auto pt-14 space-y-12 z-10">
          <RecentlyViewedRow title="Products You Viewed Earlier" />

          {(!recentlyViewed || recentlyViewed.length === 0) && popularPicks.length > 0 && (
            <div className="border-t border-[#D8C6C3]/60 pt-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#B77F7B] uppercase tracking-wider">
                    Atelier Highlights
                  </span>
                  <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
                    You May Love
                  </h2>
                </div>
                <Link
                  to="/shop?sort=bestseller"
                  className="text-xs font-semibold text-[#9C5550] hover:text-[#793D39] inline-flex items-center gap-1 transition-colors"
                >
                  <span>View All Bestsellers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ProductGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {popularPicks.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductGrid>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <SEO
        title="Your Shopping Bag"
        description="Review your selected handcrafted press-on nails, apply voucher WELCOME10, and check free shipping progress."
      />
      
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8C6C3]/60 pb-6">
        <div>
          <span className="text-xs font-medium text-[#793D39]">Review Your Selection</span>
          <h1 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
            Your Shopping Bag ({summary.itemsCount} {summary.itemsCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9C5550] hover:text-[#8A4743] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Free Shipping Progress Strip */}
      <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#313851] flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#9C5550]" />
            {summary.freeShippingQualified ? (
              <span className="text-[#879B83] font-semibold">You unlocked Complimentary Express Shipping! 🎉</span>
            ) : (
              <span>Add <strong>₹{summary.amountNeededForFreeShipping}</strong> more to unlock Free Express Courier</span>
            )}
          </span>
          <span className="text-[#786866] font-semibold">
            {summary.freeShippingQualified ? '₹0.00 Delivery' : 'Threshold ₹999'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#F4ECE6] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (summary.discountedSubtotal / 999) * 100)}%`,
              background: 'linear-gradient(90deg, #B26661 0%, #9C5550 100%)'
            }}
          />
        </div>
      </div>

      {/* Main Grid: Items on Left, Order Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence initial={false}>
            {cart.map((item, index) => (
              <motion.div
                key={`${item.product.id}-${item.shape}-${item.size}-${index}`}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="p-4 sm:p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* 4:5 Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-[#F4ECE6] shrink-0 border border-[#D8C6C3]/60 group"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-[#793D39] px-2 py-0.5 rounded-md bg-[#F4ECE6] border border-[#D8C6C3]">
                      {item.product.category}
                    </span>
                    <h3 className="font-heading font-medium text-lg sm:text-xl text-[#313851]">
                      <Link to={`/product/${item.product.id}`} className="hover:text-[#9C5550] transition-colors">
                        {item.product.name}
                      </Link>
                    </h3>
                    <div className="text-xs text-[#786866] flex flex-wrap gap-2 pt-0.5">
                      <span>Shape: <strong>{item.shape}</strong></span>
                      <span>•</span>
                      <span>Size: <strong>{item.size}</strong></span>
                    </div>
                    <div className="font-heading font-semibold text-base text-[#262D42] pt-1">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-[#D8C6C3]/60">
                  <div className="flex items-center border border-[#D8C6C3] rounded-xl bg-[#F6F3ED] p-0.5">
                    <button
                      onClick={() => updateCartQuantity(index, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-[#313851] hover:bg-[#FFFDFC] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-[#313851]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(index, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-[#313851] hover:bg-[#FFFDFC] transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold text-base text-[#313851] sm:hidden">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => removeFromCart(index)}
                      className="p-1.5 text-[#786866] hover:text-[#9C5550] transition-colors"
                      aria-label={`Remove ${item.product.name} from cart`}
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Sizing Kit Banner if ordering press-ons */}
          <div className="p-4 rounded-2xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#9C5550] shrink-0" />
              <span>Need help measuring your exact nail widths?</span>
            </div>
            <Link to="/size-guide" className="font-semibold text-[#9C5550] hover:underline shrink-0">
              Check 3-step size chart →
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Checkout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-5">
            <h3 className="font-heading font-medium text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-3">
              Order Summary
            </h3>

            {/* Line items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#453A3C]">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-[#313851]">₹{summary.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {summary.appliedCoupon && (
                <div className="flex justify-between text-[#879B83]">
                  <span>Discount ({summary.appliedCoupon.code} - 10%)</span>
                  <span className="font-semibold">-₹{summary.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#453A3C]">
                <span>Express Courier Shipping</span>
                <span className="font-semibold text-[#313851]">
                  {summary.shipping === 0 ? (
                    <span className="text-[#879B83]">FREE</span>
                  ) : (
                    `₹${summary.shipping}`
                  )}
                </span>
              </div>

              <div className="border-t border-[#D8C6C3]/60 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="font-heading font-medium text-base text-[#313851]">Total Payable</span>
                  <span className="block text-[10px] text-[#786866]">Includes all taxes</span>
                </div>
                <span className="font-heading font-semibold text-2xl text-[#262D42]">
                  ₹{summary.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-[#D8C6C3]/60 space-y-2">
              <label className="block text-xs font-semibold text-[#313851]">Promotional Code</label>
              
              {summary.appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-[#EEF3EE] border border-[#879B83]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#313851] font-medium">
                    <Tag className="w-3.5 h-3.5 text-[#879B83]" />
                    <span><strong>{summary.appliedCoupon.code}</strong> (10% off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-[#9C5550] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon (e.g. WELCOME10)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              <p className="text-[11px] text-[#786866]">
                Tip: Use <strong>WELCOME10</strong> for 10% off your entire bag.
              </p>
            </div>

            {/* Checkout CTA */}
            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-full font-medium text-sm text-[#FFFDFC] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all group"
              style={{
                background: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)'
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>

            {/* Trust highlights */}
            <div className="pt-2 text-[11px] text-[#786866] space-y-1.5 text-center">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#879B83]" />
                <span>Zero Risk • Handcrafted with love & precision</span>
              </p>
              <p>Supports UPI, Credit/Debit Cards & Cash on Delivery</p>
            </div>

          </div>
        </div>

      </div>

      {/* RECENTLY VIEWED ROW */}
      <RecentlyViewedRow />

    </div>
  );
}
