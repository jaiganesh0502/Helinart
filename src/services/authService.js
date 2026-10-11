import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LOCAL_USERS_KEY = 'helinart_local_auth_users_v1';
const CURRENT_SESSION_KEY = 'helinart_local_current_session_v1';

// Standardized error mapper adhering strictly to specifications
function mapAuthError(err, context = 'login') {
  if (!err) return null;
  const msg = (err.message || '').toLowerCase();
  const status = err.status || 0;
  const code = (err.code || '').toLowerCase();

  // Network or connectivity issue
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
    return "We couldn't connect. Please try again.";
  }

  // Unconfirmed / pending email verification
  if (msg.includes('email not confirmed') || code.includes('email_not_confirmed')) {
    return "Please verify your email before signing in.";
  }

  // Account already exists
  if (
    msg.includes('already registered') ||
    msg.includes('already exists') ||
    code.includes('user_already_exists') ||
    (context === 'signup' && (status === 422 || (status === 400 && msg.includes('registered'))))
  ) {
    return "An account already exists with this email. Please sign in.";
  }

  // Wrong password or email
  if (
    msg.includes('invalid login credentials') ||
    msg.includes('invalid credentials') ||
    msg.includes('invalid email or password') ||
    code.includes('invalid_credentials')
  ) {
    return "Invalid email or password.";
  }

  // Rate limit
  if (msg.includes('rate limit')) {
    return "Too many sign in/up attempts. Please wait a moment and try again.";
  }

  return err.message || "An authentication error occurred. Please try again.";
}

// Fallback storage for local demonstration without credentials
function getLocalUsers() {
  const stored = localStorage.getItem(LOCAL_USERS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  const defaults = [
    {
      id: 'usr-cust-01',
      email: 'customer@nailsbyhelina.com',
      role: 'customer',
      full_name: 'Verified Customer',
      phone: '+91 98000 00000',
      created_at: new Date().toISOString()
    }
  ];
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaults));
  return defaults;
}

export const authService = {
  /**
   * Customer Signup
   * Open to any visitor with any valid email address.
   * Every public signup strictly receives role = 'customer'.
   */
  async signUp({ email, password, fullName, phone }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = (phone || '').trim();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone || null,
            role: 'customer' // Enforced metadata; public users NEVER receive admin
          }
        }
      });

      if (error) {
        throw new Error(mapAuthError(error, 'signup'));
      }

      // Check if user already exists (Supabase returns empty identities array when email confirmation is active)
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error("An account already exists with this email. Please sign in.");
      }

      const needsEmailConfirmation = Boolean(data?.user && !data?.session);

      // If immediate session is granted, sync to public.profiles
      if (data?.session && data?.user) {
        supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: cleanEmail,
            full_name: cleanName,
            phone: cleanPhone,
            role: 'customer'
          })
          .catch(() => {});
      }

      return {
        user: data.user,
        session: data.session,
        needsEmailConfirmation
      };
    }

    // Local Fallback
    const users = getLocalUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account already exists with this email. Please sign in.");
    }
    const newUser = {
      id: 'usr-' + Date.now(),
      email: cleanEmail,
      password,
      role: 'customer', // Forced
      full_name: cleanName,
      phone: cleanPhone,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(newUser));
    return { user: newUser, session: { user: newUser }, needsEmailConfirmation: false };
  },

  /**
   * Login
   * Any registered customer can log in using email and password.
   */
  async signIn({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        throw new Error(mapAuthError(error, 'login'));
      }

      return data;
    }

    // Local Fallback
    const users = getLocalUsers();
    const user = users.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === password
    );
    if (!user) {
      throw new Error("Invalid email or password.");
    }
    if (user.email.toLowerCase() === 'helina.nailart@gmail.com') {
      user.role = 'admin';
    }
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
    return { user, session: { user } };
  },

  /**
   * Resend Verification Email
   */
  async resendVerificationEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail
      });
      if (error) {
        throw new Error(mapAuthError(error, 'resend'));
      }
      return true;
    }
    return true;
  },

  /**
   * Send Password Reset Link
   */
  async resetPassword(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) {
        throw new Error(mapAuthError(error, 'reset'));
      }
      return true;
    }
    return true;
  },

  /**
   * Update Password (After clicking reset link)
   */
  async updatePassword(newPassword) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) {
        throw new Error(mapAuthError(error, 'update_password'));
      }
      return data;
    }
    return true;
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

      const isHelinaAdmin = user.email?.toLowerCase() === 'helina.nailart@gmail.com';
      const effectiveRole = isHelinaAdmin ? 'admin' : (profile?.role === 'admin' ? 'customer' : (profile?.role || 'customer'));

      // If the authenticated user is the designated admin, ensure database profile matches
      if (isHelinaAdmin && profile?.role !== 'admin') {
        supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            role: 'admin',
            full_name: profile?.full_name || user.user_metadata?.full_name || 'Helina Admin',
            phone: profile?.phone || user.user_metadata?.phone || '',
            updated_at: new Date().toISOString()
          })
          .then(() => {})
          .catch(() => {});
      }

      return {
        ...user,
        role: effectiveRole,
        full_name: profile?.full_name || user.user_metadata?.full_name || (isHelinaAdmin ? 'Helina Admin' : ''),
        phone: profile?.phone || user.user_metadata?.phone || '',
        avatar_url: profile?.avatar_url || ''
      };
    }

    // Local Fallback
    const stored = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!stored) return null;
    try {
      const u = JSON.parse(stored);
      if (u && u.email?.toLowerCase() === 'helina.nailart@gmail.com') {
        u.role = 'admin';
      }
      return u;
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
