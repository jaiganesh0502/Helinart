import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, CreditCard, Smartphone, Banknote, 
  ArrowLeft, Check, Truck, Sparkles 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { createOrder } from '../api';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Checkout() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { cart, getCartSummary, clearCart, user, addToast } = useStore();
  const summary = getCartSummary();

  const [form, setForm] = useState({
    name: authUser?.full_name || user?.name || '',
    email: authUser?.email || user?.email || '',
    phone: authUser?.phone || user?.phone || '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: ''
  });

  React.useEffect(() => {
    if (authUser) {
      setForm(prev => ({
        ...prev,
        name: prev.name || authUser.full_name || '',
        email: prev.email || authUser.email || '',
        phone: prev.phone || authUser.phone || '',
      }));
    }
  }, [authUser]);

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <SEO title="Checkout" description="Your bag is empty. Please select products to checkout." />
        <h2 className="font-heading font-medium text-2xl text-[#313851]">Your Bag is Empty</h2>
        <p className="text-xs text-[#786866]">Please add items to your shopping bag before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 rounded-full bg-[#9C5550] text-[#FFFDFC] text-xs font-semibold">
          Browse Collections
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      addToast('Please complete all required shipping fields.', 'error');
      return;
    }

    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      addToast('Please enter a valid 10-digit Indian mobile number.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const fullShippingAddress = `${form.address}, ${form.apartment ? form.apartment + ', ' : ''}${form.city}, ${form.state} - ${form.pincode}`;
      
      // 1. Sync to Database Order Service
      try {
        await orderService.createOrder({
          userId: authUser?.id || null,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: fullShippingAddress,
          subtotal: summary.subtotal,
          shippingAmount: summary.shipping,
          discountAmount: summary.discount,
          total: summary.total,
          items: cart.map(item => ({
            productId: item.id || item.product?.id,
            productName: item.name || item.product?.name,
            unitPrice: item.price || item.product?.price,
            quantity: item.quantity,
            shape: item.shape || 'Almond',
            size: item.size || 'M',
            imageUrl: item.image || item.product?.image || item.product?.primary_image
          })),
          paymentMethod: paymentMethod === 'UPI' ? 'UPI' : (paymentMethod === 'Card' ? 'Card' : 'COD')
        });
      } catch (dbErr) {
        console.warn('Database order sync notice', dbErr);
      }

      // 2. Legacy tracking and order placement
      const newOrder = await createOrder({
        items: cart,
        customer: form,
        paymentMethod: paymentMethod === 'UPI' ? 'UPI (Google Pay / PhonePe)' : (paymentMethod === 'Card' ? 'Credit / Debit Card' : 'Cash on Delivery'),
        subtotal: summary.subtotal,
        discount: summary.discount,
        couponCode: summary.appliedCoupon?.code || null,
        shipping: summary.shipping,
        total: summary.total
      });

      clearCart();
      addToast(`Order placed successfully! Order #${newOrder.orderNumber} 🎉`, 'success', 5000);
      navigate(`/track-order?orderId=${newOrder.orderNumber}`);
    } catch (err) {
      addToast('Could not place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SEO
        title="Secure Atelier Checkout"
        description="Complete your order for handcrafted press-on sets with 256-bit SSL encryption, express pan-India courier dispatch, and secure UPI or Card payment."
      />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-5">
        <div>
          <span className="text-xs font-medium text-[#793D39]">Secure Atelier Checkout</span>
          <h1 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
            Delivery & Payment
          </h1>
        </div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9C5550] hover:text-[#8A4743] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bag</span>
        </Link>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Shipping & Payment Forms */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Shipping Address Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
              <h2 className="font-heading font-medium text-xl text-[#313851]">
                1. Shipping Address
              </h2>
              <span className="text-xs text-[#879B83] font-medium flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Express Courier</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#313851] mb-1">Email Address</label>
                <input
                  type="email"
                  autoComplete="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#313851] mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  autoComplete="street-address"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="Enter your street address"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1">Apartment / Landmark</label>
                <input
                  type="text"
                  name="apartment"
                  value={form.apartment}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, or landmark"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  autoComplete="postal-code"
                  maxLength={6}
                  name="pincode"
                  value={form.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter your PIN code"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1">City</label>
                <input
                  type="text"
                  autoComplete="address-level2"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-4">
            <h2 className="font-heading font-medium text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-3 flex items-center justify-between">
              <span>2. Payment Method</span>
              <span className="text-xs text-[#786866] font-normal flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#879B83]" />
                <span>256-Bit SSL Mock Gateway</span>
              </span>
            </h2>

            <div className="space-y-3">
              {/* UPI Option */}
              <label 
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'UPI' ? 'border-[#9C5550] bg-[#F4ECE6]/60' : 'border-[#D8C6C3] hover:border-[#9C5550]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-[#9C5550]"
                  />
                  <div className="w-9 h-9 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] flex items-center justify-center text-[#9C5550]">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#313851]">UPI Instant (GPay / PhonePe / Paytm / BHIM)</h4>
                    <p className="text-[11px] text-[#786866]">Fastest fulfillment & instant digital invoice</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#879B83] bg-[#EEF3EE] px-2 py-0.5 rounded">Recommended</span>
              </label>

              {/* Cards Option */}
              <label 
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Card' ? 'border-[#9C5550] bg-[#F4ECE6]/60' : 'border-[#D8C6C3] hover:border-[#9C5550]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="accent-[#9C5550]"
                  />
                  <div className="w-9 h-9 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] flex items-center justify-center text-[#313851]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#313851]">Credit or Debit Card</h4>
                    <p className="text-[11px] text-[#786866]">Visa, MasterCard, RuPay, Amex</p>
                  </div>
                </div>
              </label>

              {/* Cash On Delivery Option */}
              <label 
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-[#9C5550] bg-[#F4ECE6]/60' : 'border-[#D8C6C3] hover:border-[#9C5550]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-[#9C5550]"
                  />
                  <div className="w-9 h-9 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] flex items-center justify-center text-[#879B83]">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#313851]">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-[#786866]">Pay in cash or UPI QR upon courier arrival</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Order Summary Card & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-5 sticky top-28">
            <h3 className="font-heading font-medium text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-3">
              Order Review ({summary.itemsCount} Items)
            </h3>

            {/* Compact Item list */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-[#F4ECE6] shrink-0 border border-[#D8C6C3]/60">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-medium text-sm text-[#313851] truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-[#786866]">{item.shape} • {item.size} • Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-[#262D42]">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-[#D8C6C3]/60 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#453A3C]">
                <span>Bag Subtotal</span>
                <span>₹{summary.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {summary.appliedCoupon && (
                <div className="flex justify-between text-[#879B83]">
                  <span>Discount ({summary.appliedCoupon.code})</span>
                  <span>-₹{summary.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#453A3C]">
                <span>Express Courier Delivery</span>
                <span>{summary.shipping === 0 ? <strong className="text-[#879B83]">FREE</strong> : `₹${summary.shipping}`}</span>
              </div>
              <div className="border-t border-[#D8C6C3]/60 pt-3 flex justify-between items-baseline">
                <span className="font-heading font-medium text-base text-[#313851]">Total Amount</span>
                <span className="font-heading font-semibold text-2xl text-[#262D42]">
                  ₹{summary.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full font-medium text-sm text-[#FFFDFC] flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
              style={{
                background: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)'
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{submitting ? 'Creating Order...' : `Place Order • ₹${summary.total.toLocaleString('en-IN')}`}</span>
            </button>

            {/* Security and Trust Badges Strip */}
            <div className="pt-2 border-t border-[#D8C6C3]/60 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#453A3C]">
                <div className="p-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3]/60 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#879B83] shrink-0" />
                  <span>256-Bit SSL Secure</span>
                </div>
                <div className="p-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3]/60 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9C5550] shrink-0" />
                  <span>Hygiene Inspected</span>
                </div>
                <div className="p-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3]/60 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#A87F45] shrink-0" />
                  <span>Transit Guarantee</span>
                </div>
                <div className="p-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3]/60 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#879B83] shrink-0" />
                  <span>Verified Atelier QC</span>
                </div>
              </div>

              {/* Supported Payment Logos */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#786866] pt-1">
                <span className="px-2 py-0.5 rounded bg-[#F4ECE6] border border-[#D8C6C3] font-semibold text-[#313851]">UPI</span>
                <span className="px-2 py-0.5 rounded bg-[#F4ECE6] border border-[#D8C6C3] font-semibold text-[#313851]">VISA</span>
                <span className="px-2 py-0.5 rounded bg-[#F4ECE6] border border-[#D8C6C3] font-semibold text-[#313851]">Mastercard</span>
                <span className="px-2 py-0.5 rounded bg-[#F4ECE6] border border-[#D8C6C3] font-semibold text-[#313851]">RuPay</span>
                <span className="px-2 py-0.5 rounded bg-[#F4ECE6] border border-[#D8C6C3] font-semibold text-[#313851]">COD</span>
              </div>
            </div>

            <p className="text-[11px] text-[#786866] text-center leading-relaxed">
              By placing your order, you agree to Nailsbyhelina’s handcrafted quality assurance and atelier return policy.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
}
