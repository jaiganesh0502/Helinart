import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_FAVORITES_KEY = 'helinart_fav_ids_v1';

export const favoriteService = {
  /**
   * Get user's favorites
   */
  async getFavorites(userId) {
    if (isSupabaseConfigured && userId) {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          product_id,
          products (*)
        `)
        .eq('user_id', userId);

      if (!error && data) {
        return data.map(item => item.product_id);
      }
    }

    // Local Storage fallback
    try {
      return JSON.parse(localStorage.getItem(LOCAL_FAVORITES_KEY) || '["sakura-chrome-luxe", "vanilla-glaze-donut"]');
    } catch (e) {
      return [];
    }
  },

  /**
   * Toggle favorite
   */
  async toggleFavorite(userId, productId) {
    if (!productId) return false;

    if (isSupabaseConfigured && userId) {
      // Check if already favorite
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id);
        return false; // Removed
      } else {
        await supabase.from('favorites').insert({
          user_id: userId,
          product_id: productId
        });
        return true; // Added
      }
    }

    // Local Storage fallback
    let current = [];
    try {
      current = JSON.parse(localStorage.getItem(LOCAL_FAVORITES_KEY) || '[]');
    } catch (e) {}

    const isFav = current.includes(productId);
    const updated = isFav ? current.filter(id => id !== productId) : [...current, productId];
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(updated));
    return !isFav;
  }
};
