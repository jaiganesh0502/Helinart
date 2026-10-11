import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/SEO';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    const res = await resetPassword(email.trim());
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Reset Password | Nailsbyhelina Haute Couture Atelier"
        description="Reset your Nailsbyhelina customer account password."
      />

      <div className="max-w-md w-full space-y-6 bg-[#FFFDFC] p-8 sm:p-10 rounded-3xl border border-[#D8C6C3] shadow-md">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-center p-2.5 shadow-2xs">
            <img src="/helinart-logo.png" alt="Nailsbyhelina Logo" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="font-heading text-3xl font-medium text-[#313851]">Reset Password</h1>
          <p className="text-xs text-[#786866]">
            Enter your registered email address to receive a secure password reset link
          </p>
        </div>

        {success ? (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-heading text-xl text-[#313851]">Check your inbox</h2>
              <p className="text-xs text-[#786866] leading-relaxed">
                We have sent password reset instructions to <strong className="text-[#313851]">{email}</strong>. Please check your inbox and click the link to set a new password.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 rounded-full bg-[#313851] text-[#FFFDFC] text-xs font-semibold hover:bg-[#262D42] transition-colors"
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
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1.5">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email address"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] focus:ring-1 focus:ring-[#9C5550] outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold tracking-wider uppercase shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? 'Sending Link...' : 'SEND RESET LINK'}
              </button>
            </form>

            <div className="text-center text-xs text-[#786866] pt-2 border-t border-[#D8C6C3]/60">
              Remembered your password?{' '}
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
