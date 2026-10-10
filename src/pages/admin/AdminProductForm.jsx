import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Save, Upload, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: 'press-ons',
    price: '',
    compare_price: '',
    stock_quantity: 50,
    short_description: '',
    description: '',
    primary_image: '/images/design-sakura-chrome.jpg',
    shapes: 'Almond, Coffin, Square',
    colors: 'Dusty Rose, Silver Chrome',
    length: 'Medium',
    finish: 'Glossy Gel Chrome',
    collection: 'Atelier Signature',
    wear_duration: 'Up to 3 weeks',
    reusable_count: 'Up to 5x',
    is_active: true,
    is_featured: false,
    is_bestseller: false,
    is_new: false
  });

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const cats = await categoryService.getCategories({ activeOnly: false });
        if (mounted) setCategories(cats);

        if (isEditing) {
          const prod = await productService.getProductBySlug(id);
          if (mounted && prod) {
            setFormData({
              name: prod.name || '',
              slug: prod.slug || prod.id || '',
              category_id: prod.category_id || 'press-ons',
              price: prod.price || '',
              compare_price: prod.compare_price || '',
              stock_quantity: prod.stock_quantity ?? 50,
              short_description: prod.short_description || '',
              description: prod.description || '',
              primary_image: prod.primary_image || prod.image || '/images/design-sakura-chrome.jpg',
              shapes: Array.isArray(prod.shapes) ? prod.shapes.join(', ') : 'Almond, Coffin, Square',
              colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : 'Dusty Rose, Silver Chrome',
              length: prod.length || 'Medium',
              finish: prod.finish || 'Glossy Gel Chrome',
              collection: prod.collection || 'Atelier Signature',
              wear_duration: prod.wear_duration || 'Up to 3 weeks',
              reusable_count: prod.reusable_count || 'Up to 5x',
              is_active: prod.is_active !== false,
              is_featured: Boolean(prod.is_featured),
              is_bestseller: Boolean(prod.is_bestseller),
              is_new: Boolean(prod.is_new)
            });
          }
        }
      } catch (err) {
        console.error('Failed to load product form data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug when name changes in new product mode
    if (name === 'name' && !isEditing) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      }));
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await productService.uploadImage(file, 'products');
        setFormData(prev => ({ ...prev, primary_image: uploadedUrl }));
      } catch (err) {
        alert('Image upload failed: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Valid product price is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        compare_price: formData.compare_price ? Number(formData.compare_price) : null,
        stock_quantity: Number(formData.stock_quantity),
        shapes: formData.shapes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean)
      };

      if (isEditing) {
        await productService.updateProduct(id, payload);
        await auditService.logAction({
          action: 'PRODUCT_UPDATED',
          entityType: 'product',
          entityId: id,
          details: { name: payload.name, price: payload.price },
          adminUser: user
        });
      } else {
        await productService.createProduct(payload);
        await auditService.logAction({
          action: 'PRODUCT_CREATED',
          entityType: 'product',
          entityId: payload.slug,
          details: { name: payload.name, price: payload.price },
          adminUser: user
        });
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title={isEditing ? `Edit ${formData.name || 'Product'}` : 'Create New Nail Set'}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-4">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#786866] hover:text-[#9C5550]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
          <span className="text-xs text-[#786866]">
            {isEditing ? `Editing ID: ${id}` : 'New Catalog Entry'}
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-[#FDF2F1] border border-[#F5C2BF] text-xs text-[#9C5550] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#786866] mt-2">Loading product data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Primary Details Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-5">
              <h3 className="font-heading text-lg text-[#313851]">Essential Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sakura Velvet Chrome"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="sakura-chrome-luxe"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1199"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    name="compare_price"
                    value={formData.compare_price}
                    onChange={handleChange}
                    placeholder="1499"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Available Stock Sets *
                </label>
                <input
                  type="number"
                  min="0"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  className="w-full sm:w-48 px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Full Atelier Description
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe artistry, reflective layers, and application nuances..."
                  className="w-full px-4 py-3 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none focus:bg-[#FFFDFC] focus:border-[#9C5550]"
                />
              </div>
            </div>

            {/* Media & Image Upload */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-[#313851]">Product Showcase Imagery</h3>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={formData.primary_image}
                  alt="Preview"
                  className="w-24 h-24 rounded-2xl object-cover border border-[#D8C6C3] shrink-0"
                />
                <div className="space-y-2 flex-1 w-full">
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider">
                    Primary Image URL
                  </label>
                  <input
                    type="text"
                    name="primary_image"
                    value={formData.primary_image}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39] hover:bg-[#EEE6DE]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload to Supabase Storage</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                    </label>
                    <span className="text-[11px] text-[#786866]">JPG, PNG, WebP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nail-Specific Specifications */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-[#313851]">Nail Art Specifications</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Available Shapes (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="shapes"
                    value={formData.shapes}
                    onChange={handleChange}
                    placeholder="Almond, Coffin, Square"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Color Family (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    placeholder="Dusty Rose, Silver Chrome"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Length
                  </label>
                  <input
                    type="text"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="Medium"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Finish
                  </label>
                  <input
                    type="text"
                    name="finish"
                    value={formData.finish}
                    onChange={handleChange}
                    placeholder="Gel Chrome"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    name="collection"
                    value={formData.collection}
                    onChange={handleChange}
                    placeholder="Atelier Signature"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Visibility & Badges Toggles */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-[#313851]">Store Visibility & Badges</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="rounded text-[#9C5550]"
                  />
                  <span>Active in Store</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="rounded text-[#9C5550]"
                  />
                  <span>Featured Set</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_bestseller"
                    checked={formData.is_bestseller}
                    onChange={handleChange}
                    className="rounded text-[#9C5550]"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_new"
                    checked={formData.is_new}
                    onChange={handleChange}
                    className="rounded text-[#9C5550]"
                  />
                  <span>New Drop</span>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                to="/admin/products"
                className="px-6 py-3 rounded-full bg-[#F6F3ED] text-[#313851] text-xs font-semibold hover:bg-[#EEE6DE]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : (isEditing ? 'Save Product Changes' : 'Create Product')}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
}
