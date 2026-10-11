import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Package, Search, Truck, CheckCircle2, Clock, MapPin, 
  ArrowRight, ShieldCheck, ExternalLink, Calendar 
} from 'lucide-react';
import { getOrderByNumber, getOrders } from '../api';
import SEO from '../components/SEO';
import { pageService } from '../services/pageService';

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('orderId') || '';
  
  const [orderNumberInput, setOrderNumberInput] = useState(initialCode);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [page, setPage] = useState(null);

  useEffect(() => {
    getOrders().then(orders => {
      setRecentOrders(orders.slice(0, 3));
    });
    pageService.getPageBySlug('track-order').then(p => {
      if (p) setPage(p);
    }).catch(() => {});
  }, []);

  const fetchOrder = async (numberToFind) => {
    if (!numberToFind || !numberToFind.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const found = await getOrderByNumber(numberToFind.trim());
      setOrder(found);
      setSearchParams({ orderId: numberToFind.trim() });
    } catch (err) {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      fetchOrder(initialCode);
    }
  }, [initialCode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrder(orderNumberInput);
  };

  const stepsList = [
    { title: 'Order Placed', desc: 'Verified & received in atelier' },
    { title: 'Handcrafted & Inspected', desc: 'Curated by master artist' },
    { title: 'In Transit', desc: 'Dispatched with Blue Dart' },
    { title: 'Out for Delivery', desc: 'With local courier partner' },
    { title: 'Delivered', desc: 'Delivered to your doorstep' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      <SEO
        title="Order Tracking & Pan-India Dispatch Status"
        description="Monitor real-time pan-India courier shipping milestones and dispatch updates for your Nailsbyhelina handcrafted order."
        keywords="track nail order, courier dispatch status, nailsbyhelina order tracking"
      />
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
          <Truck className="w-3.5 h-3.5 text-[#9C5550]" />
          <span>Real-Time Express Courier Tracking</span>
        </div>
        <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
          Track Your Atelier Order
        </h1>
        <p className="text-sm sm:text-base text-[#786866] max-w-xl mx-auto leading-relaxed">
          Enter your 9-character order number (e.g. <strong>HLN-582914</strong>) to view courier dispatch status, live AWB, and estimated doorstep arrival.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786866]" />
            <input
              type="text"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              placeholder="e.g. HLN-582914"
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#D8C6C3] bg-[#FFFDFC] text-[#313851] uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#9C5550] shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl font-semibold text-xs sm:text-sm text-[#FFFDFC] bg-[#313851] hover:bg-[#262D42] transition-colors shadow-xs"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Quick Demo Helper */}
        <div className="flex items-center justify-between text-[11px] text-[#786866] mt-2 px-1">
          <span>Don't have an order number?</span>
          <button
            onClick={() => {
              setOrderNumberInput('HLN-582914');
              fetchOrder('HLN-582914');
            }}
            className="text-[#9C5550] font-semibold hover:underline"
          >
            Try Demo Order (HLN-582914)
          </button>
        </div>
      </div>

      {/* RESULT CARD */}
      {order && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-8 animate-in fade-in duration-300">
          
          {/* Order Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8C6C3]/60 pb-6">
            <div>
              <span className="text-xs font-bold text-[#9C5550]">Order Verified</span>
              <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
                Order #{order.orderNumber}
              </h2>
              <p className="text-xs text-[#786866] mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold text-[#879B83] bg-[#EEF3EE] px-3 py-1 rounded-full border border-[#879B83]/30 inline-block">
                Status: {order.status}
              </span>
              <p className="text-xs text-[#313851] font-medium mt-1">
                Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
              </p>
            </div>
          </div>

          {/* 5-STEP TIMELINE STEPPER */}
          <div className="space-y-4">
            <h3 className="font-heading font-medium text-lg text-[#313851]">
              Fulfillment Journey
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {stepsList.map((step, idx) => {
                const stepNum = idx + 1;
                const isPassed = stepNum <= (order.currentStep || 2);
                const isCurrent = stepNum === (order.currentStep || 2);

                return (
                  <div
                    key={step.title}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#F4ECE6] border-[#9C5550] shadow-xs'
                        : (isPassed ? 'bg-[#EEF3EE] border-[#879B83]/40' : 'bg-[#F6F3ED] border-[#D8C6C3]/60 opacity-60')
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPassed ? 'bg-[#879B83] text-[#FFFDFC]' : 'bg-[#D8C6C3] text-[#313851]'
                      }`}>
                        {isPassed ? '✓' : stepNum}
                      </div>
                      <span className="text-xs font-bold text-[#313851]">{step.title}</span>
                    </div>
                    <p className="text-[11px] text-[#786866] leading-tight">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Details */}
          <div className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#786866] block">Courier Partner:</span>
              <span className="font-semibold text-[#313851]">{order.carrier || 'Blue Dart Express'}</span>
            </div>
            <div>
              <span className="text-[#786866] block">Waybill / AWB Number:</span>
              <span className="font-semibold text-[#313851] font-mono">{order.awb || 'BD49201940IN'}</span>
            </div>
            <div>
              <span className="text-[#786866] block">Payment Method:</span>
              <span className="font-semibold text-[#313851]">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Ordered Items Preview */}
          <div className="space-y-3">
            <h3 className="font-heading font-medium text-lg text-[#313851]">
              Package Contents ({order.items.length} {order.items.length === 1 ? 'Design' : 'Designs'})
            </h3>
            
            <div className="divide-y divide-[#D8C6C3]/60 border border-[#D8C6C3] rounded-2xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-[#FFFDFC] flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-[#F4ECE6] shrink-0 border border-[#D8C6C3]/60">
                      <img src={item.product?.image || '/images/design-sakura-chrome.jpg'} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-heading font-medium text-sm text-[#313851]">{item.product?.name}</h4>
                      <p className="text-[11px] text-[#786866]">{item.shape} • {item.size} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#262D42]">
                    ₹{((item.product?.price || 1199) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Financials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#D8C6C3]/60 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-[#313851] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9C5550]" />
                <span>Destination Address</span>
              </span>
              <p className="text-[#453A3C]">{order.customer?.name}</p>
              <p className="text-[#786866]">{order.customer?.address}, {order.customer?.apartment}</p>
              <p className="text-[#786866]">{order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</p>
              <p className="text-[#786866]">Mobile: {order.customer?.phone}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <div className="flex justify-between sm:justify-end sm:gap-6 text-[#786866]">
                <span>Subtotal:</span>
                <span className="font-medium text-[#313851]">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between sm:justify-end sm:gap-6 text-[#879B83]">
                  <span>Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-semibold">-₹{order.discount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between sm:justify-end sm:gap-6 text-[#786866]">
                <span>Shipping:</span>
                <span className="font-medium text-[#313851]">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between sm:justify-end sm:gap-6 font-semibold text-base text-[#262D42] pt-2 border-t border-[#D8C6C3]/60">
                <span>Total Paid:</span>
                <span>₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* NOT FOUND STATE */}
      {!order && searched && !loading && (
        <div className="p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] text-center max-w-md mx-auto space-y-3">
          <Package className="w-10 h-10 text-[#9C5550] mx-auto opacity-70" />
          <h3 className="font-heading font-medium text-xl text-[#313851]">
            Order Not Found
          </h3>
          <p className="text-xs text-[#786866] leading-relaxed">
            We couldn't find an order matching "<strong>{orderNumberInput}</strong>". Please verify your order confirmation SMS or check our demo code.
          </p>
          <button
            onClick={() => {
              setOrderNumberInput('HLN-582914');
              fetchOrder('HLN-582914');
            }}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#9C5550] text-[#FFFDFC]"
          >
            Load Sample Order (HLN-582914)
          </button>
        </div>
      )}

      {/* CMS INFORMATION CARD (Admin Editable) */}
      {page && (
        <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 border border-[#D8C6C3] shadow-xs space-y-4 text-xs sm:text-sm text-[#453A3C]">
          <h3 className="font-heading font-medium text-lg text-[#313851]">
            Courier Transit & Live Dispatch Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60 space-y-1">
              <span className="font-semibold text-[#313851] block text-xs">Courier Partners</span>
              <p className="text-xs text-[#786866]">{page.content?.courierInfo || 'Blue Dart Air Express, Delhivery, and DTDC.'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60 space-y-1">
              <span className="font-semibold text-[#313851] block text-xs">AWB Update Timings</span>
              <p className="text-xs text-[#786866]">{page.content?.updateTimings || 'AWB tracking activates within 12 hours of dispatch scan.'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60 space-y-1">
              <span className="font-semibold text-[#313851] block text-xs">Concierge Assistance</span>
              <p className="text-xs text-[#786866]">{page.content?.supportContact || 'WhatsApp concierge at +91 93614 05676 for transit escalation.'}</p>
            </div>
          </div>
          {page.content?.instructions && (
            <p className="text-xs text-[#786866] pt-1 leading-relaxed">{page.content.instructions}</p>
          )}
        </div>
      )}

    </div>
  );
}
