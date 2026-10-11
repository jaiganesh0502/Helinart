import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import SEO from '../components/SEO';
import PageStatusWrapper from '../components/PageStatusWrapper';
import { pageService } from '../services/pageService';

export default function Terms() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pageService.getPageBySlug('terms-of-service');
      setPage(data);
    } catch (err) {
      console.error('Error loading terms-of-service page:', err);
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
          title={page?.seo_title || page?.title || "Terms & Conditions of Service"}
          description={page?.seo_description || page?.subtitle || "Client agreement, custom handcrafted variation disclaimers, and service terms for Nailsbyhelina."}
          keywords="terms and conditions, client agreement, nail studio policies, nailsbyhelina terms"
        />
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
            <FileText className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>{page?.subtitle || "Client Agreement"}</span>
          </div>
          <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
            {page?.title || "Terms & Conditions of Service"}
          </h1>
          <p className="text-xs text-[#786866]">
            {content.lastUpdated || "Last Updated: October 2026"} • Nailsbyhelina
          </p>
        </div>

        <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-xs space-y-8 text-xs sm:text-sm text-[#453A3C] leading-relaxed">
          
          {content.fullTerms ? (
            <div className="whitespace-pre-line space-y-4 text-[#453A3C]">
              {content.fullTerms}
            </div>
          ) : (
            <>
              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">1. General Overview</h2>
                <p>
                  By accessing this website, placing orders for handcrafted press-on nails, or booking services, you agree to comply with and be bound by the following Terms and Conditions.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">2. Handcrafted Product Authenticity & Variance</h2>
                <p>
                  Every press-on nail set is individually sculpted and hand-painted by artisan sculptors. Minor artistic variances in crystal positioning, hand-burnished chrome swirls, or marbling are a hallmark of artisanal handcrafting and not manufacturing defects.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">3. In-Studio Booking & Deposit Terms</h2>
                <ul className="list-disc list-inside space-y-1 pl-2 text-[#453A3C]">
                  <li><strong>Advance Slot Deposit:</strong> A non-refundable ₹200 deposit is required to reserve any atelier appointment slot. This amount directly offsets your service bill on the appointment day.</li>
                  <li><strong>Rescheduling:</strong> You may reschedule your appointment free of charge up to 24 hours prior to the booked time.</li>
                  <li><strong>Late Arrivals:</strong> A 15-minute grace period is granted. Beyond 15 minutes, appointments may be shortened to preserve the schedule of subsequent clients.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">4. Health, Allergies & Application Disclaimers</h2>
                <p>
                  Our press-ons and adhesive tabs are formulated from hypoallergenic materials. However, clients with known severe acrylic or cyanoacrylate sensitivities should test adhesive tabs on a single finger prior to full-set application. Nailsbyhelina is not liable for allergic reactions resulting from improper application or pre-existing natural nail infections.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">5. Intellectual Property</h2>
                <p>
                  All custom artwork, photography, design names (e.g., Sakura Velvet Chrome, Vanilla Glaze French), and brand assets are the exclusive intellectual property of Nailsbyhelina and may not be reproduced without written consent.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-heading font-medium text-xl text-[#313851]">6. Governing Law & Jurisdiction</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India. Any legal disputes shall be subject exclusively to the courts of Bengaluru, Karnataka.
                </p>
              </section>
            </>
          )}

        </div>

      </div>
    </PageStatusWrapper>
  );
}
