import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, ShoppingBag, Heart, LogOut, Shield, Check, Save } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Profile() {
  const { user, isAdmin, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.full_name && !fullName) setFullName(user.full_name);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ fullName, phone });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO 
        title="My Atelier Profile | Nailsbyhelina"
        description="Manage your Nailsbyhelina profile, contact information, and order preferences."
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9C5550] to-[#C98F8A] text-[#FFFDFC] font-heading text-2xl flex items-center justify-center shadow-md">
            {user?.full_name?.trim() ? (
              user.full_name.trim().charAt(0).toUpperCase()
            ) : (
              <User className="w-8 h-8 text-[#FFFDFC]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl text-[#313851]">
                {user?.full_name?.trim() || 'My Account'}
              </h1>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#262D42] text-[#C8A46A] text-[10px] font-bold tracking-wider uppercase border border-[#C8A46A]/30">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#786866] mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#262D42] text-[#C8A46A] text-xs font-semibold hover:bg-[#313851] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#F6F3ED] border border-[#D8C6C3] text-xs font-medium text-[#786866] hover:text-[#9C5550] hover:bg-[#F4ECE6] transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Quick Jump Banner */}
      {isAdmin && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#262D42] text-[#FFFDFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#C8A46A]/30 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C8A46A]/20 flex items-center justify-center text-[#C8A46A] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#FFFDFC]">Administrator Session Active</p>
              <p className="text-xs text-[#C2CBD3]">You are signed in as Nailsbyhelina administrator ({user?.email}).</p>
            </div>
          </div>
          <Link
            to="/admin/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C8A46A] to-[#B38F56] text-[#262D42] text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Open Admin Dashboard →</span>
          </Link>
        </div>
      )}

      {/* Profile Navigation Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/orders"
          className="p-6 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] hover:border-[#9C5550] transition-all flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4ECE6] text-[#9C5550] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg text-[#313851] group-hover:text-[#9C5550] transition-colors">
                Order History
              </h3>
              <p className="text-xs text-[#786866]">Track deliveries & past bespoke sets</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#9C5550]">View →</span>
        </Link>

        <Link
          to="/favorites"
          className="p-6 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] hover:border-[#9C5550] transition-all flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4ECE6] text-[#9C5550] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg text-[#313851] group-hover:text-[#9C5550] transition-colors">
                Saved Favourites
              </h3>
              <p className="text-xs text-[#786866]">Curate your wishlist of press-ons</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#9C5550]">View →</span>
        </Link>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-6">
        <div>
          <h2 className="font-heading text-xl text-[#313851]">Account Information</h2>
          <p className="text-xs text-[#786866]">Update your delivery contact coordinates</p>
        </div>

        {savedMessage && (
          <div className="p-3 rounded-xl bg-[#EDF7ED] border border-[#B7DCB2] text-xs text-[#3E6B3B] flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
              Registered Email
            </label>
            <input
              type="email"
              disabled
              autoComplete="email"
              value={user?.email || ''}
              className="w-full px-4 py-2.5 rounded-xl bg-[#EEE6DE]/50 border border-[#D8C6C3] text-sm text-[#786866] cursor-not-allowed"
            />
            <span className="text-[10px] text-[#786866] mt-0.5 block">Managed via Supabase Auth</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:border-[#9C5550] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-[#9C5550] text-[#FFFDFC] text-xs font-semibold hover:bg-[#8A4743] transition-colors flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

    </div>
  );
}
