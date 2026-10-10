import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_ORDERS_KEY = 'helinart_db_orders_v1';

function getLocalOrders() {
  const stored = localStorage.getItem(LOCAL_ORDERS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  const initial = [
    {
      id: 'NH-98421',
      order_number: 'NH-98421',
      user_id: 'usr-cust-01',
      customer_name: 'Priya Sharma',
      customer_email: 'priya.sharma@example.com',
      customer_phone: '+91 98765 43210',
      status: 'shipped',
      subtotal: 2498,
      shipping_amount: 0,
      discount_amount: 250,
      total: 2248,
      payment_status: 'paid',
      payment_method: 'UPI (Google Pay)',
      shipping_address: {
        line1: 'Apartment 402, Lotus Residency',
        landmark: 'Near Central Park',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034'
      },
      items: [
        {
          id: 'item-1',
          product_id: 'sakura-chrome-luxe',
          product_name: 'Sakura Velvet Chrome',
          unit_price: 1199,
          quantity: 1,
          subtotal: 1199,
          shape: 'Almond',
          size: 'M',
          image_url: '/images/design-sakura-chrome.jpg'
        },
        {
          id: 'item-2',
          product_id: 'crystal-micro-french',
          product_name: 'Crystal Micro-French',
          unit_price: 1299,
          quantity: 1,
          subtotal: 1299,
          shape: 'Round',
          size: 'S',
          image_url: '/images/design-crystal-french.jpg'
        }
      ],
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'NH-98420',
      order_number: 'NH-98420',
      user_id: 'usr-cust-02',
      customer_name: 'Aanya Verma',
      customer_email: 'aanya.v@example.com',
      customer_phone: '+91 98123 45678',
      status: 'processing',
      subtotal: 1599,
      shipping_amount: 0,
      discount_amount: 0,
      total: 1599,
      payment_status: 'paid',
      payment_method: 'Credit Card',
      shipping_address: {
        line1: 'B-12, Palm Grove Enclave',
        landmark: 'Opposite Metro Station',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050'
      },
      items: [
        {
          id: 'item-3',
          product_id: 'golden-empress-stiletto',
          product_name: 'Golden Empress Luxe',
          unit_price: 1599,
          quantity: 1,
          subtotal: 1599,
          shape: 'Coffin',
          size: 'M',
          image_url: '/images/design-golden-empress.jpg'
        }
      ],
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    }
  ];
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(initial));
  return initial;
}

export const orderService = {
  /**
   * Get Orders: Admin gets all, customer gets only their own
   */
  async getOrders(userId, isAdmin = false) {
    if (isSupabaseConfigured) {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        if (!userId) return [];
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(o => ({
          ...o,
          items: o.order_items || []
        }));
      }
    }

    // Local Fallback
    const orders = getLocalOrders();
    if (isAdmin) return orders;
    return orders.filter(o => o.user_id === userId);
  },

  /**
   * Get single order by ID or order_number
   */
  async getOrderById(orderIdOrNumber, userId, isAdmin = false) {
    if (!orderIdOrNumber) return null;

    if (isSupabaseConfigured) {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .or(`id.eq.${orderIdOrNumber},order_number.eq.${orderIdOrNumber}`)
        .maybeSingle();

      const { data, error } = await query;
      if (!error && data) {
        if (!isAdmin && data.user_id && data.user_id !== userId) {
          throw new Error('Unauthorized access to this order.');
        }
        return {
          ...data,
          items: data.order_items || []
        };
      }
    }

    // Local Fallback
    const orders = getLocalOrders();
    const found = orders.find(o => o.id === orderIdOrNumber || o.order_number === orderIdOrNumber);
    if (!found) return null;
    if (!isAdmin && found.user_id && found.user_id !== userId) {
      throw new Error('Unauthorized access to this order.');
    }
    return found;
  },

  /**
   * Create New Order with Snapshot Items
   */
  async createOrder({
    userId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    subtotal,
    shippingAmount = 0,
    discountAmount = 0,
    total,
    items,
    paymentMethod = 'Online / UPI'
  }) {
    const orderNumber = 'NH-' + Math.floor(10000 + Math.random() * 90000);
    const orderId = orderNumber;

    const orderRecord = {
      id: orderId,
      order_number: orderNumber,
      user_id: userId || null,
      customer_name: customerName,
      customer_email: customerEmail || '',
      customer_phone: customerPhone,
      shipping_address: shippingAddress,
      subtotal: Number(subtotal),
      shipping_amount: Number(shippingAmount),
      discount_amount: Number(discountAmount),
      total: Number(total),
      status: 'pending',
      payment_status: 'paid',
      payment_method: paymentMethod,
      created_at: new Date().toISOString()
    };

    const itemRecords = items.map(item => ({
      order_id: orderId,
      product_id: item.product?.id || item.productId,
      product_name: item.product?.name || item.productName || 'Nail Set', // Snapshot
      unit_price: Number(item.product?.price || item.unitPrice || 0),     // Snapshot
      quantity: Number(item.quantity || 1),
      subtotal: Number((item.product?.price || item.unitPrice || 0) * (item.quantity || 1)),
      shape: item.shape || 'Almond',
      size: item.size || 'M',
      image_url: item.product?.primary_image || item.product?.image || item.imageUrl || '/images/design-sakura-chrome.jpg'
    }));

    if (isSupabaseConfigured) {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([orderRecord])
        .select()
        .single();
      if (orderErr) throw orderErr;

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(itemRecords);
      if (itemsErr) console.error('Order items insert error', itemsErr);

      return { ...orderData, items: itemRecords };
    }

    // Local Fallback
    const orders = getLocalOrders();
    const completeOrder = { ...orderRecord, items: itemRecords };
    orders.unshift(completeOrder);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return completeOrder;
  },

  /**
   * Admin: Update Order Status
   */
  async updateOrderStatus(orderId, status) {
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid order status: ${status}`);
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Local Fallback
    const orders = getLocalOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    orders[idx] = { ...orders[idx], status, updated_at: new Date().toISOString() };
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return orders[idx];
  }
};
