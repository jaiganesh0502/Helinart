import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function StepPlaceholder({ pageName, nextStepDescription }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-center text-3xl shadow-inner">
        ✨
      </div>
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4ECE6] text-[#793D39] border border-[#D8C6C3] text-xs font-medium mb-3">
        <span>Staged atelier feature</span>
      </div>
      <h1 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851] mb-3">
        {pageName} Page
      </h1>
      <p className="text-sm sm:text-base text-[#786866] max-w-md mx-auto mb-8 leading-relaxed font-normal">
        {nextStepDescription || 'This section is staged for the subsequent development batch.'}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-sm font-medium shadow-sm hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
        >
          <ArrowLeft className="w-4 h-4 text-[#FFFDFC]" />
          <span>Return to shop</span>
        </Link>
        <Link
          to="/favorites"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFFDFC] text-[#313851] border border-[#313851] text-sm font-medium hover:bg-[#313851] hover:text-[#FFFDFC] transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
        >
          <span>View favorites</span>
        </Link>
      </div>
    </div>
  );
}
