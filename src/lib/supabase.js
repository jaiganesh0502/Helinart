import { createClient } from '@supabase/supabase-js';

// Project Supabase instance configuration (Public Client URL and Anonymous Publishable Key)
const PROJECT_SUPABASE_URL = 'https://aybjrctkozoxhenahxhb.supabase.co';
const PROJECT_SUPABASE_ANON_KEY = 'sb_publishable_YGZCbAIqUXzIoUWcjOwHaw_eVe0a2gQ';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});
const supabaseUrl = env?.VITE_SUPABASE_URL || env?.SUPABASE_URL || PROJECT_SUPABASE_URL;
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY || env?.SUPABASE_PUBLISHABLE_KEY || PROJECT_SUPABASE_ANON_KEY;

/**
 * Returns true if valid Supabase credentials are configured
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey.length > 20
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'helinart_supabase_auth_token'
    }
  }
);

