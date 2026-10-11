import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Home,
  Tag,
  CalendarCheck,
  FolderArchive,
  Headphones,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  FileText
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/lookbook', label: 'Lookbook CMS', icon: ImageIcon },
  { to: '/admin/homepage', label: 'Homepage CMS', icon: Home },
  { to: '/admin/pages', label: 'Pages & Policies', icon: FileText },
  { to: '/admin/offers', label: 'Offers & Promos', icon: Tag },
  { to: '/admin/studio', label: 'Studio Booking', icon: CalendarCheck },
  { to: '/admin/media', label: 'Media Manager', icon: FolderArchive },
  { to: '/admin/support', label: 'Support & Social', icon: Headphones },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children, title = 'Administration' }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F6F3ED] flex text-[#313851]">
      
      {/* =====================================================================
          1. DESKTOP ADMIN SIDEBAR
          ===================================================================== */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#262D42] text-[#FFFDFC] shrink-0 border-r border-[#313851]">
        
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#313851]">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img 
              src="/helinart-logo.png" 
              alt="Nailsbyhelina Logo" 
              className="w-9 h-9 object-contain"
            />
            <div>
              <span className="font-heading text-lg font-medium tracking-wide text-[#FFFDFC] block leading-none">
                Nailsbyhelina
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C8A46A] block mt-1">
                Admin Atelier
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#313851] text-[#C8A46A] shadow-xs font-semibold'
                    : 'text-[#C2CBD3] hover:text-[#FFFDFC] hover:bg-[#313851]/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C8A46A]' : 'text-[#C2CBD3]'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#313851] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#C2CBD3] hover:text-[#FFFDFC] hover:bg-[#313851] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#C8A46A]" />
              View Live Store
            </span>
            <span className="text-[10px] bg-[#313851] px-1.5 py-0.5 rounded text-[#C2CBD3]">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-[#E17A72] hover:bg-[#313851] hover:text-[#FF8E85] transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* =====================================================================
          2. MOBILE SIDEBAR DRAWER
          ===================================================================== */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-[#262D42]/80 backdrop-blur-xs" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <aside className="relative flex flex-col w-72 max-w-full bg-[#262D42] text-[#FFFDFC] z-10">
            <div className="h-16 px-6 flex items-center justify-between border-b border-[#313851]">
              <div className="flex items-center gap-2.5">
                <img src="/helinart-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-heading text-lg text-[#FFFDFC]">Admin Atelier</span>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-[#C2CBD3] hover:text-[#FFFDFC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#313851] text-[#C8A46A] font-semibold'
                        : 'text-[#C2CBD3] hover:text-[#FFFDFC]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#313851] space-y-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-[#C2CBD3]"
              >
                <ExternalLink className="w-4 h-4 text-[#C8A46A]" />
                View Store
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-[#E17A72]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================================
          3. MAIN CONTENT AREA & ADMIN HEADER
          ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Admin Header */}
        <header className="h-16 sm:h-20 bg-[#FFFDFC] border-b border-[#D8C6C3]/70 px-4 sm:px-8 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#313851] hover:bg-[#F4ECE6] transition-colors"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-medium text-[#313851] leading-none">
                {title}
              </h1>
              <p className="text-[11px] text-[#786866] mt-1 hidden sm:block">
                Nailsbyhelina Luxury Atelier Management
              </p>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39] hover:bg-[#EEE6DE] transition-colors"
            >
              <span>Store Preview</span>
              <ExternalLink className="w-3 h-3 text-[#A87F45]" />
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-[#D8C6C3]/60">
              <div className="w-8 h-8 rounded-full bg-[#262D42] text-[#FFFDFC] text-xs font-bold flex items-center justify-center">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-semibold text-[#313851] block leading-tight">
                  {user?.full_name || 'Admin'}
                </span>
                <span className="text-[10px] text-[#9C5550] font-medium block">
                  Administrator
                </span>
              </div>
            </div>
          </div>

        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
