import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ADMIN_EMAIL } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Send, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Login() {
  const { signIn, resendVerificationEmail, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [justVerified, setJustVerified] = useState(false);

  // Reset application credential state and password visibility whenever login opens or route changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setError('');
    setResendSuccess(false);

    if (typeof window !== 'undefined' && (window.location.hash.includes('type=signup') || window.location.hash.includes('access_token'))) {
      setJustVerified(true);
    }
  }, [location.pathname]);

  const from = location.state?.from;

  // If already logged in, route immediately
  useEffect(() => {
    if (user) {
      if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate('/admin/dashboard', { replace: true });
      } else if (from && !from.startsWith('/admin')) {
        navigate(from, { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendSuccess(false);
    setSubmitting(true);

    const res = await signIn(email, password);
    setSubmitting(false);

    if (res.success) {
      // Allow browser password manager to detect successful submission and prompt to save
      const isApprovedAdmin =
        res.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (isApprovedAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Customer login: redirect to customer website (profile or customer return page)
        const target = (from && !from.startsWith('/admin')) ? from : '/profile';
        navigate(target, { replace: true });
      }
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address above to resend verification.');
      return;
    }
    setResending(true);
    setResendSuccess(false);
    const res = await resendVerificationEmail(email);
    setResending(false);
    if (res.success) {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } else {
      setError(res.error || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Sign In | Nailsbyhelina Haute Couture Atelier"
        description="Sign in to your Nailsbyhelina account to manage orders, favorites, and studio bookings."
      />

      <div className="max-w-md w-full bg-[#FFFDFC] p-8 sm:p-10 rounded-3xl border border-[#D8C6C3] shadow-md">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-center p-2.5 shadow-2xs">
            <img src="/helinart-logo.png" alt="Nailsbyhelina Logo" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="font-heading text-3xl font-medium text-[#313851]">
            Welcome Back
          </h1>
          <p className="text-xs text-[#786866]">
            Enter your email address and password to sign in
          </p>
        </div>

        {/* 24-32px balanced gap between description and form / alerts */}
        <div className="mt-7 space-y-5">
          {justVerified && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Email verified successfully! You can now sign in to your atelier account.</span>
            </div>
          )}

          {resendSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verification email resent! Please check your inbox and <strong>Spam</strong> folder.</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FDF2F1] border border-[#F5C2BF] text-xs text-[#9C5550] space-y-2.5">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <span>{error}</span>
                </div>
              </div>

              {(error.includes('verify your email') || error.includes('rate limit')) && (
                <div className="pt-2 border-t border-[#F5C2BF]/50 space-y-2">
                  <p className="text-[11px] text-[#786866] leading-relaxed">
                    💡 <strong>Tip:</strong> Supabase confirmation emails often land in your <strong>Spam / Junk</strong> folder (sender: <code>noreply@mail.app.supabase.io</code>).
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="px-3 py-1.5 rounded-xl bg-[#9C5550] text-[#FFFDFC] text-xs font-semibold hover:bg-[#8A4743] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>{resending ? 'Sending...' : 'Resend Verification Email'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Customer Login Form */}
          <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  name="username"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] focus:ring-1 focus:ring-[#9C5550] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-[#313851] uppercase tracking-wider">
                  PASSWORD
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#9C5550] font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] focus:ring-1 focus:ring-[#9C5550] outline-none transition-all"
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
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-sm font-semibold tracking-wide shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#FFFDFC] border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Account creation link */}
          <div className="pt-2 text-center text-xs text-[#786866]">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-[#9C5550] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
