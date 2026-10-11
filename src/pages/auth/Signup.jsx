import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Phone, AlertCircle, CheckCircle, Send, ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Signup() {
  const { signUp, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Email verification state
  const [verificationPending, setVerificationPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    // Public signup is ALWAYS role = 'customer'
    const res = await signUp({
      email,
      password,
      fullName,
      phone
    });
    setSubmitting(false);

    if (res.success) {
      if (res.needsEmailConfirmation) {
        setVerificationPending(true);
      } else {
        navigate('/profile');
      }
    } else {
      setError(res.error || 'Failed to create account. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResendSuccess(false);
    const res = await resendVerificationEmail(email);
    setResending(false);
    if (res.success) {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 4000);
    } else {
      setError(res.error || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Create an Account | Nailsbyhelina Haute Couture Atelier"
        description="Join the Nailsbyhelina atelier to enjoy personalized sizing, order tracking, and exclusive press-on drops."
      />

      <div className="max-w-md w-full space-y-6 bg-[#FFFDFC] p-8 sm:p-10 rounded-3xl border border-[#D8C6C3] shadow-md">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-center p-2.5 shadow-2xs">
            <img src="/helinart-logo.png" alt="Nailsbyhelina Logo" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="font-heading text-3xl font-medium text-[#313851]">Join the Atelier</h1>
          <p className="text-xs text-[#786866]">
            Create your personal customer profile for express checkout & order tracking
          </p>
        </div>

        {/* Verification Required Card */}
        {verificationPending ? (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-heading text-xl text-[#313851]">Please verify your email before signing in.</h2>
              <p className="text-xs text-[#786866] leading-relaxed">
                We sent a confirmation link to <strong className="text-[#313851]">{email}</strong>. Please check your inbox and confirm your address to complete your registration.
              </p>
            </div>

            {resendSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verification email sent successfully!</span>
              </div>
            )}

            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full py-3 rounded-full bg-[#F6F3ED] border border-[#D8C6C3] text-xs font-semibold text-[#313851] hover:bg-[#EAE4DC] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{resending ? 'Sending...' : 'Resend Verification Email'}</span>
              </button>

              <Link
                to="/login"
                className="inline-block text-xs font-semibold text-[#9C5550] hover:underline"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3.5 rounded-2xl bg-[#FDF2F1] border border-[#F5C2BF] text-xs text-[#9C5550] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <div className="flex-1">
                  <span>{error}</span>
                  {error.includes('already exists') && (
                    <div className="mt-1">
                      <Link to="/login" className="font-bold underline hover:text-[#793D39]">
                        Click here to Sign In →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  PHONE NUMBER (OPTIONAL)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold tracking-wider uppercase shadow-xs hover:shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? 'Creating Account...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="text-center text-xs text-[#786866] pt-2 border-t border-[#D8C6C3]/60">
              Already have an atelier account?{' '}
              <Link to="/login" className="text-[#9C5550] font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
