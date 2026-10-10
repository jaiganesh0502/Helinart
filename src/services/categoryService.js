import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_CATEGORIES_KEY = 'helinart_db_categories_v1';

const defaultCategories = [
  { id: 'press-ons', name: 'Luxury Press-Ons', slug: 'press-ons', description: 'Handcrafted reusable sets with professional-quality adhesive tabs.', image_url: '/images/design-sakura-chrome.jpg', tag: 'Most Popular', sort_order: 1, is_active: true },
  { id: 'gel-kits', name: 'Studio Gel Kits', slug: 'gel-kits', description: 'DIY studio manicure kits with mini UV lamp & top coats.', image_url: '/images/service-gel.jpg', tag: 'Complete Set', sort_order: 2, is_active: true },
  { id: 'decals', name: 'Crystals & Decals', slug: 'decals', description: 'Swarovski rhinestones and metallic celestial stickers.', image_url: '/images/design-starburst-french.jpg', tag: 'Nail Accents', sort_order: 3, is_active: true },
  { id: 'care', name: 'Cuticle & Nail Care', slug: 'care', description: 'Organic botanical oils and keratin strengthening serums.', image_url: '/images/studio-art-craft.jpg', tag: 'Nail Health', sort_order: 4, is_active: true },
  { id: 'almond', name: 'Almond Shape', slug: 'almond', description: 'Elegant tapered oval nails designed for lengthening hands.', image_url: '/images/design-velvet-plum.jpg', tag: 'Signature Shape', sort_order: 5, is_active: true },
  { id: 'coffin', name: 'Coffin / Ballerina', slug: 'coffin', description: 'Tapered squared off tips with bold runway statement.', image_url: '/images/design-celestial-pearl.jpg', tag: 'Runway Look', sort_order: 6, is_active: true },
  { id: 'french', name: 'French & Glaze', slug: 'french', description: 'Ultra-chic minimalist tips and Hailey-inspired glazed donuts.', image_url: '/images/design-rose-quartz.jpg', tag: 'Trending', sort_order: 7, is_active: true }
];

function getLocalCategories() {
  const stored = localStorage.getItem(LOCAL_CATEGORIES_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(defaultCategories));
  return defaultCategories;
}

export const categoryService = {
  async getCategories({ activeOnly = true } = {}) {
    if (isSupabaseConfigured) {
      let query = supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (activeOnly) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data) return data;
    }
    const cats = getLocalCategories();
    return activeOnly ? cats.filter(c => c.is_active) : cats;
  },

  async createCategory(catData) {
    const slug = (catData.slug || catData.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const record = {
      id: slug,
      name: catData.name,
      slug,
      description: catData.description || '',
      image_url: catData.image_url || '',
      tag: catData.tag || '',
      sort_order: Number(catData.sort_order) || 10,
      is_active: catData.is_active !== false,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('categories').insert([record]).select().single();
      if (error) throw error;
      return data;
    }

    const list = getLocalCategories();
    list.push(record);
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(list));
    return record;
  },

  async updateCategory(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }

    const list = getLocalCategories();
    const idx = list.findIndex(c => c.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  async deleteCategory(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const list = getLocalCategories();
    const filtered = list.filter(c => c.id !== id);
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(filtered));
    return true;
  }
};
