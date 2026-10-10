import React from 'react';
import { Link } from 'react-router-dom';
import { Hand, Droplets, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

export default function HowItWorks() {
  const deepSteps = [
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
      <SEO
        title="How It Works: Prep, Apply & Reuse Guide"
        description="Master salon-grade press-on nail application and gentle, damage-free removal in minutes. Up to 3+ weeks of wear and reusable up to 5 times."
        keywords="how to apply press on nails, press on nail prep, how to remove press on nails without damage, nailsbyhelina application guide"
      />
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
          <Clock className="w-3.5 h-3.5 text-[#9C5550]" />
          <span>The Atelier Handbook</span>
        </div>
        <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
          How Press-On Nails Work
        </h1>
        <p className="text-base text-[#786866] leading-relaxed">
          Master the art of 10-minute application and gentle, damage-free removal. Designed for modern connoisseurs who crave haute couture manicures without salon sitting hours.
        </p>
      </div>

      {/* 3 Step Deep Dive */}
      <div className="space-y-8">
        {deepSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="p-6 sm:p-10 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8C6C3]/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4ECE6] text-[#9C5550] flex items-center justify-center font-bold text-lg font-heading">
                    {step.num}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#9C5550]">{step.tag}</span>
                    <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
                      {step.title}
                    </h2>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F6F3ED] text-[#313851] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#9C5550]" />
                </div>
              </div>

              <p className="text-sm font-medium text-[#313851]">
                {step.lead}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {step.points.map((pt, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#879B83] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#453A3C] leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Adhesive Comparison: Tabs vs Resin */}
      <section className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-medium text-[#793D39]">Adhesive Selection</span>
          <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
            Adhesive Tabs vs Liquid Studio Resin
          </h2>
          <p className="text-xs sm:text-sm text-[#786866]">
            Every Nailsbyhelina set includes complimentary tabs. Choose the adhesive that suits your lifestyle.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#D8C6C3]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4ECE6] text-[#313851] font-semibold border-b border-[#D8C6C3]">
              <tr>
                <th className="py-3.5 px-4">Feature</th>
                <th className="py-3.5 px-4 text-[#9C5550]">Medical Adhesive Tabs (Included)</th>
                <th className="py-3.5 px-4 text-[#313851]">Liquid Studio Resin Glue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8C6C3]/60 bg-[#FFFDFC]">
              {adhesiveComparison.map((row) => (
                <tr key={row.feature} className="hover:bg-[#F6F3ED]/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#313851]">{row.feature}</td>
                  <td className="py-3.5 px-4 text-[#453A3C]">{row.tabs}</td>
                  <td className="py-3.5 px-4 text-[#453A3C]">{row.resin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pro Tips for 3-Week Wear */}
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
  );
}
