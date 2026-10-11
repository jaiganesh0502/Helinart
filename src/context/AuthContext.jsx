import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const ADMIN_EMAIL = 'helina.nailart@gmail.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session on startup
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (!isSupabaseConfigured) {
          const current = await authService.getCurrentUser();
          if (mounted) {
            setUser(current);
          }
          return;
        }

        // 1. Instant local session check (0ms network latency)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn('[AUTH] getSession warning:', sessionError);
        }

        if (session?.user) {
          // Immediately set base user from session so route guards & UI do not wait
          const isHelinaAdmin = session.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
          if (mounted) {
            setUser({
              ...session.user,
              role: isHelinaAdmin ? 'admin' : 'customer'
            });
          }

          // 2. Asynchronously sync full profile with 3-second timeout protection
          try {
            const profilePromise = authService.getCurrentUser();
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Profile sync timeout')), 3000)
            );
            const current = await Promise.race([profilePromise, timeoutPromise]);
            if (mounted && current) {
              setUser(current);
            }
          } catch (profileErr) {
            console.warn('[AUTH] Profile sync warning (using cached user):', profileErr.message);
          }
        } else {
          if (mounted) {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('[AUTH] initialization error:', err);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    // Listen to Supabase Auth State changes once
    let authListener = null;
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          try {
            const profileUser = await authService.getCurrentUser();
            if (mounted) setUser(profileUser);
          } catch (e) {
            if (mounted) {
              const isHelinaAdmin = session.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
              setUser({ ...session.user, role: isHelinaAdmin ? 'admin' : 'customer' });
            }
          }
        } else {
          if (mounted) setUser(null);
        }
      });
      authListener = subscription;
    }

    return () => {
      mounted = false;
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.signIn({ email, password });
      const current = await authService.getCurrentUser();
      setUser(current);
      return { success: true, user: current };
    } catch (err) {
      const isUnconfirmed = err.message?.toLowerCase().includes('verify your email');
      return { success: false, error: err.message, needsEmailConfirmation: isUnconfirmed };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ email, password, fullName, phone }) => {
    setLoading(true);
    try {
      const res = await authService.signUp({ email, password, fullName, phone });
      const current = await authService.getCurrentUser();
      if (current) setUser(current);
      return { 
        success: true, 
        user: current || res.user, 
        needsEmailConfirmation: res.needsEmailConfirmation 
      };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      await authService.resendVerificationEmail(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      await authService.resetPassword(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      await authService.updatePassword(newPassword);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.id, updates);
    if (updated) {
      setUser(prev => ({ ...prev, ...updated }));
    }
    return updated;
  };

  const isEmailAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const effectiveRole = isEmailAdmin ? 'admin' : (user?.role === 'admin' ? 'customer' : (user?.role || 'customer'));

  const profile = user ? {
    id: user.id,
    email: user.email,
    role: effectiveRole,
    full_name: user.full_name || '',
    phone: user.phone || '',
    avatar_url: user.avatar_url || ''
  } : null;

  const role = effectiveRole;

  // EXACT ADMIN ACCESS RULE:
  // Requires:
  // 1. Authenticated user exists
  // 2. profile.role === 'admin'
  // 3. authenticated email === 'helina.nailart@gmail.com'
  const isAdmin = Boolean(
    user &&
    isEmailAdmin &&
    role === 'admin'
  );

  const value = {
    user,
    profile,
    role,
    isAdmin,
    ADMIN_EMAIL,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resendVerificationEmail,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
