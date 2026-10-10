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
  instagram_handle: '@nails.by.helina',
  whatsapp_number: '+91 93614 05676',
  footer_text: 'Haute couture press-on nails sculpted with salon-grade precision and delivered across India.',
  updated_at: new Date().toISOString()
};

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
   * Admin: Save Draft
   */
  async saveDraft(content) {
    const record = {
      ...content,
      id: 'current_draft',
      status: 'draft',
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      await supabase.from('homepage_content').upsert(record);
    }
    localStorage.setItem(LOCAL_HOMEPAGE_DRAFT_KEY, JSON.stringify(record));
    return record;
  },

  /**
   * Admin: Publish Live
   */
  async publishContent(content) {
    const record = {
      ...content,
      id: 'current',
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('homepage_content').upsert(record);
      if (error) throw error;
    }

    localStorage.setItem(LOCAL_HOMEPAGE_PUBLISHED_KEY, JSON.stringify(record));
    localStorage.setItem(LOCAL_HOMEPAGE_DRAFT_KEY, JSON.stringify({ ...record, id: 'current_draft', status: 'draft' }));
    return record;
  }
};
