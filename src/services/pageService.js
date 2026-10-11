import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const DEFAULT_PAGES = {
  about: {
    id: 'about',
    slug: 'about',
    title: 'Redefining luxury nails as wearable jewelry.',
    subtitle: 'The Nailsbyhelina Story',
    status: 'published',
    seo_title: 'About the Artist & Studio Story | Nailsbyhelina',
    seo_description: 'Discover the philosophy behind Nailsbyhelina: Japanese gel formulations, handcrafted press-on craftsmanship, and bespoke reusable nail art.',
    content: {
      intro: 'Nailsbyhelina was founded on a simple conviction: modern women should never have to choose between salon-grade artistry and natural nail health.',
      brand_story: 'Every press-on nail set is individually sculpted, hand-painted, and cured with professional Japanese salon gels. No harmful drills, no acetone soaking, no waiting in studios. We craft press-ons with the same care and precision as fine bespoke jewelry.',
      mission: 'To empower personal expression through flawless, reusable nail art that honors the health of natural nail beds.',
      craftsmanship: 'Unlike mass factory-produced plastic tips that snap within 24 hours, our sets are created with multi-layered industrial acrylic polymers for durability, structural rigidity, and brilliant shine up to 5 individual wears.',
      artist_name: 'Helina',
      artist_title: 'Founder & Master Nail Sculptor • Atelier Director',
      artist_image: '/images/artist-elena.jpg',
      closing_message: 'Each set is a miniature canvas crafted with immense passion and devotion to beauty.'
    }
  },
  contact: {
    id: 'contact',
    slug: 'contact',
    title: 'Atelier Concierge Desk',
    subtitle: 'We are here to assist with bespoke orders, sizing questions & studio inquiries.',
    status: 'published',
    seo_title: 'Contact Atelier Desk | Nailsbyhelina',
    seo_description: 'Get in touch with the Nailsbyhelina concierge team via WhatsApp, Email, or Instagram for custom orders, sizing consultations, and customer care.',
    content: {
      heading: 'Get in Touch with our Atelier',
      support_message: 'Whether you need guidance choosing the right nail shape, custom sizing confirmation, or wish to commission a bespoke bridal set, our concierge team is always delighted to assist you.',
      response_time_text: 'We typically reply within 1 to 2 hours during active studio hours.',
      business_hours: 'Monday to Sunday: 10:00 AM – 7:00 PM IST',
      studio_status: 'Online nail boutique open 24/7 with pan-India express courier delivery.',
      location: 'Bengaluru, Karnataka, India'
    }
  },
  'shipping-returns': {
    id: 'shipping-returns',
    slug: 'shipping-returns',
    title: 'Shipping, Delivery & Returns Policy',
    subtitle: 'Transparent guidelines on domestic courier transit, hygiene seal standards, and transit damage guarantees.',
    status: 'published',
    seo_title: 'Shipping, Delivery & Returns Policy | Nailsbyhelina',
    seo_description: 'Detailed domestic shipping timelines (Local express 24-48h, Pan-India 3-5 days), free shipping on orders over ₹999, transit guarantees, and hygiene seal return conditions.',
    content: {
      overview: 'We partner with trusted express couriers including Blue Dart Air and DTDC to ensure your handcrafted sets arrive safely and swiftly at your doorstep across India.',
      delivery_areas: 'All serviceable pin codes across Metro cities, Tier-1, Tier-2, and Tier-3 Indian hubs.',
      expected_delivery_time: 'Bengaluru: 24–48 hours. Metro Hubs (Mumbai, Delhi NCR, Chennai, Hyderabad, Kolkata): 2–3 business days. Rest of India: 3–5 business days.',
      shipping_fees: 'Flat ₹99 shipping for standard delivery.',
      free_shipping_threshold: 999,
      processing_time: 'Handcrafted sets are prepared and quality-inspected within 24 to 48 hours before dispatch.',
      returns_eligibility: 'Due to strict personal hygiene standards, press-on sets can only be returned if the exterior security tamper-seal remains completely unopened and intact within 7 days of delivery.',
      exchange_rules: 'Exchanges are supported for unopened sets or if you received an incorrect size/design discrepancy.',
      damaged_product_process: 'In the rare event of transit damage, share an unboxing video within 48 hours of receipt. We will dispatch a complimentary replacement immediately.',
      refund_policy: 'Approved returns are inspected and refunded to your original payment method (or store credit) within 5 business days.',
      contact_instructions: 'Contact concierge@nailsbyhelina.com or WhatsApp +91 93614 05676 with your order number.'
    }
  },
  'privacy-policy': {
    id: 'privacy-policy',
    slug: 'privacy-policy',
    title: 'Privacy Policy & Data Protection',
    subtitle: 'Compliant with the Indian Information Technology Act & Digital Personal Data Protection standards.',
    status: 'published',
    seo_title: 'Privacy Policy & Data Protection | Nailsbyhelina',
    seo_description: 'Our commitment to safeguarding personal data and transaction security under the Indian IT Act and Digital Personal Data Protection standards.',
    content: {
      last_updated: 'October 2026',
      introduction: 'Welcome to Nailsbyhelina (we, our, or the Atelier). We respect your privacy and are committed to protecting the personal data you share when browsing our website, purchasing handcrafted press-on sets, or reaching out to our concierge desk.',
      collected_info: 'We only collect information necessary to fulfill your couture nail orders and studio appointments: Full name, phone number, email address, physical delivery address, nail sizing millimeter measurements, and appointment preferences.',
      payment_security: 'We never store raw credit card numbers, CVVs, or UPI PINs. All monetary transactions are processed through 256-bit encrypted, PCI-DSS compliant payment gateways.',
      data_usage: 'Your personal information is used exclusively to fulfill orders with courier partners, send order tracking notifications, provide customer care, and send Atelier Gazette updates if opted in.',
      third_party_sharing: 'We never sell, rent, or trade your personal data. Data is shared strictly with operational partners (such as logistics courier services) for delivery fulfillment.',
      privacy_contact: 'privacy@nailsbyhelina.com'
    }
  },
  'terms-of-service': {
    id: 'terms-of-service',
    slug: 'terms-of-service',
    title: 'Terms & Conditions of Service',
    subtitle: 'Client agreement, handcrafted variation disclaimers, and service terms for Nailsbyhelina.',
    status: 'published',
    seo_title: 'Terms & Conditions of Service | Nailsbyhelina',
    seo_description: 'Client agreement, custom handcrafted variation disclaimers, and service terms for Nailsbyhelina.',
    content: {
      last_updated: 'October 2026',
      general_overview: 'By accessing this website, placing orders for handcrafted press-on nails, or booking studio services, you agree to comply with and be bound by these Terms and Conditions.',
      handcrafted_variance: 'Every press-on nail set is individually sculpted and hand-painted by artisan sculptors. Minor artistic variances in crystal positioning, hand-burnished chrome swirls, or marbling are hallmarks of genuine handcrafting and not manufacturing defects.',
      booking_terms: 'Advance appointment slot deposits (where applicable) reserve your private artist slot. Appointments can be rescheduled up to 24 hours prior to the slot time.',
      health_allergies: 'Our press-ons and adhesive tabs are formulated from hypoallergenic materials. Clients with known extreme acrylic or cyanoacrylate sensitivities should test adhesive tabs prior to full application.',
      intellectual_property: 'All custom nail designs, photography, design names, and branding are the exclusive intellectual property of Nailsbyhelina and may not be reproduced without written authorization.',
      governing_law: 'These Terms are governed by and construed in accordance with the laws of India, subject to the jurisdiction of the courts of Bengaluru, Karnataka.'
    }
  },
  'sizing-guide': {
    id: 'sizing-guide',
    slug: 'sizing-guide',
    title: 'Atelier Sizing Guide & Measurement Manual',
    subtitle: 'Find your bespoke nail dimensions with millimeter accuracy for a comfortable, seamless fit.',
    status: 'published',
    seo_title: 'Atelier Sizing Guide & mm Chart | Nailsbyhelina',
    seo_description: 'Step-by-step instructions for measuring natural nail widths using clear tape and ruler, standard XS/S/M/L presets, and custom size guide.',
    content: {
      instructions: 'A glove-like fit is the secret to press-ons that look indistinguishable from a salon gel extension. Follow our simple tape measurement technique or order our ₹199 Atelier Sizing Kit for 100% sizing certainty.',
      measurement_steps: [
        { step: 1, title: 'Apply Clear Tape', desc: 'Press clear scotch tape horizontally across the widest point of your natural nail bed.' },
        { step: 2, title: 'Mark the Sidewalls', desc: 'Use a fine-tip pen to mark the exact lateral edges where your nail meets the skin on both sides.' },
        { step: 3, title: 'Measure in Millimeters', desc: 'Peel the tape off and place it flat against a metric ruler. Measure the distance between marks in millimeters (mm).' },
        { step: 4, title: 'Match Your Preset', desc: 'Compare your thumb, index, middle, ring, and pinky measurements against our preset size table (XS, S, M, L) or select Custom.' }
      ],
      size_chart: {
        XS: '14mm | 11mm | 12mm | 10mm | 8mm',
        S: '15mm | 12mm | 13mm | 11mm | 8mm',
        M: '16mm | 12mm | 14mm | 11mm | 9mm',
        L: '18mm | 13mm | 15mm | 12mm | 10mm'
      },
      tips: 'When in doubt between two millimeter widths, always choose the larger size! You can gently file down the soft lateral edges of our tips with the included mini file.',
      custom_sizing_info: 'Need bespoke sizes? Simply select Custom Size at checkout and write your 10-finger mm measurements in the order notes.'
    }
  },
  'how-press-ons-work': {
    id: 'how-press-ons-work',
    slug: 'how-press-ons-work',
    title: 'How Press-Ons Work: Application, Wear & Reuse',
    subtitle: 'Salon-quality gel manicure in 10 minutes at home with zero natural nail damage.',
    status: 'published',
    seo_title: 'How Press-Ons Work: Complete Guide | Nailsbyhelina',
    seo_description: 'Master the art of 10-minute press-on application, long-lasting wear tips, painless removal, and reusing sets up to 5 times.',
    content: {
      steps: [
        { step: 1, title: 'Measure & Size', desc: 'Select the matching tip size for each finger before applying any adhesive.' },
        { step: 2, title: 'Prep Natural Nails', desc: 'Gently push cuticles back with the wooden stick, lightly buff the shine off your natural nail, and wipe clean with the alcohol prep pad.' },
        { step: 3, title: 'Apply Adhesive', desc: 'Select the matching gummy adhesive tab (for 3-7 day wear) or brush-on studio glue (for up to 3 weeks hold).' },
        { step: 4, title: 'Press Firmly at 45°', desc: 'Slide the press-on tip down to your cuticle line at a 45-degree angle, then press firmly for 30 seconds to eliminate air pockets.' },
        { step: 5, title: 'Gentle Warm Water Removal', desc: 'Soak fingers in warm soapy water with a drop of cuticle oil for 10 minutes. The adhesive softens and glides off safely without acetone.' },
        { step: 6, title: 'Clean & Store for Reuse', desc: 'Peel the gummy adhesive off the tip underside and store the nails in your velvet keepsake box for your next wear.' }
      ]
    }
  },
  'track-order': {
    id: 'track-order',
    slug: 'track-order',
    title: 'Track Your Atelier Order',
    subtitle: 'Real-time transit updates for your handcrafted press-on sets.',
    status: 'published',
    seo_title: 'Track Order Live | Nailsbyhelina',
    seo_description: 'Check the dispatch status and live courier tracking for your Nailsbyhelina order.',
    content: {
      instructions: 'Enter your 6-character order number (e.g., NH-8492) or Blue Dart AWB waybill number to view the live status of your handcrafted sets.',
      courier_info: 'All domestic deliveries are dispatched via express courier partners. You will receive SMS & WhatsApp status alerts as your package enters transit.',
      support_contact: 'If your order has not moved within 48 hours, reach out to concierge@nailsbyhelina.com with your order reference.'
    }
  },
  'studio-concierge': {
    id: 'studio-concierge',
    slug: 'studio-concierge',
    title: 'Studio & Concierge Information',
    subtitle: 'Bespoke consultations, custom designs, and private appointments.',
    status: 'published',
    seo_title: 'Studio Concierge | Nailsbyhelina',
    seo_description: 'Learn about Nailsbyhelina private studio bookings, custom design consultations, and concierge assistance.',
    content: {
      status: 'Online nail boutique open 24/7 across India. Private studio booking appointments launching soon.',
      opening_soon_message: 'Our flagship private nail studio is undergoing final curated design touches. In the meantime, all bespoke nail sets are hand-painted in our atelier and delivered pan-India.',
      support_hours: 'Concierge desk active Monday to Sunday from 10:00 AM to 7:00 PM IST.',
      booking_information: 'When in-studio appointments open, clients can book 1-on-1 sessions with master artists for luxury gel sculpting, nail extensions, and bespoke bridal nail wardrobes.'
    }
  },
  footer: {
    id: 'footer',
    slug: 'footer',
    title: 'Footer Content & Settings',
    subtitle: 'Centralized copy and configuration for the customer-facing footer.',
    status: 'published',
    seo_title: 'Footer Settings',
    seo_description: 'Centralized footer text, newsletter copy, business hours, and copyright.',
    content: {
      brand_mission: 'Elevating modern self-care with couture press-on sets, bespoke gel art kits, and handcrafted reusable nail designs delivered across India.',
      short_description: 'Elevating modern self-care with couture press-on sets, bespoke gel art kits, and handcrafted reusable nail designs delivered across India.',
      concierge_heading: 'Studio Concierge',
      newsletter_heading: 'The Atelier Gazette',
      newsletter_description: 'Subscribe for private collection drops, nail rituals, and 10% off your first order.',
      business_hours: 'Mon – Sun: 10:00 AM – 7:00 PM (WhatsApp & Email)',
      copyright_text: `© ${new Date().getFullYear()} Nailsbyhelina Luxury Nail Studio. All rights reserved.`
    }
  }
};

const LOCAL_STORAGE_PAGES_KEY = 'helinart_content_pages_cache_v1';

function getLocalPages() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { ...DEFAULT_PAGES };
}

function saveLocalPages(pages) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PAGES_KEY, JSON.stringify(pages));
  } catch (e) {}
}

export const pageService = {
  /**
   * Fetch a single published page for customer-facing display
   * If allowDraft is true, returns draft content (e.g. for Admin preview)
   */
  async getPageBySlug(slug, allowDraft = false) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('content_pages')
          .select('*')
          .eq('slug', slug);

        if (!allowDraft) {
          query = query.eq('status', 'published');
        }

        const { data, error } = await query.maybeSingle();

        if (!error && data) {
          return {
            ...DEFAULT_PAGES[slug],
            ...data,
            content: {
              ...(DEFAULT_PAGES[slug]?.content || {}),
              ...(typeof data.content === 'object' && data.content ? data.content : {})
            }
          };
        }
      } catch (err) {
        console.warn(`[CMS] Supabase getPageBySlug("${slug}") fallback:`, err.message);
      }
    }

    // Local / Default fallback
    const local = getLocalPages();
    const candidate = local[slug] || DEFAULT_PAGES[slug];
    if (!candidate) return null;

    if (!allowDraft && candidate.status !== 'published') {
      return null;
    }

    return candidate;
  },

  /**
   * Fetch all pages (draft & published) for Admin CMS management
   */
  async getAllPages() {
    let dbPages = [];
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('content_pages')
          .select('*')
          .order('title', { ascending: true });

        if (!error && Array.isArray(data)) {
          dbPages = data;
        }
      } catch (err) {
        console.warn('[CMS] Supabase getAllPages fallback:', err.message);
      }
    }

    const local = getLocalPages();
    const result = { ...DEFAULT_PAGES, ...local };

    // Overlay database pages
    dbPages.forEach(p => {
      result[p.slug] = {
        ...(DEFAULT_PAGES[p.slug] || {}),
        ...p,
        content: {
          ...(DEFAULT_PAGES[p.slug]?.content || {}),
          ...(typeof p.content === 'object' && p.content ? p.content : {})
        }
      };
    });

    return Object.values(result);
  },

  /**
   * Save changes as Draft without publishing
   */
  async saveDraft(slug, pageData, user) {
    const payload = {
      id: slug,
      slug,
      title: pageData.title || DEFAULT_PAGES[slug]?.title || slug,
      subtitle: pageData.subtitle || '',
      content: pageData.content || {},
      status: 'draft',
      seo_title: pageData.seo_title || pageData.title || '',
      seo_description: pageData.seo_description || pageData.subtitle || '',
      updated_by: user?.email || 'admin',
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('content_pages')
        .upsert(payload, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error('[CMS] Failed to save draft:', error);
        throw new Error(error.message || 'Database error saving draft');
      }
      return data;
    }

    // Local fallback
    const local = getLocalPages();
    local[slug] = payload;
    saveLocalPages(local);
    return payload;
  },

  /**
   * Publish page live to customer website
   */
  async publishPage(slug, pageData, user) {
    const payload = {
      id: slug,
      slug,
      title: pageData.title || DEFAULT_PAGES[slug]?.title || slug,
      subtitle: pageData.subtitle || '',
      content: pageData.content || {},
      status: 'published',
      seo_title: pageData.seo_title || pageData.title || '',
      seo_description: pageData.seo_description || pageData.subtitle || '',
      updated_by: user?.email || 'admin',
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('content_pages')
        .upsert(payload, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error('[CMS] Failed to publish page:', error);
        throw new Error(error.message || 'Database error publishing page');
      }
      return data;
    }

    // Local fallback
    const local = getLocalPages();
    local[slug] = payload;
    saveLocalPages(local);
    return payload;
  },

  /**
   * Unpublish page (revert to draft)
   */
  async unpublishPage(slug, user) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('content_pages')
        .update({
          status: 'draft',
          updated_by: user?.email || 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const local = getLocalPages();
    if (local[slug]) {
      local[slug].status = 'draft';
      saveLocalPages(local);
    }
    return local[slug];
  },

  /**
   * Helper to fetch published footer content
   */
  async getFooterContent() {
    const page = await this.getPageBySlug('footer', false);
    return page?.content || DEFAULT_PAGES.footer.content;
  }
};
