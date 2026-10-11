import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Bell, Camera, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import SEO from './SEO';
import { settingsService } from '../services/settingsService';
import { pageService } from '../services/pageService';
import { SOCIAL_LINKS } from '../config/social';

export default function StudioComingSoon() {
  const { subscribeNewsletter, addToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [page, setPage] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [s, p] = await Promise.all([
          settingsService.getSettings().catch(() => null),
          pageService.getPageBySlug('studio-concierge').catch(() => null)
        ]);
        if (mounted && s) setSiteSettings(s);
        if (mounted && p) setPage(p);
      } catch (e) {
        console.warn('Could not load settings in StudioComingSoon', e);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const instagramUrl = siteSettings?.instagram_url || SOCIAL_LINKS.instagram;
  const instagramHandle = siteSettings?.instagram_handle || SOCIAL_LINKS.instagramHandle;

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    subscribeNewsletter(email);
    setSubscribed(true);
    addToast('You are on our private studio opening VIP list! 💌', 'success');
  };

  return (
    <div 
      className="min-h-[85vh] py-12 sm:py-20 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 25% 20%, rgba(201, 143, 138, 0.12), transparent 35%),
          radial-gradient(circle at 80% 65%, rgba(200, 164, 106, 0.10), transparent 32%),
          linear-gradient(135deg, #F6F3ED 0%, #F4ECE6 50%, #EEE6DE 100%)
        `
      }}
    >
      <SEO
        title="Our Studio Is Coming Soon | Nailsbyhelina"
        description="Nailsbyhelina operates as an online nail store. Browse handcrafted luxury press-on sets online while our private studio prepares for launch."
        keywords="nailsbyhelina studio opening soon, luxury press on nails online, studio appointments coming soon"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* =================================================================
              LEFT COLUMN: Editorial Announcement & Calls to Action
              ================================================================= */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Animated Brand Emblem & Sparkles */}
            <div className="inline-flex items-center gap-3 relative">
              
              {/* Floating emblem */}
              <div className="relative animate-soft-float">
                <div className="w-12 h-12 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md flex items-center justify-center p-2">
                  <img
                    src="/helinart-logo.png"
                    alt="Nailsbyhelina Emblem"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = '<span class="font-bold text-xs text-[#313851]">NH</span>';
                    }}
                  />
                </div>

                {/* Staggered Decorative Sparkles */}
                <Sparkles className="w-3.5 h-3.5 text-[#C8A46A] absolute -top-2 -right-2 animate-sparkle-1" />
                <Sparkles className="w-2.5 h-2.5 text-[#C98F8A] absolute -bottom-1 -left-2 animate-sparkle-2" />
                <Sparkles className="w-3 h-3 text-[#C2CBD3] absolute top-1 -left-3 animate-sparkle-3" />
                <Sparkles className="w-2.5 h-2.5 text-[#C8A46A] absolute -bottom-2 right-2 animate-sparkle-4" />
              </div>

              {/* Atelier label with subtle shimmer */}
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-semibold tracking-wider text-[#793D39] uppercase">
                  The Nailsbyhelina Atelier
                </span>
                <span className="text-xs font-semibold shimmer-opening-soon tracking-widest uppercase">
                  ✦ Opening Soon
                </span>
              </div>
            </div>

            {/* Main Editorial Heading */}
            <h1 className="font-heading font-medium text-4xl sm:text-5xl lg:text-6xl text-[#313851] leading-[1.12]">
              Our Studio <br />
              <span className="bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] bg-clip-text text-transparent">
                Is Coming Soon.
              </span>
            </h1>

            {/* Supporting Copy */}
            <div className="space-y-3 text-sm sm:text-base text-[#786866] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              <p>
                {page?.content?.openingSoonMessage || (
                  <>
                    We’re currently creating beautiful nail experiences online.
                    Our private Nailsbyhelina studio will be opening soon for personalised nail art, extensions and one-to-one appointments.
                  </>
                )}
              </p>
              <p className="font-medium text-[#313851]">
                {page?.content?.bookingInfo || "Until then, discover our handcrafted nail sets and shop your favourite looks online."}
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto min-h-[48px] px-9 py-3.5 rounded-full font-medium text-base text-[#FFFDFC] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)'
                }}
              >
                <span>SHOP NAIL SETS</span>
                <ArrowRight className="w-4 h-4 text-[#FFFDFC]" />
              </Link>
            </div>

            {/* Secondary Message & VIP Notice */}
            <div className="pt-2 space-y-1 text-xs text-[#786866]">
              <p className="font-semibold text-[#313851] flex items-center justify-center lg:justify-start gap-1.5">
                <span className="text-[#C8A46A]">✦</span>
                <span>Studio appointments opening soon</span>
              </p>
              <p>Be the first to know when bookings go live.</p>
            </div>

            {/* VIP Notification Box */}
            <div className="pt-4 max-w-md mx-auto lg:mx-0">
              {subscribed ? (
                <div className="p-3.5 rounded-2xl bg-[#EEF3EE] border border-[#879B83]/40 text-xs text-[#2B3B29] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#879B83] shrink-0" />
                  <span>You're on our private studio guest list! We'll alert you first.</span>
                </div>
              ) : (
                <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for opening alerts"
                    className="flex-1 px-4 py-2.5 rounded-full text-xs border border-[#D8C6C3] bg-[#FFFDFC] text-[#2B2223] placeholder-[#8B7774] focus:outline-none focus:border-[#C98F8A]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#C8A46A]" />
                    <span>NOTIFY ME</span>
                  </button>
                </form>
              )}

              {/* Social Follow Link */}
              <div className="pt-3 flex items-center justify-center lg:justify-start gap-2 text-xs text-[#786866]">
                <Camera className="w-3.5 h-3.5 text-[#C8A46A]" />
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#9C5550] transition-colors font-medium underline decoration-black/20"
                >
                  Follow {instagramHandle} for studio opening updates
                </a>
              </div>
            </div>

          </div>

          {/* =================================================================
              RIGHT COLUMN: Visual & Clear Business Status Card
              ================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Glass Card */}
            <div className="relative rounded-[32px] overflow-hidden p-3 bg-white/40 backdrop-blur-md border border-white/70 shadow-[0_20px_50px_rgba(49,56,81,0.08)]">
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-[#F4ECE6]">
                <img
                  src="/images/studio-art-craft.jpg"
                  alt="Nailsbyhelina atelier artisan craft"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Overlay Badge */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#262D42]/90 via-[#262D42]/50 to-transparent text-[#FFFDFC]">
                  <span className="text-[11px] font-semibold text-[#E0BC7A] tracking-wider uppercase block">
                    Private Atelier Preparation
                  </span>
                  <h2 className="font-heading text-lg font-medium mt-0.5">
                    Something beautiful is being prepared.
                  </h2>
                </div>
              </div>
            </div>

            {/* Clear Status Card: Online Active vs Studio Coming Soon */}
            <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-4">
              
              {/* Online Store Status */}
              <div className="flex items-start gap-3.5 pb-3 border-b border-[#D8C6C3]/60">
                <div className="w-3 h-3 rounded-full bg-[#879B83] mt-1 shrink-0 animate-pulse" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#313851] tracking-wide uppercase">
                      Online Store
                    </h3>
                    <span className="text-[11px] font-semibold text-[#43623E] px-2 py-0.5 rounded-full bg-[#EEF3EE]">
                      Open Now
                    </span>
                  </div>
                  <p className="text-xs text-[#786866] mt-0.5">
                    Shop handcrafted reusable press-on sets anytime with express delivery across India.
                  </p>
                </div>
              </div>

              {/* Physical Studio Appointments Status */}
              <div className="flex items-start gap-3.5">
                <div className="w-3 h-3 rounded-full border-2 border-[#C8A46A] bg-transparent mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#313851] tracking-wide uppercase">
                      Studio Appointments
                    </h3>
                    <span className="text-[11px] font-semibold text-[#A87F45] px-2 py-0.5 rounded-full bg-[#F4ECE6]">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-[#786866] mt-0.5">
                    Our private atelier is being tailored for exclusive 1-on-1 bespoke sessions.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
