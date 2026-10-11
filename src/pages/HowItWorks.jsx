import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hand, Droplets, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import PageStatusWrapper from '../components/PageStatusWrapper';
import { pageService } from '../services/pageService';

export default function HowItWorks() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pageService.getPageBySlug('how-press-ons-work');
      setPage(data);
    } catch (err) {
      console.error('Error loading how-press-ons-work page:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const content = page?.content || {};

  const defaultSteps = [
    {
      num: '01',
      title: 'Precision Natural Nail Prep',
      icon: Hand,
      tag: '5 Minutes',
      lead: 'The secret to 3-week wear is a squeaky clean, dehydrated nail surface.',
      points: [
        'Push cuticles back: Use the angled beveled wooden stick to push back the eponychium and clear invisible dead cuticle cells from the nail plate.',
        'Gentle surface buff: With the included fine grit mini-buffer, lightly buff away natural shine. No heavy filing needed!',
        'Sanitize & dehydrate: Wipe each nail vigorously with the medical isopropyl alcohol wipe to eliminate residual oils, hand creams, and moisture.',
        'Dry completely: Allow 30 seconds for the alcohol to fully evaporate before touching the nails.'
      ]
    },
    {
      num: '02',
      title: 'Application & Locking Pressure',
      icon: Droplets,
      tag: '3 Minutes',
      lead: 'Choose between temporary weekend tabs (3-5 days) or full studio resin (up to 3 weeks).',
      points: [
        'Size matching: Test nail sizes on bare fingers before opening glue. If between sizes, choose the larger and file sides.',
        'Apply tab or resin: For tabs, place flush with cuticle and peel clear plastic film. For resin, apply a pea-sized drop to both the natural nail and press-on well.',
        '45-degree angle contact: Slide the press-on under your cuticle at a 45° angle, then rock it down slowly to push out air pockets.',
        'Firm static press: Hold unwavering static pressure for 30 full seconds across the entire nail plate.'
      ]
    },
    {
      num: '03',
      title: 'Gentle Removal & Reusability',
      icon: RefreshCw,
      tag: '10 Minutes',
      lead: 'Zero natural damage. Our release technique keeps your keratin beds healthy and your press-on tips ready to rewear up to 5 times.',
      points: [
        'Warm soapy water soak: Submerge hands in a bowl of warm water with a few drops of dish soap and our Rose Botanical Cuticle Elixir for 10 minutes.',
        'Test looseness: Never rip or force press-ons off! Gently wiggle the wooden stick along the lateral sides until the adhesive breaks.',
        'Roll off tab residue: Gently peel remaining adhesive tab gummy residue off the back of the nail tip with your thumb.',
        'Store in keepsake box: Place your handcrafted tips back into your signature velvet case for your next soirée.'
      ]
    }
  ];

  const adhesiveComparison = [
    {
      feature: 'Intended Wear Duration',
      tabs: '3 to 7 Days (Weekend events / shoot / weddings)',
      resin: '2 to 3+ Weeks (Continuous everyday wear)'
    },
    {
      feature: 'Tip Reusability',
      tabs: '100% Reusable up to 5x (Zero residue damage)',
      resin: 'Reusable 2-3x (Requires gentle buff of dried glue)'
    },
    {
      feature: 'Removal Process',
      tabs: '10 min warm water & oil soak (Zero acetone)',
      resin: 'Warm soapy water with olive/cuticle oil soak'
    },
    {
      feature: 'Natural Nail Health',
      tabs: '100% Damage-free, cuticle safe',
      resin: 'Gentle on natural nail when soaked off properly'
    },
    {
      feature: 'Best For',
      tabs: 'Frequent style changes, weekend outings, doctors & nurses',
      resin: 'Vacations, extended travels, bridal honeymoons'
    }
  ];

  return (
    <PageStatusWrapper loading={loading} error={error} page={page} onRetry={loadData}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        <SEO
          title={page?.seo_title || page?.title || "How It Works: Prep, Apply & Reuse Guide"}
          description={page?.seo_description || page?.subtitle || "Master salon-grade press-on nail application and gentle, damage-free removal in minutes. Up to 3+ weeks of wear and reusable up to 5 times."}
          keywords="how to apply press on nails, press on nail prep, how to remove press on nails without damage, nailsbyhelina application guide"
        />
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
            <Clock className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>{page?.subtitle || "The Atelier Handbook"}</span>
          </div>
          <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
            {page?.title || "How Press-On Nails Work"}
          </h1>
          <p className="text-base text-[#786866] leading-relaxed">
            {content.intro || "Master the art of 10-minute application and gentle, damage-free removal. Designed for modern connoisseurs who crave haute couture manicures without salon sitting hours."}
          </p>
        </div>

        {/* Dynamic / Default Steps */}
        <div className="space-y-8">
          {(content.steps && Array.isArray(content.steps) && content.steps.length > 0 ? content.steps : defaultSteps).map((step, idx) => {
            const stepNum = step.num || `0${idx + 1}`;
            return (
              <div
                key={stepNum}
                className="p-6 sm:p-10 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8C6C3]/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F4ECE6] text-[#9C5550] flex items-center justify-center font-bold text-lg font-heading">
                      {stepNum}
                    </div>
                    <div>
                      {step.tag && <span className="text-xs font-semibold text-[#9C5550]">{step.tag}</span>}
                      <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
                        {step.title}
                      </h2>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#F6F3ED] text-[#313851] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#9C5550]" />
                  </div>
                </div>

                {step.lead && (
                  <p className="text-sm font-medium text-[#313851]">
                    {step.lead}
                  </p>
                )}

                {step.desc && (
                  <p className="text-xs sm:text-sm text-[#453A3C] leading-relaxed">
                    {step.desc}
                  </p>
                )}

                {step.points && Array.isArray(step.points) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {step.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-[#453A3C]">
                        <CheckCircle2 className="w-4 h-4 text-[#879B83] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Adhesive Comparison Matrix */}
        <section className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-xs space-y-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-medium text-[#793D39]">Adhesive Selection</span>
            <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
              Medical Tabs vs. Studio Liquid Glue
            </h2>
            <p className="text-xs sm:text-sm text-[#786866]">
              Both are included inside every Nailsbyhelina presentation set. Choose depending on your lifestyle.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#D8C6C3] text-[#786866]">
                  <th className="py-3 px-4 font-medium">Feature</th>
                  <th className="py-3 px-4 font-medium">Medical Sticky Tabs</th>
                  <th className="py-3 px-4 font-medium">Liquid Studio Resin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C6C3]/40">
                {adhesiveComparison.map((r) => (
                  <tr key={r.feature} className="hover:bg-[#F6F3ED]/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#313851]">{r.feature}</td>
                    <td className="py-3 px-4 text-[#453A3C]">{r.tabs}</td>
                    <td className="py-3 px-4 text-[#453A3C]">{r.resin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#EEF3EE] border border-[#879B83]/50 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#879B83]" />
            <h3 className="font-heading font-medium text-2xl text-[#313851]">
              Master Sculptor Secrets for Extended Hold
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#453A3C]">
            <div className="p-3 bg-[#FFFDFC] rounded-2xl border border-[#879B83]/40">
              <strong>Avoid Hot Water for 60 Minutes</strong>
              <p className="mt-1 text-[#786866]">Give the polymer adhesive bonds 1 full hour to cure and lock against your natural keratin.</p>
            </div>
            <div className="p-3 bg-[#FFFDFC] rounded-2xl border border-[#879B83]/40">
              <strong>Use Your Finger Pads, Not Nails</strong>
              <p className="mt-1 text-[#786866]">Do not use your press-on tips as tools to open soda cans, peel stickers, or scrape surfaces.</p>
            </div>
            <div className="p-3 bg-[#FFFDFC] rounded-2xl border border-[#879B83]/40">
              <strong>Nighttime Application</strong>
              <p className="mt-1 text-[#786866]">Applying right before sleeping gives the sets 7–8 hours of undisturbed bonding with zero moisture exposure.</p>
            </div>
          </div>
        </section>

        {/* Bottom CTA to Shop */}
        <div className="text-center pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm text-[#FFFDFC] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(135deg, #B26661, #9C5550)' }}
          >
            <span>Explore Handcrafted Nail Sets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </PageStatusWrapper>
  );
}
