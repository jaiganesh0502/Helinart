import React from 'react';
import { Sparkles, Hand, Droplets, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorksSection({ showFullPageLink = true }) {
  const steps = [
    {
      step: '01',
      title: 'Prep Natural Nails',
      icon: Hand,
      summary: 'Cleanse & lightly buff for 3-week adhesion.',
      desc: 'Use the included dual-sided wooden stick to push back cuticles gently. Wipe clean with an alcohol pad to remove natural oils, then lightly buff the nail surface.',
      tip: 'Pro tip: Dry, oil-free nails guarantee maximum hold.'
    },
    {
      step: '02',
      title: 'Apply & Press Firmly',
      icon: Droplets,
      summary: 'Adhesive tabs or studio brush glue.',
      desc: 'Select the matching tab size or a drop of non-damaging resin. Place the press-on at a 45° angle flush with the cuticle line, then press down firmly for 30 seconds.',
      tip: 'Pro tip: Avoid submerging hands in hot water for the first hour.'
    },
    {
      step: '03',
      title: 'Gently Remove & Reuse',
      icon: RefreshCw,
      summary: 'Soak in warm soapy water to rewear up to 5x.',
      desc: 'Soak hands in warm water with a drop of our Rose Cuticle Elixir for 10 minutes. Gently ease off using the wooden stick from the lateral sidewall. Zero nail damage.',
      tip: 'Pro tip: Store sets back in your keepsake case for next time.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
        <span className="text-xs font-medium text-[#793D39]">Effortless beauty in 10 minutes</span>
        <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
          How Press-Ons Work
        </h2>
        <p className="text-sm text-[#786866]">
          Three seamless steps to studio-grade manicures without appointment waits or nail bed thinning.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 border border-[#D8C6C3] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                {/* Step Pill & Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F4ECE6] text-[#9C5550] border border-[#D8C6C3]">
                    Step {s.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F3ED] text-[#313851] flex items-center justify-center border border-[#D8C6C3]/60">
                    <Icon className="w-5 h-5 text-[#9C5550]" />
                  </div>
                </div>

                <h3 className="font-heading font-medium text-2xl text-[#313851]">
                  {s.title}
                </h3>

                <p className="text-sm text-[#453A3C] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Tip box */}
              <div className="pt-3 border-t border-[#D8C6C3]/60 flex items-start gap-2 text-xs text-[#786866]">
                <CheckCircle2 className="w-4 h-4 text-[#879B83] shrink-0 mt-0.5" />
                <span>{s.tip}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link to full how-it-works page */}
      {showFullPageLink && (
        <div className="mt-8 text-center">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 font-medium text-sm text-[#9C5550] hover:text-[#8A4743] transition-colors"
          >
            <span>Read complete application handbook, adhesive FAQ & video guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
