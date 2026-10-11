import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [custsRes, ordsRes] = await Promise.allSettled([
          authService.getCustomers(),
          orderService.getOrders(null, true)
        ]);
        if (mounted) {
          if (custsRes.status === 'fulfilled' && Array.isArray(custsRes.value)) {
            setCustomers(custsRes.value);
          }
          if (ordsRes.status === 'fulfilled' && Array.isArray(ordsRes.value)) {
            setOrders(ordsRes.value);
          }
        }
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const getCustomerOrderCount = (customerId, email) => {
    return orders.filter(o => 
      (o.user_id && o.user_id === customerId) ||
      (o.customer_email && email && o.customer_email.toLowerCase() === email.toLowerCase())
    ).length;
  };

  const filteredCustomers = customers.filter(c => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (c.full_name && c.full_name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term))
    );
  });

  return (
    <AdminLayout title="Atelier Client Directory">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl text-[#313851]">Registered Clients</h2>
            <p className="text-xs text-[#786866]">View verified accounts and order activity</p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F4ECE6] text-[#793D39] border border-[#D8C6C3]">
            {customers.length} Verified Client Accounts
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name, email, or telephone number..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] outline-none"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#786866] mt-2">Loading client profiles...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#786866]">
              No clients found matching the query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8C6C3]/60 text-[#786866] uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Client Name</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Account Role</th>
                    <th className="pb-3">Join Date</th>
                    <th className="pb-3 text-right">Orders Placed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C6C3]/40">
                  {filteredCustomers.map((c) => {
                    const orderCount = getCustomerOrderCount(c.id, c.email);
                    return (
                      <tr key={c.id} className="hover:bg-[#F6F3ED]/40 transition-colors">
                        <td className="py-3.5 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#F4ECE6] text-[#9C5550] font-semibold text-xs flex items-center justify-center shrink-0 border border-[#D8C6C3]/60">
                            {c.full_name ? c.full_name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <span className="font-semibold text-sm text-[#313851]">
                            {c.full_name || 'Anonymous Client'}
                          </span>
                        </td>

                        <td className="py-3.5 text-[#313851] font-medium">{c.email}</td>

                        <td className="py-3.5 text-[#786866]">{c.phone || '—'}</td>

                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.role === 'admin'
                              ? 'bg-[#262D42] text-[#C8A46A] border border-[#C8A46A]/30'
                              : 'bg-[#EEF3EE] text-[#43623E]'
                          }`}>
                            {c.role || 'customer'}
                          </span>
                        </td>

                        <td className="py-3.5 text-[#786866]">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : '—'}
                        </td>

                        <td className="py-3.5 text-right font-bold text-[#313851]">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F6F3ED] border border-[#D8C6C3]">
                            <ShoppingBag className="w-3 h-3 text-[#9C5550]" />
                            <span>{orderCount}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
