import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { settingsService } from '../services/settingsService';

export default function ShippingReturns() {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const s = await settingsService.getSettings();
        if (mounted && s) setSiteSettings(s);
      } catch (e) {
        console.warn('Could not load settings in ShippingReturns', e);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      <SEO
        title="Shipping, Delivery & Returns Policy"
        description="Detailed domestic shipping timelines (Local express 24-48h, Pan-India 3-5 days), free shipping on orders over ₹999, transit guarantees, and hygiene seal return conditions."
        keywords="nailsbyhelina shipping, press on nail delivery india, return policy press on nails"
      />
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
          <Truck className="w-3.5 h-3.5 text-[#9C5550]" />
          <span>Client Care & Assurance</span>
        </div>
        <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
          Shipping, Delivery & Returns Policy
        </h1>
        <p className="text-sm sm:text-base text-[#786866] max-w-xl mx-auto leading-relaxed">
          Transparent guidelines on our domestic courier transit, hygiene seal standards, and transit damage guarantees.
        </p>
      </div>

      {/* Owner Note */}
      <div className="p-4 rounded-2xl bg-[#EEF3EE] border border-[#879B83]/50 text-xs text-[#2B3B29] space-y-1">
        <span className="font-bold text-[#313851] block">[Note to Owner: Policy Customization]</span>
        <p>This policy reflects luxury beauty studio industry standards across India. Edit return windows, courier partners, or fee thresholds as your operations evolve.</p>
      </div>

      {/* SECTION 1: SHIPPING & TRANSIT */}
      <section className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-[#D8C6C3]/60 pb-3">
          <Truck className="w-5 h-5 text-[#9C5550]" />
          <h2 className="font-heading font-medium text-2xl text-[#313851]">
            1. Domestic Shipping & Transit
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60 space-y-1">
            <span className="font-bold text-[#9C5550] block">Local Express Courier</span>
            <div className="font-heading font-medium text-xl text-[#313851]">24 – 48 Hours</div>
            <p className="text-[#786866]">Dispatched via express atelier courier directly to your doorstep.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60 space-y-1">
            <span className="font-bold text-[#313851] block">Tier-1 Metro Hubs</span>
            <div className="font-heading font-medium text-xl text-[#313851]">2 – 3 Business Days</div>
            <p className="text-[#786866]">Mumbai, Delhi NCR, Chennai, Hyderabad, Pune, Kolkata via Blue Dart Air.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60 space-y-1">
            <span className="font-bold text-[#879B83] block">Rest of India</span>
            <div className="font-heading font-medium text-xl text-[#313851]">3 – 5 Business Days</div>
            <p className="text-[#786866]">Delivered to all serviceable pin codes across Tier-2 and Tier-3 cities.</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-[#453A3C] leading-relaxed">
          <p>
            <strong>Complimentary Express Courier:</strong> Orders valued at ₹999 or above receive 100% free express delivery. A flat fee of ₹99 applies to orders under ₹999.
          </p>
          <p>
            <strong>Packaging Standards:</strong> Every set is packed in a protective, padded keepsake velvet presentation box ensuring zero crushing or tip damage during shipping.
          </p>
          <p>
            <strong>Live Courier Tracking:</strong> Once dispatched, a live tracking SMS with Blue Dart AWB waybill is triggered. You can track your parcel live anytime at <a href="/track-order" className="text-[#9C5550] underline font-medium">nailsbyhelina.com/track-order</a>.
          </p>
        </div>
      </section>

      {/* SECTION 2: HYGIENE & RETURNS */}
      <section className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-[#D8C6C3]/60 pb-3">
          <ShieldCheck className="w-5 h-5 text-[#879B83]" />
          <h2 className="font-heading font-medium text-2xl text-[#313851]">
            2. Hygiene Seal & Returns Policy
          </h2>
        </div>

        <div className="space-y-3 text-xs text-[#453A3C] leading-relaxed">
          <p>
            <strong>Intimate Cosmetic Hygiene Standards:</strong> Because press-on nails touch natural nail keratin and cuticles, all keepsake boxes are sealed with a tamper-evident holographic safety sticker.
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#453A3C]">
            <li>
              <strong>Unopened & Sealed Returns (48 Hours):</strong> If the box remains completely sealed with its original tamper-evident sticker intact, you may initiate a return within 48 hours of delivery for store credit or refund.
            </li>
            <li>
              <strong>Opened Products (Hygiene Policy):</strong> Once the holographic hygiene seal is broken, sets cannot be returned or restocked to ensure client safety.
            </li>
            <li>
              <strong>Custom Made-to-Order Sets:</strong> Bespoke sets sculpted to your exact millimeter dimensions or personalized color briefs are final sale.
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 3: TRANSIT DAMAGE GUARANTEE */}
      <section className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-[#D8C6C3]/60 pb-3">
          <RefreshCw className="w-5 h-5 text-[#C8A46A]" />
          <h2 className="font-heading font-medium text-2xl text-[#313851]">
            3. Transit Damage Guarantee
          </h2>
        </div>

        <p className="text-xs text-[#453A3C] leading-relaxed">
          If your package arrives crushed or a tip is damaged during transit, take a quick photo of the unboxing and WhatsApp our concierge at <a href={`https://wa.me/${siteSettings?.whatsapp_raw_number || '919361405676'}?text=${encodeURIComponent('Hi Nailsbyhelina, I’d like to report a transit damage.')}`} target="_blank" rel="noopener noreferrer" className="text-[#9C5550] hover:underline font-semibold">{siteSettings?.whatsapp_number || '+91 93614 05676'}</a> within 24 hours. We will dispatch an immediate replacement set free of charge.
        </p>
      </section>

    </div>
  );
}
