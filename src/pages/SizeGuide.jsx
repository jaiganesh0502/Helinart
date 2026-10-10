import React from 'react';
import { Link } from 'react-router-dom';
import { Ruler, HelpCircle, Check, Printer, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { products } from '../data/products';
import SEO from '../components/SEO';

export default function SizeGuide() {
  const { addToCart } = useStore();
  const sizingKitProduct = products.find(p => p.id === 'atelier-sizing-kit');

  const presets = [
    { name: 'Extra Small (XS)', thumb: '14 mm (3)', index: '11 mm (6)', middle: '12 mm (5)', ring: '11 mm (6)', pinky: '9 mm (8)', notes: 'Petite nail beds' },
    { name: 'Small (S)', thumb: '15 mm (2)', index: '12 mm (5)', middle: '13 mm (4)', ring: '12 mm (5)', pinky: '10 mm (7)', notes: 'Slim to average' },
    { name: 'Medium (M)', thumb: '16 mm (1)', index: '13 mm (4)', middle: '14 mm (3)', ring: '13 mm (4)', pinky: '11 mm (6)', notes: 'Most common atelier size' },
    { name: 'Large (L)', thumb: '18 mm (0)', index: '14 mm (3)', middle: '15 mm (2)', ring: '14 mm (3)', pinky: '12 mm (5)', notes: 'Wider natural nail beds' }
  ];

  const mmBreakdown = [
    { size: '0', mm: '18 mm', desc: 'Extra Wide Thumb' },
    { size: '1', mm: '16 mm', desc: 'Standard Thumb' },
    { size: '2', mm: '15 mm', desc: 'Small Thumb / Wide Index' },
    { size: '3', mm: '14 mm', desc: 'Petite Thumb / Middle' },
    { size: '4', mm: '13 mm', desc: 'Standard Middle / Index' },
    { size: '5', mm: '12 mm', desc: 'Standard Index / Ring' },
    { size: '6', mm: '11 mm', desc: 'Slim Ring / Wide Pinky' },
    { size: '7', mm: '10 mm', desc: 'Standard Pinky' },
    { size: '8', mm: '9 mm', desc: 'Slim Pinky' },
    { size: '9', mm: '8 mm', desc: 'Petite Pinky' },
  ];

  const handleQuickAddSizingKit = () => {
    if (sizingKitProduct) {
      addToCart(sizingKitProduct, { shape: 'Universal', size: 'Full Kit', quantity: 1 });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
      <SEO
        title="Nail Sizing Guide & MM Measurement Handbook"
        description="Find your perfect press-on fit with our 3-step measurement guide, mm sizing chart (sizes 0-9), and sizing kit advice for salon-flush adhesion."
        keywords="press on nail sizing, nail size chart mm, how to measure nails for press ons, nailsbyhelina size guide"
      />
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
          <Ruler className="w-3.5 h-3.5 text-[#9C5550]" />
          <span>Atelier Precision Fit Guide</span>
        </div>
        <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
          The Definitive Press-On Size Guide
        </h1>
        <p className="text-base text-[#786866] leading-relaxed">
          Our reusable couture press-on nails are handcrafted to mirror the exact curvature of in-studio sculpted sets. Follow our three-step method to ensure seamless, salon-flush adhesion.
        </p>
      </div>

      {/* 3 Step Visual Measurement Process */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-medium text-[#793D39]">Step-by-step measurement</span>
          <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
            How to Measure Natural Nails at Home
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 border border-[#D8C6C3] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4ECE6] text-[#9C5550] flex items-center justify-center font-bold text-lg font-heading">
              01
            </div>
            <h3 className="font-heading font-medium text-xl text-[#313851]">
              Place Clear Tape
            </h3>
            <p className="text-xs sm:text-sm text-[#453A3C] leading-relaxed">
              Take a small strip of clear tape or household masking tape. Press it flat horizontally across the <strong>widest point</strong> of your bare natural nail bed, ensuring it wraps smoothly into the side sidewalls.
            </p>
          </div>

          <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 border border-[#D8C6C3] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4ECE6] text-[#9C5550] flex items-center justify-center font-bold text-lg font-heading">
              02
            </div>
            <h3 className="font-heading font-medium text-xl text-[#313851]">
              Mark Both Sidewalls
            </h3>
            <p className="text-xs sm:text-sm text-[#453A3C] leading-relaxed">
              Using a fine ballpoint pen or micro marker, make two vertical marks directly on the tape where your nail bed meets your cuticle lateral skin folds on both the left and right sides.
            </p>
          </div>

          <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 border border-[#D8C6C3] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4ECE6] text-[#9C5550] flex items-center justify-center font-bold text-lg font-heading">
              03
            </div>
            <h3 className="font-heading font-medium text-xl text-[#313851]">
              Read in Millimeters (mm)
            </h3>
            <p className="text-xs sm:text-sm text-[#453A3C] leading-relaxed">
              Carefully peel the tape off and stick it flat against a metric ruler. Count the millimeters between your two marks. Record the measurements for both hands (thumb to pinky).
            </p>
          </div>

        </div>
      </section>

      {/* Preset Sizes Table (Thumb to Pinky) */}
      <section className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-[#793D39]">Quick Match</span>
            <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
              Standard Preset Sizes
            </h2>
            <p className="text-xs sm:text-sm text-[#786866] mt-1">
              Select one of our four tailored presets at checkout for instant matching.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8C6C3] text-xs font-semibold text-[#313851] hover:bg-[#F4ECE6] transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>Print Size Guide</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#D8C6C3]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4ECE6] text-[#313851] font-semibold border-b border-[#D8C6C3]">
              <tr>
                <th className="py-3 px-4">Preset Name</th>
                <th className="py-3 px-4">Thumb</th>
                <th className="py-3 px-4">Index</th>
                <th className="py-3 px-4">Middle</th>
                <th className="py-3 px-4">Ring</th>
                <th className="py-3 px-4">Pinky</th>
                <th className="py-3 px-4">Typical Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8C6C3]/60 bg-[#FFFDFC]">
              {presets.map((p) => (
                <tr key={p.name} className="hover:bg-[#F6F3ED]/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#9C5550]">{p.name}</td>
                  <td className="py-3 px-4 font-medium">{p.thumb}</td>
                  <td className="py-3 px-4">{p.index}</td>
                  <td className="py-3 px-4">{p.middle}</td>
                  <td className="py-3 px-4">{p.ring}</td>
                  <td className="py-3 px-4">{p.pinky}</td>
                  <td className="py-3 px-4 text-[#786866]">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Complete Tip Matrix (0 - 9) */}
      <section className="space-y-4">
        <div className="max-w-xl">
          <span className="text-xs font-medium text-[#793D39]">Individual Numbers</span>
          <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
            Nail Tip Number Breakdown (0 to 9)
          </h2>
          <p className="text-xs sm:text-sm text-[#786866]">
            Every set includes 24 tips across these 10 distinct millimeter sizes so you have ample backups.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {mmBreakdown.map((item) => (
            <div key={item.size} className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-[#9C5550]">Size {item.size}</span>
              <div className="font-heading font-medium text-2xl text-[#313851]">{item.mm}</div>
              <p className="text-[11px] text-[#786866]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sizing Tips & Coin Tip */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 sm:p-8 rounded-3xl bg-[#EEF3EE] border border-[#879B83]/50 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#313851]">
            <Check className="w-5 h-5 text-[#879B83]" />
            <span>Golden Rule: When in doubt, size up!</span>
          </div>
          <p className="text-xs sm:text-sm text-[#453A3C] leading-relaxed">
            If your natural nail measures 12.5 mm (between size 4 and size 5), always choose the larger size (size 4, 13 mm). Our high-grade acrylic polymer can be gently sculpted down using the included nail file for a completely flush custom fit.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#F6F3ED] border border-[#D8C6C3] space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#313851]">
            <HelpCircle className="w-5 h-5 text-[#9C5550]" />
            <span>Coin Calibration Quick-Tip</span>
          </div>
          <p className="text-xs sm:text-sm text-[#453A3C] leading-relaxed">
            Need to calibrate a screen ruler? A standard Indian 1-Rupee coin measures exactly 21.93 mm in diameter. Lay a coin against your screen or measuring tape to verify scale accuracy.
          </p>
        </div>

      </section>

      {/* SIZING KIT HERO PROMOTION BANNER */}
      <section className="dark-section rounded-3xl p-8 sm:p-12 border border-[#3A425E] shadow-xl text-[#FFFDFC]" style={{ background: 'linear-gradient(135deg, #262D42 0%, #313851 100%)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-[#C8A46A] border border-white/20">
              Zero Guesswork Guarantee
            </span>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#FFFDFC]">
              Prefer to try physical samples first?
            </h2>
            <p className="text-sm text-[#F4ECE6] leading-relaxed max-w-xl">
              Order our physical <strong>Atelier Sizing Kit for just ₹199</strong>. We ship 10 clear sample tips (0–9) directly to your home with a printed gauge and give you ₹199 store credit toward your first set!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleQuickAddSizingKit}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full font-medium text-sm text-[#FFFDFC] shadow-sm hover:scale-105 active:scale-95 transition-all text-center"
                style={{ background: 'linear-gradient(135deg, #B26661, #9C5550)' }}
              >
                Add Sizing Kit to Bag (₹199)
              </button>
              <Link
                to="/product/atelier-sizing-kit"
                className="text-xs font-semibold text-[#F4ECE6] hover:text-[#C8A46A] underline"
              >
                Learn more about sizing kits
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-52 h-52 rounded-3xl overflow-hidden border-2 border-[#C8A46A]/40 shadow-lg">
              <img
                src="/images/studio-art-craft.jpg"
                alt="Atelier Sizing Kit preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
