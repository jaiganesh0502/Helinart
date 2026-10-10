import React from 'react';
import { X, Ruler, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const presets = [
    { name: 'XS', thumb: '14mm (3)', index: '11mm (6)', middle: '12mm (5)', ring: '11mm (6)', pinky: '9mm (8)' },
    { name: 'S', thumb: '15mm (2)', index: '12mm (5)', middle: '13mm (4)', ring: '12mm (5)', pinky: '10mm (7)' },
    { name: 'M (Standard)', thumb: '16mm (1)', index: '13mm (4)', middle: '14mm (3)', ring: '13mm (4)', pinky: '11mm (6)' },
    { name: 'L', thumb: '18mm (0)', index: '14mm (3)', middle: '15mm (2)', ring: '14mm (3)', pinky: '12mm (5)' }
  ];

  const singleSizes = [
    { size: '0', mm: '18 mm' },
    { size: '1', mm: '16 mm' },
    { size: '2', mm: '15 mm' },
    { size: '3', mm: '14 mm' },
    { size: '4', mm: '13 mm' },
    { size: '5', mm: '12 mm' },
    { size: '6', mm: '11 mm' },
    { size: '7', mm: '10 mm' },
    { size: '8', mm: '9 mm' },
    { size: '9', mm: '8 mm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#262D42]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#FFFDFC] rounded-3xl border border-[#D8C6C3] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[#2B2223]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#786866] hover:text-[#313851] hover:bg-[#F4ECE6] transition-colors"
          aria-label="Close size guide modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-md mx-auto mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4ECE6] text-[#793D39] text-xs font-medium">
            <Ruler className="w-3.5 h-3.5" />
            <span>Atelier Fit Guide</span>
          </div>
          <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#313851]">
            Find Your Flawless Press-On Fit
          </h2>
          <p className="text-xs sm:text-sm text-[#786866]">
            Follow our 3-step measurement guide or pick from our standard atelier presets.
          </p>
        </div>

        {/* 3 Step Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <div className="bg-[#F6F3ED] rounded-2xl p-4 border border-[#D8C6C3]/80 space-y-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-[#9C5550] text-[#FFFDFC] font-bold text-xs flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="font-heading font-medium text-sm text-[#313851]">Tape & Curve</h4>
            <p className="text-[11.5px] text-[#786866] leading-relaxed">
              Place a piece of clear scotch tape across the widest point of your natural nail bed.
            </p>
          </div>

          <div className="bg-[#F6F3ED] rounded-2xl p-4 border border-[#D8C6C3]/80 space-y-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-[#9C5550] text-[#FFFDFC] font-bold text-xs flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="font-heading font-medium text-sm text-[#313851]">Mark with Pen</h4>
            <p className="text-[11.5px] text-[#786866] leading-relaxed">
              Use a fine pen to mark both lateral sidewalls where your nail meets the skin.
            </p>
          </div>

          <div className="bg-[#F6F3ED] rounded-2xl p-4 border border-[#D8C6C3]/80 space-y-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-[#9C5550] text-[#FFFDFC] font-bold text-xs flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="font-heading font-medium text-sm text-[#313851]">Measure in mm</h4>
            <p className="text-[11.5px] text-[#786866] leading-relaxed">
              Peel tape, lay it flat against a ruler, and count millimeters from mark to mark.
            </p>
          </div>
        </div>

        {/* Preset Sizing Table */}
        <div className="space-y-2 mb-6">
          <h3 className="font-heading font-medium text-base text-[#313851]">
            Standard Sizing Presets (Thumb to Pinky)
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-[#D8C6C3]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F4ECE6] text-[#313851] font-semibold border-b border-[#D8C6C3]">
                <tr>
                  <th className="py-2.5 px-3">Preset</th>
                  <th className="py-2.5 px-3">Thumb</th>
                  <th className="py-2.5 px-3">Index</th>
                  <th className="py-2.5 px-3">Middle</th>
                  <th className="py-2.5 px-3">Ring</th>
                  <th className="py-2.5 px-3">Pinky</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C6C3]/60 bg-[#FFFDFC]">
                {presets.map((p) => (
                  <tr key={p.name} className="hover:bg-[#F6F3ED]/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#9C5550]">{p.name}</td>
                    <td className="py-2.5 px-3">{p.thumb}</td>
                    <td className="py-2.5 px-3">{p.index}</td>
                    <td className="py-2.5 px-3">{p.middle}</td>
                    <td className="py-2.5 px-3">{p.ring}</td>
                    <td className="py-2.5 px-3">{p.pinky}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Millimeter Table (0 - 9) */}
        <div className="space-y-2 mb-6">
          <h3 className="font-heading font-medium text-base text-[#313851]">
            Nail Tip Number vs Millimeters
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-center">
            {singleSizes.map((s) => (
              <div key={s.size} className="p-2 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3]/60">
                <span className="block font-bold text-xs text-[#313851]">Size {s.size}</span>
                <span className="block text-[11px] text-[#786866] mt-0.5">{s.mm}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip Box & Sizing Kit Link */}
        <div className="p-4 rounded-2xl bg-[#EEF3EE] border border-[#879B83]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#879B83] shrink-0 mt-0.5" />
            <div className="text-xs text-[#2B2223] leading-relaxed">
              <strong className="text-[#313851]">Between sizes? Always size up!</strong>
              <p className="text-[#453A3C]">You can gently file the soft lateral edges of our press-ons for a bespoke tailored fit.</p>
            </div>
          </div>
          <Link
            to="/product/atelier-sizing-kit"
            onClick={onClose}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#262D42] text-[#FFFDFC] hover:bg-[#313851] transition-colors"
          >
            Order Sizing Kit (₹199)
          </Link>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D8C6C3]/60">
          <Link
            to="/size-guide"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9C5550] hover:text-[#8A4743] transition-colors"
          >
            <span>View comprehensive sizing page & printable ruler</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#9C5550] text-[#FFFDFC] hover:bg-[#8A4743] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
