import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { categoryService } from '../../services/categoryService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { FolderTree, Plus, Edit, Trash2, CheckCircle, X, Save } from 'lucide-react';

export default function AdminCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCategory, setModalCategory] = useState(null); // null = closed, {} = new, {id,...} = edit
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories({ activeOnly: false });
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
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
      if (modalCategory.id && categories.some(c => c.id === modalCategory.id)) {
        await categoryService.updateCategory(modalCategory.id, modalCategory);
        await auditService.logAction({
          action: 'CATEGORY_UPDATED',
          entityType: 'category',
          entityId: modalCategory.id,
          details: { name: modalCategory.name },
          adminUser: user
        });
        showToast(`Category "${modalCategory.name}" updated.`);
      } else {
        await categoryService.createCategory(modalCategory);
        await auditService.logAction({
          action: 'CATEGORY_CREATED',
          entityType: 'category',
          entityId: modalCategory.slug || modalCategory.name,
          details: { name: modalCategory.name },
          adminUser: user
        });
        showToast(`Category "${modalCategory.name}" created.`);
      }
      setModalCategory(null);
      await loadData();
    } catch (err) {
      alert('Error saving category: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await categoryService.deleteCategory(cat.id);
      await auditService.logAction({
        action: 'CATEGORY_DELETED',
        entityType: 'category',
        entityId: cat.id,
        details: { name: cat.name },
        adminUser: user
      });
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      showToast(`Category "${cat.name}" deleted.`);
    } catch (err) {
      alert('Failed to delete category: ' + err.message);
    }
  };

  return (
    <AdminLayout title="Catalog Categories & Silhouettes">
      <div className="space-y-6">
        
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[#EEF3EE] border border-[#B7DCB2] text-xs font-semibold text-[#43623E] flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl text-[#313851]">Nail Categories & Shapes</h2>
            <p className="text-xs text-[#786866]">Organize press-on lines, silhouettes, and artistic styles</p>
          </div>
          <button
            onClick={() => setModalCategory({ name: '', slug: '', description: '', sort_order: categories.length + 1, is_active: true })}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#786866] mt-2">Loading categories...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8C6C3]/60 text-[#786866] uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Visual</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Slug</th>
                    <th className="pb-3">Badge Tag</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C6C3]/40">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F6F3ED]/40 transition-colors">
                      <td className="py-2.5">
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#F4ECE6] border border-[#D8C6C3] shrink-0">
                          {c.image_url ? (
                            <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#786866] font-bold">
                              {c.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-sm text-[#313851]">{c.name}</td>
                      <td className="py-3 font-mono text-[#786866]">{c.slug || c.id}</td>
                      <td className="py-3">
                        {c.tag ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F4ECE6] text-[#793D39] border border-[#D8C6C3]">
                            {c.tag}
                          </span>
                        ) : (
                          <span className="text-[#C2CBD3]">—</span>
                        )}
                      </td>
                      <td className="py-3 text-[#786866] max-w-xs truncate">{c.description || '—'}</td>
                      <td className="py-3 font-medium text-[#313851]">{c.sort_order ?? 0}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.is_active ? 'bg-[#EEF3EE] text-[#43623E]' : 'bg-[#FDF2F1] text-[#9C5550]'
                        }`}>
                          {c.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => setModalCategory(c)}
                          className="p-1.5 rounded-lg text-[#313851] hover:text-[#9C5550] hover:bg-[#F4ECE6]"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="p-1.5 rounded-lg text-[#786866] hover:text-[#B24A45] hover:bg-[#FDF2F1]"
                          title="Delete"
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

      {/* Add / Edit Category Modal */}
      {modalCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262D42]/70 backdrop-blur-xs">
          <div className="max-w-md w-full bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 border border-[#D8C6C3] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
              <h3 className="font-heading text-xl text-[#313851]">
                {modalCategory.id ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setModalCategory(null)} className="p-1 text-[#786866]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={modalCategory.name || ''}
                  onChange={(e) => setModalCategory(prev => ({
                    ...prev,
                    name: e.target.value,
                    slug: prev.id ? prev.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={modalCategory.slug || ''}
                  onChange={(e) => setModalCategory(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  placeholder="/images/design-sakura-chrome.jpg or Media Manager URL"
                  value={modalCategory.image_url || ''}
                  onChange={(e) => setModalCategory(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Badge Tag (e.g. Most Popular, Complete Set, New Drop)
                </label>
                <input
                  type="text"
                  placeholder="Most Popular"
                  value={modalCategory.tag || ''}
                  onChange={(e) => setModalCategory(prev => ({ ...prev, tag: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={modalCategory.description || ''}
                  onChange={(e) => setModalCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={modalCategory.sort_order ?? 0}
                    onChange={(e) => setModalCategory(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 mt-4 cursor-pointer font-semibold text-[#313851]">
                  <input
                    type="checkbox"
                    checked={modalCategory.is_active !== false}
                    onChange={(e) => setModalCategory(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded text-[#9C5550]"
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalCategory(null)}
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
                  <span>{saving ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
