import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_USERS_KEY = 'helinart_local_auth_users_v1';
const CURRENT_SESSION_KEY = 'helinart_local_current_session_v1';

// Seed demo admin & customer in local fallback
function getLocalUsers() {
  const stored = localStorage.getItem(LOCAL_USERS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  const defaults = [
    {
      id: 'usr-admin-01',
      email: 'admin@nailsbyhelina.com',
      password: 'adminpassword123',
      role: 'admin',
      full_name: 'Helina Atelier Admin',
      phone: '+91 93614 05676',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr-cust-01',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer',
      full_name: 'Priya Sharma',
      phone: '+91 98765 43210',
      created_at: new Date().toISOString()
    }
  ];
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaults));
  return defaults;
}

export const authService = {
  /**
   * Customer Signup
   * CRITICAL SECURITY RULE: Public signup ALWAYS assigns role = 'customer'
   */
  async signUp({ email, password, fullName, phone }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: (phone || '').trim(),
            role: 'customer' // Enforced
          }
        }
      });
      if (error) throw error;
      
      // Upsert profile record explicitly to guarantee immediate availability
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName.trim(),
          phone: (phone || '').trim(),
          role: 'customer' // NEVER allow admin on signup
        });
      }
      return data;
    }

    // Local Fallback
    const users = getLocalUsers();
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: 'usr-' + Date.now(),
      email: email.trim().toLowerCase(),
      password,
      role: 'customer', // Forced
      full_name: fullName.trim(),
      phone: (phone || '').trim(),
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(newUser));
    return { user: newUser, session: { user: newUser } };
  },

  /**
   * Login
   */
  async signIn({ email, password }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (error) throw error;
      return data;
    }

    // Local Fallback
    const users = getLocalUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password. Please verify credentials.');
    }
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
    return { user, session: { user } };
  },

  /**
   * Logout
   */
  async signOut() {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Supabase signout error', error);
    }
    localStorage.removeItem(CURRENT_SESSION_KEY);
    return true;
  },

  /**
   * Get Current Session User & Role
   */
  async getCurrentUser() {
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Fetch role & profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      return {
        ...user,
        role: profile?.role || 'customer',
        full_name: profile?.full_name || user.user_metadata?.full_name || '',
        phone: profile?.phone || user.user_metadata?.phone || '',
        avatar_url: profile?.avatar_url || ''
      };
    }

    // Local Fallback
    const stored = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  },

  /**
   * Update Profile Details
   */
  async updateProfile(userId, { fullName, phone, avatarUrl }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Local Fallback
    const users = getLocalUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx > -1) {
      users[idx] = { ...users[idx], full_name: fullName, phone };
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(users[idx]));
      return users[idx];
    }
    return null;
  },

  /**
   * Admin: List all customers
   */
  async getCustomers() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }

    return getLocalUsers().map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      phone: u.phone,
      role: u.role,
      created_at: u.created_at
    }));
  }
};
