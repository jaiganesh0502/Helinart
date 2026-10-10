import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { products as defaultProducts } from './src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------
// 1. Load Environment Variables from .env and .env.local
// -----------------------------------------------------------------------------
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}

loadEnvFile(path.join(__dirname, '.env'));
loadEnvFile(path.join(__dirname, '.env.local'));

const PORT = process.env.PORT || 5000;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://aybjrctkozoxhenahxhb.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_YGZCbAIqUXzIoUWcjOwHaw_eVe0a2gQ';

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const defaultCategories = [
  { id: 'press-ons', name: 'Luxury Press-Ons', slug: 'press-ons', description: 'Couture reusable nail tips' },
  { id: 'gel-kits', name: 'Gel Art & Polish Kits', slug: 'gel-kits', description: 'Studio lamp & pigment systems' },
  { id: 'decals', name: 'Crystals & Decals', slug: 'decals', description: 'Precision rhinestones & metal accents' },
  { id: 'care', name: 'Nail Health & Elixirs', slug: 'care', description: 'Botanical cuticle and keratin therapies' }
];

const defaultSettings = {
  id: 'global',
  brand_name: 'Nailsbyhelina',
  instagram_url: 'https://www.instagram.com/nails.by.helina/',
  instagram_handle: '@nails.by.helina',
  whatsapp_number: '+91 93614 05676',
  whatsapp_raw_number: '919361405676',
  support_email: 'concierge@nailsbyhelina.com',
  announcement_text: 'Complimentary express pan-India delivery on orders over ₹999 ✨',
  free_shipping_threshold: 999,
  currency: 'INR',
  studio_booking_enabled: false
};

const defaultStudioSettings = {
  id: 'studio_main',
  booking_enabled: false,
  available_days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  opening_time: '11:00 AM',
  closing_time: '07:30 PM',
  appointment_duration: 90,
  max_daily_bookings: 6,
  deposit_amount: 200
};

// In-memory fallback stores for orders and inquiries when database is pending migrations
const inMemoryOrders = [];
const inMemoryInquiries = [];

const mime = {
  'html': 'text/html; charset=utf-8',
  'css': 'text/css; charset=utf-8',
  'js': 'application/javascript; charset=utf-8',
  'json': 'application/json; charset=utf-8',
  'svg': 'image/svg+xml',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'webp': 'image/webp',
  'ico': 'image/x-icon',
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'woff': 'font/woff',
  'woff2': 'font/woff2',
  'otf': 'font/otf',
  'ttf': 'font/ttf'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// -----------------------------------------------------------------------------
// 2. HTTP Server & API Router
// -----------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info'
    });
    return res.end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // ---------------------------------------------------------------------------
  // API ROUTING (/api/*)
  // ---------------------------------------------------------------------------
  if (pathname.startsWith('/api')) {
    try {
      // 1. Health & Status
      if (pathname === '/api/health' && req.method === 'GET') {
        let dbStatus = 'connected';
        let schemaReady = false;
        let errorMessage = null;

        try {
          const { error, status } = await supabase.from('products').select('id').limit(1);
          if (error) {
            schemaReady = false;
            errorMessage = error.message;
          } else {
            schemaReady = true;
          }
        } catch (e) {
          dbStatus = 'unreachable';
          errorMessage = e.message;
        }

        return sendJson(res, 200, {
          status: 'ok',
          service: 'Nailsbyhelina Full-Stack Backend API',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          supabase: {
            configured: Boolean(SUPABASE_URL && SUPABASE_KEY),
            url: SUPABASE_URL,
            connection: dbStatus,
            tablesProvisioned: schemaReady,
            note: schemaReady 
              ? 'Database tables active' 
              : 'Database reachable; apply supabase/schema.sql in Supabase Dashboard SQL Editor for live PostgreSQL tables'
          }
        });
      }

      // 2. Products List
      if (pathname === '/api/products' && req.method === 'GET') {
        const category = urlObj.searchParams.get('category');
        const search = urlObj.searchParams.get('search');
        
        // Try Supabase first
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          let list = data;
          if (category && category !== 'all' && category !== 'All') {
            list = list.filter(p => p.category_id === category || p.category_name === category);
          }
          if (search) {
            const q = search.toLowerCase();
            list = list.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
          }
          return sendJson(res, 200, { source: 'supabase', products: list });
        }

        // Fallback to static catalog
        let list = [...defaultProducts];
        if (category && category !== 'all' && category !== 'All') {
          list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
        }
        if (search) {
          const q = search.toLowerCase();
          list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
        }
        return sendJson(res, 200, { source: 'catalog-fallback', products: list });
      }

      // 3. Single Product
      if (pathname.startsWith('/api/products/') && req.method === 'GET') {
        const idOrSlug = pathname.replace('/api/products/', '').trim();
        const { data, error } = await supabase.from('products').select('*').or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`).maybeSingle();
        if (!error && data) {
          return sendJson(res, 200, { source: 'supabase', product: data });
        }
        const found = defaultProducts.find(p => p.id === idOrSlug || p.name.toLowerCase().replace(/\s+/g, '-') === idOrSlug);
        if (found) {
          return sendJson(res, 200, { source: 'catalog-fallback', product: found });
        }
        return sendJson(res, 404, { error: 'Product not found' });
      }

      // 4. Categories
      if (pathname === '/api/categories' && req.method === 'GET') {
        const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return sendJson(res, 200, { source: 'supabase', categories: data });
        }
        return sendJson(res, 200, { source: 'catalog-fallback', categories: defaultCategories });
      }

      // 5. Settings
      if (pathname === '/api/settings') {
        if (req.method === 'GET') {
          const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'global').maybeSingle();
          if (!error && data) {
            return sendJson(res, 200, { settings: data });
          }
          return sendJson(res, 200, { settings: defaultSettings });
        }

        if (req.method === 'POST' || req.method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = { ...defaultSettings, ...body, id: 'global', updated_at: new Date().toISOString() };
          try {
            await supabase.from('site_settings').upsert(updated);
          } catch (e) {
            // ignore if table not yet created
          }
          return sendJson(res, 200, { success: true, settings: updated });
        }
      }

      // 6. Orders
      if (pathname === '/api/orders') {
        if (req.method === 'GET') {
          const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
          if (!error && data) {
            return sendJson(res, 200, { orders: data });
          }
          return sendJson(res, 200, { orders: inMemoryOrders });
        }

        if (req.method === 'POST') {
          const body = await parseJsonBody(req);
          const orderNumber = 'NH-' + Math.floor(10000 + Math.random() * 90000);
          const newOrder = {
            id: orderNumber,
            order_number: orderNumber,
            created_at: new Date().toISOString(),
            status: 'confirmed',
            subtotal: Number(body.subtotal) || 0,
            shipping_amount: Number(body.shippingAmount) || 0,
            discount_amount: Number(body.discountAmount) || 0,
            total: Number(body.total) || 0,
            customer_name: body.customerName || 'Customer',
            customer_email: body.customerEmail || '',
            customer_phone: body.customerPhone || '',
            shipping_address: body.shippingAddress || {},
            payment_method: body.paymentMethod || 'UPI / Card',
            items: body.items || []
          };

          try {
            await supabase.from('orders').insert({
              id: newOrder.id,
              order_number: newOrder.order_number,
              customer_name: newOrder.customer_name,
              customer_email: newOrder.customer_email,
              customer_phone: newOrder.customer_phone,
              shipping_address: newOrder.shipping_address,
              subtotal: newOrder.subtotal,
              shipping_amount: newOrder.shipping_amount,
              discount_amount: newOrder.discount_amount,
              total: newOrder.total,
              status: 'confirmed'
            });
          } catch (e) {
            // DB table pending, store in memory
          }

          inMemoryOrders.unshift(newOrder);
          return sendJson(res, 201, { success: true, order: newOrder });
        }
      }

      // 7. Track Order by Number
      if (pathname.startsWith('/api/orders/') && req.method === 'GET') {
        const orderNumber = pathname.replace('/api/orders/', '').trim().toUpperCase();
        const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('order_number', orderNumber).maybeSingle();
        if (!error && data) {
          return sendJson(res, 200, { order: data });
        }
        const memoryMatch = inMemoryOrders.find(o => o.order_number.toUpperCase() === orderNumber);
        if (memoryMatch) {
          return sendJson(res, 200, { order: memoryMatch });
        }
        return sendJson(res, 404, { error: 'Order not found' });
      }

      // 8. Contact Form Submissions
      if (pathname === '/api/contact' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.name || !body.email || !body.message) {
          return sendJson(res, 400, { error: 'Name, email, and message are required.' });
        }
        const inquiry = {
          id: 'inq-' + Date.now(),
          ...body,
          created_at: new Date().toISOString()
        };
        inMemoryInquiries.unshift(inquiry);
        console.log(`[Contact Form Received] From: ${body.name} (${body.email}) - Subject: ${body.category || 'General'}`);
        return sendJson(res, 200, { success: true, message: 'Your message has been received! We will reply within 24 hours.' });
      }

      // 9. Newsletter Subscriptions
      if (pathname === '/api/newsletter' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.email || !body.email.includes('@')) {
          return sendJson(res, 400, { error: 'Valid email is required.' });
        }
        return sendJson(res, 200, { success: true, message: 'Subscribed to Atelier Gazette! Check your inbox for your 10% welcome gift.' });
      }

      // Unknown API route
      return sendJson(res, 404, { error: `Endpoint ${pathname} not found on backend API` });
    } catch (apiErr) {
      console.error('[Backend API Error]', apiErr);
      return sendJson(res, 500, { error: apiErr.message || 'Internal Server Error' });
    }
  }

  // ---------------------------------------------------------------------------
  // STATIC ASSET SERVING (Production Build from /dist or Project Root)
  // ---------------------------------------------------------------------------
  let reqPath = decodeURIComponent(pathname);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(__dirname, 'dist', reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, reqPath);
  }

  // Security check: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const contentType = mime[ext] || 'application/octet-stream';
    const range = req.headers.range;

    if (range && (ext === 'mp4' || ext === 'webm')) {
      const parts = range.replace(/bytes=/, '').split('-');
      let start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      if (isNaN(start)) start = stat.size - parseInt(parts[1], 10);
      if (isNaN(end) || end >= stat.size) end = stat.size - 1;
      if (start < 0) start = 0;

      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType
      });
      return fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes'
      });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  // SPA Fallback: if not an asset, serve dist/index.html or index.html
  const spaIndex = fs.existsSync(path.join(__dirname, 'dist', 'index.html'))
    ? path.join(__dirname, 'dist', 'index.html')
    : path.join(__dirname, 'index.html');

  if (fs.existsSync(spaIndex)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(spaIndex).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Please free port ${PORT} or configure a different PORT.`);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Nailsbyhelina Full-Stack Backend API Server Active    `);
  console.log(`  Local Endpoint:  http://localhost:${PORT}             `);
  console.log(`  API Health:      http://localhost:${PORT}/api/health  `);
  console.log(`  Supabase URL:    ${SUPABASE_URL}                      `);
  console.log(`=======================================================`);
});
