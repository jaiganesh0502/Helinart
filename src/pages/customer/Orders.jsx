import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { ShoppingBag, ArrowRight, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import SEO from '../../components/SEO';

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-[#FFF8E7]', text: 'text-[#8A6D3B]', icon: Clock },
  confirmed: { label: 'Confirmed', bg: 'bg-[#EEF3EE]', text: 'text-[#43623E]', icon: CheckCircle2 },
  processing: { label: 'In Production', bg: 'bg-[#F4EAE8]', text: 'text-[#9C5550]', icon: Package },
  shipped: { label: 'Shipped', bg: 'bg-[#EBF3F8]', text: 'text-[#31587A]', icon: Truck },
  delivered: { label: 'Delivered', bg: 'bg-[#EEF3EE]', text: 'text-[#2D5A27]', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', bg: 'bg-[#FDF2F1]', text: 'text-[#B24A45]', icon: AlertCircle }
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders(user?.id, false);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders', err);
      setError('We could not retrieve your orders right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadUserOrders();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <SEO 
        title="My Orders | Nailsbyhelina Haute Couture Atelier"
        description="View and track your bespoke handcrafted press-on nail orders from Nailsbyhelina."
      />

      <div className="border-b border-[#D8C6C3]/60 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-[#313851]">My Atelier Orders</h1>
          <p className="text-xs text-[#786866] mt-1">Track handcrafted sets in production & transit</p>
        </div>
        <Link 
          to="/shop" 
          className="text-xs font-semibold text-[#9C5550] hover:text-[#8A4743] transition-colors"
        >
          Browse New Drops →
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#786866]">Retrieving your orders...</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center space-y-4 bg-[#FFFDFC] rounded-3xl border border-[#D8C6C3] p-8 max-w-md mx-auto">
          <p className="text-base font-medium text-[#313851]">{error}</p>
          <p className="text-xs text-[#786866]">Please check your connection and try again.</p>
          <button
            onClick={loadUserOrders}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#9C5550] text-[#FFFDFC] text-xs font-semibold hover:bg-[#8A4743] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-[#FFFDFC] rounded-3xl border border-[#D8C6C3] p-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F4ECE6] flex items-center justify-center text-[#9C5550]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-2xl text-[#313851]">No Orders Placed Yet</h3>
          <p className="text-xs text-[#786866] max-w-sm mx-auto">
            Discover our master artisan sculpted reusable press-ons and elevate your everyday manicure.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9C5550] text-[#FFFDFC] text-xs font-semibold hover:bg-[#8A4743] transition-all shadow-xs"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusConfig.icon;
            const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div 
                key={order.id}
                className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-4 hover:border-[#9C5550]/60 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D8C6C3]/60 pb-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-sm text-[#313851]">{order.order_number}</span>
                    <span className="text-[11px] text-[#786866] block">Placed on {formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusConfig.label}</span>
                    </span>

                    <span className="font-heading text-lg font-bold text-[#262D42]">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items Summary Preview */}
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image_url || '/images/design-sakura-chrome.jpg'} 
                          alt={item.product_name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#D8C6C3]/60 shrink-0" 
                        />
                        <div>
                          <h4 className="font-semibold text-[#313851]">{item.product_name}</h4>
                          <span className="text-[11px] text-[#786866]">
                            Qty: {item.quantity} • {item.shape || 'Almond'}, Size {item.size || 'M'}
                          </span>
                        </div>
                      </div>
                      <span className="font-medium text-[#313851]">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#D8C6C3]/40 flex items-center justify-between text-xs">
                  <span className="text-[#786866]">
                    Delivering to: <strong className="text-[#313851]">{order.customer_name}</strong> ({order.shipping_address?.city || 'India'})
                  </span>
                  <Link
                    to={`/orders/${order.id}`}
                    className="font-semibold text-[#9C5550] hover:text-[#8A4743] transition-colors flex items-center gap-1"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
