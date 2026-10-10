import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_SETTINGS_KEY = 'helinart_site_settings_v1';
const LOCAL_STUDIO_KEY = 'helinart_studio_settings_v1';

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

export const settingsService = {
  /**
   * Get Site Settings (Social, Brand, Shipping, Studio Flag)
   */
  async getSettings() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      if (!error && data) return data;
    }

    try {
      const stored = localStorage.getItem(LOCAL_SETTINGS_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  },

  /**
   * Update Site Settings
   */
  async updateSettings(updates) {
    const newSettings = {
      ...updates,
      id: 'global',
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      let { data, error } = await supabase
        .from('site_settings')
        .upsert(newSettings)
        .select()
        .single();

      if (error) {
        const updateRes = await supabase
          .from('site_settings')
          .update(newSettings)
          .eq('id', 'global')
          .select()
          .single();
        if (!updateRes.error && updateRes.data) {
          data = updateRes.data;
          error = null;
        }
      }

      if (error) {
        console.error('Supabase site_settings save error:', error);
        throw error;
      }
      try {
        localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(data || newSettings));
      } catch (e) {}
      return data || newSettings;
    }

    const current = await this.getSettings();
    const merged = { ...current, ...newSettings };
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(merged));
    return merged;

  },

  /**
   * Get Studio Settings
   */
  async getStudioSettings() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('studio_settings')
        .select('*')
        .eq('id', 'studio_main')
        .maybeSingle();

      if (!error && data) return data;
    }

    try {
      const stored = localStorage.getItem(LOCAL_STUDIO_KEY);
      return stored ? { ...defaultStudioSettings, ...JSON.parse(stored) } : defaultStudioSettings;
    } catch (e) {
      return defaultStudioSettings;
    }
  },

  /**
   * Update Studio Booking Availability (Central Toggle)
   */
  async setStudioBookingEnabled(enabled) {
    const isBool = Boolean(enabled);

    // Update both studio_settings and site_settings
    await this.updateSettings({ studio_booking_enabled: isBool });

    if (isSupabaseConfigured) {
      await supabase
        .from('studio_settings')
        .update({ booking_enabled: isBool, updated_at: new Date().toISOString() })
        .eq('id', 'studio_main');
    }

    const studio = await this.getStudioSettings();
    const updatedStudio = { ...studio, booking_enabled: isBool };
    localStorage.setItem(LOCAL_STUDIO_KEY, JSON.stringify(updatedStudio));

    return isBool;
  }
};
