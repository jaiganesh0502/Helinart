import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_HOMEPAGE_PUBLISHED_KEY = 'helinart_homepage_published_v1';
const LOCAL_HOMEPAGE_DRAFT_KEY = 'helinart_homepage_draft_v1';

const defaultContent = {
  id: 'current',
  status: 'published',
  hero_eyebrow: 'New atelier collection drop',
  hero_heading: 'Haute couture nail art,',
  hero_highlight: 'made effortless.',
  hero_description: 'Discover professional-quality reusable press-on sets sculpted by master artists, delivered directly to your doorstep across India.',
  primary_cta_text: 'Explore nail sets',
  secondary_cta_text: 'Studio Opening Soon',
  collection_heading: 'Curated Nail Collections',
  collection_description: 'Handcrafted press-on sets designed with precision gel artistry and long-lasting durability.',
  announcement_text: 'Complimentary express pan-India delivery on orders over ₹999 ✨',
  footer_text: 'Haute couture press-on nails sculpted with salon-grade precision and delivered across India.',
  updated_at: new Date().toISOString()
};

/**
 * Strict column whitelist matching production public.homepage_content schema.
 * Social/support fields (instagram_handle, whatsapp_number, etc.) belong strictly in site_settings.
 */
const VALID_HOMEPAGE_COLUMNS = [
  'hero_eyebrow',
  'hero_heading',
  'hero_highlight',
  'hero_description',
  'primary_cta_text',
  'secondary_cta_text',
  'collection_heading',
  'collection_description',
  'announcement_text',
  'footer_text'
];

/**
 * Builds an explicit, sanitized payload for the homepage_content table.
 */
function buildHomepagePayload(input = {}, status = 'published') {
  const isDraft = status === 'draft';
  const now = new Date().toISOString();

  const payload = {
    id: isDraft ? 'current_draft' : 'current',
    status: isDraft ? 'draft' : 'published',
    updated_at: now
  };

  if (!isDraft) {
    payload.published_at = now;
  }

  for (const col of VALID_HOMEPAGE_COLUMNS) {
    if (input[col] !== undefined) {
      payload[col] = input[col];
    }
  }

  return payload;
}

export const contentService = {
  /**
   * Customer gets published content only
   */
  async getPublishedContent() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('id', 'current')
        .eq('status', 'published')
        .maybeSingle();

      if (!error && data) return data;
    }

    try {
      const stored = localStorage.getItem(LOCAL_HOMEPAGE_PUBLISHED_KEY);
      return stored ? JSON.parse(stored) : defaultContent;
    } catch (e) {
      return defaultContent;
    }
  },

  /**
   * Admin gets draft content (or published if no draft)
   */
  async getDraftContent() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('id', 'current_draft')
        .maybeSingle();

      if (!error && data) return data;
    }

    try {
      const draft = localStorage.getItem(LOCAL_HOMEPAGE_DRAFT_KEY);
      if (draft) return JSON.parse(draft);
      return await this.getPublishedContent();
    } catch (e) {
      return defaultContent;
    }
  },

  /**
   * Admin: Save Draft (Strictly sends verified homepage_content columns)
   */
  async saveDraft(content) {
    const record = buildHomepagePayload(content, 'draft');

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('homepage_content')
        .upsert(record)
        .select()
        .single();

      if (error) {
        console.error('Supabase homepage_content saveDraft error:', error);
        throw error;
      }
      localStorage.setItem(LOCAL_HOMEPAGE_DRAFT_KEY, JSON.stringify(data || record));
      return data || record;
    }

    localStorage.setItem(LOCAL_HOMEPAGE_DRAFT_KEY, JSON.stringify(record));
    return record;
  },

  /**
   * Admin: Publish Live (Strictly sends verified homepage_content columns)
   */
  async publishContent(content) {
    const record = buildHomepagePayload(content, 'published');

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('homepage_content')
        .upsert(record)
        .select()
        .single();

      if (error) {
        console.error('Supabase homepage_content publish error:', error);
        throw error;
      }

      localStorage.setItem(LOCAL_HOMEPAGE_PUBLISHED_KEY, JSON.stringify(data || record));
      localStorage.setItem(
        LOCAL_HOMEPAGE_DRAFT_KEY, 
        JSON.stringify({ ...(data || record), id: 'current_draft', status: 'draft' })
      );
      return data || record;
    }

    localStorage.setItem(LOCAL_HOMEPAGE_PUBLISHED_KEY, JSON.stringify(record));
    localStorage.setItem(
      LOCAL_HOMEPAGE_DRAFT_KEY, 
      JSON.stringify({ ...record, id: 'current_draft', status: 'draft' })
    );
    return record;
  }
};
