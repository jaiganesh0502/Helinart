import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import PageStatusWrapper from '../components/PageStatusWrapper';
import { pageService } from '../services/pageService';

export default function ShippingReturns() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pageService.getPageBySlug('shipping-returns');
      setPage(data);
    } catch (err) {
      console.error('Error loading shipping-returns page:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const content = page?.content || {};

  return (
    <PageStatusWrapper loading={loading} error={error} page={page} onRetry={loadData}>
      {/* Requirement 26: comfortable reading layout max-w-4xl (850-950px) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
        <SEO
          title={page?.seo_title || page?.title || "Shipping, Delivery & Returns Policy"}
          description={page?.seo_description || page?.subtitle || "Detailed domestic shipping timelines, free shipping on orders over ₹999, transit guarantees, and hygiene seal return conditions."}
          keywords="nailsbyhelina shipping, press on nail delivery india, return policy press on nails"
        />
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
            <Truck className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>{page?.subtitle || "Client Care & Assurance"}</span>
          </div>
          <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
            {page?.title || "Shipping, Delivery & Returns Policy"}
          </h1>
          <p className="text-sm sm:text-base text-[#786866] max-w-xl mx-auto leading-relaxed">
            {content.shippingOverview || "Transparent guidelines on our domestic courier transit, hygiene seal standards, and transit damage guarantees."}
          </p>
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

          <div className="space-y-3 text-xs sm:text-sm text-[#453A3C] leading-relaxed">
            <p>
              <strong>Complimentary Express Courier:</strong> Orders valued at {content.freeShippingThreshold || '₹999'} or above receive 100% free express delivery. {content.shippingFees || 'A flat fee of ₹99 applies to orders under ₹999.'}
            </p>
            <p>
              <strong>Order Processing & Dispatch:</strong> {content.processingTime || 'Bespoke sets are handcrafted and dispatched within 2-4 business days.'}
            </p>
            <p>
              <strong>Expected Delivery Timelines:</strong> {content.expectedDelivery || '24-48 hours for Bengaluru; 2-3 business days for Metro hubs; 3-5 business days for pan-India destinations.'}
            </p>
            <p>
              <strong>Packaging Standards:</strong> Every set is packed in a protective, padded keepsake velvet presentation box ensuring zero crushing or tip damage during shipping.
            </p>
            <p>
              <strong>Live Courier Tracking:</strong> Once dispatched, live tracking SMS notifications are triggered. You can track your parcel live anytime at <a href="/track-order" className="text-[#9C5550] underline font-medium">nailsbyhelina.com/track-order</a>.
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

          <div className="p-4 rounded-2xl bg-[#F4ECE6] border border-[#D8C6C3] space-y-2 text-xs text-[#453A3C]">
            <div className="flex items-center gap-2 text-[#793D39] font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>Strict Cosmetic Hygiene Compliance</span>
            </div>
            <p className="leading-relaxed">
              {content.returnsPolicy || "Due to strict health and cosmetic hygiene regulations, press-on nail sets cannot be returned or refunded once the tamper-evident box seal is broken or if the nails have touched natural nail beds."}
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#453A3C] leading-relaxed">
            <p>
              <strong>Exchange Rules:</strong> {content.exchangeRules || "Unopened sets in original sealed velvet presentation packaging may be exchanged within 48 hours of delivery."}
            </p>
            <p>
              <strong>Transit Damage Guarantee:</strong> {content.damagedProcess || "If your order arrives damaged, broken, or with missing gems, record an unboxing video within 24 hours of delivery and WhatsApp our concierge. We will dispatch a complimentary priority replacement immediately."}
            </p>
            <p>
              <strong>Refund Process:</strong> {content.refundPolicy || "Eligible refunds are processed back to the original payment method within 5-7 business days."}
            </p>
          </div>
        </section>

        {/* SECTION 3: ASSISTANCE */}
        <section className="p-6 rounded-2xl bg-[#EEF3EE] border border-[#879B83]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-[#313851] block text-sm">Need Help With Your Shipment?</span>
            <p className="text-[#453A3C]">
              {content.contactInstructions || "Contact our concierge desk on WhatsApp (+91 93614 05676) or email concierge@nailsbyhelina.com with your Order ID."}
            </p>
          </div>
          <a
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-[#313851] text-[#FFFDFC] font-semibold hover:bg-[#262D42] transition-colors shrink-0"
          >
            Contact Concierge
          </a>
        </section>

      </div>
    </PageStatusWrapper>
  );
}
