import { products, initialProductReviews } from '../data/products.js';
import { services, slotTimes } from '../data/services.js';

const STORAGE_KEYS = {
  FAVORITES: 'helinart_favorites_v1',
  CART: 'helinart_cart_v1',
  BOOKINGS: 'helinart_bookings_v1',
  ORDERS: 'helinart_orders_v1',
  REVIEWS: 'helinart_reviews_v1',
  CUSTOM_ORDERS: 'helinart_custom_orders_v1',
  USER: 'helinart_user_v1'
};

// Seed initial bookings & reviews & demo order
function seedInitialData() {
  // 1. Bookings
  const existingBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  if (!existingBookings) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const initial = [
      {
        id: 'bk-mock-1',
        date: today,
        time: '11:00 AM',
        serviceId: 'gel-manicure',
        serviceName: 'Gel Manicure',
        price: 900,
        userName: 'Priya Sharma',
        phone: '9876543210',
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      },
      {
        id: 'bk-mock-2',
        date: today,
        time: '03:00 PM',
        serviceId: 'custom-nail-art',
        serviceName: 'Custom Nail Art',
        price: 1500,
        userName: 'Aanya Verma',
        phone: '9812345678',
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      },
      {
        id: 'bk-mock-3',
        date: tomorrow,
        time: '02:00 PM',
        serviceId: 'extensions',
        serviceName: 'Sculpted Extensions',
        price: 2200,
        userName: 'Rhea Sen',
        phone: '9789012345',
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initial));
  }

  // 2. Reviews
  const existingReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  if (!existingReviews) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialProductReviews));
  }

  // 3. Demo Order for instant tracking verification
  const existingOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!existingOrders) {
    const demoOrder = [
      {
        orderNumber: 'HLN-582914',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'Shipped',
        currentStep: 3, // 1: Placed, 2: Packed, 3: Shipped, 4: Out for delivery, 5: Delivered
        carrier: 'Blue Dart Express',
        awb: 'BD89201948IN',
        estimatedDelivery: 'Tomorrow by 6:00 PM',
        customer: {
          name: 'Aishwarya Raman',
          email: 'aishwarya.r@example.com',
          phone: '+91 98450 12345',
          address: '42 Orchid Villa, 12th Main Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038'
        },
        items: [
          {
            product: products[0],
            shape: 'Almond',
            size: 'M',
            quantity: 1
          },
          {
            product: products[1],
            shape: 'Round',
            size: 'S',
            quantity: 1
          }
        ],
        subtotal: 2498,
        discount: 250,
        couponCode: 'WELCOME10',
        shipping: 0,
        total: 2248,
        paymentMethod: 'UPI (Google Pay)',
        timeline: [
          { status: 'Order Placed', time: '2 days ago, 11:20 AM', completed: true },
          { status: 'Handcrafted & Packed', time: 'Yesterday, 3:45 PM', completed: true },
          { status: 'Dispatched via Express Courier', time: 'Today, 9:15 AM', completed: true },
          { status: 'Out for Delivery', time: 'Tomorrow morning', completed: false },
          { status: 'Delivered', time: 'Expected tomorrow 6:00 PM', completed: false }
        ]
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(demoOrder));
  }
}

seedInitialData();

import { productService } from '../services/productService.js';
import { apiClient } from './client.js';

export { apiClient };

const delay = (ms = 90) => new Promise(res => setTimeout(res, ms));

/**
 * Fetch all products with optional filtering and sorting (Database & Supabase backed)
 */
export async function getProducts({ category = 'All', search = '', sortBy = 'featured' } = {}) {
  await delay(60);
  let result = [];
  try {
    result = await productService.getProducts({ activeOnly: true });
  } catch (err) {
    console.warn('Could not fetch from productService, using static catalog', err);
    result = [...products];
  }

  if (!result || result.length === 0) {
    result = [...products];
  }

  // Category filter
  if (category && category !== 'All') {
    result = result.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  }

  // Search filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(p => 
      (p.name || '').toLowerCase().includes(q) || 
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sortBy === 'price-low') {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === 'price-high') {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === 'rating') {
    result.sort((a, b) => Number(b.rating) - Number(a.rating));
  } else if (sortBy === 'newest') {
    result.sort((a, b) => (b.isNew || b.is_new ? 1 : 0) - (a.isNew || a.is_new ? 1 : 0));
  }

  return result;
}

/**
 * Get product by ID or Slug
 */
export async function getProductById(id) {
  await delay(50);
  try {
    const dynamicProduct = await productService.getProductBySlug(id);
    if (dynamicProduct) return dynamicProduct;
  } catch (err) {
    console.warn('Could not fetch product dynamically', err);
  }

  const found = products.find(p => p.id === id || p.slug === id);
  if (!found) throw new Error(`Product with ID "${id}" not found.`);
  return found;
}

/**
 * REVIEWS SYSTEM (with LocalStorage persistence)
 */
export async function getProductReviews(productId) {
  await delay(60);
  const allReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');
  return allReviews[productId] || initialProductReviews[productId] || [
    {
      id: `rev-default-1`,
      author: 'Aarohi S.',
      rating: 5,
      date: '2026-09-10',
      verified: true,
      comment: 'Exceptionally crafted set. Seamless cuticle edge that blends with natural nails.',
      customerPhoto: null
    },
    {
      id: `rev-default-2`,
      author: 'Sunaina M.',
      rating: 5,
      date: '2026-08-28',
      verified: true,
      comment: 'Arrived packaged in a velvet box with full adhesive tabs and wooden pusher stick. 10/10.',
      customerPhoto: null
    }
  ];
}

export async function addProductReview(productId, reviewData) {
  await delay(120);
  const allReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');
  const current = allReviews[productId] || initialProductReviews[productId] || [];
  
  const newReview = {
    id: `rev-${Date.now().toString(36)}`,
    author: reviewData.author.trim() || 'Anonymous Connoisseur',
    rating: Number(reviewData.rating) || 5,
    date: new Date().toISOString().split('T')[0],
    verified: true,
    comment: reviewData.comment.trim(),
    customerPhoto: reviewData.customerPhoto || null
  };

  const updated = [newReview, ...current];
  allReviews[productId] = updated;
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));
  return newReview;
}

/**
 * PINCODE DELIVERY VALIDATOR
 */
export async function checkPincodeDelivery(pincode) {
  await delay(150);
  const pin = (pincode || '').trim();
  
  if (!/^\d{6}$/.test(pin)) {
    return {
      serviceable: false,
      message: 'Please enter a valid 6-digit Indian postal code.'
    };
  }

  // Bengaluru pincodes (starting with 56)
  if (pin.startsWith('56')) {
    return {
      serviceable: true,
      city: 'Bengaluru Atelier Local Express',
      estimate: 'Delivers in 24 to 48 hours',
      carrier: 'Same-Day Atelier Courier',
      freeShippingThreshold: 999,
      codAvailable: true
    };
  }

  // Metro hubs (Delhi, Mumbai, Chennai, Kolkata, Hyderabad, Pune)
  const metroPrefixes = ['11', '40', '60', '70', '50', '41'];
  if (metroPrefixes.some(pref => pin.startsWith(pref))) {
    return {
      serviceable: true,
      city: 'Metro City Express',
      estimate: 'Delivers in 2 to 3 business days',
      carrier: 'Blue Dart Air Express',
      freeShippingThreshold: 999,
      codAvailable: true
    };
  }

  // Non-serviceable test code: 000000 or 999999
  if (pin === '000000' || pin === '999999') {
    return {
      serviceable: false,
      message: 'Pincode currently outside courier coverage area.'
    };
  }

  // Standard India Post / Bluedart delivery
  return {
    serviceable: true,
    city: 'Rest of India Express',
    estimate: 'Delivers in 3 to 5 business days',
    carrier: 'Blue Dart Surface / DTDC',
    freeShippingThreshold: 999,
    codAvailable: true
  };
}

/**
 * CUSTOM ORDER INQUIRY SYSTEM
 */
export async function createCustomOrder(orderData) {
  await delay(140);
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_ORDERS) || '[]');
  const referenceId = `CST-${Math.floor(100000 + Math.random() * 900000)}`;

  const newCustomOrder = {
    referenceId,
    createdAt: new Date().toISOString(),
    status: 'In Review with Master Artist',
    ...orderData
  };

  stored.unshift(newCustomOrder);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify(stored));
  return newCustomOrder;
}

export async function getCustomOrders() {
  await delay(80);
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_ORDERS) || '[]');
}

/**
 * SERVICES & APPOINTMENTS
 */
export async function getServices() {
  await delay(60);
  return services;
}

export async function getSlotAvailability(dateString) {
  await delay(80);
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  const bookedForDate = stored
    .filter(b => b.date === dateString && b.status !== 'Cancelled')
    .map(b => b.time);

  return slotTimes.map(time => ({
    time,
    isAvailable: !bookedForDate.includes(time)
  }));
}

export async function bookSlot({ date, time, serviceId, userName, phone }) {
  await delay(120);
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');

  const isTaken = stored.some(b => b.date === date && b.time === time && b.status !== 'Cancelled');
  if (isTaken) {
    throw new Error(`The slot on ${date} at ${time} is already booked. Please choose another time.`);
  }

  const service = services.find(s => s.id === serviceId) || { name: 'Studio Service', price: 900 };

  const newBooking = {
    id: `BK-${Date.now().toString(36).toUpperCase()}`,
    date,
    time,
    serviceId,
    serviceName: service.name,
    price: service.price,
    userName,
    phone,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  stored.unshift(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(stored));
  return newBooking;
}

export async function cancelBooking(bookingId) {
  await delay(100);
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  const updated = stored.map(b => {
    if (b.id === bookingId) {
      return { ...b, status: 'Cancelled' };
    }
    return b;
  });
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  return true;
}

export async function rescheduleBooking({ bookingId, newDate, newTime }) {
  await delay(120);
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  
  // Verify new date & time slot is available
  const isTaken = stored.some(
    b => b.id !== bookingId && b.date === newDate && b.time === newTime && b.status !== 'Cancelled'
  );
  if (isTaken) {
    throw new Error(`The slot on ${newDate} at ${newTime} is already booked. Please choose another time.`);
  }

  let updatedBooking = null;
  const updated = stored.map(b => {
    if (b.id === bookingId) {
      updatedBooking = {
        ...b,
        date: newDate,
        time: newTime,
        status: 'Confirmed',
        rescheduledAt: new Date().toISOString()
      };
      return updatedBooking;
    }
    return b;
  });

  if (!updatedBooking) throw new Error('Booking not found');
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  return updatedBooking;
}

export async function getMyBookings() {
  await delay(80);
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
}

/**
 * ORDERS & TRACKING
 */
export async function createOrder({ 
  items, 
  customer, 
  paymentMethod, 
  subtotal, 
  discount = 0, 
  couponCode = null, 
  shipping, 
  total 
}) {
  await delay(150);
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const orderNumber = `HLN-${Math.floor(100000 + Math.random() * 900000)}`;

  const newOrder = {
    orderNumber,
    createdAt: new Date().toISOString(),
    status: 'Placed',
    currentStep: 1, // 1: Placed, 2: Packed, 3: Shipped, 4: Out for Delivery, 5: Delivered
    carrier: 'Blue Dart Air Express',
    awb: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
    estimatedDelivery: '3 to 4 business days',
    items,
    customer,
    paymentMethod,
    subtotal,
    discount,
    couponCode,
    shipping,
    total,
    timeline: [
      { status: 'Order Placed & Payment Verified', time: 'Just now', completed: true },
      { status: 'Atelier Artisan Handcrafting & Inspection', time: 'Estimated within 24 hrs', completed: false },
      { status: 'Packed in Luxury Gift Keepsake Box', time: 'Estimated tomorrow', completed: false },
      { status: 'Dispatched with Blue Dart Courier', time: 'Pending fulfillment', completed: false },
      { status: 'Delivered to Doorstep', time: 'Estimated in 3-4 days', completed: false }
    ]
  };

  orders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  // Sync with Backend API asynchronously
  try {
    apiClient.createOrder(newOrder).catch(() => {});
  } catch (e) {
    // ignore
  }

  return newOrder;
}

export async function getOrders() {
  await delay(60);
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
}

export async function getOrderByNumber(orderNumber) {
  await delay(100);
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const match = orders.find(o => o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase());
  if (match) return match;

  // Check Backend API for order
  try {
    const remoteOrder = await apiClient.trackOrder(orderNumber);
    if (remoteOrder) return remoteOrder;
  } catch (e) {
    // ignore
  }
  
  // If not found in localStorage, check if it's the demo code
  if (orderNumber.trim().toUpperCase() === 'HLN-582914') {
    seedInitialData();
    const refreshed = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    return refreshed.find(o => o.orderNumber === 'HLN-582914');
  }

  return null;
}

/**
 * USER PROFILE
 */
export async function getUserProfile() {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
}

export async function saveUserProfile(user) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
}
