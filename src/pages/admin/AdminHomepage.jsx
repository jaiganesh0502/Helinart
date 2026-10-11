import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { contentService } from '../../services/contentService';
import { settingsService } from '../../services/settingsService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { Save, Send, Eye, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminHomepage() {
  const { user } = useAuth();
  const [content, setContent] = useState({
    hero_eyebrow: '',
    hero_heading: '',
    hero_highlight: '',
    hero_description: '',
    primary_cta_text: '',
    secondary_cta_text: '',
    collection_heading: '',
    collection_description: '',
    announcement_text: '',
    instagram_handle: '',
    whatsapp_number: '',
    footer_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string, details?: string }
  const [previewMode, setPreviewMode] = useState(false);

  const showSuccessToast = (message) => {
    setToast({ type: 'success', message });
    setTimeout(() => setToast(null), 4500);
  };

  const showErrorToast = (message, details = '') => {
    setToast({ type: 'error', message, details });
    setTimeout(() => setToast(null), 6500);
  };

  const loadContentAndSettings = async () => {
    try {
      const [draft, settings] = await Promise.all([
        contentService.getDraftContent(),
        settingsService.getSettings()
      ]);
      setContent({
        hero_eyebrow: draft?.hero_eyebrow || '',
        hero_heading: draft?.hero_heading || '',
        hero_highlight: draft?.hero_highlight || '',
        hero_description: draft?.hero_description || '',
        primary_cta_text: draft?.primary_cta_text || '',
        secondary_cta_text: draft?.secondary_cta_text || '',
        collection_heading: draft?.collection_heading || '',
        collection_description: draft?.collection_description || '',
        announcement_text: draft?.announcement_text || settings?.announcement_text || '',
        footer_text: draft?.footer_text || '',
        // Social settings strictly from site_settings (single source of truth):
        instagram_handle: settings?.instagram_handle || '@nails.by.helina',
        whatsapp_number: settings?.whatsapp_number || '+91 93614 05676'
      });
    } catch (err) {
      console.error('Failed to load homepage CMS data', err);
      showErrorToast('Unable to load homepage data. Please refresh.');
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await loadContentAndSettings();
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      // 1. Explicit homepage payload containing ONLY valid homepage_content columns
      const homepagePayload = {
        hero_eyebrow: content.hero_eyebrow,
        hero_heading: content.hero_heading,
        hero_highlight: content.hero_highlight,
        hero_description: content.hero_description,
        primary_cta_text: content.primary_cta_text,
        secondary_cta_text: content.secondary_cta_text,
        collection_heading: content.collection_heading,
        collection_description: content.collection_description,
        announcement_text: content.announcement_text,
        footer_text: content.footer_text
      };
      await contentService.saveDraft(homepagePayload);

      // 2. Explicit site_settings payload for social & helpline
      const settingsPayload = {
        instagram_handle: content.instagram_handle,
        whatsapp_number: content.whatsapp_number,
        announcement_text: content.announcement_text
      };
      await settingsService.updateSettings(settingsPayload);

      // 3. Audit log
      await auditService.logAction({
        action: 'HOMEPAGE_DRAFT_SAVED',
        entityType: 'homepage',
        entityId: 'current_draft',
        details: { heading: content.hero_heading },
        adminUser: user
      }).catch(() => {});

      // 4. Refetch both datasets
      await loadContentAndSettings();

      showSuccessToast('Draft changes saved successfully. (Not yet live on customer site)');
    } catch (err) {
      console.error('Failed to save draft:', err);
      showErrorToast('Unable to save draft. Please try again.', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishLive = async () => {
    if (!window.confirm('Are you sure you want to publish these changes directly to the live customer website?')) {
      return;
    }

    setPublishing(true);
    try {
      // STEP 1: Save/publish homepage content to homepage_content
      const homepagePayload = {
        hero_eyebrow: content.hero_eyebrow,
        hero_heading: content.hero_heading,
        hero_highlight: content.hero_highlight,
        hero_description: content.hero_description,
        primary_cta_text: content.primary_cta_text,
        secondary_cta_text: content.secondary_cta_text,
        collection_heading: content.collection_heading,
        collection_description: content.collection_description,
        announcement_text: content.announcement_text,
        footer_text: content.footer_text
      };

      try {
        await contentService.publishContent(homepagePayload);
      } catch (hpError) {
        console.error('Homepage content publish failed:', hpError);
        throw new Error(`Homepage publish failed: ${hpError.message || 'Database error'}`);
      }

      // STEP 2: Save social settings to site_settings
      const settingsPayload = {
        instagram_handle: content.instagram_handle,
        whatsapp_number: content.whatsapp_number,
        announcement_text: content.announcement_text
      };

      try {
        await settingsService.updateSettings(settingsPayload);
      } catch (settError) {
        console.error('Support & social settings update failed:', settError);
        throw new Error(`Support settings update failed: ${settError.message || 'Database error'}`);
      }

      // STEP 3: Audit log
      await auditService.logAction({
        action: 'HOMEPAGE_PUBLISHED',
        entityType: 'homepage',
        entityId: 'current',
        details: { heading: content.hero_heading, highlight: content.hero_highlight },
        adminUser: user
      }).catch(() => {});

      // STEP 4: Refetch both datasets to sync state
      await loadContentAndSettings();

      // STEP 5: Success Toast
      showSuccessToast('Homepage published successfully.');
    } catch (err) {
      console.error('Publish error:', err);
      showErrorToast('Unable to publish homepage. Please try again.', err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AdminLayout title="Homepage Content Management (CMS)">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {toast && (
          <div 
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200 ${
              toast.type === 'success'
                ? 'bg-[#EEF3EE] border-[#B7DCB2] text-[#43623E]'
                : 'bg-[#FDF2F2] border-[#E8B4B4] text-[#9C5550]'
            }`}
            role="status"
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-[#43623E]" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-[#9C5550]" />
              )}
              <span>{toast.message}</span>
              {toast.details && (
                <span className="text-[11px] opacity-80 font-normal">({toast.details})</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-current opacity-60 hover:opacity-100 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Workflow Action Bar */}
        <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl text-[#313851]">Draft & Publish Workflow</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F4ECE6] text-[#793D39] border border-[#D8C6C3]">
                Draft Mode
              </span>
            </div>
            <p className="text-xs text-[#786866] mt-0.5">
              Edit homepage copy safely. Customers only see published content.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 rounded-full bg-[#F6F3ED] border border-[#D8C6C3] text-xs font-semibold text-[#313851] hover:bg-[#EEE6DE] transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewMode ? 'Exit Preview' : 'Preview Draft'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-4 py-2 rounded-full bg-[#313851] text-[#FFFDFC] text-xs font-semibold hover:bg-[#262D42] transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              type="button"
              onClick={handlePublishLive}
              disabled={publishing}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{publishing ? 'Publishing...' : 'Publish Live'}</span>
            </button>
          </div>
        </div>

        {/* Live Draft Preview Card */}
        {previewMode && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F6F3ED] border-2 border-dashed border-[#9C5550] space-y-6 animate-fade-in shadow-inner">
            <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
              <span className="text-[11px] font-bold tracking-widest text-[#9C5550] uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9C5550] animate-pulse" />
                Live Draft Preview (Previewing unpublished draft changes)
              </span>
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className="text-xs text-[#786866] hover:text-[#313851] font-medium"
              >
                Close Preview
              </button>
            </div>

            {/* Simulated Announcement Ribbon */}
            {content.announcement_text && (
              <div className="py-2 px-4 rounded-xl bg-[#262D42] text-[#FFFDFC] text-xs text-center font-medium shadow-xs">
                {content.announcement_text}
              </div>
            )}

            {/* Simulated Hero */}
            <div className="p-6 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
                {content.hero_eyebrow || 'New atelier collection drop'}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl text-[#313851] font-medium leading-tight">
                {content.hero_heading || 'Haute couture nail art,'}{' '}
                <span className="bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] bg-clip-text text-transparent">
                  {content.hero_highlight || 'made effortless.'}
                </span>
              </h1>
              <p className="text-sm text-[#786866] max-w-xl leading-relaxed">
                {content.hero_description || 'Discover professional-quality reusable press-on sets sculpted by master artists, delivered directly to your doorstep across India.'}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B26661] to-[#8A4743] text-[#FFFDFC] text-xs font-medium shadow-xs">
                  {content.primary_cta_text || 'Explore nail sets'}
                </span>
                <span className="px-6 py-2.5 rounded-full bg-[#FFFDFC] border border-[#313851] text-[#313851] text-xs font-medium">
                  {content.secondary_cta_text || 'Studio Opening Soon'}
                </span>
              </div>
            </div>

            {/* Simulated Collection Header */}
            <div className="p-6 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] text-center space-y-1">
              <span className="text-[11px] font-medium text-[#793D39]">Carefully curated</span>
              <h3 className="font-heading text-2xl text-[#313851]">
                {content.collection_heading || 'Shop by Collection'}
              </h3>
              <p className="text-xs text-[#786866]">
                {content.collection_description || 'From red-carpet reusable press-ons to DIY professional gel sculpting kits.'}
              </p>
            </div>

            {/* Simulated Footer Mission */}
            <div className="p-4 rounded-xl bg-[#262D42] text-[#C2CBD3] text-xs space-y-1 border border-[#3A425E]">
              <span className="text-[10px] uppercase font-bold text-[#C8A46A] tracking-wider block">Footer Brand Mission</span>
              <p>{content.footer_text || 'Haute couture press-on nails sculpted with salon-grade precision and delivered across India.'}</p>
            </div>
          </div>
        )}

        {/* CMS Editor Form */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-[#9C5550] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#786866] mt-2">Loading CMS fields...</p>
          </div>
        ) : (
          <form onSubmit={handleSaveDraft} className="space-y-6">
            
            {/* Announcement Banner */}
            <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-[#313851]">Header Announcement Ribbon</h3>
              <div>
                <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Ribbon Text
                </label>
                <input
                  type="text"
                  name="announcement_text"
                  value={content.announcement_text || ''}
                  onChange={handleChange}
                  placeholder="Complimentary express pan-India delivery on orders over ₹999 ✨"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>
            </div>

            {/* Hero Section Copy */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-[#313851]">Hero Section Copy</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Hero Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    name="hero_eyebrow"
                    value={content.hero_eyebrow || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Heading Main Line
                  </label>
                  <input
                    type="text"
                    name="hero_heading"
                    value={content.hero_heading || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Heading Highlight (Gradient Accent)
                </label>
                <input
                  type="text"
                  name="hero_highlight"
                  value={content.hero_highlight || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Hero Paragraph Description
                </label>
                <textarea
                  rows="3"
                  name="hero_description"
                  value={content.hero_description || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="primary_cta_text"
                    value={content.primary_cta_text || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="secondary_cta_text"
                    value={content.secondary_cta_text || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Collection Section Heading */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-[#313851]">Collection Section Copy</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    name="collection_heading"
                    value={content.collection_heading || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Section Description
                  </label>
                  <input
                    type="text"
                    name="collection_description"
                    value={content.collection_description || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social & Concierge Channels (Section 23 requirement) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-[#313851]">Social & Concierge Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    name="instagram_handle"
                    value={content.instagram_handle || ''}
                    onChange={handleChange}
                    placeholder="@nails.by.helina"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                    WhatsApp Helpline Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp_number"
                    value={content.whatsapp_number || ''}
                    onChange={handleChange}
                    placeholder="+91 93614 05676"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-4">
              <h3 className="font-heading text-lg text-[#313851]">Footer Brand Mission</h3>
              <div>
                <label className="block text-xs font-semibold text-[#313851] uppercase tracking-wider mb-1">
                  Brand Mission Blurb
                </label>
                <textarea
                  rows="2"
                  name="footer_text"
                  value={content.footer_text || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-sm text-[#313851] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-[#F6F3ED] text-[#313851] text-xs font-semibold hover:bg-[#EEE6DE]"
              >
                {saving ? 'Saving...' : 'Save As Draft'}
              </button>

              <button
                type="button"
                onClick={handlePublishLive}
                disabled={publishing}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-xs font-semibold shadow-xs hover:shadow-md"
              >
                {publishing ? 'Publishing...' : 'Publish to Live Website'}
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
}
