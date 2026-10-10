import { create } from 'zustand';

const FAVORITES_KEY = 'helinart_fav_ids_v1';
const CART_KEY = 'helinart_cart_items_v1';
const USER_KEY = 'helinart_current_user_v1';
const RECENTLY_VIEWED_KEY = 'helinart_recently_viewed_v1';
const COUPON_KEY = 'helinart_applied_coupon_v1';
const STOCK_NOTIFICATIONS_KEY = 'helinart_stock_notifications_v1';
const NEWSLETTER_KEY = 'helinart_newsletter_subs_v1';

export const useStore = create((set, get) => ({
  // ---------------------------------------------------------------------------
  // 1. FAVORITES STATE
  // ---------------------------------------------------------------------------
  favorites: JSON.parse(localStorage.getItem(FAVORITES_KEY) || '["sakura-chrome-luxe", "vanilla-glaze-donut"]'),

  toggleFavorite: (productId, productName = 'Design') => {
    const current = get().favorites;
    const isFav = current.includes(productId);
    const updated = isFav 
      ? current.filter(id => id !== productId)
      : [...current, productId];

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    set({ favorites: updated });

    if (!isFav) {
      get().addToast(`Added "${productName}" to favorites! ✨`, 'success');
    } else {
      get().addToast(`Removed "${productName}" from favorites.`, 'info');
    }
  },

  isFavorite: (productId) => {
    return get().favorites.includes(productId);
  },

  clearFavorites: () => {
    localStorage.removeItem(FAVORITES_KEY);
    set({ favorites: [] });
    get().addToast('Cleared all favorites.', 'info');
  },

  // ---------------------------------------------------------------------------
  // 2. CART STATE & COUPONS
  // ---------------------------------------------------------------------------
  cart: JSON.parse(localStorage.getItem(CART_KEY) || '[]'),
  appliedCoupon: JSON.parse(localStorage.getItem(COUPON_KEY) || 'null'),

  addToCart: (product, options = { shape: 'Almond', size: 'M', quantity: 1 }) => {
    const cart = get().cart;
    const shape = options.shape || (product.shapes ? product.shapes[0] : 'Universal');
    const size = options.size || 'M';
    const quantity = options.quantity || 1;

    // Check if same item with same variant already in cart
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.shape === shape && item.size === size
    );

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) => {
        if (idx === existingIndex) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      });
    } else {
      updatedCart = [...cart, { product, shape, size, quantity }];
    }

    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    set({ cart: updatedCart });
    get().addToast(`Added ${quantity}x "${product.name}" (${shape}, ${size}) to cart! 🛍️`, 'success');
  },

  updateCartQuantity: (index, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeFromCart(index);
      return;
    }
    const updated = get().cart.map((item, idx) => 
      idx === index ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
    set({ cart: updated });
  },

  removeFromCart: (index) => {
    const item = get().cart[index];
    const updated = get().cart.filter((_, idx) => idx !== index);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
    set({ cart: updated });
    if (item) {
      get().addToast(`Removed "${item.product.name}" from cart.`, 'info');
    }
  },

  clearCart: () => {
    localStorage.removeItem(CART_KEY);
    set({ cart: [] });
  },

  applyCoupon: (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (trimmed === 'WELCOME10') {
      const couponObj = { code: 'WELCOME10', discountPercent: 10, description: '10% Welcome Discount' };
      localStorage.setItem(COUPON_KEY, JSON.stringify(couponObj));
      set({ appliedCoupon: couponObj });
      get().addToast('Coupon "WELCOME10" applied! You saved 10%. 🎉', 'success');
      return { success: true, message: 'Coupon applied successfully!' };
    } else {
      get().addToast('Invalid coupon code. Try using "WELCOME10".', 'error');
      return { success: false, message: 'Invalid code. Try "WELCOME10" for 10% off.' };
    }
  },

  removeCoupon: () => {
    localStorage.removeItem(COUPON_KEY);
    set({ appliedCoupon: null });
    get().addToast('Coupon removed.', 'info');
  },

  // Cart Totals Calculator with Dynamic Coupon & Shipping
  getCartSummary: () => {
    const cart = get().cart;
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Coupon discount calculation
    const coupon = get().appliedCoupon;
    const discount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
    const discountedSubtotal = Math.max(0, subtotal - discount);

    const shippingThreshold = 999;
    const shipping = subtotal === 0 ? 0 : (discountedSubtotal >= shippingThreshold ? 0 : 99);
    const total = discountedSubtotal + shipping;
    const itemsCount = cart.reduce((count, item) => count + item.quantity, 0);

    return {
      subtotal,
      discount,
      discountedSubtotal,
      shipping,
      total,
      itemsCount,
      appliedCoupon: coupon,
      freeShippingQualified: discountedSubtotal >= shippingThreshold,
      amountNeededForFreeShipping: Math.max(0, shippingThreshold - discountedSubtotal)
    };
  },

  // ---------------------------------------------------------------------------
  // 3. RECENTLY VIEWED PRODUCTS
  // ---------------------------------------------------------------------------
  recentlyViewed: JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]'),

  addRecentlyViewed: (productId) => {
    const current = get().recentlyViewed;
    const filtered = current.filter(id => id !== productId);
    const updated = [productId, ...filtered].slice(0, 8); // Keep last 8 unique items
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    set({ recentlyViewed: updated });
  },

  // ---------------------------------------------------------------------------
  // 4. OUT OF STOCK NOTIFICATIONS
  // ---------------------------------------------------------------------------
  stockNotifications: JSON.parse(localStorage.getItem(STOCK_NOTIFICATIONS_KEY) || '[]'),

  requestStockNotification: (productId, productName, email) => {
    const existing = get().stockNotifications;
    const record = {
      productId,
      productName,
      email: email.trim(),
      date: new Date().toISOString()
    };
    const updated = [record, ...existing];
    localStorage.setItem(STOCK_NOTIFICATIONS_KEY, JSON.stringify(updated));
    set({ stockNotifications: updated });
    get().addToast(`We will email ${email} the moment "${productName}" rests in stock! 💌`, 'success');
    return true;
  },

  // ---------------------------------------------------------------------------
  // 5. NEWSLETTER SUBSCRIPTION
  // ---------------------------------------------------------------------------
  newsletterSubscribers: JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || '[]'),

  subscribeNewsletter: (email) => {
    const trimmed = (email || '').trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      get().addToast('Please enter a valid email address.', 'error');
      return false;
    }
    const current = get().newsletterSubscribers;
    if (current.some(sub => sub.email === trimmed)) {
      get().addToast('You are already subscribed to the Atelier Gazette! ✨', 'info');
      return true;
    }
    const updated = [...current, { email: trimmed, date: new Date().toISOString() }];
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(updated));
    set({ newsletterSubscribers: updated });
    get().addToast('Subscribed! Check your inbox for your 10% welcome gift. 💌', 'success');
    return true;
  },

  // ---------------------------------------------------------------------------
  // 6. TOAST NOTIFICATIONS
  // ---------------------------------------------------------------------------
  toasts: [],

  addToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    set(state => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, duration);
  },

  removeToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  },

  // ---------------------------------------------------------------------------
  // 7. USER PROFILE STATE
  // ---------------------------------------------------------------------------
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),

  setUser: (userData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    set({ user: userData });
    get().addToast(`Welcome back, ${userData.name}!`, 'success');
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
    set({ user: null });
    get().addToast('Logged out successfully.', 'info');
  }
}));
