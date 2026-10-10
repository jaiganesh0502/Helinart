import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_LOOKBOOK_KEY = 'helinart_db_lookbook_v1';

const defaultLookbook = [
  { id: 'lb-1', title: 'Sakura Velvet Chrome', subtitle: 'Bridal Suite Editorial', price_display: '₹1,199', image_url: '/images/design-sakura-chrome.jpg', product_id: 'sakura-chrome-luxe', instagram_caption: '@nailsbyhelina • Bridal Suite', sort_order: 1, is_active: true },
  { id: 'lb-2', title: 'Crystal Micro-French', subtitle: 'Minimal Luxury Accents', price_display: '₹1,299', image_url: '/images/design-crystal-french.jpg', product_id: 'crystal-micro-french', instagram_caption: '@nailsbyhelina • Editorial Chic', sort_order: 2, is_active: true },
  { id: 'lb-3', title: 'Vanilla Glaze French', subtitle: 'Everyday Couture Glow', price_display: '₹899', image_url: '/images/design-vanilla-glaze.jpg', product_id: 'vanilla-glaze-donut', instagram_caption: '@nailsbyhelina • Everyday Glow', sort_order: 3, is_active: true },
  { id: 'lb-4', title: 'Golden Empress Luxe', subtitle: '24K Gold Foil Embedding', price_display: '₹1,599', image_url: '/images/design-golden-empress.jpg', product_id: 'golden-empress-stiletto', instagram_caption: '@nailsbyhelina • 24K Gold Accent', sort_order: 4, is_active: true },
  { id: 'lb-5', title: 'Sculpted 3D Rose Petals', subtitle: 'Dimensional Gel Sculpture', price_display: '₹1,449', image_url: '/images/design-3d-floral.jpg', product_id: 'sculpted-3d-floral', instagram_caption: '@nailsbyhelina • Haute Couture', sort_order: 5, is_active: true },
  { id: 'lb-6', title: 'Midnight Navy Velvet', subtitle: 'Magnetic Aurora Finish', price_display: '₹1,099', image_url: '/images/design-navy-luxe.jpg', product_id: 'midnight-navy-aurora', instagram_caption: '@nailsbyhelina • Constellation', sort_order: 6, is_active: true }
];

function getLocalLookbook() {
  const stored = localStorage.getItem(LOCAL_LOOKBOOK_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(LOCAL_LOOKBOOK_KEY, JSON.stringify(defaultLookbook));
  return defaultLookbook;
}

export const lookbookService = {
  async getLookbookItems({ activeOnly = true } = {}) {
    if (isSupabaseConfigured) {
      let query = supabase.from('lookbook_items').select('*').order('sort_order', { ascending: true });
      if (activeOnly) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data) return data;
    }

    const items = getLocalLookbook();
    return activeOnly ? items.filter(i => i.is_active) : items;
  },

  async createLookbookItem(itemData) {
    const record = {
      id: 'lb-' + Date.now(),
      title: itemData.title,
      subtitle: itemData.subtitle || '',
      price_display: itemData.price_display || '',
      image_url: itemData.image_url || '/images/design-sakura-chrome.jpg',
      product_id: itemData.product_id || null,
      instagram_caption: itemData.instagram_caption || '@nailsbyhelina',
      sort_order: Number(itemData.sort_order) || 10,
      is_active: itemData.is_active !== false,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('lookbook_items').insert([record]).select().single();
      if (error) throw error;
      return data;
    }

    const list = getLocalLookbook();
    list.push(record);
    localStorage.setItem(LOCAL_LOOKBOOK_KEY, JSON.stringify(list));
    return record;
  },

  async updateLookbookItem(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('lookbook_items').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }

    const list = getLocalLookbook();
    const idx = list.findIndex(i => i.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem(LOCAL_LOOKBOOK_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  async deleteLookbookItem(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('lookbook_items').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const list = getLocalLookbook();
    const filtered = list.filter(i => i.id !== id);
    localStorage.setItem(LOCAL_LOOKBOOK_KEY, JSON.stringify(filtered));
    return true;
  }
};
