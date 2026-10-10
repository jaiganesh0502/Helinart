import React from 'react';

/**
 * Four-pointed delicate luxury sparkle star SVG
 */
function SparkleStar({ className = "", style = {} }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
    </svg>
  );
}

/**
 * HeroLogoShowcase
 * 
 * Replaces the static hero photograph with an animated, high-end editorial
 * Nailsbyhelina brand presentation.
 */
export default function HeroLogoShowcase() {
  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      
      {/* Ambient Outer Halo */}
      <div 
        className="absolute -inset-2 bg-gradient-to-tr from-[#EEE6DE] via-[#F4ECE6] to-[#E4D8D5] rounded-[36px] opacity-40 blur-2xl pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Glassmorphic Brand Showcase Container */}
      <div className="logo-showcase relative w-full p-8 sm:p-10 select-none">
        
        {/* ===================================================================
            1. BACKGROUND NAIL-ART CURVED LINE ANIMATION (Delicate Beauty Stroke)
            =================================================================== */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80" 
          viewBox="0 0 500 500" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Champagne gold fluid swirl */}
          <path 
            d="M 60,330 C 130,430 310,430 390,330 C 470,230 420,110 300,90 C 190,70 110,170 160,260" 
            stroke="rgba(200,164,106,0.26)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            className="nail-art-curve"
          />
          {/* Dusty rose accent stroke */}
          <path 
            d="M 110,380 C 210,440 370,390 410,280 C 440,190 360,120 260,150" 
            stroke="rgba(201,143,138,0.22)" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeDasharray="6 8"
            className="nail-art-curve-secondary"
          />
        </svg>

        {/* ===================================================================
            2. SOFT BLURRED GLOW BEHIND LOGO (Dusty Rose & Champagne Gold)
            =================================================================== */}
        <div className="logo-glow" aria-hidden="true" />

        {/* ===================================================================
            3. LUXURY FLOATING SPARKLES (5 Delicate Star Accents)
            =================================================================== */}
        {/* Sparkle 1: Top-Left (Champagne Gold 6px) */}
        <div 
          className="logo-sparkle sparkle-anim-1 absolute top-[14%] left-[16%]" 
          aria-hidden="true"
        >
          <SparkleStar className="w-[6px] h-[6px] text-[#C8A46A]" />
        </div>

        {/* Sparkle 2: Top-Right (Dusty Rose 8px) */}
        <div 
          className="logo-sparkle sparkle-anim-2 absolute top-[18%] right-[15%]" 
          aria-hidden="true"
        >
          <SparkleStar className="w-[8px] h-[8px] text-[#C98F8A]" />
        </div>

        {/* Sparkle 3: Middle-Right (Soft Blue Grey 4px) */}
        <div 
          className="logo-sparkle sparkle-anim-3 absolute top-[48%] right-[10%]" 
          aria-hidden="true"
        >
          <SparkleStar className="w-[4px] h-[4px] text-[#C2CBD3]" />
        </div>

        {/* Sparkle 4: Bottom-Left (Champagne Gold 6px) */}
        <div 
          className="logo-sparkle sparkle-anim-4 absolute bottom-[22%] left-[14%]" 
          aria-hidden="true"
        >
          <SparkleStar className="w-[6px] h-[6px] text-[#C8A46A]" />
        </div>

        {/* Sparkle 5: Top-Center (Dusty Rose 4px) */}
        <div 
          className="logo-sparkle sparkle-anim-5 absolute top-[9%] left-[50%] -translate-x-1/2" 
          aria-hidden="true"
        >
          <SparkleStar className="w-[4px] h-[4px] text-[#C98F8A]" />
        </div>

        {/* ===================================================================
            4. CENTERED ANIMATED LOGO WITH REVEAL & GENTLE FLOAT
            =================================================================== */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          
          {/* Logo Reveal Entrance Wrapper */}
          <div className="logo-reveal-anim">
            
            {/* Continuous Gentle Floating Wrapper */}
            <div className="logo-float-anim flex items-center justify-center">
              <img
                src="/helinart-logo.png"
                alt="Nailsbyhelina Haute Couture Atelier"
                className="w-36 h-36 sm:w-48 sm:h-48 lg:w-[210px] lg:h-[210px] object-contain drop-shadow-[0_12px_24px_rgba(49,56,81,0.08)] filter"
                loading="eager"
                fetchPriority="high"
                width="210"
                height="210"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.parentNode) {
                    e.target.parentNode.innerHTML = '<span class="font-heading text-4xl font-semibold text-[#313851]">NH</span>';
                  }
                }}
              />
            </div>

          </div>

          {/* ===================================================================
              5. BRAND TYPOGRAPHY & MESSAGE (Subtle, High-End Beauty Atelier)
              =================================================================== */}
          <div className="mt-5 space-y-1">
            <h2 className="font-heading text-2xl sm:text-[26px] font-normal tracking-[0.02em] text-[#313851] leading-tight">
              Nailsbyhelina
            </h2>
            <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-[#786866] uppercase">
              Luxury nail art & press-ons
            </p>
          </div>

          {/* Elegant Tagline */}
          <div className="mt-3.5 pt-3 border-t border-[#D8C6C3]/50">
            <p className="text-xs text-[#786866] font-normal tracking-wide">
              Handcrafted. Reusable. Made for you.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
