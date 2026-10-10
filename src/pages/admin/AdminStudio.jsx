import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { settingsService } from '../../services/settingsService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarCheck,
  AlertCircle,
  Clock,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Info,
  DollarSign,
  Save,
  Users
} from 'lucide-react';

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export default function AdminStudio() {
  const { user } = useAuth();
  const [bookingEnabled, setBookingEnabled] = useState(false);
  const [studioSettings, setStudioSettings] = useState({
    available_days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opening_time: '11:00 AM',
    closing_time: '07:30 PM',
    appointment_duration: 90,
    max_daily_bookings: 6,
    deposit_amount: 200
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingToggleState, setPendingToggleState] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const siteSettings = await settingsService.getSettings();
      const studio = await settingsService.getStudioSettings();

      setBookingEnabled(Boolean(siteSettings.studio_booking_enabled));
      if (studio) {
        setStudioSettings(prev => ({ ...prev, ...studio }));
      }
    } catch (err) {
      console.error('Failed to load studio settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClick = () => {
    const nextState = !bookingEnabled;
    if (nextState === true) {
      // Require explicit confirmation when enabling public appointments
      setPendingToggleState(true);
      setShowConfirmModal(true);
    } else {
      // Direct disable with confirmation or instant toggle
      setPendingToggleState(false);
      setShowConfirmModal(true);
    }
  };

  const confirmToggle = async () => {
    setShowConfirmModal(false);
    setSaving(true);
    try {
      await settingsService.setStudioBookingEnabled(pendingToggleState);
      setBookingEnabled(pendingToggleState);

      await auditService.logAction({
        action: pendingToggleState ? 'STUDIO_BOOKING_ENABLED' : 'STUDIO_BOOKING_DISABLED',
        entityType: 'studio_settings',
        entityId: 'studio_main',
        details: { booking_enabled: pendingToggleState },
        adminUser: user
      });

      showToast(
        pendingToggleState
          ? 'Studio booking successfully ENABLED. Customers can now book appointments.'
          : 'Studio booking switched to OPENING SOON mode.'
      );
    } catch (err) {
      console.error('Failed to toggle studio booking', err);
      showToast('Error updating studio status. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDayToggle = (day) => {
    const current = studioSettings.available_days || [];
    const next = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    setStudioSettings({ ...studioSettings, available_days: next });
  };

  const handleSaveOperationalDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Persist studio operational settings
      const current = await settingsService.getStudioSettings();
      const updated = {
        ...current,
        ...studioSettings,
        booking_enabled: bookingEnabled,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('helinart_studio_settings_v1', JSON.stringify(updated));

      await auditService.logAction({
        action: 'STUDIO_SETTINGS_UPDATED',
        entityType: 'studio_settings',
        entityId: 'studio_main',
        details: studioSettings,
        adminUser: user
      });

      showToast('Studio operational hours and rules saved successfully.');
    } catch (err) {
      console.error('Failed to save operational settings', err);
      showToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <AdminLayout title="Studio Booking & Availability">
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDFC] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#313851]/10 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${pendingToggleState ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {pendingToggleState ? <CalendarCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-heading text-lg font-medium text-[#313851]">
                  {pendingToggleState ? 'Enable Studio Booking?' : 'Disable Studio Booking?'}
                </h3>
                <p className="text-xs text-[#313851]/60">Confirm change to customer booking experience</p>
              </div>
            </div>

            <div className="text-sm text-[#313851]/80 leading-relaxed mb-6 space-y-2 bg-[#F6F3ED]/70 p-4 rounded-xl border border-[#313851]/5">
              {pendingToggleState ? (
                <p>
                  <strong>Customers will immediately be able to access studio appointment booking.</strong> The customer navigation will switch from "Studio Opening Soon" to "Book a Studio Slot", and the booking calendar will go live.
                </p>
              ) : (
                <p>
                  The customer studio section will immediately return to <strong>"Studio Opening Soon"</strong> mode. Customers will not be able to schedule appointments while disabled.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#313851]/70 hover:bg-[#F6F3ED] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmToggle}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors ${
                  pendingToggleState
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-[#313851] hover:bg-[#262D42]'
                }`}
              >
                {pendingToggleState ? 'Confirm & Go Live' : 'Confirm & Set to Coming Soon'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl space-y-6">
        {/* Header Breadcrumb & Status */}
        <div className="bg-[#FFFDFC] p-6 rounded-2xl border border-[#313851]/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#C8A46A]">
                Feature Flag Control
              </span>
              <span className="text-xs text-[#313851]/40">•</span>
              <span className="text-xs text-[#313851]/60">Physical Location Booking</span>
            </div>
            <h2 className="font-heading text-2xl font-normal text-[#313851]">
              Offline Studio Booking Gateway
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
              bookingEnabled 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${bookingEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {bookingEnabled ? 'LIVE & ACCEPTING APPOINTMENTS' : 'STUDIO OPENING SOON (OFFLINE)'}
            </span>
          </div>
        </div>

        {/* Studio Booking Primary Switcher Card */}
        <div className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#313851]/10">
            <div className="max-w-xl">
              <h3 className="font-heading text-lg font-medium text-[#313851] mb-2 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#C8A46A]" />
                Customer Booking Experience Toggle
              </h3>
              <p className="text-xs text-[#313851]/70 leading-relaxed">
                When enabled, the customer navigation link dynamically reads <strong>"Book a Studio Slot"</strong> and grants customers access to the interactive appointment booking calendar. When disabled, it shows <strong>"Studio Opening Soon"</strong> with an online-store priority banner.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs font-semibold text-[#313851]">
                {bookingEnabled ? 'ACTIVE (ON)' : 'DISABLED (OFF)'}
              </span>

              {/* Master Toggle Button */}
              <button
                type="button"
                onClick={handleToggleClick}
                disabled={loading || saving}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C8A46A] focus:ring-offset-2 ${
                  bookingEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
                role="switch"
                aria-checked={bookingEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    bookingEnabled ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#F6F3ED]/80 border border-[#313851]/10 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#C8A46A] shrink-0 mt-0.5" />
            <div className="text-xs text-[#313851]/80 leading-relaxed">
              <p className="font-semibold text-[#313851] mb-0.5">Architectural Guarantee</p>
              The original booking codebase (appointment dates, service selection, nail art consultations) is preserved in <code className="bg-white px-1.5 py-0.5 rounded text-[11px] text-[#313851]">src/features/studio-booking/StudioBooking.jsx</code>. Switching this setting instantly mounts or dismounts it without losing any configurations or code.
            </div>
          </div>
        </div>

        {/* Studio Operational Hours & Booking Configuration Form */}
        <form onSubmit={handleSaveOperationalDetails} className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#313851]/10">
            <div>
              <h3 className="font-heading text-lg font-medium text-[#313851]">
                Operational Hours & Appointment Rules
              </h3>
              <p className="text-xs text-[#313851]/60">
                Configure your atelier's availability for when the physical studio is live.
              </p>
            </div>
          </div>

          {/* Available Days */}
          <div>
            <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-2">
              Available Days of Operation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {WEEKDAYS.map((day) => {
                const isSelected = (studioSettings.available_days || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? 'bg-[#313851] text-[#FFFDFC] border-[#313851] shadow-xs'
                        : 'bg-white text-[#313851]/70 border-[#313851]/20 hover:border-[#313851]/50'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time & Capacity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C8A46A]" />
                Opening Time
              </label>
              <input
                type="text"
                value={studioSettings.opening_time}
                onChange={e => setStudioSettings({ ...studioSettings, opening_time: e.target.value })}
                placeholder="11:00 AM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C8A46A]" />
                Closing Time
              </label>
              <input
                type="text"
                value={studioSettings.closing_time}
                onChange={e => setStudioSettings({ ...studioSettings, closing_time: e.target.value })}
                placeholder="07:30 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C8A46A]" />
                Session Duration (Minutes)
              </label>
              <input
                type="number"
                value={studioSettings.appointment_duration}
                onChange={e => setStudioSettings({ ...studioSettings, appointment_duration: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#C8A46A]" />
                Max Daily Bookings
              </label>
              <input
                type="number"
                value={studioSettings.max_daily_bookings}
                onChange={e => setStudioSettings({ ...studioSettings, max_daily_bookings: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#C8A46A]" />
                Deposit Requirement (₹)
              </label>
              <input
                type="number"
                value={studioSettings.deposit_amount}
                onChange={e => setStudioSettings({ ...studioSettings, deposit_amount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#313851]/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4 text-[#C8A46A]" />
              {saving ? 'Saving...' : 'Save Studio Rules'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
