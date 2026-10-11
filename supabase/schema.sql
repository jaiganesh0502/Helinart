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

-- Content Pages (Pages & Policies CMS Workflow)
CREATE TABLE IF NOT EXISTS public.content_pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  seo_title TEXT,
  seo_description TEXT,
  updated_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs (Interactive Accordion CMS)
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

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
-- CONTENT PAGES POLICIES (Pages & Policies CMS Workflow)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read published content pages" ON public.content_pages;
DROP POLICY IF EXISTS "Admin can read all content pages" ON public.content_pages;
DROP POLICY IF EXISTS "Admin can insert content pages" ON public.content_pages;
DROP POLICY IF EXISTS "Admin can update content pages" ON public.content_pages;
DROP POLICY IF EXISTS "Admin can delete content pages" ON public.content_pages;

CREATE POLICY "Anyone can read published content pages"
  ON public.content_pages FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admin can read all content pages"
  ON public.content_pages FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert content pages"
  ON public.content_pages FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update content pages"
  ON public.content_pages FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete content pages"
  ON public.content_pages FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- FAQS POLICIES (Interactive Accordion CMS)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read active faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin can read all faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin can insert faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin can update faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin can delete faqs" ON public.faqs;

CREATE POLICY "Anyone can read active faqs"
  ON public.faqs FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin can read all faqs"
  ON public.faqs FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert faqs"
  ON public.faqs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update faqs"
  ON public.faqs FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete faqs"
  ON public.faqs FOR DELETE
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

-- Initial Content Pages (Pages & Policies CMS)
INSERT INTO public.content_pages (id, slug, title, subtitle, status, seo_title, seo_description, content) VALUES
(
  'about',
  'about',
  'Redefining luxury nails as wearable jewelry.',
  'The Nailsbyhelina Story',
  'published',
  'About the Artist & Studio Story | Nailsbyhelina',
  'Discover the philosophy behind Nailsbyhelina: Japanese gel formulations, handcrafted press-on craftsmanship, and bespoke reusable nail art.',
  '{
    "intro": "Nailsbyhelina was founded on a simple conviction: modern women should never have to choose between salon-grade artistry and natural nail health.",
    "brand_story": "Every press-on nail set is individually sculpted, hand-painted, and cured with professional Japanese salon gels. No harmful drills, no acetone soaking, no waiting in studios. We craft press-ons with the same care and precision as fine bespoke jewelry.",
    "mission": "To empower personal expression through flawless, reusable nail art that honors the health of natural nail beds.",
    "craftsmanship": "Unlike mass factory-produced plastic tips that snap within 24 hours, our sets are created with multi-layered industrial acrylic polymers for durability, structural rigidity, and brilliant shine up to 5 individual wears.",
    "artist_name": "Helina",
    "artist_title": "Founder & Master Nail Sculptor • Atelier Director",
    "artist_image": "/images/artist-elena.jpg",
    "closing_message": "Each set is a miniature canvas crafted with immense passion and devotion to beauty."
  }'::jsonb
),
(
  'contact',
  'contact',
  'Atelier Concierge Desk',
  'We are here to assist with bespoke orders, sizing questions & studio inquiries.',
  'published',
  'Contact Atelier Desk | Nailsbyhelina',
  'Get in touch with the Nailsbyhelina concierge team via WhatsApp, Email, or Instagram for custom orders, sizing consultations, and customer care.',
  '{
    "heading": "Get in Touch with our Atelier",
    "support_message": "Whether you need guidance choosing the right nail shape, custom sizing confirmation, or wish to commission a bespoke bridal set, our concierge team is always delighted to assist you.",
    "response_time_text": "We typically reply within 1 to 2 hours during active studio hours.",
    "business_hours": "Monday to Sunday: 10:00 AM – 7:00 PM IST",
    "studio_status": "Online nail boutique open 24/7 with pan-India express courier delivery.",
    "location": "Bengaluru, Karnataka, India"
  }'::jsonb
),
(
  'shipping-returns',
  'shipping-returns',
  'Shipping, Delivery & Returns Policy',
  'Transparent guidelines on domestic courier transit, hygiene seal standards, and transit damage guarantees.',
  'published',
  'Shipping, Delivery & Returns Policy | Nailsbyhelina',
  'Detailed domestic shipping timelines (Local express 24-48h, Pan-India 3-5 days), free shipping on orders over ₹999, transit guarantees, and hygiene seal return conditions.',
  '{
    "overview": "We partner with trusted express couriers including Blue Dart Air and DTDC to ensure your handcrafted sets arrive safely and swiftly at your doorstep across India.",
    "delivery_areas": "All serviceable pin codes across Metro cities, Tier-1, Tier-2, and Tier-3 Indian hubs.",
    "expected_delivery_time": "Bengaluru: 24–48 hours. Metro Hubs (Mumbai, Delhi NCR, Chennai, Hyderabad, Kolkata): 2–3 business days. Rest of India: 3–5 business days.",
    "shipping_fees": "Flat ₹99 shipping for standard delivery.",
    "free_shipping_threshold": 999,
    "processing_time": "Handcrafted sets are prepared and quality-inspected within 24 to 48 hours before dispatch.",
    "returns_eligibility": "Due to strict personal hygiene standards, press-on sets can only be returned if the exterior security tamper-seal remains completely unopened and intact within 7 days of delivery.",
    "exchange_rules": "Exchanges are supported for unopened sets or if you received an incorrect size/design discrepancy.",
    "damaged_product_process": "In the rare event of transit damage, share an unboxing video within 48 hours of receipt. We will dispatch a complimentary replacement immediately.",
    "refund_policy": "Approved returns are inspected and refunded to your original payment method (or store credit) within 5 business days.",
    "contact_instructions": "Contact concierge@nailsbyhelina.com or WhatsApp +91 93614 05676 with your order number."
  }'::jsonb
),
(
  'privacy-policy',
  'privacy-policy',
  'Privacy Policy & Data Protection',
  'Compliant with the Indian Information Technology Act & Digital Personal Data Protection standards.',
  'published',
  'Privacy Policy & Data Protection | Nailsbyhelina',
  'Our commitment to safeguarding personal data and transaction security under the Indian IT Act and Digital Personal Data Protection standards.',
  '{
    "last_updated": "October 2026",
    "introduction": "Welcome to Nailsbyhelina (we, our, or the Atelier). We respect your privacy and are committed to protecting the personal data you share when browsing our website, purchasing handcrafted press-on sets, or reaching out to our concierge desk.",
    "collected_info": "We only collect information necessary to fulfill your couture nail orders and studio appointments: Full name, phone number, email address, physical delivery address, nail sizing millimeter measurements, and appointment preferences.",
    "payment_security": "We never store raw credit card numbers, CVVs, or UPI PINs. All monetary transactions are processed through 256-bit encrypted, PCI-DSS compliant payment gateways.",
    "data_usage": "Your personal information is used exclusively to fulfill orders with courier partners, send order tracking notifications, provide customer care, and send Atelier Gazette updates if opted in.",
    "third_party_sharing": "We never sell, rent, or trade your personal data. Data is shared strictly with operational partners (such as logistics courier services) for delivery fulfillment.",
    "privacy_contact": "privacy@nailsbyhelina.com"
  }'::jsonb
),
(
  'terms-of-service',
  'terms-of-service',
  'Terms & Conditions of Service',
  'Client agreement, handcrafted variation disclaimers, and service terms for Nailsbyhelina.',
  'published',
  'Terms & Conditions of Service | Nailsbyhelina',
  'Client agreement, custom handcrafted variation disclaimers, and service terms for Nailsbyhelina.',
  '{
    "last_updated": "October 2026",
    "general_overview": "By accessing this website, placing orders for handcrafted press-on nails, or booking studio services, you agree to comply with and be bound by these Terms and Conditions.",
    "handcrafted_variance": "Every press-on nail set is individually sculpted and hand-painted by artisan sculptors. Minor artistic variances in crystal positioning, hand-burnished chrome swirls, or marbling are hallmarks of genuine handcrafting and not manufacturing defects.",
    "booking_terms": "Advance appointment slot deposits (where applicable) reserve your private artist slot. Appointments can be rescheduled up to 24 hours prior to the slot time.",
    "health_allergies": "Our press-ons and adhesive tabs are formulated from hypoallergenic materials. Clients with known extreme acrylic or cyanoacrylate sensitivities should test adhesive tabs prior to full application.",
    "intellectual_property": "All custom nail designs, photography, design names, and branding are the exclusive intellectual property of Nailsbyhelina and may not be reproduced without written authorization.",
    "governing_law": "These Terms are governed by and construed in accordance with the laws of India, subject to the jurisdiction of the courts of Bengaluru, Karnataka."
  }'::jsonb
),
(
  'sizing-guide',
  'sizing-guide',
  'Atelier Sizing Guide & Measurement Manual',
  'Find your bespoke nail dimensions with millimeter accuracy for a comfortable, seamless fit.',
  'published',
  'Atelier Sizing Guide & mm Chart | Nailsbyhelina',
  'Step-by-step instructions for measuring natural nail widths using clear tape and ruler, standard XS/S/M/L presets, and custom size guide.',
  '{
    "instructions": "A glove-like fit is the secret to press-ons that look indistinguishable from a salon gel extension. Follow our simple tape measurement technique or order our ₹199 Atelier Sizing Kit for 100% sizing certainty.",
    "measurement_steps": [
      {"step": 1, "title": "Apply Clear Tape", "desc": "Press clear scotch tape horizontally across the widest point of your natural nail bed."},
      {"step": 2, "title": "Mark the Sidewalls", "desc": "Use a fine-tip pen to mark the exact lateral edges where your nail meets the skin on both sides."},
      {"step": 3, "title": "Measure in Millimeters", "desc": "Peel the tape off and place it flat against a metric ruler. Measure the distance between marks in millimeters (mm)."},
      {"step": 4, "title": "Match Your Preset", "desc": "Compare your thumb, index, middle, ring, and pinky measurements against our preset size table (XS, S, M, L) or select Custom."}
    ],
    "size_chart": {
      "XS": "14mm | 11mm | 12mm | 10mm | 8mm",
      "S": "15mm | 12mm | 13mm | 11mm | 8mm",
      "M": "16mm | 12mm | 14mm | 11mm | 9mm",
      "L": "18mm | 13mm | 15mm | 12mm | 10mm"
    },
    "tips": "When in doubt between two millimeter widths, always choose the larger size! You can gently file down the soft lateral edges of our tips with the included mini file.",
    "custom_sizing_info": "Need bespoke sizes? Simply select Custom Size at checkout and write your 10-finger mm measurements in the order notes."
  }'::jsonb
),
(
  'how-press-ons-work',
  'how-press-ons-work',
  'How Press-Ons Work: Application, Wear & Reuse',
  'Salon-quality gel manicure in 10 minutes at home with zero natural nail damage.',
  'published',
  'How Press-Ons Work: Complete Guide | Nailsbyhelina',
  'Master the art of 10-minute press-on application, long-lasting wear tips, painless removal, and reusing sets up to 5 times.',
  '{
    "steps": [
      {"step": 1, "title": "Measure & Size", "desc": "Select the matching tip size for each finger before applying any adhesive."},
      {"step": 2, "title": "Prep Natural Nails", "desc": "Gently push cuticles back with the wooden stick, lightly buff the shine off your natural nail, and wipe clean with the alcohol prep pad."},
      {"step": 3, "title": "Apply Adhesive", "desc": "Select the matching gummy adhesive tab (for 3-7 day wear) or brush-on studio glue (for up to 3 weeks hold)."},
      {"step": 4, "title": "Press Firmly at 45°", "desc": "Slide the press-on tip down to your cuticle line at a 45-degree angle, then press firmly for 30 seconds to eliminate air pockets."},
      {"step": 5, "title": "Gentle Warm Water Removal", "desc": "Soak fingers in warm soapy water with a drop of cuticle oil for 10 minutes. The adhesive softens and glides off safely without acetone."},
      {"step": 6, "title": "Clean & Store for Reuse", "desc": "Peel the gummy adhesive off the tip underside and store the nails in your velvet keepsake box for your next wear."}
    ]
  }'::jsonb
),
(
  'track-order',
  'track-order',
  'Track Your Atelier Order',
  'Real-time transit updates for your handcrafted press-on sets.',
  'published',
  'Track Order Live | Nailsbyhelina',
  'Check the dispatch status and live courier tracking for your Nailsbyhelina order.',
  '{
    "instructions": "Enter your 6-character order number (e.g., NH-8492) or Blue Dart AWB waybill number to view the live status of your handcrafted sets.",
    "courier_info": "All domestic deliveries are dispatched via express courier partners. You will receive SMS & WhatsApp status alerts as your package enters transit.",
    "support_contact": "If your order has not moved within 48 hours, reach out to concierge@nailsbyhelina.com with your order reference."
  }'::jsonb
),
(
  'studio-concierge',
  'studio-concierge',
  'Studio & Concierge Information',
  'Bespoke consultations, custom designs, and private appointments.',
  'published',
  'Studio Concierge | Nailsbyhelina',
  'Learn about Nailsbyhelina private studio bookings, custom design consultations, and concierge assistance.',
  '{
    "status": "Online nail boutique open 24/7 across India. Private studio booking appointments launching soon.",
    "opening_soon_message": "Our flagship private nail studio is undergoing final curated design touches. In the meantime, all bespoke nail sets are hand-painted in our atelier and delivered pan-India.",
    "support_hours": "Concierge desk active Monday to Sunday from 10:00 AM to 7:00 PM IST.",
    "booking_information": "When in-studio appointments open, clients can book 1-on-1 sessions with master artists for luxury gel sculpting, nail extensions, and bespoke bridal nail wardrobes."
  }'::jsonb
),
(
  'footer',
  'footer',
  'Footer Content & Settings',
  'Centralized copy and configuration for the customer-facing footer.',
  'published',
  'Footer Settings',
  'Centralized footer text, newsletter copy, business hours, and copyright.',
  '{
    "brand_mission": "Elevating modern self-care with couture press-on sets, bespoke gel art kits, and handcrafted reusable nail designs delivered across India.",
    "short_description": "Elevating modern self-care with couture press-on sets, bespoke gel art kits, and handcrafted reusable nail designs delivered across India.",
    "concierge_heading": "Studio Concierge",
    "newsletter_heading": "The Atelier Gazette",
    "newsletter_description": "Subscribe for private collection drops, nail rituals, and 10% off your first order.",
    "business_hours": "Mon – Sun: 10:00 AM – 7:00 PM (WhatsApp & Email)",
    "copyright_text": "© 2026 Nailsbyhelina Luxury Nail Studio. All rights reserved."
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Initial FAQs Seed
INSERT INTO public.faqs (id, question, answer, category, sort_order, is_active) VALUES
('faq-1', 'How do I know what press-on size to order?', 'You can easily measure your natural nail widths using clear scotch tape and a millimeter ruler (refer to our interactive /size-guide). Alternatively, we recommend ordering our ₹199 Atelier Sizing Kit, which ships 10 sample tips to your doorstep and gives you ₹199 back in store credit.', 'Sizing & Fit', 1, TRUE),
('faq-2', 'What if my nails are between sizes?', 'Always size up! If your index finger measures 12.5mm, pick size 4 (13mm). You can gently file down the soft lateral edges of our tips with the included mini file for a bespoke glove-like fit.', 'Sizing & Fit', 2, TRUE),
('faq-3', 'How long do Nailsbyhelina press-on sets last?', 'With our medical adhesive tabs, sets typically stay firmly locked for 3 to 7 days, making them perfect for events, shoots, and weekend outings. With studio liquid brush glue, sets hold for up to 3 weeks without lifting.', 'Application & Hold', 3, TRUE),
('faq-4', 'Can I shower, wash dishes, or wash my hair with them on?', 'Yes! Our medical tabs and resin are 100% waterproof once cured. Just avoid submerging hands in hot water or saunas for the first 60 minutes after initial application.', 'Application & Hold', 4, TRUE),
('faq-5', 'How do I remove the press-ons without damaging my natural nails?', 'Never pry or force the nails off! Simply soak fingertips in a bowl of warm water with gentle soap and a few drops of our Rose Cuticle Elixir for 10 minutes. The adhesive gummy bonds will soften, allowing you to slide them off with the wooden orange stick.', 'Reusability & Care', 5, TRUE),
('faq-6', 'Can I truly reuse the press-on tips?', 'Yes, up to 5 times! Because our nails are sculpted from high-durability acrylic polymer rather than cheap ABS plastic, you can peel the old gummy tab off the underside and reapply with a fresh tab whenever you wish.', 'Reusability & Care', 6, TRUE),
('faq-7', 'How fast do orders ship across India?', 'Bengaluru orders arrive in 24 to 48 hours via local express courier. Tier-1 metros (Delhi NCR, Mumbai, Chennai, Hyderabad, Kolkata) take 2 to 3 business days. Pan-India delivery takes 3 to 5 business days. Free shipping applies on all orders above ₹999.', 'Shipping & Delivery', 7, TRUE),
('faq-8', 'Why is a ₹200 advance deposit required for in-studio appointments?', 'Because our private studio operates on a 1-on-1 model with dedicated master artists, the ₹200 deposit reserves your private artist slot. It is 100% credited toward your final service total on the appointment day.', 'Studio Bookings', 8, TRUE),
('faq-9', 'Can I reschedule or cancel my in-studio appointment?', 'Yes. You can reschedule or cancel for free up to 24 hours prior to your slot directly through our booking portal. Cancellations within 24 hours forfeit the ₹200 deposit to compensate the scheduled artisan.', 'Studio Bookings', 9, TRUE)
ON CONFLICT (id) DO NOTHING;

