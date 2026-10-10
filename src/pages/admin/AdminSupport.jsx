import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { settingsService } from '../../services/settingsService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { InstagramIcon } from '../../components/SocialIcons';
import {
  Headphones,
  MessageCircle,
  Mail,
  Save,
  CheckCircle2,
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';

export default function AdminSupport() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    instagram_handle: '@nails.by.helina',
    instagram_url: 'https://www.instagram.com/nails.by.helina/',
    whatsapp_number: '+91 93614 05676',
    whatsapp_raw_number: '919361405676',
    support_email: 'concierge@nailsbyhelina.com'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settings = await settingsService.getSettings();
      if (settings) {
        setFormData({
          instagram_handle: settings.instagram_handle || '@nails.by.helina',
          instagram_url: settings.instagram_url || 'https://www.instagram.com/nails.by.helina/',
          whatsapp_number: settings.whatsapp_number || '+91 93614 05676',
          whatsapp_raw_number: settings.whatsapp_raw_number || '919361405676',
          support_email: settings.support_email || 'concierge@nailsbyhelina.com'
        });
      }
    } catch (err) {
      console.error('Failed to load support settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Ensure raw whatsapp number is formatted for https://wa.me/ links
      const rawNumber = formData.whatsapp_number.replace(/\D/g, '');
      const payload = {
        ...formData,
        whatsapp_raw_number: rawNumber.length >= 10 ? (rawNumber.startsWith('91') ? rawNumber : '91' + rawNumber) : formData.whatsapp_raw_number
      };

      await settingsService.updateSettings(payload);

      await auditService.logAction({
        action: 'SUPPORT_SETTINGS_UPDATED',
        entityType: 'site_settings',
        entityId: 'global',
        details: payload,
        adminUser: user
      });

      showToast('Support and social links updated across the entire customer store!');
    } catch (err) {
      console.error('Error saving support settings', err);
      showToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <AdminLayout title="Support & Social Channels">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 transition-all ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-[#262D42] text-[#FFFDFC] border-[#C8A46A]/40'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#C8A46A] shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        {/* Banner */}
        <div className="bg-[#FFFDFC] p-6 rounded-2xl border border-[#313851]/10 shadow-xs flex items-start gap-4">
          <div className="p-3 rounded-xl bg-[#F6F3ED] text-[#C8A46A] shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-medium text-[#313851] mb-1">
              Centralized Concierge & Social Contacts
            </h2>
            <p className="text-xs text-[#313851]/70 leading-relaxed">
              Updating these values here will automatically update the customer website header, footer, mobile navigation bar, checkout order notes, and WhatsApp floating contact button. No code changes required!
            </p>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 p-6 md:p-8 shadow-xs space-y-6">
          {/* Instagram Section */}
          <div className="space-y-4">
            <h3 className="font-heading text-base font-medium text-[#313851] flex items-center gap-2 pb-2 border-b border-[#313851]/10">
              <InstagramIcon className="w-4 h-4 text-[#C98F8A]" />
              Instagram Concierge Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Visible Handle
                </label>
                <input
                  type="text"
                  required
                  value={formData.instagram_handle}
                  onChange={e => setFormData({ ...formData, instagram_handle: e.target.value })}
                  placeholder="@nails.by.helina"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Direct Profile URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.instagram_url}
                  onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://www.instagram.com/nails.by.helina/"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Section */}
          <div className="space-y-4 pt-4">
            <h3 className="font-heading text-base font-medium text-[#313851] flex items-center gap-2 pb-2 border-b border-[#313851]/10">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              WhatsApp Direct Order Helpline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Formatted Display Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp_number}
                  onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="+91 93614 05676"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
                />
                <span className="text-[10px] text-[#313851]/50 mt-1 block">
                  e.g. +91 93614 05676 (visible to customers)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Raw API Number (wa.me)
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp_raw_number}
                  onChange={e => setFormData({ ...formData, whatsapp_raw_number: e.target.value })}
                  placeholder="919361405676"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs font-mono text-[#313851] focus:outline-none focus:border-[#C8A46A]"
                />
                <span className="text-[10px] text-[#313851]/50 mt-1 block">
                  Format: 919361405676 (digits only, India country code)
                </span>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-4 pt-4">
            <h3 className="font-heading text-base font-medium text-[#313851] flex items-center gap-2 pb-2 border-b border-[#313851]/10">
              <Mail className="w-4 h-4 text-[#C8A46A]" />
              Concierge Email
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                Support & Press Inquiries Email
              </label>
              <input
                type="email"
                required
                value={formData.support_email}
                onChange={e => setFormData({ ...formData, support_email: e.target.value })}
                placeholder="concierge@nailsbyhelina.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-[#F6F3ED] border border-[#313851]/10 space-y-2">
            <span className="text-[11px] font-bold text-[#313851] uppercase tracking-wider block">
              Customer Live Link Verification
            </span>
            <div className="flex flex-wrap gap-4 text-xs">
              <a
                href={formData.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#313851] hover:text-[#C8A46A] flex items-center gap-1.5 font-medium"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-[#C98F8A]" />
                {formData.instagram_handle}
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href={`https://wa.me/${formData.whatsapp_raw_number}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#313851] hover:text-[#C8A46A] flex items-center gap-1.5 font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                {formData.whatsapp_number}
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-[#313851]/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving || loading}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4 text-[#C8A46A]" />
              {saving ? 'Updating Store...' : 'Save Support Channels'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
