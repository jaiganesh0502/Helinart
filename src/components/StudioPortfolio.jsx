import React, { useState } from 'react';
import { Sparkles, Eye, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

export default function StudioPortfolio() {
  const transformations = [
    {
      id: 'russian-manicure',
      title: 'Russian Dry Manicure & BIAB Gel Overlay',
      category: 'Cuticle Refinement & Natural Strengthening',
      duration: '60 mins',
      technique: 'Diamond e-file cuticle polishing + builder in a bottle (BIAB)',
      beforeImage: '/images/salon-art-craft.jpg',
      beforeLabel: 'Before: Overgrown cuticles & dry sidewalls',
      afterImage: '/images/design-vanilla-glaze.jpg',
      afterLabel: 'After: Micro-buffed porcelain cuticle line & high-gloss glaze'
    },
    {
      id: 'velvet-chrome',
      title: 'Sculpted Almond Velvet Chrome',
      category: 'Haute Couture Gel Extension',
      duration: '90 mins',
      technique: 'Soft gel tip sculpting + iridescent rose chrome burnishing',
      beforeImage: '/images/service-acrylic.jpg',
      beforeLabel: 'Before: Short bare nails with chipped edges',
      afterImage: '/images/design-sakura-chrome.jpg',
      afterLabel: 'After: Sculpted almond silhouette with mirror velvet chrome'
    },
    {
      id: 'bridal-crystals',
      title: 'Bridal Micro-French & Swarovski Crystals',
      category: 'Wedding Atelier Special',
      duration: '105 mins',
      technique: 'Ultra-thin reflective French micro-tips + sealed Swarovski gems',
      beforeImage: '/images/studio-art-craft.jpg',
      beforeLabel: 'Before: Natural unpolished nail plates',
      afterImage: '/images/design-crystal-french.jpg',
      afterLabel: 'After: Razor-sharp French tips with snag-free embedded crystals'
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [activeMode, setActiveMode] = useState('slider'); // 'slider' or 'split'

  const current = transformations[activeIdx];

  const handleSliderMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <section className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4ECE6] text-[#793D39] text-xs font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#A87F45]" />
            <span>Master Sculptor Portfolio</span>
          </div>
          <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
            Before & After Transformations
          </h2>
          <p className="text-sm text-[#786866] mt-1">
            Drag the interactive slider to see how our dry Russian technique and gel sculpting rejuvenate hands.
          </p>
        </div>

        {/* Tab Buttons to switch between transformation showcases */}
        <div className="flex flex-wrap gap-2">
          {transformations.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveIdx(idx);
                setSliderPos(50);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeIdx === idx
                  ? 'bg-[#313851] text-[#FFFDFC] shadow-xs'
                  : 'bg-[#FFFDFC] text-[#313851] border border-[#D8C6C3] hover:border-[#9C5550]'
              }`}
            >
              Case 0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Slider Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8C6C3]/60 pb-4">
          <div>
            <span className="text-[11px] font-semibold text-[#9C5550]">{current.category}</span>
            <h3 className="font-heading font-medium text-xl sm:text-2xl text-[#313851]">{current.title}</h3>
          </div>
          <div className="text-xs text-[#786866] flex items-center gap-3">
            <span>Duration: <strong>{current.duration}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#879B83] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Retention 3+ Weeks</span>
            </span>
          </div>
        </div>

        {/* The Interactive Before / After Split Viewer */}
        <div 
          className="relative aspect-[16/10] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden cursor-ew-resize select-none bg-[#F4ECE6] border border-[#D8C6C3]"
          onMouseMove={handleSliderMove}
          onTouchMove={handleTouchMove}
        >
          {/* AFTER Image (Full background) */}
          <img
            src={current.afterImage}
            alt={current.afterLabel}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-[#262D42]/90 backdrop-blur-md text-[#FFFDFC] text-xs font-semibold shadow-xs">
            After: Studio Artistry
          </div>

          {/* BEFORE Image (Clipped by slider position) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none transition-none"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={current.beforeImage}
              alt={current.beforeLabel}
              className="absolute inset-y-0 left-0 w-full h-full object-cover max-w-none pointer-events-none"
              style={{
                width: '100vw',
                maxWidth: 'calc(100% * 100 / ' + Math.max(1, sliderPos) + ')'
              }}
            />
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-[#FFFDFC]/95 backdrop-blur-md text-[#313851] text-xs font-semibold shadow-xs border border-[#D8C6C3]">
              Before: Natural State
            </div>
          </div>

          {/* Draggable Divider Handle Line */}
          <div
            className="absolute inset-y-0 z-20 w-0.5 bg-[#FFFDFC] shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#9C5550] text-[#FFFDFC] border-2 border-[#FFFDFC] shadow-md flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* Details & Technique */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60">
            <span className="font-semibold text-[#313851] block mb-0.5">Initial Nail Assessment</span>
            <p className="text-[#453A3C]">{current.beforeLabel}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#EEF3EE] border border-[#879B83]/50">
            <span className="font-semibold text-[#313851] block mb-0.5">Technique & Outcome</span>
            <p className="text-[#453A3C]">{current.technique}</p>
          </div>
        </div>

      </div>

    </section>
  );
}
