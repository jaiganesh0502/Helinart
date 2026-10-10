import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Palette, ShieldCheck, RefreshCw, Truck, Heart, Mail, 
  ArrowRight, Check, MapPin, Phone, Camera, MessageSquare, Sparkles 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { FEATURES } from '../config/features';

export default function Footer({ dynamicSettings, dynamicContent }) {
  const { subscribeNewsletter } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const footerBlurb = dynamicContent?.footer_text ||
    'Elevating modern self-care with couture press-on sets, bespoke gel art kits, and handcrafted reusable nail designs delivered across India.';
  const whatsappNumber = dynamicSettings?.whatsapp_number || '+91 93614 05676';
  const whatsappRaw = dynamicSettings?.whatsapp_raw_number || '919361405676';
  const instagramHandle = dynamicSettings?.instagram_handle || '@nails.by.helina';
  const instagramUrl = dynamicSettings?.instagram_url || 'https://www.instagram.com/nails.by.helina/';
  const supportEmail = dynamicSettings?.support_email || 'concierge@nailsbyhelina.com';
  const studioBookingEnabled = dynamicSettings?.studio_booking_enabled !== undefined
    ? Boolean(dynamicSettings.studio_booking_enabled)
    : FEATURES.STUDIO_BOOKING_ENABLED;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    const success = subscribeNewsletter(emailInput);
    if (success) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer 
      className="dark-section text-[#F6F3ED] border-t border-[#3A425E] mt-24"
      style={{ background: 'linear-gradient(135deg, #262D42, #313851)' }}
    >
      {/* Brand Value Props Strip */}
      <div 
        className="border-b border-[#3A425E]/80 py-10"
        style={{ background: 'linear-gradient(135deg, #262D42, #313851)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="flex flex-col items-center p-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#D89B96'
              }}
            >
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-medium text-base text-[#FFFDFC]">Free Express Shipping</h4>
            <p className="text-xs text-[#C2CBD3] mt-1">On orders above ₹999 across India</p>
          </div>

          <div className="flex flex-col items-center p-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#C8A46A'
              }}
            >
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-medium text-base text-[#FFFDFC]">Reusable Up to 5x</h4>
            <p className="text-xs text-[#C2CBD3] mt-1">Professional-quality durable polymer sets</p>
          </div>

          <div className="flex flex-col items-center p-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#C2CBD3'
              }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-medium text-base text-[#FFFDFC]">Zero Natural Damage</h4>
            <p className="text-xs text-[#C2CBD3] mt-1">Cuticle-safe prep & gentle release oils</p>
          </div>

          <div className="flex flex-col items-center p-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#D89B96'
              }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-medium text-base text-[#FFFDFC]">Artist Handcrafted</h4>
            <p className="text-xs text-[#C2CBD3] mt-1">Bespoke chrome, 3D gel & crystals</p>
          </div>

        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Column 1: Brand & Online Boutique */}
        <div className="space-y-4 lg:col-span-2">
          <Link to="/" className="inline-block">
            <span className="font-heading text-2xl font-normal tracking-tight text-[#FFFDFC]">
              Nailsbyhelina <span className="text-[#C8A46A] font-light">Studio</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-[#C2CBD3] leading-relaxed max-w-sm">
            {footerBlurb}
          </p>

          <div className="space-y-2 text-xs text-[#C2CBD3] pt-1">
            <p className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D89B96] shrink-0" />
              <span>Online Nail Boutique • Pan-India Express Delivery</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C8A46A] shrink-0" />
              <span>WhatsApp: </span>
              <a 
                href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hi Nailsbyhelina, I’d like to know more about your nail sets.')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FFFDFC] font-medium hover:text-[#D8A19B] transition-colors underline decoration-white/30 underline-offset-2"
              >
                {whatsappNumber}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#C8A46A] shrink-0" />
              <span>Instagram: </span>
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FFFDFC] font-medium hover:text-[#D8A19B] transition-colors underline decoration-white/30 underline-offset-2"
              >
                {instagramHandle}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C2CBD3] shrink-0" />
              <a href={`mailto:${supportEmail}`} className="hover:text-[#D8A19B] transition-colors">
                {supportEmail}
              </a>
            </p>
          </div>

          {/* Social Links with accessible ARIA labels */}
          <div className="pt-2 flex items-center gap-3 text-xs">
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FFFDFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
              aria-label={`Follow Nailsbyhelina on Instagram ${instagramHandle}`}
              title={`Instagram: ${instagramHandle}`}
            >
              IG
            </a>
            <a 
              href="https://pinterest.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FFFDFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
              aria-label="View Nailsbyhelina inspirations on Pinterest"
              title="Pinterest"
            >
              PIN
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FFFDFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
              aria-label="Watch application tutorials on YouTube"
              title="YouTube"
            >
              YT
            </a>
            <a 
              href="https://wa.me/919361405676?text=Hi%20Nailsbyhelina%2C%20I%E2%80%99d%20like%20to%20know%20more%20about%20your%20nail%20sets." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FFFDFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
              aria-label="Chat with Nailsbyhelina Concierge on WhatsApp (+91 93614 05676)"
              title="WhatsApp: +91 93614 05676"
            >
              WA
            </a>
          </div>
        </div>

        {/* Column 2: Collections */}
        <div>
          <h4 className="font-heading font-medium text-base text-[#FFFDFC] mb-4">Collections</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#C2CBD3]">
            <li><Link to="/shop?category=Press-ons" className="hover:text-[#D8A19B] transition-colors">Luxury Press-Ons</Link></li>
            <li><Link to="/shop?category=Gel%20kits" className="hover:text-[#D8A19B] transition-colors">Gel Art & Polish Kits</Link></li>
            <li><Link to="/shop?category=Decals" className="hover:text-[#D8A19B] transition-colors">Crystals & Decals</Link></li>
            <li><Link to="/shop?category=Care" className="hover:text-[#D8A19B] transition-colors">Nail Health & Elixirs</Link></li>
            <li><Link to="/product/atelier-sizing-kit" className="hover:text-[#D8A19B] transition-colors text-[#C8A46A]">Atelier Sizing Kit (₹199)</Link></li>
            <li><Link to="/custom-order" className="hover:text-[#D8A19B] transition-colors">Custom Order Request</Link></li>
          </ul>
        </div>

        {/* Column 3: Atelier Services & Guidance */}
        <div>
          <h4 className="font-heading font-medium text-base text-[#FFFDFC] mb-4">Studio Concierge</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#C2CBD3]">
            <li><Link to="/book" className="hover:text-[#D8A19B] transition-colors font-medium text-[#FFFDFC]">{studioBookingEnabled ? 'Book Studio Slot' : 'Studio Opening Soon'}</Link></li>
            <li><Link to="/size-guide" className="hover:text-[#D8A19B] transition-colors">Sizing Guide & mm Chart</Link></li>
            <li><Link to="/how-it-works" className="hover:text-[#D8A19B] transition-colors">How Press-Ons Work</Link></li>
            <li><Link to="/track-order" className="hover:text-[#D8A19B] transition-colors">Track Courier Order</Link></li>
            <li><Link to="/about" className="hover:text-[#D8A19B] transition-colors">About the Artist</Link></li>
            <li><Link to="/contact" className="hover:text-[#D8A19B] transition-colors">Contact Atelier Desk</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter & Policies */}
        <div className="space-y-4">
          <div>
            <h4 className="font-heading font-medium text-base text-[#FFFDFC] mb-2">The Atelier Gazette</h4>
            <p className="text-xs text-[#C2CBD3] leading-relaxed mb-3">
              Subscribe for private collection drops, nail rituals, and 10% off your first order.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs text-[#A8C1A2] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#879B83]" />
                <span>Thank you! Check your inbox for your 10% welcome voucher.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Email address for atelier newsletter
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    aria-label="Email address for atelier newsletter"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-[#FFFDFC] placeholder-[#C2CBD3]/60 focus:outline-none focus:ring-1 focus:ring-[#D89B96]"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#9C5550] text-[#FFFDFC] hover:bg-[#8A4743] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFDFC]"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="text-xs text-[#C2CBD3] space-y-1 pt-2 border-t border-[#3A425E]/60">
            <p className="font-medium text-[#FFFDFC]">Atelier Concierge Desk</p>
            <p>Mon – Sun: 10:00 AM – 7:00 PM (WhatsApp & Email)</p>
            <p className="text-[#A8C1A2]">● Online store open 24/7</p>
          </div>
        </div>

      </div>

      {/* Payment Methods & Policy Links Bar */}
      <div 
        className="border-t border-[#3A425E]/60 py-8 px-4 text-xs"
        style={{ color: 'rgba(246, 243, 237, 0.70)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[#C2CBD3]">
            <Link to="/about" className="hover:text-[#D8A19B] transition-colors">About</Link>
            <Link to="/faq" className="hover:text-[#D8A19B] transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-[#D8A19B] transition-colors">Contact</Link>
            <Link to="/shipping-returns" className="hover:text-[#D8A19B] transition-colors">Shipping & Returns</Link>
            <Link to="/privacy-policy" className="hover:text-[#D8A19B] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#D8A19B] transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="hover:text-[#D8A19B] transition-colors text-[#C8A46A]">Admin Portal</Link>
          </div>

          {/* Supported Payment Badges */}
          <div className="flex items-center gap-2 text-[10px] text-[#FFFDFC]">
            <span className="px-2 py-1 rounded bg-white/10 border border-white/20 font-semibold">UPI (GPay / PhonePe)</span>
            <span className="px-2 py-1 rounded bg-white/10 border border-white/20 font-semibold">VISA</span>
            <span className="px-2 py-1 rounded bg-white/10 border border-white/20 font-semibold">MasterCard</span>
            <span className="px-2 py-1 rounded bg-white/10 border border-white/20 font-semibold">RuPay</span>
            <span className="px-2 py-1 rounded bg-white/10 border border-white/20 font-semibold">COD</span>
          </div>

        </div>

        <div className="max-w-7xl mx-auto text-center md:text-left pt-4 border-t border-[#3A425E]/40 mt-4 text-[11px] text-[#C2CBD3]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Nailsbyhelina Luxury Nail Studio. All rights reserved.</p>
          <p>Handcrafted with love & precision in India.</p>
        </div>
      </div>
    </footer>
  );
}
