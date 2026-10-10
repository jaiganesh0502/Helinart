import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_AUDIT_KEY = 'helinart_audit_logs_v1';

export const auditService = {
  /**
   * Log administrative action
   * SENSITIVITY RULE: Never log passwords, tokens, or credentials
   */
  async logAction({ action, entityType, entityId, details = {}, adminUser = null }) {
    // Sanitize details
    const sanitized = { ...details };
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.secret;
    delete sanitized.apiKey;

    const logRecord = {
      admin_user_id: adminUser?.id || null,
      admin_email: adminUser?.email || 'helina.nailart@gmail.com',
      action,
      entity_type: entityType,
      entity_id: entityId ? String(entityId) : null,
      details: sanitized,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('audit_logs').insert([logRecord]);
      } catch (err) {
        console.warn('Failed to insert audit log to Supabase', err);
      }
    }

    // Local Fallback
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_AUDIT_KEY) || '[]');
      stored.unshift({ id: 'log-' + Date.now(), ...logRecord });
      localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(stored.slice(0, 100)));
    } catch (e) {}
  },

  /**
   * Admin: Get recent audit logs
   */
  async getLogs({ limit = 50 } = {}) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data) return data;
    }

    try {
      return JSON.parse(localStorage.getItem(LOCAL_AUDIT_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }
};
