import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      navigate('/profile');
    } else {
      setError(res.error || 'Failed to create account. Please try again.');
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

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FDF2F1] border border-[#F5C2BF] text-xs text-[#9C5550] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
              Phone Number <span className="text-[#786866] font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                Confirm
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#786866] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-sm font-semibold tracking-wide shadow-xs hover:shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {submitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-[#786866] pt-2 border-t border-[#D8C6C3]/60">
          Already have an atelier account?{' '}
          <Link to="/login" className="text-[#9C5550] font-semibold hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
