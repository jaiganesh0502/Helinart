import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Calendar, Ruler, Truck, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      <SEO
        title="404 — Page Not Found"
        description="The page you are looking for has been archived or does not exist. Explore our luxury handcrafted press-ons or book an atelier slot."
      />
      
      <div className="w-20 h-20 mx-auto rounded-3xl bg-[#F4ECE6] border border-[#D8C6C3] flex items-center justify-center text-4xl shadow-inner">
        💅
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-[#793D39] uppercase tracking-wider">
          Page Not Found • Error 404
        </span>
        <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
          Looks like this nail tip chipped.
        </h1>
        <p className="text-sm sm:text-base text-[#786866] max-w-md mx-auto leading-relaxed">
          The page or design collection you are seeking may have been renamed, archived, or moved to our private vault.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#FFFDFC] text-[#313851] border border-[#313851] font-medium text-sm hover:bg-[#313851] hover:text-[#FFFDFC] transition-colors shadow-xs group"
        >
          <Home className="w-4 h-4 text-[#9C5550] group-hover:text-[#FFFDFC] transition-colors" />
          <span>Return to Atelier Home</span>
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-[#FFFDFC] font-medium text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)' }}
        >
          <ShoppingBag className="w-4 h-4 text-[#FFFDFC]" />
          <span>Explore Ready-to-Wear Sets</span>
        </Link>
      </div>

      {/* Helpful Quick Links Grid */}
      <div className="pt-8 border-t border-[#D8C6C3]/60 max-w-md mx-auto space-y-3">
        <span className="text-xs font-semibold text-[#313851]">Popular Atelier Destinations:</span>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Link
            to="/size-guide"
            className="p-3 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] hover:border-[#9C5550] transition-colors flex flex-col items-center gap-1"
          >
            <Ruler className="w-4 h-4 text-[#9C5550]" />
            <span className="font-medium text-[#313851]">Size Guide</span>
          </Link>
          <Link
            to="/book"
            className="p-3 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] hover:border-[#9C5550] transition-colors flex flex-col items-center gap-1"
          >
            <Calendar className="w-4 h-4 text-[#C8A46A]" />
            <span className="font-medium text-[#313851]">Book Studio</span>
          </Link>
          <Link
            to="/track-order"
            className="p-3 rounded-2xl bg-[#FFFDFC] border border-[#D8C6C3] hover:border-[#9C5550] transition-colors flex flex-col items-center gap-1"
          >
            <Truck className="w-4 h-4 text-[#879B83]" />
            <span className="font-medium text-[#313851]">Track Order</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
