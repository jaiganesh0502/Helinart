import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { products as defaultProducts } from '../data/products.js';

const LOCAL_PRODUCTS_KEY = 'helinart_db_products_v1';

function getLocalProducts() {
  const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  // Initialize from existing catalog
  const mapped = defaultProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.id,
    category_id: (p.category || 'Press-ons').toLowerCase().replace(/\s+/g, '-'),
    category_name: p.category || 'Luxury Press-Ons',
    price: Number(p.price),
    compare_price: Math.round(Number(p.price) * 1.25),
    stock_quantity: 45,
    is_active: true,
    is_featured: Boolean(p.isBestSeller),
    is_bestseller: Boolean(p.isBestSeller),
    is_new: Boolean(p.isNew),
    rating: p.rating || 4.9,
    reviews_count: p.reviewsCount || 100,
    shapes: p.shapes || ['Almond', 'Coffin', 'Square'],
    colors: p.colors || ['Blush', 'Chrome'],
    length: 'Medium',
    finish: 'Gel Chrome',
    collection: 'Atelier Signature',
    wear_duration: 'Up to 3 weeks',
    reusable_count: 'Up to 5x',
    primary_image: p.image || '/images/design-sakura-chrome.jpg',
    description: p.description || '',
    short_description: p.description?.slice(0, 100) || '',
    created_at: new Date().toISOString()
  }));
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(mapped));
  return mapped;
}

export const productService = {
  /**
   * Fetch All Products (with filters)
   */
  async getProducts({ category, search, activeOnly = true, featuredOnly = false } = {}) {
    if (isSupabaseConfigured) {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories:category_id (id, name, slug)
        `)
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }
      if (category && category !== 'all') {
        query = query.eq('category_id', category);
      }
      if (search && search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(p => ({
          ...p,
          image: p.primary_image,
          category: p.categories?.name || p.category_id
        }));
      }
      console.warn('Supabase fetch products error, falling back to local', error);
    }

    // Local Fallback
    let items = getLocalProducts();
    if (activeOnly) {
      items = items.filter(p => p.is_active);
    }
    if (featuredOnly) {
      items = items.filter(p => p.is_featured);
    }
    if (category && category !== 'all') {
      const catSlug = category.toLowerCase().replace(/\s+/g, '-');
      items = items.filter(p => 
        p.category_id === catSlug || 
        (p.category_name && p.category_name.toLowerCase().includes(category.toLowerCase()))
      );
    }
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      items = items.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    return items.map(p => ({
      ...p,
      image: p.primary_image,
      category: p.category_name || p.category_id
    }));
  },

  /**
   * Fetch Single Product By Slug or ID
   */
  async getProductBySlug(slugOrId) {
    if (!slugOrId) return null;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (id, name, slug),
          product_images (*)
        `)
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          image: data.primary_image,
          category: data.categories?.name || data.category_id
        };
      }
    }

    // Local Fallback
    const products = getLocalProducts();
    const found = products.find(p => p.slug === slugOrId || p.id === slugOrId);
    if (found) {
      return {
        ...found,
        image: found.primary_image,
        category: found.category_name || found.category_id
      };
    }
    return null;
  },

  /**
   * Admin: Create Product
   */
  async createProduct(productData) {
    const slug = (productData.slug || productData.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const record = {
      id: slug,
      name: productData.name,
      slug,
      description: productData.description || '',
      short_description: productData.short_description || '',
      category_id: productData.category_id || 'press-ons',
      price: Number(productData.price) || 0,
      compare_price: productData.compare_price ? Number(productData.compare_price) : null,
      stock_quantity: Number(productData.stock_quantity) || 50,
      is_active: productData.is_active !== false,
      is_featured: Boolean(productData.is_featured),
      is_bestseller: Boolean(productData.is_bestseller),
      is_new: Boolean(productData.is_new),
      shape: Array.isArray(productData.shape) ? productData.shape : ['Almond', 'Coffin'],
      shapes: Array.isArray(productData.shapes) ? productData.shapes : ['Almond', 'Coffin'],
      colors: Array.isArray(productData.colors) ? productData.colors : ['Dusty Rose'],
      length: productData.length || 'Medium',
      finish: productData.finish || 'Gel Chrome',
      collection: productData.collection || 'Atelier Signature',
      wear_duration: productData.wear_duration || 'Up to 3 weeks',
      reusable_count: productData.reusable_count || 'Up to 5x',
      primary_image: productData.primary_image || productData.image || '/images/design-sakura-chrome.jpg',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .insert([record])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Local Fallback
    const list = getLocalProducts();
    list.unshift(record);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));
    return record;
  },

  /**
   * Admin: Update Product
   */
  async updateProduct(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Local Fallback
    const list = getLocalProducts();
    const idx = list.findIndex(p => p.id === id || p.slug === id);
    if (idx === -1) throw new Error('Product not found');
    list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));
    return list[idx];
  },

  /**
   * Admin: Delete Product
   */
  async deleteProduct(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    // Local Fallback
    const list = getLocalProducts();
    const filtered = list.filter(p => p.id !== id && p.slug !== id);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(filtered));
    return true;
  },

  /**
   * Admin: Upload Product Image to Supabase Storage
   */
  async uploadImage(file, folder = 'products') {
    if (isSupabaseConfigured && file) {
      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);
        return publicUrl;
      }
      console.warn('Storage upload error, using local object URL', error);
    }

    // Local fallback: return object URL or standard asset path
    return URL.createObjectURL(file);
  }
};
