import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Search, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import PageStatusWrapper from '../components/PageStatusWrapper';
import { faqService } from '../services/faqService';
import { pageService } from '../services/pageService';
import { settingsService } from '../services/settingsService';
import { SOCIAL_LINKS } from '../config/social';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedFaqs, fetchedPage, settings] = await Promise.all([
        faqService.getFaqs(),
        pageService.getPageBySlug('faq'),
        settingsService.getSettings().catch(() => null)
      ]);
      setFaqs(fetchedFaqs);
      setPage(fetchedPage);
      if (settings) setSiteSettings(settings);
      if (fetchedFaqs && fetchedFaqs.length > 0) {
        setExpandedId(fetchedFaqs[0].id);
      }
    } catch (err) {
      console.error('Error loading FAQ page:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const whatsappRaw = siteSettings?.whatsapp_raw_number || '919361405676';
  const whatsappNumber = siteSettings?.whatsapp_number || SOCIAL_LINKS.whatsappNumber;

  const categories = ['All', ...new Set(faqs.map(f => f.category || 'General').filter(Boolean))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
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
    <PageStatusWrapper loading={loading} error={error} page={page} onRetry={loadData}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
        <SEO
          title={page?.seo_title || page?.title || "Frequently Asked Questions & Care Handbook"}
          description={page?.seo_description || page?.subtitle || "Answers to sizing kits, application longevity (3-week wear), gentle warm-water removal, reusable acrylic tips, and fast domestic shipping across India."}
          keywords="press-on faq, how to apply press ons, nailsbyhelina help, reusable nails care"
          structuredData={faqSchema}
        />
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
            <HelpCircle className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>{page?.subtitle || "Atelier Knowledge Base"}</span>
          </div>
          <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
            {page?.title || "Frequently Asked Questions"}
          </h1>
          <p className="text-sm sm:text-base text-[#786866] max-w-xl mx-auto leading-relaxed">
            Everything you need to know about bespoke sizing, multi-wear longevity, gentle removal, and pan-India shipping.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#786866]" />
            <input
              type="text"
              placeholder="Search sizing, wear duration, glue, removal, shipping..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] text-sm text-[#313851] placeholder-[#786866] focus:outline-hidden focus:border-[#9C5550] shadow-xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#313851] text-[#FFFDFC] shadow-xs'
                    : 'bg-[#FFFDFC] text-[#786866] border border-[#D8C6C3] hover:border-[#313851] hover:text-[#313851]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-[#FFFDFC] rounded-3xl border border-[#D8C6C3] p-8 space-y-3">
              <p className="text-sm text-[#786866]">No answers found matching "{searchQuery}".</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="text-xs font-semibold text-[#9C5550] underline"
              >
                Clear search filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] overflow-hidden transition-all duration-200 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#F6F3ED]/40 transition-colors"
                  >
                    <div className="space-y-1 pr-2">
                      <span className="text-[10px] font-semibold text-[#9C5550] uppercase tracking-wider block">
                        {faq.category || 'General'}
                      </span>
                      <h3 className="font-heading font-medium text-base sm:text-lg text-[#313851] leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-[#F4ECE6] text-[#793D39] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 bg-[#313851] text-[#FFFDFC]' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#453A3C] leading-relaxed border-t border-[#D8C6C3]/40 bg-[#FFFDFC]">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Concierge Card */}
        <div className="bg-[#262D42] text-[#FFFDFC] rounded-3xl p-8 sm:p-10 border border-[#3A425E] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#C8A46A] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Still Have Questions?</span>
            </div>
            <h3 className="font-heading font-medium text-2xl text-[#FFFDFC]">
              Chat With Our Atelier Concierge
            </h3>
            <p className="text-xs sm:text-sm text-[#C2CBD3] max-w-md">
              Need custom measurements, personalized sizing confirmation, or bridal styling assistance?
            </p>
          </div>

          <a
            href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent('Hi Nailsbyhelina, I have a question about sizing and ordering.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full text-xs font-semibold bg-[#879B83] text-[#FFFDFC] hover:bg-[#768A72] transition-colors shrink-0 flex items-center gap-2 shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>
        </div>

      </div>
    </PageStatusWrapper>
  );
}
