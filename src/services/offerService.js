import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_OFFERS_KEY = 'helinart_db_offers_v1';

const defaultOffers = [
  {
    id: 'welcome-10',
    title: 'Welcome to the Atelier',
    description: 'Enjoy 10% off your first handcrafted press-on set.',
    discount_type: 'percentage',
    discount_value: 10,
    promo_code: 'WELCOME10',
    min_order_value: 0,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'festive-15',
    title: 'Couture Celebration',
    description: '15% off orders over ₹1,999.',
    discount_type: 'percentage',
    discount_value: 15,
    promo_code: 'COUTURE15',
    min_order_value: 1999,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

function getLocalOffers() {
  const stored = localStorage.getItem(LOCAL_OFFERS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem(LOCAL_OFFERS_KEY, JSON.stringify(defaultOffers));
  return defaultOffers;
}

export const offerService = {
  async getOffers({ activeOnly = true } = {}) {
    if (isSupabaseConfigured) {
      let query = supabase.from('offers').select('*').order('created_at', { ascending: false });
      if (activeOnly) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (!error && data) return data;
    }

    const items = getLocalOffers();
    return activeOnly ? items.filter(o => o.is_active) : items;
  },

  async createOffer(offerData) {
    const record = {
      id: 'off-' + Date.now(),
      title: offerData.title,
      description: offerData.description || '',
      discount_type: offerData.discount_type || 'percentage',
      discount_value: Number(offerData.discount_value) || 10,
      promo_code: (offerData.promo_code || '').trim().toUpperCase(),
      min_order_value: Number(offerData.min_order_value) || 0,
      is_active: offerData.is_active !== false,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('offers').insert([record]).select().single();
      if (error) throw error;
      return data;
    }

    const list = getLocalOffers();
    list.unshift(record);
    localStorage.setItem(LOCAL_OFFERS_KEY, JSON.stringify(list));
    return record;
  },

  async updateOffer(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('offers').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }

    const list = getLocalOffers();
    const idx = list.findIndex(o => o.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem(LOCAL_OFFERS_KEY, JSON.stringify(list));
      return list[idx];
    }
    return null;
  },

  async deleteOffer(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const list = getLocalOffers();
    const filtered = list.filter(o => o.id !== id);
    localStorage.setItem(LOCAL_OFFERS_KEY, JSON.stringify(filtered));
    return true;
  }
};
