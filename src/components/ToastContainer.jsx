import React from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (!toasts.length) return null;

  return (
    <aside 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
      aria-label="Notification toasts"
    >
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-[#D8C6C3]';
        let bgClass = 'bg-[#FFFDFC] text-[#313851]';
        let iconColor = 'text-[#C98F8A]';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-[#879B83]/60';
          iconColor = 'text-[#879B83]'; // Soft Sage for success
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-[#B77F7B]/70';
          iconColor = 'text-[#B77F7B]';
        }

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-lg shadow-black/5 backdrop-blur-md border ${borderClass} ${bgClass} transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} aria-hidden="true" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-[#786866] hover:text-[#313851] rounded-lg transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
}
