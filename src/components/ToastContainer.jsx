import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useStore } from '../store/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
      aria-label="Notification toasts"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let borderClass = 'border-[#D8C6C3]';
          let bgClass = 'bg-[#FFFDFC] text-[#313851]';
          let iconColor = 'text-[#C98F8A]';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            borderClass = 'border-[#879B83]/60';
            iconColor = 'text-[#879B83]';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            borderClass = 'border-[#B77F7B]/70';
            iconColor = 'text-[#B77F7B]';
          }

          return (
            <motion.div
              key={toast.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: LUXURY_EASE }}
              role="status"
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-lg shadow-black/5 backdrop-blur-md border ${borderClass} ${bgClass}`}
            >
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} aria-hidden="true" />
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 text-[#786866] hover:text-[#313851] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9C5550]"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
}
