import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ADMIN_EMAIL } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import SEO from '../../components/SEO';

export default function AdminLogin() {
  const { signIn, signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset form when route opens or changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setError('');
  }, [location.pathname]);

  const from = location.state?.from;

  // If already logged in as authorized administrator, route immediately to dashboard
  useEffect(() => {
    if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      const destination = (from && from.startsWith('/admin')) ? from : '/admin/dashboard';
      navigate(destination, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await signIn(email, password);
    setSubmitting(false);

    if (res.success) {
      const isApprovedAdmin = res.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (isApprovedAdmin) {
        const destination = (from && from.startsWith('/admin')) ? from : '/admin/dashboard';
        navigate(destination, { replace: true });
      } else {
        // Authenticated account does not possess admin rights
        setError('Access denied. This portal is strictly reserved for authorized atelier administration.');
        await signOut();
      }
    } else {
      setError(res.error || 'Invalid administrator email or password.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F6F3ED]">
      <SEO 
        title="Admin Sign In | Nailsbyhelina Atelier"
        description="Authorized administrator sign in for the Nailsbyhelina Atelier management portal."
      />

      <div className="max-w-md w-full bg-[#FFFDFC] p-8 sm:p-10 rounded-3xl border border-[#D8C6C3] shadow-md">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#262D42] border border-[#313851] flex items-center justify-center p-2.5 shadow-sm text-[#C8A46A]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-medium text-[#313851]">
            Admin Portal Sign In
          </h1>
          <p className="text-xs text-[#786866]">
            Enter authorized administrator credentials to access the Atelier portal
          </p>
        </div>

        {/* Spacing & Alerts */}
        <div className="mt-7 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FDF2F1] border border-[#F5C2BF] text-xs text-[#9C5550] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
            <div>
              <label htmlFor="admin-login-email" className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-login-email"
                  name="username"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email address"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#262D42] focus:ring-1 focus:ring-[#262D42] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-login-password" className="block text-xs font-semibold text-[#313851] uppercase tracking-wider">
                  PASSWORD
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#262D42] focus:ring-1 focus:ring-[#262D42] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#786866] hover:text-[#313851] transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#262D42] hover:bg-[#1E2333] text-[#FFFDFC] text-sm font-semibold tracking-wide shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#FFFDFC] border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A46A]" />
                </>
              )}
            </button>
          </form>

          {/* Return link */}
          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-[#786866] hover:text-[#313851] transition-colors">
              ← Return to Nailsbyhelina Store
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
