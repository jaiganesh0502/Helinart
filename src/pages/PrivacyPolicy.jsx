import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      <SEO
        title="Privacy Policy & Data Protection"
        description="Our commitment to safeguarding personal data and transaction security under the Indian IT Act and Digital Personal Data Protection standards."
        keywords="privacy policy, data protection, nailsbyhelina privacy terms"
      />
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
          <Lock className="w-3.5 h-3.5 text-[#9C5550]" />
          <span>Legal & Data Protection</span>
        </div>
        <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#786866]">
          Last Updated: October 2026 • Compliant with Indian Information Technology Act & Digital Personal Data Protection
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#EEF3EE] border border-[#879B83]/50 text-xs text-[#2B3B29] space-y-1">
        <span className="font-bold text-[#313851] block">[Note to Owner: Privacy Terms Template]</span>
        <p>This is a standard luxury beauty studio privacy policy. Update your registered legal entity name, jurisdiction, or Data Protection Officer email as needed.</p>
      </div>

      <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-xs space-y-8 text-xs text-[#453A3C] leading-relaxed">
        
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

      </div>

    </div>
  );
}
