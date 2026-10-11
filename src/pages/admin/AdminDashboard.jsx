import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { authService } from '../../services/authService';
import { settingsService } from '../../services/settingsService';
import {
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockCount: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    studioBookingEnabled: false
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        const [productsRes, ordersRes, customersRes, settingsRes] = await Promise.all([
          productService.getProducts({ activeOnly: false }).catch(() => []),
          orderService.getOrders(null, true).catch(() => []),
          authService.getCustomers().catch(() => []),
          settingsService.getSettings().catch(() => ({}))
        ]);

        if (mounted) {
          const products = Array.isArray(productsRes) ? productsRes : [];
          const orders = Array.isArray(ordersRes) ? ordersRes : [];
          const customers = Array.isArray(customersRes) ? customersRes : [];
          const settings = settingsRes || {};

          const activeProds = products.filter(p => p && p.is_active);
          const lowStock = products.filter(p => p && (Number(p.stock_quantity) || 0) < 30);
          const pending = orders.filter(o => o && o.status === 'pending');
          const revenue = orders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0);

          setStats({
            totalProducts: products.length,
            activeProducts: activeProds.length,
            lowStockCount: lowStock.length,
            totalOrders: orders.length,
            pendingOrders: pending.length,
            totalCustomers: customers.length,
            totalRevenue: revenue,
            studioBookingEnabled: Boolean(settings?.studio_booking_enabled)
          });

          setRecentOrders(orders.slice(0, 5));
          setLowStockProducts(lowStock.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => { mounted = false; };
  }, []);

  return (
    <AdminLayout title="Atelier Executive Overview">
      <div className="space-y-8">
        
        {/* Studio Status Live Alert */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              stats.studioBookingEnabled ? 'bg-[#EEF3EE] text-[#43623E]' : 'bg-[#FFF8E7] text-[#8A6D3B]'
            }`}>
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-[#313851]">Physical Studio Appointment Engine:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                  stats.studioBookingEnabled ? 'bg-[#EEF3EE] text-[#43623E]' : 'bg-[#FFF8E7] text-[#8A6D3B]'
                }`}>
                  {stats.studioBookingEnabled ? '● LIVE BOOKINGS ACTIVE' : '○ COMING SOON MODE'}
                </span>
              </div>
              <p className="text-[11px] text-[#786866]">
                {stats.studioBookingEnabled 
                  ? 'Customers can currently book studio appointment slots on the website.'
                  : 'Nailsbyhelina is currently operating as an Online Store Only.'}
              </p>
            </div>
          </div>
          <Link
            to="/admin/studio"
            className="px-4 py-2 rounded-full bg-[#262D42] text-[#C8A46A] text-xs font-semibold hover:bg-[#313851] transition-colors"
          >
            Manage Studio Toggle →
          </Link>
        </div>

        {/* Executive KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="p-5 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#786866] uppercase tracking-wider">Total Products</span>
              <Package className="w-4 h-4 text-[#9C5550]" />
            </div>
            <div className="font-heading text-3xl text-[#313851] font-medium">
              {stats.totalProducts}
            </div>
            <div className="text-[11px] text-[#786866]">
              <strong className="text-[#3E6B3B]">{stats.activeProducts}</strong> published in shop
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#786866] uppercase tracking-wider">Customer Orders</span>
              <ShoppingBag className="w-4 h-4 text-[#C8A46A]" />
            </div>
            <div className="font-heading text-3xl text-[#313851] font-medium">
              {stats.totalOrders}
            </div>
            <div className="text-[11px] text-[#786866]">
              <strong className="text-[#9C5550]">{stats.pendingOrders}</strong> pending fulfillment
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#786866] uppercase tracking-wider">Registered Clients</span>
              <Users className="w-4 h-4 text-[#879B83]" />
            </div>
            <div className="font-heading text-3xl text-[#313851] font-medium">
              {stats.totalCustomers}
            </div>
            <div className="text-[11px] text-[#786866]">Verified customer accounts</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#786866] uppercase tracking-wider">Gross Revenue</span>
              <TrendingUp className="w-4 h-4 text-[#3E6B3B]" />
            </div>
            <div className="font-heading text-3xl text-[#262D42] font-medium">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#786866]">Calculated from orders</div>
          </div>

        </div>

        {/* Two-Column Detail View: Recent Orders & Inventory Watch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Recent Orders Table */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-4">
              <div>
                <h2 className="font-heading text-xl text-[#313851]">Recent Customer Orders</h2>
                <p className="text-xs text-[#786866]">Live orders submitted across pan-India</p>
              </div>
              <Link to="/admin/orders" className="text-xs font-semibold text-[#9C5550] hover:text-[#8A4743]">
                View All Orders →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-[#786866] py-6 text-center">No orders recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#D8C6C3]/60 text-[#786866] uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Order #</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8C6C3]/40">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#F6F3ED]/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#313851]">
                          <Link to={`/admin/orders/${ord.id}`} className="hover:text-[#9C5550]">
                            {ord.order_number}
                          </Link>
                        </td>
                        <td className="py-3 font-medium text-[#313851]">{ord.customer_name}</td>
                        <td className="py-3 text-[#786866]">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            ord.status === 'delivered' ? 'bg-[#EEF3EE] text-[#43623E]' :
                            ord.status === 'shipped' ? 'bg-[#EBF3F8] text-[#31587A]' :
                            ord.status === 'processing' ? 'bg-[#F4EAE8] text-[#9C5550]' :
                            'bg-[#FFF8E7] text-[#8A6D3B]'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold text-[#262D42]">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions & Low Stock Alerts */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Shortcuts */}
            <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-[#313851]">Atelier Shortcuts</h3>
              <div className="space-y-2 text-xs">
                <Link
                  to="/admin/products/new"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#262D42] text-[#FFFDFC] font-semibold flex items-center justify-between hover:bg-[#313851] transition-colors"
                >
                  <span>+ Create New Product</span>
                  <Package className="w-4 h-4 text-[#C8A46A]" />
                </Link>

                <Link
                  to="/admin/homepage"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] font-semibold flex items-center justify-between hover:bg-[#F4ECE6] transition-colors"
                >
                  <span>Edit Homepage CMS</span>
                  <ExternalLink className="w-4 h-4 text-[#786866]" />
                </Link>

                <Link
                  to="/admin/lookbook"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] font-semibold flex items-center justify-between hover:bg-[#F4ECE6] transition-colors"
                >
                  <span>Manage Lookbook Drops</span>
                  <Sparkles className="w-4 h-4 text-[#9C5550]" />
                </Link>

                <Link
                  to="/admin/pages"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] font-semibold flex items-center justify-between hover:bg-[#F4ECE6] transition-colors"
                >
                  <span>Pages & Policies CMS</span>
                  <FileText className="w-4 h-4 text-[#793D39]" />
                </Link>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#9C5550]">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="font-heading text-lg text-[#313851]">Low Stock Notice</h3>
              </div>

              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-[#786866]">All products have healthy inventory levels.</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-[#D8C6C3]/40 last:border-0">
                      <div>
                        <span className="font-medium text-[#313851] block">{p.name}</span>
                        <span className="text-[10px] text-[#9C5550] font-semibold">
                          Only {p.stock_quantity || 0} sets remaining
                        </span>
                      </div>
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="text-[11px] font-semibold text-[#313851] hover:text-[#9C5550]"
                      >
                        Restock →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
