-- =============================================================================
-- NAILSBYHELINA: IMMEDIATE ADMIN RLS & CMS FIX SCRIPT
-- =============================================================================
-- Execute this script in the Supabase Dashboard -> SQL Editor (New query -> Run)
-- This repairs is_admin(), establishes the admin profile for helina.nailart@gmail.com,
-- configures the automatic auth trigger, and applies complete CRUD RLS policies
-- across all CMS tables and Supabase storage.

-- 1. Create/Update Central is_admin() Function
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

-- 2. Link existing helina.nailart@gmail.com Auth User into public.profiles
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Helina Admin'),
  'admin'
FROM auth.users
WHERE lower(email) = 'helina.nailart@gmail.com'
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  role = 'admin',
  updated_at = NOW();

-- 3. Automatic Auth Trigger for future signups / logins
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

-- 4. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lookbook_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. Profiles RLS Policies
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

-- 6. Fix site_settings RLS Policies
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can delete site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (TRUE);

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

-- 7. Fix studio_settings RLS Policies
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

-- 8. Fix homepage_content RLS Policies
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

-- 9. Fix products & categories RLS Policies
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

-- 9b. Fix product_images RLS Policies
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

-- 10. Fix lookbook & offers RLS Policies
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

-- 11. Fix orders RLS Policies
DROP POLICY IF EXISTS "Users can view own orders, admins view all" ON public.orders;
DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;

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

-- 11b. Fix order_items RLS Policies
DROP POLICY IF EXISTS "Users view own order items, admins view all" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON public.order_items;

CREATE POLICY "Users view own order items, admins view all"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Users can insert order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

-- 12. Fix audit_logs RLS Policies
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

-- 13. Fix storage.objects RLS Policies
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('atelier-media', 'atelier-media', true)
ON CONFLICT (id) DO NOTHING;

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
