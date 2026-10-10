import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Truck, 
  Sparkles, Check, ArrowLeft, Ruler 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import RecentlyViewedRow from '../components/RecentlyViewedRow';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, getCartSummary, applyCoupon, removeCoupon } = useStore();
  const [couponInput, setCouponInput] = useState('');
  
  const summary = getCartSummary();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <SEO
          title="Shopping Bag"
          description="Your Nailsbyhelina shopping bag is currently empty. Explore our handcrafted collections or reserve a private studio slot."
        />
        <EmptyState
          title="Your Shopping Bag is Empty"
          description="You haven't added any luxury press-on sets or gel kits to your bag yet. Explore our handcrafted collections or reserve a studio slot."
          buttonText="Explore Nail Sets"
          buttonLink="/shop"
          icon={ShoppingBag}
        />
        <RecentlyViewedRow title="Products You Viewed Earlier" />
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
          {cart.map((item, index) => (
            <div
              key={`${item.product.id}-${item.shape}-${item.size}-${index}`}
              className="p-4 sm:p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {/* 4:5 Image */}
                <Link
                  to={`/product/${item.product.id}`}
                  className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-[#F4ECE6] shrink-0 border border-[#D8C6C3]/60"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
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
                  <button
                    onClick={() => removeFromCart(index)}
                    className="p-1.5 text-[#786866] hover:text-[#9C5550] transition-colors"
                    aria-label={`Remove ${item.product.name} from cart`}
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

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
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-full font-medium text-sm text-[#FFFDFC] flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
              style={{
                background: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)'
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

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
