-- =============================================================================
-- NAILSBYHELINA COMPLETE SUPABASE SCHEMA & SECURITY POLICIES
-- =============================================================================
-- Production Database Schema for Customer Storefront & Centralized Admin CMS
-- Execute in the Supabase SQL Editor to configure all tables, RLS policies,
-- triggers, storage buckets, and initial CMS state.

-- -----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 2. TABLES
-- -----------------------------------------------------------------------------

-- Profiles (User Roles & Client Directory)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  tag TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  price NUMERIC NOT NULL,
  compare_price NUMERIC,
  stock_quantity INT DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 4.9,
  reviews_count INT DEFAULT 0,
  shapes TEXT[] DEFAULT ARRAY['Almond', 'Coffin', 'Square'],
  colors TEXT[] DEFAULT ARRAY['Dusty Rose', 'Champagne Gold'],
  length TEXT DEFAULT 'Medium',
  finish TEXT DEFAULT 'Glossy Gel Chrome',
  collection TEXT DEFAULT 'Atelier Signature',
  wear_duration TEXT DEFAULT 'Up to 3 weeks',
  reusable_count TEXT DEFAULT 'Up to 5x',
  primary_image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  shape TEXT DEFAULT 'Almond',
  size TEXT DEFAULT 'M',
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal NUMERIC NOT NULL,
  shipping_amount NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_method TEXT DEFAULT 'UPI / Card',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  unit_price NUMERIC NOT NULL,
  quantity INT NOT NULL,
  subtotal NUMERIC NOT NULL,
  shape TEXT,
  size TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lookbook Items
CREATE TABLE IF NOT EXISTS public.lookbook_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  price_display TEXT,
  instagram_caption TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers & Promo Codes
CREATE TABLE IF NOT EXISTS public.offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  promo_code TEXT UNIQUE NOT NULL,
  min_order_value NUMERIC DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage Content (Draft & Published Workflow)
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  hero_eyebrow TEXT DEFAULT 'New atelier collection drop',
  hero_heading TEXT DEFAULT 'Haute couture nail art,',
  hero_highlight TEXT DEFAULT 'made effortless.',
  hero_description TEXT DEFAULT 'Discover professional-quality reusable press-on sets sculpted by master artists, delivered directly to your doorstep across India.',
  primary_cta_text TEXT DEFAULT 'Explore nail sets',
  secondary_cta_text TEXT DEFAULT 'Studio Opening Soon',
  collection_heading TEXT DEFAULT 'Curated Nail Collections',
  collection_description TEXT DEFAULT 'Handcrafted press-on sets designed with precision gel artistry and long-lasting durability.',
  announcement_text TEXT DEFAULT 'Complimentary express pan-India delivery on orders over ₹999 ✨',
  footer_text TEXT DEFAULT 'Haute couture press-on nails sculpted with salon-grade precision and delivered across India.',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings (Centralized Global Config: Social, Brand, Studio, Shipping)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  brand_name TEXT DEFAULT 'Nailsbyhelina',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/nails.by.helina/',
  instagram_handle TEXT DEFAULT '@nails.by.helina',
  whatsapp_number TEXT DEFAULT '+91 93614 05676',
  whatsapp_raw_number TEXT DEFAULT '919361405676',
  support_email TEXT DEFAULT 'concierge@nailsbyhelina.com',
  announcement_text TEXT DEFAULT 'Complimentary express pan-India delivery on orders over ₹999 ✨',
  free_shipping_threshold NUMERIC DEFAULT 999,
  currency TEXT DEFAULT 'INR',
  studio_booking_enabled BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Studio Settings (Appointment Engine Configuration)
CREATE TABLE IF NOT EXISTS public.studio_settings (
  id TEXT PRIMARY KEY DEFAULT 'studio_main',
  booking_enabled BOOLEAN DEFAULT FALSE,
  available_days TEXT[] DEFAULT ARRAY['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  opening_time TEXT DEFAULT '11:00 AM',
  closing_time TEXT DEFAULT '07:30 PM',
  appointment_duration INT DEFAULT 90,
  max_daily_bookings INT DEFAULT 6,
  deposit_amount NUMERIC DEFAULT 200,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs (Admin Action Tracking)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage Buckets Configuration
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('atelier-media', 'atelier-media', true)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. CENTRAL DATABASE is_admin() FUNCTION
-- -----------------------------------------------------------------------------
-- Multi-layered, non-circular administrator verification:
-- Returns TRUE if the cryptographically verified JWT belongs to helina.nailart@gmail.com
-- OR if profiles.role = 'admin' for the authenticated user.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    lower(COALESCE(auth.jwt() ->> 'email', '')) = 'helina.nailart@gmail.com'
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
        AND lower(email) = 'helina.nailart@gmail.com'
    )
  );
$$;

-- -----------------------------------------------------------------------------
-- 4. AUTH TRIGGER & PROFILE MANAGEMENT
-- -----------------------------------------------------------------------------
-- Automatically creates or synchronizes public.profiles on user creation/login.
-- Assigns role = 'admin' EXCLUSIVELY to helina.nailart@gmail.com.
-- Public customer signups ALWAYS receive role = 'customer'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Customer'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN lower(NEW.email) = 'helina.nailart@gmail.com' THEN 'admin'
      ELSE 'customer'
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    role = CASE 
      WHEN lower(EXCLUDED.email) = 'helina.nailart@gmail.com' THEN 'admin'
      ELSE public.profiles.role
    END,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing accounts from auth.users into public.profiles
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Helina Admin'),
  CASE WHEN lower(email) = 'helina.nailart@gmail.com' THEN 'admin' ELSE 'customer' END
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
  role = CASE WHEN lower(public.profiles.email) = 'helina.nailart@gmail.com' THEN 'admin' ELSE public.profiles.role END;

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lookbook_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- PROFILES POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own profile or admin reads all" ON public.profiles;
CREATE POLICY "Users can read own profile or admin reads all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Public can insert own customer profile on signup" ON public.profiles;
CREATE POLICY "Public can insert own customer profile on signup"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id 
    AND ((role = 'customer') OR public.is_admin())
  );

DROP POLICY IF EXISTS "Users can update own profile, admin can manage" ON public.profiles;
CREATE POLICY "Users can update own profile, admin can manage"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    CASE 
      WHEN public.is_admin() THEN TRUE
      ELSE (auth.uid() = id AND role = 'customer')
    END
  );

-- -----------------------------------------------------------------------------
-- SITE SETTINGS POLICIES (Fixes RLS failure on Support & Social / Admin save)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can delete site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;

-- Public customer storefront can read active site settings
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (TRUE);

-- Authorized admin can SELECT, INSERT, UPDATE, DELETE (complete upsert permission)
CREATE POLICY "Admin can read site settings"
  ON public.site_settings FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete site settings"
  ON public.site_settings FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- STUDIO SETTINGS POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read studio settings" ON public.studio_settings;
DROP POLICY IF EXISTS "Admin can read studio settings" ON public.studio_settings;
DROP POLICY IF EXISTS "Admin can insert studio settings" ON public.studio_settings;
DROP POLICY IF EXISTS "Admin can update studio settings" ON public.studio_settings;
DROP POLICY IF EXISTS "Admin can delete studio settings" ON public.studio_settings;
DROP POLICY IF EXISTS "Admins manage studio settings" ON public.studio_settings;

CREATE POLICY "Anyone can read studio settings"
  ON public.studio_settings FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin can read studio settings"
  ON public.studio_settings FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert studio settings"
  ON public.studio_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update studio settings"
  ON public.studio_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete studio settings"
  ON public.studio_settings FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- HOMEPAGE CONTENT POLICIES (Draft vs. Published Workflow)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read published homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Admin can read all homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Admin can insert homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Admin can update homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Admin can delete homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Admins manage homepage content" ON public.homepage_content;

CREATE POLICY "Anyone can read published homepage content"
  ON public.homepage_content FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admin can read all homepage content"
  ON public.homepage_content FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert homepage content"
  ON public.homepage_content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update homepage content"
  ON public.homepage_content FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete homepage content"
  ON public.homepage_content FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- PRODUCTS POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admin can read all products" ON public.products;
DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
DROP POLICY IF EXISTS "Admin can update products" ON public.products;
DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin can read all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- CATEGORIES POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can read all categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin can read all categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- PRODUCT IMAGES POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Admin can insert product images" ON public.product_images;
DROP POLICY IF EXISTS "Admin can update product images" ON public.product_images;
DROP POLICY IF EXISTS "Admin can delete product images" ON public.product_images;
DROP POLICY IF EXISTS "Admins can manage product images" ON public.product_images;

CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin can insert product images"
  ON public.product_images FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update product images"
  ON public.product_images FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete product images"
  ON public.product_images FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- LOOKBOOK ITEMS POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view active lookbook" ON public.lookbook_items;
DROP POLICY IF EXISTS "Admin can read all lookbook" ON public.lookbook_items;
DROP POLICY IF EXISTS "Admin can insert lookbook" ON public.lookbook_items;
DROP POLICY IF EXISTS "Admin can update lookbook" ON public.lookbook_items;
DROP POLICY IF EXISTS "Admin can delete lookbook" ON public.lookbook_items;
DROP POLICY IF EXISTS "Admins manage lookbook" ON public.lookbook_items;

CREATE POLICY "Anyone can view active lookbook"
  ON public.lookbook_items FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin can read all lookbook"
  ON public.lookbook_items FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert lookbook"
  ON public.lookbook_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update lookbook"
  ON public.lookbook_items FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete lookbook"
  ON public.lookbook_items FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- OFFERS POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view active offers" ON public.offers;
DROP POLICY IF EXISTS "Admin can read all offers" ON public.offers;
DROP POLICY IF EXISTS "Admin can insert offers" ON public.offers;
DROP POLICY IF EXISTS "Admin can update offers" ON public.offers;
DROP POLICY IF EXISTS "Admin can delete offers" ON public.offers;
DROP POLICY IF EXISTS "Admins manage offers" ON public.offers;

CREATE POLICY "Anyone can view active offers"
  ON public.offers FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin can read all offers"
  ON public.offers FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert offers"
  ON public.offers FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update offers"
  ON public.offers FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete offers"
  ON public.offers FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- ORDERS & ORDER ITEMS POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own orders, admins view all" ON public.orders;
DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can delete orders" ON public.orders;

CREATE POLICY "Users can view own orders, admins view all"
  ON public.orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users view items of their orders, admins view all" ON public.order_items;
DROP POLICY IF EXISTS "Allow inserting order items with order" ON public.order_items;
DROP POLICY IF EXISTS "Admin can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Admin can delete order items" ON public.order_items;

CREATE POLICY "Users view items of their orders, admins view all"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Allow inserting order items with order"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Admin can update order items"
  ON public.order_items FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- FAVORITES & CART POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own favorites" ON public.favorites;
CREATE POLICY "Users manage own favorites"
  ON public.favorites FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own cart" ON public.cart_items;
CREATE POLICY "Users manage own cart"
  ON public.cart_items FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- AUDIT LOGS POLICIES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view and create audit logs" ON public.audit_logs;

CREATE POLICY "Admin can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- STORAGE POLICIES (Supabase Storage)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product images" ON storage.objects;

CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images', 'atelier-media'));

CREATE POLICY "Admin can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('product-images', 'atelier-media') AND public.is_admin());

CREATE POLICY "Admin can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('product-images', 'atelier-media') AND public.is_admin())
  WITH CHECK (bucket_id IN ('product-images', 'atelier-media') AND public.is_admin());

CREATE POLICY "Admin can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('product-images', 'atelier-media') AND public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. INITIAL SEED DATA
-- -----------------------------------------------------------------------------

-- Global Site Settings
INSERT INTO public.site_settings (id, brand_name, instagram_url, instagram_handle, whatsapp_number, whatsapp_raw_number, support_email, studio_booking_enabled)
VALUES (
  'global',
  'Nailsbyhelina',
  'https://www.instagram.com/nails.by.helina/',
  '@nails.by.helina',
  '+91 93614 05676',
  '919361405676',
  'concierge@nailsbyhelina.com',
  FALSE
) ON CONFLICT (id) DO NOTHING;

-- Studio Settings
INSERT INTO public.studio_settings (id, booking_enabled, deposit_amount)
VALUES ('studio_main', FALSE, 200)
ON CONFLICT (id) DO NOTHING;

-- Homepage Content (Published)
INSERT INTO public.homepage_content (
  id, status, hero_eyebrow, hero_heading, hero_highlight, hero_description,
  primary_cta_text, secondary_cta_text, collection_heading, collection_description
)
VALUES (
  'current',
  'published',
  'New atelier collection drop',
  'Haute couture nail art,',
  'made effortless.',
  'Discover professional-quality reusable press-on sets sculpted by master artists, delivered directly to your doorstep across India.',
  'Explore nail sets',
  'Studio Opening Soon',
  'Curated Nail Collections',
  'Handcrafted press-on sets designed with precision gel artistry and long-lasting durability.'
) ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active) VALUES
('press-ons', 'Luxury Press-Ons', 'press-ons', 'Handcrafted reusable sets with professional-quality adhesive tabs.', 1, TRUE),
('gel-kits', 'Studio Gel Kits', 'gel-kits', 'DIY studio manicure kits with mini UV lamp & top coats.', 2, TRUE),
('decals', 'Crystals & Decals', 'decals', 'Swarovski rhinestones and metallic celestial stickers.', 3, TRUE),
('care', 'Cuticle & Nail Care', 'care', 'Organic botanical oils and keratin strengthening serums.', 4, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO public.products (
  id, name, slug, category_id, price, compare_price, stock_quantity,
  is_active, is_featured, is_bestseller, is_new, rating, reviews_count,
  shapes, colors, length, finish, primary_image, description
) VALUES
(
  'sakura-chrome-luxe',
  'Sakura Velvet Chrome',
  'sakura-chrome-luxe',
  'press-ons',
  1199,
  1499,
  45,
  TRUE, TRUE, TRUE, FALSE, 4.9, 128,
  ARRAY['Almond', 'Coffin', 'Square'],
  ARRAY['Dusty Rose', 'Silver Chrome', 'Pearl White'],
  'Medium',
  'Glossy Gel Chrome',
  '/images/design-sakura-chrome.jpg',
  'Iridescent mirror chrome finish layered over a subtle blush base. Handcrafted reusable press-on set designed to hold up to 3 weeks.'
),
(
  'crystal-micro-french',
  'Crystal Micro-French',
  'crystal-micro-french',
  'press-ons',
  1299,
  1599,
  38,
  TRUE, TRUE, TRUE, TRUE, 4.8, 94,
  ARRAY['Almond', 'Round'],
  ARRAY['Milky Pink', 'Crystal Silver'],
  'Short',
  'High-Gloss Clear',
  '/images/design-crystal-french.jpg',
  'Ultra-thin reflective French micro-tips adorned with precision hand-placed crystal accents. Understated elegance for minimalists.'
),
(
  'vanilla-glaze-donut',
  'Vanilla Glaze French',
  'vanilla-glaze-donut',
  'press-ons',
  899,
  1199,
  60,
  TRUE, FALSE, TRUE, FALSE, 4.7, 215,
  ARRAY['Almond', 'Square', 'Round'],
  ARRAY['Opal Sheer', 'Warm Vanilla'],
  'Medium',
  'Luminous Sheen',
  '/images/design-vanilla-glaze.jpg',
  'The iconic glazed donut aesthetic with a translucent milky white base and high-shine luminous sheen.'
),
(
  'golden-empress-stiletto',
  'Golden Empress Luxe',
  'golden-empress-stiletto',
  'press-ons',
  1599,
  1899,
  25,
  TRUE, TRUE, FALSE, TRUE, 5.0, 67,
  ARRAY['Coffin', 'Almond'],
  ARRAY['Champagne Gold', 'Onyx Black', 'Nude'],
  'Long',
  '24K Gold Leaf Embedded',
  '/images/design-golden-empress.jpg',
  'Regal 24K gold foil flakes embedded in deep sheer layers with delicate sculpted baroque accents.'
),
(
  'sculpted-3d-floral',
  'Sculpted 3D Rose Petals',
  'sculpted-3d-floral',
  'press-ons',
  1449,
  1799,
  30,
  TRUE, FALSE, FALSE, TRUE, 4.9, 42,
  ARRAY['Almond', 'Coffin'],
  ARRAY['Soft Blush', 'Cream White', 'Gold Trim'],
  'Medium',
  'Textured 3D Matte & Gloss',
  '/images/design-3d-floral.jpg',
  'Dimensionally sculpted floral petals handcrafted with specialized builder gel for a bridal couture statement.'
),
(
  'midnight-navy-aurora',
  'Midnight Navy Velvet',
  'midnight-navy-aurora',
  'press-ons',
  1099,
  1399,
  40,
  TRUE, FALSE, FALSE, FALSE, 4.8, 83,
  ARRAY['Square', 'Almond'],
  ARRAY['Deep Navy', 'Aurora Silver'],
  'Short',
  'Magnetic Cat-Eye Velvet',
  '/images/design-navy-luxe.jpg',
  'Hypnotic deep navy blue with mesmerizing magnetic silver cat-eye particle shifting under movement.'
)
ON CONFLICT (id) DO NOTHING;

-- Lookbook Items
INSERT INTO public.lookbook_items (id, title, subtitle, image_url, product_id, price_display, instagram_caption, sort_order, is_active) VALUES
('lb-1', 'Sakura Velvet Chrome', 'Bridal Suite Editorial', '/images/design-sakura-chrome.jpg', 'sakura-chrome-luxe', '₹1,199', '@nailsbyhelina • Bridal Suite', 1, TRUE),
('lb-2', 'Crystal Micro-French', 'Minimal Luxury Accents', '/images/design-crystal-french.jpg', 'crystal-micro-french', '₹1,299', '@nailsbyhelina • Editorial Chic', 2, TRUE),
('lb-3', 'Vanilla Glaze French', 'Everyday Couture Glow', '/images/design-vanilla-glaze.jpg', 'vanilla-glaze-donut', '₹899', '@nailsbyhelina • Everyday Glow', 3, TRUE),
('lb-4', 'Golden Empress Luxe', '24K Gold Foil Embedding', '/images/design-golden-empress.jpg', 'golden-empress-stiletto', '₹1,599', '@nailsbyhelina • 24K Gold Accent', 4, TRUE),
('lb-5', 'Sculpted 3D Rose Petals', 'Dimensional Gel Sculpture', '/images/design-3d-floral.jpg', 'sculpted-3d-floral', '₹1,449', '@nailsbyhelina • Haute Couture', 5, TRUE),
('lb-6', 'Midnight Navy Velvet', 'Magnetic Aurora Finish', '/images/design-navy-luxe.jpg', 'midnight-navy-aurora', '₹1,099', '@nailsbyhelina • Constellation', 6, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Offers
INSERT INTO public.offers (id, title, description, discount_type, discount_value, promo_code, min_order_value, is_active) VALUES
('welcome-10', 'Welcome to the Atelier', 'Enjoy 10% off your first handcrafted press-on set.', 'percentage', 10, 'WELCOME10', 0, TRUE),
('festive-15', 'Couture Celebration', '15% off orders over ₹1,999.', 'percentage', 15, 'COUTURE15', 1999, TRUE)
ON CONFLICT (id) DO NOTHING;
