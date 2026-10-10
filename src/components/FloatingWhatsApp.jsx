import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function FloatingWhatsApp({ dynamicSettings }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Official WhatsApp business number for Nailsbyhelina: dynamic from CMS
  const phoneNumber = dynamicSettings?.whatsapp_raw_number || '919361405676';
  const prefilledText = encodeURIComponent('Hi Nailsbyhelina, I’d like to know more about your nail sets.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${prefilledText}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-30 flex items-center gap-2 pointer-events-auto">
      
      {/* Floating Tooltip Pill */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#262D42] text-[#FFFDFC] text-xs font-medium shadow-lg border border-[#C8A46A]/40 animate-in fade-in slide-in-from-right-2 duration-200">
          <span>Chat with Atelier Concierge</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }} 
            className="text-white/60 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)'
        }}
        aria-label="Chat with Nailsbyhelina Atelier Concierge on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* Crisp WhatsApp SVG Icon */}
        <svg 
          viewBox="0 0 24 24" 
          width="26" 
          height="26" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="fill-current text-white"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>

        {/* Subtle Online Presence Indicator */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#FFFDFC] border-2 border-[#128C7E] flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        </span>
      </a>
    </div>
  );
}
