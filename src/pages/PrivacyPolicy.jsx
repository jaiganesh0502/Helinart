import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import SEO from '../components/SEO';
import PageStatusWrapper from '../components/PageStatusWrapper';
import { pageService } from '../services/pageService';

export default function PrivacyPolicy() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pageService.getPageBySlug('privacy-policy');
      setPage(data);
    } catch (err) {
      console.error('Error loading privacy-policy page:', err);
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
      {/* Comfortable long-form reading layout max-w-4xl (850-950px) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
        <SEO
          title={page?.seo_title || page?.title || "Privacy Policy & Data Protection"}
          description={page?.seo_description || page?.subtitle || "Our commitment to safeguarding personal data and transaction security under the Indian IT Act and Digital Personal Data Protection standards."}
          keywords="privacy policy, data protection, nailsbyhelina privacy terms"
        />
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
            <Lock className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>{page?.subtitle || "Legal & Data Protection"}</span>
          </div>
          <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
            {page?.title || "Privacy Policy"}
          </h1>
          <p className="text-xs text-[#786866]">
            {content.lastUpdated || "Last Updated: October 2026"} • Compliant with Indian Information Technology Act & Digital Personal Data Protection
          </p>
        </div>

        <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-xs space-y-8 text-xs sm:text-sm text-[#453A3C] leading-relaxed">
          
          {content.fullPolicy ? (
            <div className="whitespace-pre-line space-y-4 text-[#453A3C]">
              {content.fullPolicy}
            </div>
          ) : (
            <>
              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">1. Introduction</h2>
                <p>
                  Welcome to Nailsbyhelina ("we", "our", or "the Atelier"). We respect your privacy and are committed to protecting the personal data you share when browsing our website, purchasing handcrafted press-on sets, or reaching out to our concierge desk.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">2. Information We Collect</h2>
                <p>We only collect information necessary to fulfill your couture nail orders and studio appointments:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-[#453A3C]">
                  <li><strong>Identity & Contact:</strong> Full name, phone number, and email address.</li>
                  <li><strong>Delivery Information:</strong> Physical street address, apartment details, and postal pin code.</li>
                  <li><strong>Nail Specifications:</strong> Sizing presets, millimeter measurements per finger, and shape preferences.</li>
                  <li><strong>Appointment Bookings:</strong> Date, time, selected service, and studio reference codes.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">3. Payment Data Security</h2>
                <p>
                  We do not store your credit card numbers, debit card CVVs, or UPI PINs on our servers. All monetary transactions (including advance studio deposits and online checkouts) are encrypted via 256-bit SSL and processed through certified PCI-DSS compliant payment gateways.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">4. How We Use Your Data</h2>
                <p>Your personal information is used exclusively to:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-[#453A3C]">
                  <li>Deliver orders through verified courier partners (e.g., Blue Dart, DTDC).</li>
                  <li>Transmit appointment verification and SMS/WhatsApp booking reminders.</li>
                  <li>Respond to custom design inquiries and bespoke moodboard submissions.</li>
                  <li>Send Atelier Gazette newsletter announcements (only if explicitly opted-in).</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">5. Third-Party Sharing</h2>
                <p>
                  We never sell, rent, or trade your personal data. Information is shared strictly with necessary operational service providers (such as logistics courier partners for delivery).
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">6. Contact Our Privacy Officer</h2>
                <p>
                  For any inquiries regarding data access, corrections, or deletion, please email <strong>privacy@nailsbyhelina.com</strong> or reach out to our concierge desk on WhatsApp (+91 93614 05676).
                </p>
              </section>
            </>
          )}

        </div>

      </div>
    </PageStatusWrapper>
  );
}
