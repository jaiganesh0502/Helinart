import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { orderService } from '../../services/orderService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Search, Filter, Eye, CheckCircle, Clock, Truck, Package, AlertCircle } from 'lucide-react';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders(null, true);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await auditService.logAction({
        action: 'ORDER_STATUS_CHANGED',
        entityType: 'order',
        entityId: orderId,
        details: { newStatus },
        adminUser: user
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order ${orderId} updated to "${newStatus}".`);
    } catch (err) {
      alert('Error updating order: ' + err.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = !search ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_phone && o.customer_phone.includes(search));

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout title="Client Order Fulfillment">
      <div className="space-y-6">
        
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[#EEF3EE] border border-[#B7DCB2] text-xs font-semibold text-[#43623E] flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl text-[#313851]">Customer Orders</h2>
            <p className="text-xs text-[#786866]">Track payments, artisan production, and express dispatch</p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs flex flex-col sm:flex-row items-center gap-3 text-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order #, Customer Name, or Phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] outline-none"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>
                  Status: {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#786866] mt-2">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#786866]">
              No orders found matching the filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8C6C3]/60 text-[#786866] uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Customer Details</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Order Status</th>
                    <th className="pb-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C6C3]/40">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#F6F3ED]/40 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-[#313851]">
                        <Link to={`/admin/orders/${ord.id}`} className="hover:text-[#9C5550]">
                          {ord.order_number}
                        </Link>
                      </td>

                      <td className="py-3.5">
                        <span className="font-semibold text-[#313851] block">{ord.customer_name}</span>
                        <span className="text-[11px] text-[#786866] block">{ord.customer_phone}</span>
                      </td>

                      <td className="py-3.5 text-[#786866]">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      <td className="py-3.5 text-[#313851] font-medium">
                        {ord.items?.length || 1} set(s)
                      </td>

                      <td className="py-3.5 font-bold text-[#262D42]">
                        ₹{Number(ord.total).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EEF3EE] text-[#43623E]">
                          {ord.payment_status}
                        </span>
                      </td>

                      <td className="py-3.5">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">In Production</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 text-right">
                        <Link
                          to={`/admin/orders/${ord.id}`}
                          className="p-1.5 inline-block rounded-lg text-[#313851] hover:text-[#9C5550] hover:bg-[#F4ECE6]"
                          title="Inspect Order"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
