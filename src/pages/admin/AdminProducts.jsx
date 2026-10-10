import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Flame,
  AlertTriangle,
  X
} from 'lucide-react';

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive, low-stock
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        productService.getProducts({ activeOnly: false }),
        categoryService.getCategories({ activeOnly: false })
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products', err);
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

  const handleToggleActive = async (product) => {
    try {
      const updated = await productService.updateProduct(product.id, {
        is_active: !product.is_active
      });
      await auditService.logAction({
        action: updated.is_active ? 'PRODUCT_ACTIVATED' : 'PRODUCT_DEACTIVATED',
        entityType: 'product',
        entityId: product.id,
        details: { name: product.name },
        adminUser: user
      });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
      showToast(`Product "${product.name}" ${!product.is_active ? 'activated' : 'hidden from shop'}.`);
    } catch (err) {
      alert('Error updating product: ' + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalItem) return;
    try {
      await productService.deleteProduct(deleteModalItem.id);
      await auditService.logAction({
        action: 'PRODUCT_DELETED',
        entityType: 'product',
        entityId: deleteModalItem.id,
        details: { name: deleteModalItem.name, price: deleteModalItem.price },
        adminUser: user
      });
      setProducts(prev => prev.filter(p => p.id !== deleteModalItem.id));
      showToast(`Product "${deleteModalItem.name}" deleted successfully.`);
      setDeleteModalItem(null);
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    
    const matchesCat = selectedCategory === 'all' || 
      p.category_id === selectedCategory ||
      (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = p.is_active;
    if (statusFilter === 'inactive') matchesStatus = !p.is_active;
    if (statusFilter === 'low-stock') matchesStatus = (p.stock_quantity || 0) < 30;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <AdminLayout title="Product Catalog Management">
      <div className="space-y-6">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[#EEF3EE] border border-[#B7DCB2] text-xs font-semibold text-[#43623E] flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl text-[#313851]">All Handcrafted Sets</h2>
            <p className="text-xs text-[#786866]">Manage prices, inventory, and visibility in customer store</p>
          </div>
          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold tracking-wide hover:shadow-md transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Nail Set</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs flex flex-col md:flex-row items-center gap-3 text-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or slug..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] outline-none focus:bg-[#FFFDFC] focus:border-[#9C5550]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 md:flex-none px-3 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:flex-none px-3 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive / Hidden</option>
              <option value="low-stock">Low Stock (&lt;30)</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#786866]">Loading catalog products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#786866]">
              No products found matching your filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8C6C3]/60 text-[#786866] uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Inventory</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C6C3]/40">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#F6F3ED]/40 transition-colors">
                      <td className="py-3.5 flex items-center gap-3">
                        <img
                          src={prod.image || prod.primary_image || '/images/design-sakura-chrome.jpg'}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#D8C6C3] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-[#313851]">{prod.name}</span>
                            {prod.is_bestseller && (
                              <Flame className="w-3.5 h-3.5 text-[#9C5550]" title="Bestseller" />
                            )}
                            {prod.is_featured && (
                              <Star className="w-3.5 h-3.5 text-[#C8A46A] fill-[#C8A46A]" title="Featured" />
                            )}
                          </div>
                          <span className="text-[11px] text-[#786866] font-mono">/{prod.slug}</span>
                        </div>
                      </td>

                      <td className="py-3.5 text-[#786866]">
                        {prod.category || prod.category_id || 'Luxury Press-Ons'}
                      </td>

                      <td className="py-3.5 font-bold text-[#262D42]">
                        ₹{Number(prod.price).toLocaleString('en-IN')}
                        {prod.compare_price && (
                          <span className="text-[10px] text-[#786866] line-through block font-normal">
                            ₹{Number(prod.compare_price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5">
                        <span className={`font-semibold ${
                          (prod.stock_quantity || 0) < 25 ? 'text-[#9C5550]' : 'text-[#3E6B3B]'
                        }`}>
                          {prod.stock_quantity || 0} in stock
                        </span>
                      </td>

                      <td className="py-3.5">
                        <button
                          onClick={() => handleToggleActive(prod)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            prod.is_active
                              ? 'bg-[#EEF3EE] text-[#43623E] hover:bg-[#E3EFE3]'
                              : 'bg-[#FDF2F1] text-[#9C5550] hover:bg-[#FBE8E7]'
                          }`}
                        >
                          {prod.is_active ? 'Active' : 'Hidden'}
                        </button>
                      </td>

                      <td className="py-3.5 text-right space-x-2">
                        <Link
                          to={`/admin/products/${prod.id}/edit`}
                          className="p-1.5 inline-block rounded-lg text-[#313851] hover:text-[#9C5550] hover:bg-[#F4ECE6] transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteModalItem(prod)}
                          className="p-1.5 rounded-lg text-[#786866] hover:text-[#B24A45] hover:bg-[#FDF2F1] transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262D42]/70 backdrop-blur-xs">
          <div className="max-w-md w-full bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 border border-[#D8C6C3] shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F1] text-[#B24A45] flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-2xl text-[#313851]">Delete Product?</h3>
            <p className="text-xs text-[#786866] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#313851]">"{deleteModalItem.name}"</strong>? 
              This will remove the product from customer searches, collections, and catalog pages.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalItem(null)}
                className="px-5 py-2.5 rounded-full bg-[#F6F3ED] text-[#313851] text-xs font-semibold hover:bg-[#EEE6DE]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-full bg-[#B24A45] text-[#FFFDFC] text-xs font-semibold hover:bg-[#963C38]"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
