import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#262D42] flex flex-col items-center justify-center text-[#FFFDFC]">
        <div className="w-10 h-10 border-3 border-[#C8A46A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wider text-[#C2CBD3]">Verifying Atelier Administrative Credentials...</p>
      </div>
    );
  }

  // Not logged in -> Redirect to login with redirect path
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Logged in but not an admin -> Deny access
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F6F3ED] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FFFDFC] border border-[#D8C6C3] rounded-3xl p-8 text-center shadow-lg space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#9C5550]/10 flex items-center justify-center text-[#9C5550]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl text-[#313851]">Administrative Access Restricted</h2>
          <p className="text-sm text-[#786866] leading-relaxed">
            Your account ({user.email}) has role <code className="px-2 py-0.5 rounded bg-[#F4ECE6] text-[#9C5550] font-semibold">{user.role}</code>. 
            Only verified Nailsbyhelina administrators can access this portal.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#313851] text-[#FFFDFC] text-xs font-semibold hover:bg-[#262D42] transition-colors"
            >
              Return to Customer Store
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children || <Outlet />;
}
