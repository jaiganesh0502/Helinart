import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { ArrowLeft, Package, MapPin, CreditCard, ShieldCheck, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import SEO from '../../components/SEO';

const STATUS_CONFIG = {
  pending: { label: 'Pending Atelier Confirmation', bg: 'bg-[#FFF8E7]', text: 'text-[#8A6D3B]', icon: Clock },
  confirmed: { label: 'Order Confirmed', bg: 'bg-[#EEF3EE]', text: 'text-[#43623E]', icon: CheckCircle2 },
  processing: { label: 'In Artisan Sculpting', bg: 'bg-[#F4EAE8]', text: 'text-[#9C5550]', icon: Package },
  shipped: { label: 'Dispatched via Express Courier', bg: 'bg-[#EBF3F8]', text: 'text-[#31587A]', icon: Truck },
  delivered: { label: 'Delivered to Doorstep', bg: 'bg-[#EEF3EE]', text: 'text-[#2D5A27]', icon: CheckCircle2 },
  cancelled: { label: 'Order Cancelled', bg: 'bg-[#FDF2F1]', text: 'text-[#B24A45]', icon: AlertCircle }
};

export default function OrderDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await orderService.getOrderById(id, user?.id, isAdmin);
        if (mounted) setOrder(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to retrieve order.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, user, isAdmin]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#786866]">Loading order specifications...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FDF2F1] text-[#9C5550] flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-heading text-2xl text-[#313851]">Order Not Found</h2>
        <p className="text-xs text-[#786866]">{error || 'This order does not exist or access is restricted.'}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#313851] text-[#FFFDFC] text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO 
        title={`Order ${order.order_number} | Nailsbyhelina`}
        description={`Details and live status for order ${order.order_number}.`}
      />

      <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-4">
        <Link 
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#786866] hover:text-[#9C5550] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>

        <span className="text-xs font-mono font-bold text-[#313851]">
          {order.order_number}
        </span>
      </div>

      {/* Status Card */}
      <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-[#786866] uppercase tracking-wider block">
            Current Order Fulfillment Status
          </span>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusConfig.label}</span>
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-[#786866] block">Order Date</span>
          <span className="text-xs font-semibold text-[#313851]">
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Ordered Items List (Snapshots) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-6">
          <h2 className="font-heading text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-3">
            Handcrafted Set Items ({order.items?.length || 0})
          </h2>

          <div className="space-y-4 divide-y divide-[#D8C6C3]/40">
            {order.items?.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url || '/images/design-sakura-chrome.jpg'}
                    alt={item.product_name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#D8C6C3] shrink-0"
                  />
                  <div>
                    <h3 className="font-heading text-base font-semibold text-[#313851]">
                      {item.product_name}
                    </h3>
                    <div className="text-xs text-[#786866] space-y-0.5 mt-0.5">
                      <p>Shape: <strong className="text-[#313851]">{item.shape || 'Almond'}</strong></p>
                      <p>Size: <strong className="text-[#313851]">{item.size || 'M'}</strong></p>
                      <p>Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                <span className="font-heading text-base font-semibold text-[#262D42]">
                  ₹{item.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-[#D8C6C3]/60 space-y-2 text-xs">
            <div className="flex justify-between text-[#786866]">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-[#9C5550]">
                <span>Discount Applied</span>
                <span>-₹{order.discount_amount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-[#786866]">
              <span>Pan-India Express Shipping</span>
              <span>{order.shipping_amount === 0 ? 'Complimentary' : `₹${order.shipping_amount}`}</span>
            </div>
            <div className="pt-2 border-t border-[#D8C6C3]/60 flex justify-between font-heading text-xl text-[#313851] font-semibold">
              <span>Total Paid</span>
              <span className="text-[#262D42]">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Customer Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#313851] font-heading text-lg">
              <MapPin className="w-4 h-4 text-[#9C5550]" />
              <span>Delivery Address</span>
            </div>
            <div className="text-xs text-[#786866] space-y-1 leading-relaxed">
              <p className="font-bold text-[#313851] text-sm">{order.customer_name}</p>
              <p>{order.shipping_address?.line1}</p>
              {order.shipping_address?.landmark && <p>Near: {order.shipping_address.landmark}</p>}
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
              <p className="pt-1 font-medium text-[#313851]">Phone: {order.customer_phone}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#313851] font-heading text-lg">
              <CreditCard className="w-4 h-4 text-[#879B83]" />
              <span>Payment Details</span>
            </div>
            <p className="text-[#786866]">
              Payment Status: <strong className="text-[#3E6B3B] uppercase">{order.payment_status}</strong>
            </p>
            <p className="text-[#786866]">
              Method: <strong className="text-[#313851]">{order.payment_method || 'Online Checkout'}</strong>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
