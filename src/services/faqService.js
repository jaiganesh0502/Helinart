import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    category: 'Sizing & Fit',
    question: 'How do I know what press-on size to order?',
    answer: 'You can easily measure your natural nail widths using clear scotch tape and a millimeter ruler (refer to our interactive /size-guide). Alternatively, we recommend ordering our ₹199 Atelier Sizing Kit, which ships 10 sample tips to your doorstep and gives you ₹199 back in store credit.',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'faq-2',
    category: 'Sizing & Fit',
    question: 'What if my nails are between sizes?',
    answer: 'Always size up! If your index finger measures 12.5mm, pick size 4 (13mm). You can gently file down the soft lateral edges of our tips with the included mini file for a bespoke glove-like fit.',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'faq-3',
    category: 'Application & Hold',
    question: 'How long do Nailsbyhelina press-on sets last?',
    answer: 'With our medical adhesive tabs, sets typically stay firmly locked for 3 to 7 days, making them perfect for events, shoots, and weekend outings. With studio liquid brush glue, sets hold for up to 3 weeks without lifting.',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'faq-4',
    category: 'Application & Hold',
    question: 'Can I shower, wash dishes, or wash my hair with them on?',
    answer: 'Yes! Our medical tabs and resin are 100% waterproof once cured. Just avoid submerging hands in hot water or saunas for the first 60 minutes after initial application.',
    sort_order: 4,
    is_active: true
  },
  {
    id: 'faq-5',
    category: 'Reusability & Care',
    question: 'How do I remove the press-ons without damaging my natural nails?',
    answer: 'Never pry or force the nails off! Simply soak fingertips in a bowl of warm water with gentle soap and a few drops of our Rose Cuticle Elixir for 10 minutes. The adhesive gummy bonds will soften, allowing you to slide them off with the wooden orange stick.',
    sort_order: 5,
    is_active: true
  },
  {
    id: 'faq-6',
    category: 'Reusability & Care',
    question: 'Can I truly reuse the press-on tips?',
    answer: 'Yes, up to 5 times! Because our nails are sculpted from high-durability acrylic polymer rather than cheap ABS plastic, you can peel the old gummy tab off the underside and reapply with a fresh tab whenever you wish.',
    sort_order: 6,
    is_active: true
  },
  {
    id: 'faq-7',
    category: 'Shipping & Delivery',
    question: 'How fast do orders ship across India?',
    answer: 'Bengaluru orders arrive in 24 to 48 hours via local express courier. Tier-1 metros (Delhi NCR, Mumbai, Chennai, Hyderabad, Kolkata) take 2 to 3 business days. Pan-India delivery takes 3 to 5 business days. Free shipping applies on all orders above ₹999.',
    sort_order: 7,
    is_active: true
  },
  {
    id: 'faq-8',
    category: 'Studio Bookings',
    question: 'Why is a ₹200 advance deposit required for in-studio appointments?',
    answer: 'Because our private studio operates on a 1-on-1 model with dedicated master artists, the ₹200 deposit reserves your private artist slot. It is 100% credited toward your final service total on the appointment day.',
    sort_order: 8,
    is_active: true
  },
  {
    id: 'faq-9',
    category: 'Studio Bookings',
    question: 'Can I reschedule or cancel my in-studio appointment?',
    answer: 'Yes. You can reschedule or cancel for free up to 24 hours prior to your slot directly through our booking portal. Cancellations within 24 hours forfeit the ₹200 deposit to compensate the scheduled artisan.',
    sort_order: 9,
    is_active: true
  }
];

const LOCAL_STORAGE_FAQS_KEY = 'helinart_faqs_cache_v1';

function getLocalFaqs() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FAQS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...DEFAULT_FAQS];
}

function saveLocalFaqs(faqs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_FAQS_KEY, JSON.stringify(faqs));
  } catch (e) {}
}

export const faqService = {
  /**
   * Fetch FAQs ordered by sort_order
   */
  async getFaqs(activeOnly = true) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('faqs')
          .select('*')
          .order('sort_order', { ascending: true });

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[FAQ] Supabase getFaqs fallback:', err.message);
      }
    }

    const local = getLocalFaqs();
    return activeOnly ? local.filter(f => f.is_active !== false) : local;
  },

  /**
   * Create a new FAQ entry
   */
  async createFaq(faqData) {
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: faqData.question?.trim() || '',
      answer: faqData.answer?.trim() || '',
      category: faqData.category || 'General',
      sort_order: Number(faqData.sort_order) || 10,
      is_active: faqData.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('faqs')
        .insert(newFaq)
        .select()
        .single();

      if (error) {
        console.error('[FAQ] Failed to create FAQ:', error);
        throw new Error(error.message || 'Database error creating FAQ');
      }
      return data;
    }

    const local = getLocalFaqs();
    local.push(newFaq);
    saveLocalFaqs(local);
    return newFaq;
  },

  /**
   * Update existing FAQ entry
   */
  async updateFaq(id, faqData) {
    const payload = {
      question: faqData.question?.trim(),
      answer: faqData.answer?.trim(),
      category: faqData.category || 'General',
      sort_order: Number(faqData.sort_order) || 0,
      is_active: Boolean(faqData.is_active),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('faqs')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[FAQ] Failed to update FAQ:', error);
        throw new Error(error.message || 'Database error updating FAQ');
      }
      return data;
    }

    const local = getLocalFaqs();
    const idx = local.findIndex(f => f.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...payload };
      saveLocalFaqs(local);
      return local[idx];
    }
    return null;
  },

  /**
   * Delete FAQ
   */
  async deleteFaq(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[FAQ] Failed to delete FAQ:', error);
        throw new Error(error.message || 'Database error deleting FAQ');
      }
      return true;
    }

    const local = getLocalFaqs().filter(f => f.id !== id);
    saveLocalFaqs(local);
    return true;
  }
};
