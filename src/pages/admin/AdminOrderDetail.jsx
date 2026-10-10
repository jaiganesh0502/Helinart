import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { orderService } from '../../services/orderService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Save, CheckCircle, MapPin, Phone, Mail, User, CreditCard, Package } from 'lucide-react';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await orderService.getOrderById(id, null, true);
        if (mounted && data) {
          setOrder(data);
          setSelectedStatus(data.status);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const handleUpdateStatus = async () => {
    setSaving(true);
    try {
      await orderService.updateOrderStatus(order.id, selectedStatus);
      await auditService.logAction({
        action: 'ORDER_STATUS_CHANGED',
        entityType: 'order',
        entityId: order.id,
        details: { oldStatus: order.status, newStatus: selectedStatus },
        adminUser: user
      });
      setOrder(prev => ({ ...prev, status: selectedStatus }));
      setToastMessage('Order status updated successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      alert('Error updating order: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="py-24 text-center">
          <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#786866] mt-2">Loading order details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Details">
        <div className="py-16 text-center space-y-4">
          <h3 className="font-heading text-2xl text-[#313851]">Order Not Found</h3>
          <Link to="/admin/orders" className="text-xs font-semibold text-[#9C5550]">
            ← Return to Orders List
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Order ${order.order_number}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[#EEF3EE] border border-[#B7DCB2] text-xs font-semibold text-[#43623E] flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-4">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#786866] hover:text-[#9C5550]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>
          <span className="text-xs font-mono font-bold text-[#313851]">
            Status: <span className="uppercase text-[#9C5550]">{order.status}</span>
          </span>
        </div>

        {/* Status Controller Card */}
        <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg text-[#313851]">Update Fulfillment Status</h3>
            <p className="text-xs text-[#786866]">Changes are immediately visible to the customer</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-xs font-semibold text-[#313851] outline-none"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">In Artisan Sculpting</option>
              <option value="shipped">Dispatched / Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={handleUpdateStatus}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#9C5550] text-[#FFFDFC] text-xs font-semibold hover:bg-[#8A4743] transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Updating...' : 'Save Status'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Order Items */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-6">
            <h3 className="font-heading text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-3">
              Ordered Items
            </h3>

            <div className="space-y-4 divide-y divide-[#D8C6C3]/40">
              {order.items?.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image_url || '/images/design-sakura-chrome.jpg'}
                      alt={item.product_name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#D8C6C3]"
                    />
                    <div>
                      <h4 className="font-heading text-base font-semibold text-[#313851]">
                        {item.product_name}
                      </h4>
                      <p className="text-xs text-[#786866]">
                        {item.shape || 'Almond'}, Size {item.size || 'M'} • Qty: {item.quantity}
                      </p>
                      <span className="text-[11px] text-[#786866]">
                        Unit Price: ₹{item.unit_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <span className="font-heading text-base font-semibold text-[#262D42]">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#D8C6C3]/60 space-y-2 text-xs">
              <div className="flex justify-between text-[#786866]">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-[#9C5550]">
                  <span>Discount</span>
                  <span>-₹{order.discount_amount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#786866]">
                <span>Pan-India Shipping</span>
                <span>{order.shipping_amount === 0 ? 'Free' : `₹${order.shipping_amount}`}</span>
              </div>
              <div className="pt-2 border-t border-[#D8C6C3]/60 flex justify-between font-heading text-xl text-[#313851] font-semibold">
                <span>Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="lg:col-span-4 space-y-6 text-xs">
            
            <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#313851] font-heading text-base font-semibold">
                <User className="w-4 h-4 text-[#9C5550]" />
                <span>Customer Coordinates</span>
              </div>
              <p className="font-semibold text-[#313851] text-sm">{order.customer_name}</p>
              {order.customer_email && (
                <p className="text-[#786866] flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{order.customer_email}</span>
                </p>
              )}
              <p className="text-[#786866] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>{order.customer_phone}</span>
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#313851] font-heading text-base font-semibold">
                <MapPin className="w-4 h-4 text-[#9C5550]" />
                <span>Shipping Address</span>
              </div>
              <div className="text-[#786866] space-y-0.5 leading-relaxed">
                <p>{order.shipping_address?.line1}</p>
                {order.shipping_address?.landmark && <p>Near: {order.shipping_address.landmark}</p>}
                <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                <p className="font-mono font-bold text-[#313851]">PIN: {order.shipping_address?.pincode}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
