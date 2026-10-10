import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ADMIN_EMAIL } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isAdminLogin = location.pathname === '/admin/login' || location.state?.from?.startsWith('/admin');
  const from = location.state?.from || (user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? '/admin/dashboard' : '/profile');

  // If already logged in, route immediately
  useEffect(() => {
    if (user) {
      if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate('/admin/dashboard', { replace: true });
      } else if (from && !from.startsWith('/admin')) {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await signIn(email, password);
    setSubmitting(false);

    if (res.success) {
      // If logging in as authorized admin, open admin dashboard
      const isApprovedAdmin =
        res.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (isApprovedAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Normal customer account
        const target = (from && !from.startsWith('/admin')) ? from : '/profile';
        navigate(target, { replace: true });
      }
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Sign In | Nailsbyhelina Haute Couture Atelier"
        description="Sign in to your Nailsbyhelina account to manage orders, favorites, and studio bookings."
      />

      <div className="max-w-md w-full space-y-8 bg-[#FFFDFC] p-8 sm:p-10 rounded-3xl border border-[#D8C6C3] shadow-md">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-center p-2.5 shadow-2xs">
            <img src="/helinart-logo.png" alt="Nailsbyhelina Logo" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="font-heading text-3xl font-medium text-[#313851]">
            {isAdminLogin ? 'Admin Portal Sign In' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-[#786866]">
            {isAdminLogin 
              ? 'Enter authorized administrator credentials to access the Atelier portal' 
              : 'Enter your credentials to access your Nailsbyhelina atelier account'}
          </p>
        </div>

        {/* Portal Switcher Tabs */}
        <div className="flex p-1 bg-[#F6F3ED] rounded-2xl border border-[#D8C6C3]">
          <button
            type="button"
            onClick={() => {
              if (isAdminLogin) navigate('/login');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              !isAdminLogin
                ? 'bg-[#FFFDFC] text-[#313851] shadow-xs'
                : 'text-[#786866] hover:text-[#313851]'
            }`}
          >
            Customer Account
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isAdminLogin) navigate('/admin/login');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              isAdminLogin
                ? 'bg-[#262D42] text-[#C8A46A] shadow-xs'
                : 'text-[#786866] hover:text-[#313851]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FDF2F1] border border-[#F5C2BF] text-xs text-[#9C5550] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminLogin ? "Enter admin email" : "Enter your email address"}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] focus:ring-1 focus:ring-[#9C5550] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isAdminLogin ? "Enter password" : "Enter your password"}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] focus:ring-1 focus:ring-[#9C5550] outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-sm font-semibold tracking-wide shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#FFFDFC] border-t-transparent rounded-full animate-spin" />
                Signing In...
              </span>
            ) : (
              <>
                <span>{isAdminLogin ? 'Sign In to Admin Portal' : 'Sign In to Atelier'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Signup Redirect - Only shown for customer portal */}
        {!isAdminLogin && (
          <div className="text-center text-xs text-[#786866]">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-[#9C5550] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
