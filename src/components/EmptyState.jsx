import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function EmptyState({
  icon = '💅',
  title = 'No items found',
  description = 'Try adjusting your filters or search terms to discover our handcrafted nail designs.',
  actionLabel = 'Explore All Sets',
  actionTo = '/shop',
  onActionClick
}) {
  return (
    <div className="text-center py-16 px-6 max-w-md mx-auto bg-glass-card rounded-3xl border border-[#D8C6C3] backdrop-blur-sm my-8 shadow-sm">
      <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-center text-3xl shadow-inner">
        {icon}
      </div>
      <h3 className="font-heading font-medium text-2xl text-[#313851] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#786866] leading-relaxed mb-6 font-normal">
        {description}
      </p>

      {actionTo && !onActionClick ? (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-sm font-medium shadow-sm hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4 text-[#FFFDFC]" />
        </Link>
      ) : onActionClick ? (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] text-[#FFFDFC] text-sm font-medium shadow-sm hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4 text-[#FFFDFC]" />
        </button>
      ) : null}
    </div>
  );
}
