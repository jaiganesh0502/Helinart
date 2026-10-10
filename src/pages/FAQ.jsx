import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Search, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { settingsService } from '../services/settingsService';
import { SOCIAL_LINKS } from '../config/social';

export default function FAQ() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState('q1');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const s = await settingsService.getSettings();
        if (mounted && s) setSiteSettings(s);
      } catch (e) {
        console.warn('Could not load settings in FAQ', e);
      }
    }
    loadSettings();
    return () => { mounted = false; };
  }, []);

  const faqs = [
    {
      id: 'q1',
      category: 'Sizing & Fit',
      question: 'How do I know what press-on size to order?',
      answer: 'You can easily measure your natural nail widths using clear scotch tape and a millimeter ruler (refer to our interactive /size-guide). Alternatively, we recommend ordering our ₹199 Atelier Sizing Kit, which ships 10 sample tips to your doorstep and gives you ₹199 back in store credit.'
    },
    {
      id: 'q2',
      category: 'Sizing & Fit',
      question: 'What if my nails are between sizes?',
      answer: 'Always size up! If your index finger measures 12.5mm, pick size 4 (13mm). You can gently file down the soft lateral edges of our tips with the included mini file for a bespoke glove-like fit.'
    },
    {
      id: 'q3',
      category: 'Application & Hold',
      question: 'How long do Nailsbyhelina press-on sets last?',
      answer: 'With our medical adhesive tabs, sets typically stay firmly locked for 3 to 7 days, making them perfect for events, shoots, and weekend outings. With studio liquid brush glue, sets hold for up to 3 weeks without lifting.'
    },
    {
      id: 'q4',
      category: 'Application & Hold',
      question: 'Can I shower, wash dishes, or wash my hair with them on?',
      answer: 'Yes! Our medical tabs and resin are 100% waterproof once cured. Just avoid submerging hands in hot water or saunas for the first 60 minutes after initial application.'
    },
    {
      id: 'q5',
      category: 'Reusability & Care',
      question: 'How do I remove the press-ons without damaging my natural nails?',
      answer: 'Never pry or force the nails off! Simply soak fingertips in a bowl of warm water with gentle soap and a few drops of our Rose Cuticle Elixir for 10 minutes. The adhesive gummy bonds will soften, allowing you to slide them off with the wooden orange stick.'
    },
    {
      id: 'q6',
      category: 'Reusability & Care',
      question: 'Can I truly reuse the press-on tips?',
      answer: 'Yes, up to 5 times! Because our nails are sculpted from high-durability acrylic polymer rather than cheap ABS plastic, you can peel the old gummy tab off the underside and reapply with a fresh tab whenever you wish.'
    },
    {
      id: 'q7',
      category: 'Shipping & Delivery',
      question: 'How fast do orders ship across India?',
      answer: 'Bengaluru orders arrive in 24 to 48 hours via local express courier. Tier-1 metros (Delhi NCR, Mumbai, Chennai, Hyderabad, Kolkata) take 2 to 3 business days. Pan-India delivery takes 3 to 5 business days. Free shipping applies on all orders above ₹999.'
    },
    {
      id: 'q8',
      category: 'Studio Bookings',
      question: 'Why is a ₹200 advance deposit required for in-studio appointments?',
      answer: 'Because our private studio operates on a 1-on-1 model with dedicated master artists, the ₹200 deposit reserves your private artist slot. It is 100% credited toward your final service total on the appointment day.'
    },
    {
      id: 'q9',
      category: 'Studio Bookings',
      question: 'Can I reschedule or cancel my in-studio appointment?',
      answer: 'Yes. You can reschedule or cancel for free up to 24 hours prior to your slot directly through our booking portal. Cancellations within 24 hours forfeit the ₹200 deposit to compensate the scheduled artisan.'
    }
  ];

  const categories = ['All', 'Sizing & Fit', 'Application & Hold', 'Reusability & Care', 'Shipping & Delivery', 'Studio Bookings'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      <SEO
        title="Frequently Asked Questions"
        description="Get answers about press-on nail sizing, adhesive tabs vs liquid resin, 5x reusability, pan-India courier delivery, and studio booking policies."
        keywords="press on nail faq, how to wear press on nails, nailsbyhelina help, reusable nails questions"
        schema={faqSchema}
      />
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
          <HelpCircle className="w-3.5 h-3.5 text-[#9C5550]" />
          <span>Atelier Concierge Help Center</span>
        </div>
        <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-[#786866] max-w-xl mx-auto leading-relaxed">
          Everything you need to know about measuring nail widths, adhesive longevity, damage-free removal, and in-studio bookings.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#786866]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. sizing, removal, shower)..."
          className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#D8C6C3] bg-[#FFFDFC] text-[#313851] focus:outline-none focus:ring-1 focus:ring-[#9C5550] shadow-xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-[#313851] text-[#FFFDFC] shadow-xs'
                : 'bg-[#FFFDFC] text-[#313851] border border-[#D8C6C3] hover:border-[#9C5550]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-[#9C5550] px-2 py-0.5 rounded bg-[#F4ECE6]">
                    {faq.category}
                  </span>
                  <h3 className="font-heading font-medium text-base sm:text-lg text-[#313851]">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#786866] shrink-0 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-[#9C5550]' : ''
                }`} />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#453A3C] leading-relaxed border-t border-[#D8C6C3]/50 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs text-[#786866]">
            No answers matched your search. Contact our studio concierge for immediate assistance.
          </div>
        )}
      </div>

      {/* Bottom Concierge Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F6F3ED] border border-[#D8C6C3] text-center space-y-3">
        <h3 className="font-heading font-medium text-xl text-[#313851]">
          Still have a question about your nails?
        </h3>
        <p className="text-xs text-[#786866] max-w-md mx-auto">
          Our atelier concierge artists are available 10:00 AM – 7:00 PM for custom design consultations, sizing verification, and order inquiries.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/contact"
            className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors"
          >
            Contact Studio
          </Link>
          <a
            href={`https://wa.me/${siteSettings?.whatsapp_raw_number || '919361405676'}?text=${encodeURIComponent('Hi Nailsbyhelina, I’d like to know more about your nail sets.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#EEF3EE] text-[#43623E] border border-[#B7DCB2] hover:bg-[#E7F3E6] transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#879B83]" />
            <span>Chat on WhatsApp ({siteSettings?.whatsapp_number || '+91 93614 05676'})</span>
          </a>
        </div>
      </div>

    </div>
  );
}
