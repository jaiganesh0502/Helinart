import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_CART_KEY = 'helinart_cart_items_v1';

export const cartService = {
  /**
   * Get user's cart items
   */
  async getCart(userId) {
    if (isSupabaseConfigured && userId) {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          shape,
          size,
          quantity,
          products (*)
        `)
        .eq('user_id', userId);

      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          product: {
            ...item.products,
            image: item.products?.primary_image || item.products?.image
          },
          shape: item.shape,
          size: item.size,
          quantity: item.quantity
        }));
      }
    }

    try {
      return JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  /**
   * Add or update cart item
   */
  async addToCart(userId, { product, shape = 'Almond', size = 'M', quantity = 1 }) {
    if (isSupabaseConfigured && userId) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .eq('shape', shape)
        .eq('size', size)
        .maybeSingle();

      if (existing) {
        const newQty = existing.quantity + quantity;
        await supabase
          .from('cart_items')
          .update({ quantity: newQty, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase.from('cart_items').insert({
          user_id: userId,
          product_id: product.id,
          shape,
          size,
          quantity
        });
      }
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(userId, { productId, shape, size }) {
    if (isSupabaseConfigured && userId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('shape', shape)
        .eq('size', size);
    }
  },

  /**
   * Clear user's cart
   */
  async clearCart(userId) {
    if (isSupabaseConfigured && userId) {
      await supabase.from('cart_items').delete().eq('user_id', userId);
    }
  }
};
