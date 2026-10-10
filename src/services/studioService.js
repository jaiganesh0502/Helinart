import { settingsService } from './settingsService.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export const studioService = {
  async getStudioSettings() {
    return await settingsService.getStudioSettings();
  },

  async setStudioBookingEnabled(enabled) {
    return await settingsService.setStudioBookingEnabled(enabled);
  },

  async updateStudioSettings(updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('studio_settings')
        .upsert({
          ...updates,
          id: 'studio_main',
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const current = await settingsService.getStudioSettings();
    const merged = { ...current, ...updates };
    localStorage.setItem('helinart_studio_settings_v1', JSON.stringify(merged));
    return merged;
  }
};
