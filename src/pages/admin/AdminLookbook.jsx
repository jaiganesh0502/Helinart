import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { lookbookService } from '../../services/lookbookService';
import { productService } from '../../services/productService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { Image as ImageIcon, Plus, Edit, Trash2, CheckCircle, X, Save, Upload, ExternalLink } from 'lucide-react';

export default function AdminLookbook() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [lbItemsRes, prodsRes] = await Promise.allSettled([
        lookbookService.getLookbookItems({ activeOnly: false }),
        productService.getProducts({ activeOnly: false })
      ]);
      if (lbItemsRes.status === 'fulfilled' && Array.isArray(lbItemsRes.value)) {
        setItems(lbItemsRes.value);
      }
      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value)) {
        setProducts(prodsRes.value);
      }
    } catch (err) {
      console.error('Failed to load lookbook', err);
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modalItem.id && items.some(i => i.id === modalItem.id)) {
        await lookbookService.updateLookbookItem(modalItem.id, modalItem);
        await auditService.logAction({
          action: 'LOOKBOOK_ITEM_UPDATED',
          entityType: 'lookbook',
          entityId: modalItem.id,
          details: { title: modalItem.title },
          adminUser: user
        });
        showToast(`Lookbook card "${modalItem.title}" updated.`);
      } else {
        await lookbookService.createLookbookItem(modalItem);
        await auditService.logAction({
          action: 'LOOKBOOK_ITEM_CREATED',
          entityType: 'lookbook',
          entityId: modalItem.id,
          details: { title: modalItem.title },
          adminUser: user
        });
        showToast(`Lookbook card "${modalItem.title}" created.`);
      }
      setModalItem(null);
      await loadData();
    } catch (err) {
      alert('Error saving lookbook item: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete lookbook item "${item.title}"?`)) return;
    try {
      await lookbookService.deleteLookbookItem(item.id);
      await auditService.logAction({
        action: 'LOOKBOOK_ITEM_DELETED',
        entityType: 'lookbook',
        entityId: item.id,
        details: { title: item.title },
        adminUser: user
      });
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast(`Lookbook item "${item.title}" removed.`);
    } catch (err) {
      alert('Failed to delete lookbook item: ' + err.message);
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await productService.uploadImage(file, 'lookbook');
        setModalItem(prev => ({ ...prev, image_url: url }));
      } catch (err) {
        alert('Upload failed: ' + err.message);
      }
    }
  };

  return (
    <AdminLayout title="Haute Lookbook CMS">
      <div className="space-y-6">
        
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[#EEF3EE] border border-[#B7DCB2] text-xs font-semibold text-[#43623E] flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl text-[#313851]">Editorial Lookbook Grid</h2>
            <p className="text-xs text-[#786866]">Manage the Instagram lookbook cards displayed on the customer home page</p>
          </div>
          <button
            onClick={() => setModalItem({
              title: '',
              subtitle: '',
              price_display: '₹1,199',
              image_url: '/images/design-sakura-chrome.jpg',
              product_id: '',
              instagram_caption: '@nailsbyhelina • Bridal Suite',
              sort_order: items.length + 1,
              is_active: true
            })}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lookbook Card</span>
          </button>
        </div>

        {/* Lookbook Cards Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#786866] mt-2">Loading lookbook items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div 
                key={item.id}
                className="rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 w-full bg-[#F4ECE6] overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-xs ${
                        item.is_active ? 'bg-[#EEF3EE] text-[#43623E]' : 'bg-[#FDF2F1] text-[#9C5550]'
                      }`}>
                        {item.is_active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-semibold text-[#313851]">{item.title}</h3>
                      <span className="font-bold text-[#262D42]">{item.price_display}</span>
                    </div>
                    <p className="text-[#786866]">{item.subtitle || '—'}</p>
                    <p className="text-[11px] font-mono text-[#9C5550]">{item.instagram_caption}</p>
                    {item.product_id && (
                      <p className="text-[11px] text-[#786866]">
                        Linked Product: <strong className="text-[#313851]">{item.product_id}</strong>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-[#D8C6C3]/60 flex items-center justify-between text-xs">
                  <span className="text-[#786866]">Order: #{item.sort_order ?? 0}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModalItem(item)}
                      className="p-1.5 rounded-lg text-[#313851] hover:text-[#9C5550] hover:bg-[#F4ECE6]"
                      title="Edit Lookbook"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg text-[#786866] hover:text-[#B24A45] hover:bg-[#FDF2F1]"
                      title="Delete Lookbook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add / Edit Lookbook Item Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262D42]/70 backdrop-blur-xs overflow-y-auto">
          <div className="max-w-md w-full bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 border border-[#D8C6C3] shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
              <h3 className="font-heading text-xl text-[#313851]">
                {modalItem.id ? 'Edit Lookbook Card' : 'New Lookbook Card'}
              </h3>
              <button onClick={() => setModalItem(null)} className="p-1 text-[#786866]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Card Title *
                </label>
                <input
                  type="text"
                  required
                  value={modalItem.title || ''}
                  onChange={(e) => setModalItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Sakura Velvet Chrome"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={modalItem.subtitle || ''}
                  onChange={(e) => setModalItem(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Bridal Suite Editorial"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Price Display
                  </label>
                  <input
                    type="text"
                    value={modalItem.price_display || ''}
                    onChange={(e) => setModalItem(prev => ({ ...prev, price_display: e.target.value }))}
                    placeholder="₹1,199"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={modalItem.sort_order ?? 1}
                    onChange={(e) => setModalItem(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  required
                  value={modalItem.image_url || ''}
                  onChange={(e) => setModalItem(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
                <label className="mt-1.5 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F4ECE6] border border-[#D8C6C3] text-[11px] font-medium text-[#793D39]">
                  <Upload className="w-3 h-3" />
                  <span>Upload Image File</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                </label>
              </div>

              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Link to Product (Optional)
                </label>
                <select
                  value={modalItem.product_id || ''}
                  onChange={(e) => setModalItem(prev => ({ ...prev, product_id: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                >
                  <option value="">-- No Direct Link --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Instagram Tag / Caption
                </label>
                <input
                  type="text"
                  value={modalItem.instagram_caption || ''}
                  onChange={(e) => setModalItem(prev => ({ ...prev, instagram_caption: e.target.value }))}
                  placeholder="@nailsbyhelina • Editorial Chic"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer font-semibold text-[#313851]">
                <input
                  type="checkbox"
                  checked={modalItem.is_active !== false}
                  onChange={(e) => setModalItem(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded text-[#9C5550]"
                />
                <span>Active in Published Lookbook</span>
              </label>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D8C6C3]/60">
                <button
                  type="button"
                  onClick={() => setModalItem(null)}
                  className="px-4 py-2 rounded-full bg-[#F6F3ED] text-[#313851] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-[#9C5550] text-[#FFFDFC] font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Lookbook'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
