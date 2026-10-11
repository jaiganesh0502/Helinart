import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, Camera, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import SEO from '../components/SEO';
import PageStatusWrapper from '../components/PageStatusWrapper';
import { useAuth } from '../context/AuthContext';
import { settingsService } from '../services/settingsService';
import { pageService } from '../services/pageService';
import { SOCIAL_LINKS } from '../config/social';
import { apiClient } from '../api';

export default function Contact() {
  const { addToast } = useStore();
  const { user } = useAuth();
  const [siteSettings, setSiteSettings] = useState(null);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    interested: 'Press-On Nail Sets',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.full_name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, p] = await Promise.all([
        settingsService.getSettings().catch(() => null),
        pageService.getPageBySlug('contact').catch(() => null)
      ]);
      if (s) setSiteSettings(s);
      if (p) setPage(p);
    } catch (err) {
      console.warn('Could not load data in Contact', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const instagramUrl = siteSettings?.instagram_url || SOCIAL_LINKS.instagram;
  const instagramHandle = siteSettings?.instagram_handle || SOCIAL_LINKS.instagramHandle;
  const whatsappNumber = siteSettings?.whatsapp_number || SOCIAL_LINKS.whatsappNumber;
  const whatsappRaw = siteSettings?.whatsapp_raw_number || '919361405676';
  const supportEmail = siteSettings?.support_email || 'concierge@nailsbyhelina.com';

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim().replace(/[\s-]/g, '');
    const email = formData.email.trim();
    const message = formData.message.trim();

    // Required Field Validation
    if (!name) {
      addToast('Please enter your full name.', 'error');
      return;
    }

    // Sensible Phone Number Validation (accepts Indian mobile numbers)
    const phoneRegex = /^(?:\+?91)?[6789]\d{9}$/;
    if (!phone || (!phoneRegex.test(phone) && phone.length < 10)) {
      addToast(`Please enter a valid phone number (e.g. ${whatsappNumber} or 10-digit number).`, 'error');
      return;
    }

    // Email validation if entered
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    if (!message) {
      addToast('Please enter your message.', 'error');
      return;
    }

    // Construct functional WhatsApp submission fallback message
    const inquiryText = `Hi Nailsbyhelina,

Name: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}
Interested in: ${formData.interested}

Message:
${message}`;

    const whatsappUrl = `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(inquiryText)}`;

    // Open WhatsApp chat in a new tab with pre-filled inquiry
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Submit inquiry to backend API asynchronously
    try {
      apiClient.submitContact({
        name,
        phone,
        email: email || '',
        category: formData.interested,
        message
      }).catch(() => {});
    } catch (e) {
      // ignore
    }

    setSubmitted(true);
    addToast('Opening WhatsApp with your inquiry! 💌', 'success');
  };

  const pageContent = page?.content || {};

  return (
    <PageStatusWrapper loading={loading} error={error} page={page} onRetry={loadData}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
        <SEO
          title={page?.seo_title || page?.title || "Contact Us & Atelier Concierge Desk"}
          description={page?.seo_description || page?.subtitle || `Reach Nailsbyhelina concierge desk. Message us directly on WhatsApp (${whatsappNumber}), Instagram (${instagramHandle}), or send an inquiry.`}
          keywords="contact nailsbyhelina, press on nails inquiry, nailsbyhelina whatsapp, customer care nailsbyhelina"
        />
        
        {/* Editorial Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
            <Mail className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>{page?.subtitle || "Atelier Concierge Desk"}</span>
          </div>
          <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
            {page?.title || "Get in Touch with Nailsbyhelina"}
          </h1>
          <p className="text-sm sm:text-base text-[#786866] leading-relaxed">
            {pageContent.supportMessage || "Whether you need personalized sizing advice, wish to commission a bridal suite, or have questions about an existing order, our concierge is here for you."}
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Input-Based Contact Form */}
        <div className="lg:col-span-7 bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-md space-y-6">
          <div className="border-b border-[#D8C6C3]/60 pb-3">
            <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
              Get in Touch
            </h2>
            <p className="text-xs text-[#786866] mt-0.5">
              Fill out your details below and our concierge desk will assist you directly on WhatsApp.
            </p>
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#EEF3EE] text-[#879B83] flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-medium text-2xl text-[#313851]">Inquiry Generated</h3>
              <p className="text-xs text-[#786866] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your message was prepared for WhatsApp concierge desk <strong>(+91 93614 05676)</strong>.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', interested: 'Press-On Nail Sets', message: '' });
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors"
                >
                  Send Another Message
                </button>
                <a
                  href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent(`Hi Nailsbyhelina, I'm ${formData.name}. I just sent an inquiry.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-semibold bg-[#EEF3EE] text-[#43623E] border border-[#B7DCB2] hover:bg-[#E7F3E6] transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#879B83]" />
                  <span>Reopen WhatsApp Chat</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Full Name (Required) */}
              <div>
                <label htmlFor="contact-full-name" className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Full Name <span className="text-[#9C5550]">*</span>
                </label>
                <input
                  id="contact-full-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full text-sm rounded-[10px] border border-[#D8C6C3] bg-[#FFFDFC] text-[#2B2223] placeholder-[#8B7774] px-3.5 py-3 focus:border-[#C98F8A] focus:outline-none focus:ring-3 focus:ring-[#C98F8A]/15 transition-all"
                />
              </div>

              {/* Phone Number (Required) & Email (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#313851] mb-1.5">
                    Phone Number <span className="text-[#9C5550]">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className="w-full text-sm rounded-[10px] border border-[#D8C6C3] bg-[#FFFDFC] text-[#2B2223] placeholder-[#8B7774] px-3.5 py-3 focus:border-[#C98F8A] focus:outline-none focus:ring-3 focus:ring-[#C98F8A]/15 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-[#313851] mb-1.5">
                    Email <span className="text-[#786866] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="w-full text-sm rounded-[10px] border border-[#D8C6C3] bg-[#FFFDFC] text-[#2B2223] placeholder-[#8B7774] px-3.5 py-3 focus:border-[#C98F8A] focus:outline-none focus:ring-3 focus:ring-[#C98F8A]/15 transition-all"
                  />
                </div>
              </div>

              {/* Interested In (Dropdown) */}
              <div>
                <label htmlFor="contact-interested" className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Interested In
                </label>
                <select
                  id="contact-interested"
                  name="interested"
                  value={formData.interested}
                  onChange={(e) => setFormData({ ...formData, interested: e.target.value })}
                  className="w-full text-sm rounded-[10px] border border-[#D8C6C3] bg-[#FFFDFC] text-[#2B2223] px-3.5 py-3 focus:border-[#C98F8A] focus:outline-none focus:ring-3 focus:ring-[#C98F8A]/15 transition-all cursor-pointer"
                >
                  <option value="Press-On Nail Sets">Press-On Nail Sets</option>
                  <option value="Custom Nail Design">Custom Nail Design</option>
                  <option value="Order Help">Order Help</option>
                  <option value="Studio Opening">Studio Opening</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message (Required textarea) */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Message <span className="text-[#9C5550]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full text-sm rounded-[10px] border border-[#D8C6C3] bg-[#FFFDFC] text-[#2B2223] placeholder-[#8B7774] px-3.5 py-3 min-h-[130px] resize-y focus:border-[#C98F8A] focus:outline-none focus:ring-3 focus:ring-[#C98F8A]/15 transition-all"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[44px] px-9 py-3.5 rounded-full font-medium text-sm text-[#FFFDFC] shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98F8A]"
                style={{
                  background: 'linear-gradient(135deg, #D39A94 0%, #C98F8A 55%, #B77F7B 100%)'
                }}
              >
                <Send className="w-4 h-4 text-[#FFFDFC]" />
                <span className="tracking-wide">SEND MESSAGE</span>
              </button>
            </form>
          )}

          {/* Contact Alternatives Directly Below Form */}
          <div className="pt-6 border-t border-[#D8C6C3]/60 space-y-3">
            <h3 className="text-xs font-semibold text-[#786866] uppercase tracking-wider">
              Prefer a quick message?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${whatsappRaw}?text=Hi%20Nailsbyhelina%2C%20I%E2%80%99d%20like%20to%20know%20more%20about%20your%20nail%20sets.`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex-1 px-4 py-3 rounded-2xl bg-[#EEF3EE] border border-[#B7DCB2] text-[#43623E] hover:bg-[#E7F3E6] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                aria-label={`Chat directly on WhatsApp ${whatsappNumber}`}
              >
                <MessageSquare className="w-4 h-4 text-[#879B83]" />
                <span>WhatsApp: <strong>{whatsappNumber}</strong></span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex-1 px-4 py-3 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851] hover:text-[#C98F8A] hover:border-[#C98F8A] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                aria-label={`Direct message on Instagram ${instagramHandle}`}
              >
                <Camera className="w-4 h-4 text-[#C8A46A]" />
                <span>Instagram: <strong>{instagramHandle}</strong></span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Studio Details & Direct Lines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-6">
            <h3 className="font-heading font-medium text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-3">
              Studio & Atelier Concierge
            </h3>

            <div className="space-y-4 text-xs text-[#453A3C]">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#9C5550] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#313851] block">Store Operation Mode</strong>
                  <span>{pageContent.studioStatus || 'Online Nail Boutique Only • Express Nationwide Shipping'}</span>
                  <span className="block text-[#786866] mt-0.5">Physical Studio Appointments: Coming Soon</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#A87F45] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#313851] block">Concierge Desk Hours</strong>
                  <span>{pageContent.businessHours || 'Monday – Sunday: 10:00 AM – 7:00 PM (IST)'}</span>
                  <span className="block text-[#786866]">{pageContent.responseTime || 'Online store accepts orders 24 hours a day'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#313851] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#313851] block">WhatsApp Business Contact</strong>
                  <a
                    href={`https://wa.me/${whatsappRaw}?text=Hi%20Nailsbyhelina%2C%20I%E2%80%99d%20like%20to%20know%20more%20about%20your%20nail%20sets.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9C5550] hover:underline font-semibold"
                  >
                    {whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Camera className="w-4 h-4 text-[#C8A46A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#313851] block">Instagram Official</strong>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9C5550] hover:underline font-semibold"
                  >
                    {instagramHandle}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#9C5550] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#313851] block">Direct Concierge Email</strong>
                  <a href={`mailto:${supportEmail}`} className="hover:text-[#9C5550] transition-colors">
                    {supportEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Quick Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappRaw}?text=Hi%20Nailsbyhelina!%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#EEF3EE] border border-[#B7DCB2] text-[#43623E] hover:bg-[#E7F3E6] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <MessageSquare className="w-4 h-4 text-[#879B83]" />
                <span>CHAT ON WHATSAPP ({whatsappNumber})</span>
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
    </PageStatusWrapper>
  );
}
