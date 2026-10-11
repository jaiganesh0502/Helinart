import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, HelpCircle, Check, Printer, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { products } from '../data/products';
import SEO from '../components/SEO';
import PageStatusWrapper from '../components/PageStatusWrapper';
import { pageService } from '../services/pageService';

export default function SizeGuide() {
  const { addToCart } = useStore();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sizingKitProduct = products.find(p => p.id === 'atelier-sizing-kit');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pageService.getPageBySlug('sizing-guide');
      setPage(data);
    } catch (err) {
      console.error('Error loading sizing guide page:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const content = page?.content || {};

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
    <PageStatusWrapper loading={loading} error={error} page={page} onRetry={loadData}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        <SEO
          title={page?.seo_title || page?.title || "Nail Sizing Guide & MM Measurement Handbook"}
          description={page?.seo_description || page?.subtitle || "Find your perfect press-on fit with our 3-step measurement guide, mm sizing chart (sizes 0-9), and sizing kit advice for salon-flush adhesion."}
          keywords="press on nail sizing, nail size chart mm, how to measure nails for press ons, nailsbyhelina size guide"
        />
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
            <Ruler className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>{page?.subtitle || "Atelier Precision Fit Guide"}</span>
          </div>
          <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
            {page?.title || "The Definitive Press-On Size Guide"}
          </h1>
          <p className="text-base text-[#786866] leading-relaxed">
            {content.instructions || "Our reusable couture press-on nails are handcrafted to mirror the exact curvature of in-studio sculpted sets. Follow our three-step method to ensure seamless, salon-flush adhesion."}
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
                Peel the tape off, place it flat on a table against a millimeter ruler, and measure the distance between the two lines. Note your numbers: Thumb, Index, Middle, Ring, Pinky.
              </p>
            </div>
          </div>
        </section>

        {/* STANDARD PRESET SIZE COMBINATIONS */}
        <section className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#D8C6C3] shadow-xs space-y-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-medium text-[#793D39]">Preset Options</span>
            <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
              Standard Preset Sizes (XS to L)
            </h2>
            <p className="text-xs sm:text-sm text-[#786866]">
              {content.sizeChartNotes || "If your individual fingers match these standard combinations, simply pick your preset letter during checkout."}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#D8C6C3] text-[#786866]">
                  <th className="py-3 px-4 font-medium">Preset</th>
                  <th className="py-3 px-4 font-medium">Thumb</th>
                  <th className="py-3 px-4 font-medium">Index</th>
                  <th className="py-3 px-4 font-medium">Middle</th>
                  <th className="py-3 px-4 font-medium">Ring</th>
                  <th className="py-3 px-4 font-medium">Pinky</th>
                  <th className="py-3 px-4 font-medium">Profile Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C6C3]/40">
                {presets.map((p) => (
                  <tr key={p.name} className="hover:bg-[#F6F3ED]/40 transition-colors">
                    <td className="py-3 px-4 font-heading font-medium text-[#313851]">{p.name}</td>
                    <td className="py-3 px-4 text-[#453A3C]">{p.thumb}</td>
                    <td className="py-3 px-4 text-[#453A3C]">{p.index}</td>
                    <td className="py-3 px-4 text-[#453A3C]">{p.middle}</td>
                    <td className="py-3 px-4 text-[#453A3C]">{p.ring}</td>
                    <td className="py-3 px-4 text-[#453A3C]">{p.pinky}</td>
                    <td className="py-3 px-4 text-xs text-[#786866]">{p.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CUSTOM SIZING NOTE */}
        {content.customSizing && (
          <div className="p-6 rounded-3xl bg-[#EEF3EE] border border-[#879B83]/50 text-xs sm:text-sm text-[#2B3B29] space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#313851]">
              <Sparkles className="w-4 h-4 text-[#879B83]" />
              <span>Custom Sizing Available</span>
            </div>
            <p className="leading-relaxed">{content.customSizing}</p>
          </div>
        )}

        {/* SIZING KIT HERO PROMOTION BANNER */}
        <section className="rounded-3xl p-8 sm:p-12 border border-[#3A425E] shadow-xl text-[#FFFDFC]" style={{ background: 'linear-gradient(135deg, #262D42 0%, #313851 100%)' }}>
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
    </PageStatusWrapper>
  );
}
