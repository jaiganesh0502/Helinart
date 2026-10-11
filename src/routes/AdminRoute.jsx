import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ADMIN_EMAIL = 'helina.nailart@gmail.com';

function AdminAccessDenied() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1400);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F6F3ED] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#FFFDFC] border border-[#D8C6C3] rounded-3xl p-8 text-center shadow-md space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#9C5550]/10 flex items-center justify-center text-[#9C5550]">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="font-heading text-2xl text-[#313851]">Admin access only.</h2>
        <p className="text-xs text-[#786866] leading-relaxed">
          This portal is reserved for authorized atelier administration. Redirecting to store...
        </p>
        <div className="pt-2">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#313851] text-[#FFFDFC] text-xs font-semibold hover:bg-[#262D42] transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#262D42] flex flex-col items-center justify-center text-[#FFFDFC]">
        <div className="w-10 h-10 border-2 border-[#C8A46A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#C2CBD3]">Verifying Atelier Access...</p>
      </div>
    );
  }

  // Not logged in -> Redirect to admin login with redirect path
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // EXACT ADMIN ACCESS RULE:
  // Requires authenticated user exists AND profile.role === "admin" AND user.email === "helina.nailart@gmail.com"
  const isAuthorizedAdmin = Boolean(
    user &&
    (profile?.role === 'admin' || user.role === 'admin') &&
    user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  // If authenticated but not the approved admin -> deny access & redirect to /
  if (!isAuthorizedAdmin) {
    return <AdminAccessDenied />;
  }

  return children || <Outlet />;
}
