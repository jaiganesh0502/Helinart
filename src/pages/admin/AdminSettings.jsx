import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { settingsService } from '../../services/settingsService';
import { auditService } from '../../services/auditService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Settings,
  Save,
  CheckCircle2,
  Database,
  ShieldCheck,
  Truck,
  Sparkles,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    brand_name: 'Nailsbyhelina',
    announcement_text: 'Complimentary express pan-India delivery on orders over ₹999 ✨',
    free_shipping_threshold: 999,
    currency: 'INR',
    studio_booking_enabled: false
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
      const data = await settingsService.getSettings();
      if (data) {
        setSettings({
          brand_name: data.brand_name || 'Nailsbyhelina',
          announcement_text: data.announcement_text || '',
          free_shipping_threshold: data.free_shipping_threshold ?? 999,
          currency: data.currency || 'INR',
          studio_booking_enabled: Boolean(data.studio_booking_enabled)
        });
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);

      await auditService.logAction({
        action: 'SITE_SETTINGS_UPDATED',
        entityType: 'site_settings',
        entityId: 'global',
        details: settings,
        adminUser: user
      });

      showToast('Global store settings saved successfully!');
    } catch (err) {
      console.error('Failed to update settings', err);
      showToast(err.message ? `Error: ${err.message}` : 'Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }

  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AdminLayout title="Global Store Settings">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 transition-all ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-[#262D42] text-[#FFFDFC] border-[#C8A46A]/40'
        }`}>
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#C8A46A] shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-4xl space-y-6">
        {/* System Architecture Diagnostic Card */}
        <div className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-medium text-[#313851]">
                  Full-Stack Architecture Status
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isSupabaseConfigured
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL CACHE / STANDALONE'}
                </span>
              </div>
              <p className="text-xs text-[#313851]/60 mt-0.5">
                {isSupabaseConfigured
                  ? 'Supabase PostgreSQL database, Storage bucket, and Auth are active.'
                  : 'Operating in self-contained mode with synchronized local state. Add VITE_SUPABASE_URL in .env to connect remote DB.'}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#313851]/70 bg-[#F6F3ED] px-3.5 py-2 rounded-xl border border-[#313851]/10 shrink-0">
            Platform: <span className="font-semibold text-[#313851]">React + Vite + Supabase</span>
          </div>
        </div>

        {/* Global Settings Form */}
        <form onSubmit={handleSubmit} className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 p-6 md:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#313851]/10">
            <h3 className="font-heading text-lg font-medium text-[#313851]">
              Brand & Commerce Configuration
            </h3>
            <p className="text-xs text-[#313851]/60">
              Manage the announcement banner, currency, and checkout thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                Brand Atelier Name
              </label>
              <input
                type="text"
                required
                value={settings.brand_name}
                onChange={e => setSettings({ ...settings, brand_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C8A46A]" />
                Free Shipping Order Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.free_shipping_threshold}
                onChange={e => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
              />
              <span className="text-[10px] text-[#313851]/50 mt-1 block">
                Orders equal or exceeding this total receive complimentary shipping at checkout.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#313851] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A46A]" />
              Announcement Bar Text
            </label>
            <input
              type="text"
              value={settings.announcement_text}
              onChange={e => setSettings({ ...settings, announcement_text: e.target.value })}
              placeholder="Complimentary express pan-India delivery on orders over ₹999 ✨"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
            />
            <span className="text-[10px] text-[#313851]/50 mt-1 block">
              Displayed at the very top of all customer pages. Leave blank to hide.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                Store Currency
              </label>
              <select
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] bg-white focus:outline-none focus:border-[#C8A46A]"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                Physical Studio Status
              </label>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F3ED] border border-[#313851]/10 text-xs">
                <span className="font-medium text-[#313851]">
                  {settings.studio_booking_enabled ? 'Appointments Open' : 'Opening Soon Mode'}
                </span>
                <Link
                  to="/admin/studio"
                  className="text-[11px] font-semibold text-[#C8A46A] hover:underline flex items-center gap-1"
                >
                  Manage in Studio <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
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
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
