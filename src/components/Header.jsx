import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, ShoppingBag, Menu, X, User, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FEATURES } from '../config/features';
import { useAuth } from '../context/AuthContext';
import { settingsService } from '../services/settingsService';

export default function Header({ dynamicSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(dynamicSettings || null);
  const { user, isAdmin } = useAuth();
  const { favorites, cart } = useStore();
  const favCount = favorites.length;
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (dynamicSettings) {
      setSiteSettings(dynamicSettings);
      return;
    }
    let mounted = true;
    settingsService.getSettings().then(s => {
      if (mounted && s) setSiteSettings(s);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [dynamicSettings]);

  const studioBookingEnabled = siteSettings?.studio_booking_enabled !== undefined
    ? Boolean(siteSettings.studio_booking_enabled)
    : FEATURES.STUDIO_BOOKING_ENABLED;

  const announcementText = siteSettings?.announcement_text ||
    'Complimentary adhesive tab kit on orders above ₹999';

  // Balanced 3-link navigation
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop Nail Sets' },
    { to: '/favorites', label: 'Favorites' },
  ];

  return (
    <>
      {/* Top single announcement bar in Deep Navy */}
      {announcementText && (
        <aside className="bg-[#262D42] text-[#FFFDFC] text-xs py-2 px-4 text-center font-medium tracking-wide border-b border-[#313851]">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <span>{announcementText}</span>
          </div>
        </aside>
      )}

      {/* Main Navigation Header (Full-width 100%, 78-82px height, 28-32px padding) */}
      <header className="sticky top-0 z-40 bg-[#FFFDFC]/95 backdrop-blur-md border-b border-[#D8C6C3]/60 transition-colors">
        <div className="w-full h-20 px-7 lg:px-8 grid grid-cols-2 md:grid-cols-[auto_1fr_auto] items-center">
          
          {/* =================================================================
              LEFT: Brand area moved toward left edge (No border/container on logo)
              ================================================================= */}
          <div className="flex items-center justify-start">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98F8A] rounded-xl p-0.5"
              aria-label="Nailsbyhelina Nails Home"
            >
              {/* Logo icon sits naturally without navy outline, colored ring, container, or shadow */}
              <div className="w-11 h-11 flex items-center justify-center shrink-0">
                <img 
                  src="/helinart-logo.png" 
                  alt="Nailsbyhelina Logo" 
                  className="w-11 h-11 object-contain border-0 outline-none shadow-none bg-transparent"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class="text-base font-bold text-[#313851]">NH</span>';
                  }}
                />
              </div>

              {/* Brand Wordmark & Luxury Subtitle */}
              <div className="flex flex-col justify-center">
                <span className="font-heading text-[22px] sm:text-2xl font-normal tracking-tight text-[#313851] leading-tight">
                  Nailsbyhelina
                </span>
                <span className="text-[11px] font-medium text-[#786866] tracking-normal -mt-0.5">
                  Luxury nail art & press-ons
                </span>
              </div>
            </Link>
          </div>

          {/* =================================================================
              CENTER: Visually centered navigation links (Balanced 34px gap)
              ================================================================= */}
          <nav className="hidden md:flex justify-center items-center gap-7 lg:gap-8.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `
                  text-sm tracking-wide transition-colors duration-200 py-1
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550] rounded-md
                  ${isActive 
                    ? 'text-[#9C5550] font-semibold' 
                    : 'text-[#313851] font-medium hover:text-[#8A4743]'
                  }
                `}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* =================================================================
              RIGHT: Action items (Single Book Studio Slot CTA + Action Icons)
              ================================================================= */}
          <div className="flex items-center justify-end gap-3 sm:gap-4.5">
            
            {/* Single subtle premium booking CTA */}
            <Link
              to="/studio"
              className="hidden lg:inline-flex items-center justify-center px-4.5 py-2.5 text-xs font-medium tracking-normal text-[#FFFDFC] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xs"
              style={{
                background: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)',
                borderRadius: '10px',
                border: 'none',
                color: '#FFFDFC'
              }}
            >
              {studioBookingEnabled ? 'Book a studio slot' : 'Studio Opening Soon'}
            </Link>

            {/* Favorites Icon Button with Live Count */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-full text-[#313851] hover:text-[#9C5550] hover:bg-[#F4ECE6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
              aria-label={`View favorites (${favCount} items)`}
              title="Favorites"
            >
              <Heart className={`w-5 h-5 ${favCount > 0 ? 'text-[#9C5550] fill-[#9C5550]' : ''}`} />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#9C5550] text-[#FFFDFC] text-[11px] font-bold flex items-center justify-center animate-in zoom-in-50 duration-200">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon Button with Live Count */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-[#313851] hover:text-[#9C5550] hover:bg-[#F4ECE6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550]"
              aria-label={`View shopping bag (${cartCount} items)`}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#262D42] text-[#FFFDFC] text-[11px] font-bold flex items-center justify-center animate-in zoom-in-50 duration-200">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Dashboard Quick Access Button */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#262D42] text-[#C8A46A] text-xs font-semibold hover:bg-[#313851] transition-all shadow-xs border border-[#C8A46A]/30"
                title="Open Admin Portal Dashboard"
              >
                <Shield className="w-3.5 h-3.5 text-[#C8A46A]" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {/* Profile / Account Button */}
            <Link
              to={isAdmin ? '/admin/dashboard' : (user ? '/profile' : '/login')}
              className="relative p-1.5 rounded-full text-[#313851] hover:text-[#9C5550] hover:bg-[#F4ECE6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550] flex items-center justify-center"
              aria-label={isAdmin ? 'Admin Dashboard' : (user?.full_name?.trim() || (user ? 'My Account' : 'Sign In'))}
              title={isAdmin ? 'Admin Dashboard' : (user?.full_name?.trim() || (user ? 'My Account' : 'Sign In'))}
            >
              {user && user?.full_name?.trim() ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9C5550] to-[#C98F8A] text-[#FFFDFC] text-xs font-heading font-bold flex items-center justify-center shadow-2xs">
                  {user.full_name.trim().charAt(0).toUpperCase()}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
              {user && (
                <span className={`absolute top-0.5 right-0.5 w-2 h-2 rounded-full border border-[#FFFDFC] ${isAdmin ? 'bg-[#C8A46A]' : 'bg-emerald-500'}`} />
              )}
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#313851] hover:text-[#C98F8A] hover:bg-[#F4ECE6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98F8A]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#D8C6C3]/60 bg-[#FFFDFC] px-6 py-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  block px-4 py-3 rounded-2xl text-base font-semibold transition-all
                  ${isActive 
                    ? 'bg-[#F4ECE6] text-[#9C5550] font-semibold border border-[#D8C6C3]' 
                    : 'text-[#313851] hover:text-[#8A4743] hover:bg-[#F4ECE6]/50'
                  }
                `}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile Account Links */}
            <div className="pt-2 border-t border-[#D8C6C3]/60 space-y-2">
              <Link
                to={user ? '/profile' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl text-base font-semibold text-[#313851] bg-[#F6F3ED] hover:bg-[#EAE4DC]"
              >
                {user ? (user.full_name?.trim() || 'My Account') : 'Sign In / Register'}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-2xl text-base font-semibold text-[#FFFDFC] bg-[#262D42]"
                >
                  Admin Portal Dashboard
                </Link>
              )}

              <Link
                to="/studio"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#FFFDFC] shadow-xs"
                style={{
                  background: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)',
                  borderRadius: '10px'
                }}
              >
                {studioBookingEnabled ? 'Book a studio slot' : 'Studio Opening Soon'}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
