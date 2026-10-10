# Nailsbyhelina — Luxury Nail Art Studio & Handcrafted Press-Ons

A luxury beauty e-commerce web application and handcrafted press-on nail boutique for **Nailsbyhelina**. Built with **React**, **Vite**, **Tailwind CSS**, **React Router v6**, and **Zustand**.

The application operates as a full-featured frontend web app with zero backend dependencies, utilizing an isolated API abstraction layer with mock catalogs and browser `localStorage` persistence.

---

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The site will be live at `http://localhost:5173`.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🗺️ Application Routes Directory

Every route features unique, dynamic document titles, meta descriptions, Open Graph cards, and semantic HTML hierarchy:

| Route | Page Component | Description |
| :--- | :--- | :--- |
| `/` | [`Home.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/Home.jsx) | Editorial hero, category curation, trending master sets, value proposition, 3-step handbook, Instagram lookbook grid (8 sets), and studio appointment CTA. |
| `/shop` | [`Shop.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/Shop.jsx) | Full product catalog with search, category filtering chips, sorting (featured, price, rating, newest), and empty states. |
| `/product/:id` | [`ProductDetails.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/ProductDetails.jsx) | Nail shape & size selectors, 6-digit pincode delivery check, verified client reviews with submission form, stock notification, and recently viewed row. |
| `/favorites` | [`Favorites.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/Favorites.jsx) | Client wishlist and saved moodboard with one-click clear and quick-add actions. |
| `/cart` | [`Cart.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/Cart.jsx) | Shopping bag with item quantity modifiers, `WELCOME10` voucher coupon engine, free express shipping progress bar (>₹999), and recently viewed items. |
| `/checkout` | [`Checkout.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/Checkout.jsx) | Simulated checkout with Indian shipping address validation (10-digit mobile, 6-digit pincode), payment method selector (UPI, Card, COD), and trust security badges. |
| `/size-guide` | [`SizeGuide.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/SizeGuide.jsx) | 3-step measurement guide, millimeter size chart (sizes 0–9), preset reference tables (XS, S, M, L), and direct Sizing Kit add-to-bag. |
| `/how-it-works` | [`HowItWorks.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/HowItWorks.jsx) | Comprehensive handbook detailing Prep, 45° angle Application, and gentle warm-water damage-free Removal for 5x reusability. Adhesive comparison matrix. |
| `/custom-order` | [`CustomOrder.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/CustomOrder.jsx) | Bespoke commission form for 1-of-1 bridal or event sets. Custom finger millimeter inputs, nail shape & length selectors, theme chips, and client photo preview upload. |
| `/track-order` | [`TrackOrder.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/TrackOrder.jsx) | Real-time pan-India courier milestone tracking (Placed ➔ Packed ➔ Shipped ➔ Out for Delivery ➔ Delivered) with simulated AWB and courier partner. |
| `/book` | [`Book.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/Book.jsx) | Studio experience portal: Feature-flagged (`STUDIO_BOOKING_ENABLED`) returning luxury animated "Studio Coming Soon" experience while operating as online boutique, with preserved complete working booking engine. |
| `/about` | [`About.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/About.jsx) | Brand story, artisan craftsmanship philosophy, team profiles (Helina, Chloe, Sarah), and atelier values. |
| `/faq` | [`FAQ.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/FAQ.jsx) | Categorized accordion FAQ (Sizing, Application, Reusability, Shipping, Appointments) with live search and concierge desk contact CTA. |
| `/contact` | [`Contact.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/Contact.jsx) | Atelier concierge desk: direct inquiry form with validation, official WhatsApp business chat, Instagram, and email support. |
| `/shipping-returns` | [`ShippingReturns.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/ShippingReturns.jsx) | Domestic delivery timelines (Bengaluru 24–48h, Pan-India 3–5d), free shipping criteria, hygiene seal return conditions, and transit damage replacement guarantee. |
| `/privacy-policy` | [`PrivacyPolicy.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/PrivacyPolicy.jsx) | Client privacy guidelines complying with Indian IT Act and Digital Personal Data Protection standards. Payment safety disclosures. |
| `/terms` | [`Terms.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/Terms.jsx) | Client terms of service, handcrafted artistic variation clauses, studio deposit & 24-hour cancellation terms, and intellectual property protection. |
| `/account` | [`StepPlaceholder.jsx`](file:///c:/Users/ZAYN/full%20stack/src/components/StepPlaceholder.jsx) | Client studio pass & profile preview route. |
| `*` | [`NotFound.jsx`](file:///c:/Users/ZAYN/full%20stack/src/pages/NotFound.jsx) | Brand-aligned 404 page with quick navigation back to Home, Shop, Size Guide, Book, and Track Order. |

---

## 🗄️ Where Mock Data Lives

All application data is isolated from the UI components and flows through a clean API layer:

### 1. Catalog Data Files
- **Products & Sets**: [`src/data/products.js`](file:///c:/Users/ZAYN/full%20stack/src/data/products.js)
  - 14 handcrafted products (Press-ons, Gel kits, Decals, Nail Care elixirs, Sizing kit, Gift cards).
  - Contains pricing, shapes, colors, stock status (`inStock: true/false`), ratings, reviews count, and image references.
- **Studio Services & Slots**: [`src/data/services.js`](file:///c:/Users/ZAYN/full%20stack/src/data/services.js)
  - 4 studio services (Gel Manicure, Custom Nail Art, Sculpted Extensions, Nail Repair & Care).
  - Operating slot times (`10:00 AM`, `11:00 AM`, `12:00 PM`, `02:00 PM`, `03:00 PM`, `04:00 PM`, `05:00 PM`).

### 2. API Abstraction Layer
- **API Entrypoint**: [`src/api/index.js`](file:///c:/Users/ZAYN/full%20stack/src/api/index.js)
  - Every UI component invokes methods from this file rather than reading storage directly:
    - `getProducts({ category, search, sortBy })`
    - `getProductById(id)`
    - `getSlotAvailability(date)` — checks for double bookings on the specified date
    - `bookSlot(bookingData)` — saves appointment and locks the slot
    - `rescheduleBooking({ bookingId, newDate, newTime })` — moves the slot without re-charging deposit
    - `cancelBooking(bookingId)` — marks status as Cancelled and frees up slot
    - `createOrder(orderData)` — creates order with unique tracking number (`HLN-XXXXXX`)
    - `getOrders()` / `getOrderByNumber(orderNumber)`
    - `checkPincodeDelivery(pincode)` — validates 6-digit Indian postal code
    - `getProductReviews(productId)` / `addProductReview(productId, reviewData)`
    - `createCustomOrder(customOrderData)`

### 3. Zustand Global State
- **Store Configuration**: [`src/store/useStore.js`](file:///c:/Users/ZAYN/full%20stack/src/store/useStore.js)
  - Manages shopping bag items, wishlist/favorites, recently viewed product history, active toast notifications, and newsletter subscriptions with instant synchronization.

### 4. Browser LocalStorage Keys
The following keys are utilized by the mock persistence layer:
- `nailsbyhelina_cart`: Current active shopping bag items and quantities.
- `nailsbyhelina_favorites`: Array of favorited product IDs.
- `nailsbyhelina_bookings`: Studio appointment bookings array with date, time, client name, and status.
- `nailsbyhelina_orders`: Placed customer orders with line items, shipping address, and tracking status.
- `nailsbyhelina_reviews`: User-submitted product reviews.
- `nailsbyhelina_custom_orders`: Bespoke nail commission requests.
- `nailsbyhelina_recently_viewed`: List of recently browsed product IDs (capped at 8).
- `nailsbyhelina_newsletter`: Subscribed email addresses.

---

## 🎨 Design Tokens & Aesthetic System

The user interface follows a warm, calm, high-editorial aesthetic:

- **Backgrounds**: Warm Ivory (`#F6F3ED`) & Soft Cream (`#FFFDFC`).
- **Typography**: 
  - Headings: `Cormorant Garamond` (medium weights, comfortable letter-spacing).
  - Body & UI: `DM Sans` (clean sans-serif).
- **Primary Contrast Elements**: Deep Slate Navy (`#313851`) & Deep Navy (`#262D42`).
- **Accent & Primary Buttons**: WCAG AA Compliant Dusty Rose (`#9C5550` / `#8A4743` gradient with 4.7:1+ contrast on cream and white).
- **Subtle Luxury Accents**: Champagne Gold (`#C8A46A`), Soft Sage (`#879B83`), Soft Blue Grey (`#C2CBD3`).
- **Photography Treatment**: Fixed 4:5 aspect ratio portrait orientation with consistent rounded corners and neutral warm backdrops.

---

## 🔍 SEO & Accessibility Implementation

- **Dynamic Head & Open Graph**: Built using [`src/components/SEO.jsx`](file:///c:/Users/ZAYN/full%20stack/src/components/SEO.jsx). Each route programmatically injects unique `<title>`, `<meta name="description">`, canonical `<link>`, and Open Graph cards (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`).
- **Rich Structured Data (JSON-LD)**:
  - Home: `NailSalon` and `LocalBusiness` schema with Bengaluru address, geo coordinates, phone, and hours.
  - Product Pages: `Product` schema with offers, INR currency, stock availability, and aggregate reviews.
  - FAQ: `FAQPage` schema indexing all client questions and answers.
  - Book: `Service` and `NailSalon` booking schema.
- **Search Engine Assets**:
  - [`public/sitemap.xml`](file:///c:/Users/ZAYN/full%20stack/public/sitemap.xml): Public XML sitemap indexing all active pages and catalog items.
  - [`public/robots.txt`](file:///c:/Users/ZAYN/full%20stack/public/robots.txt): Configured to allow indexing while disallowing checkout/cart sessions.
- **Semantic HTML & WCAG AA**:
  - Proper heading hierarchy (`h1` ➔ `h2` ➔ `h3`) across all pages.
  - Accessible `aria-label`s on icon buttons (search toggle, favorites heart, cart trigger, social icons, newsletter input, and calendar controls).
  - High visible focus outlines (`focus-visible:ring-2 focus-visible:ring-[#9C5550]`).
  - Respects `prefers-reduced-motion`.

---

## 🔌 Connecting to a Live Backend

To replace the simulated mock API with a production backend (Node.js/Express, Supabase, Firebase, or PostgreSQL):
1. Open [`src/api/index.js`](file:///c:/Users/ZAYN/full%20stack/src/api/index.js).
2. Swap the localStorage read/writes with standard `fetch()` or `axios` API calls:
   - `getProducts()` ➔ `GET /api/v1/products`
   - `bookSlot(data)` ➔ `POST /api/v1/bookings`
   - `createOrder(data)` ➔ `POST /api/v1/orders`
3. All UI pages and components will seamlessly continue working without code changes.
