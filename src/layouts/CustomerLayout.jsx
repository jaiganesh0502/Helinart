import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { settingsService } from '../services/settingsService';
import { contentService } from '../services/contentService';
import { pageService } from '../services/pageService';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

export default function CustomerLayout({ children }) {
  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(null);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    async function loadGlobalCms() {
      try {
        const [sRes, cRes, fRes] = await Promise.allSettled([
          settingsService.getSettings(),
          contentService.getPublishedContent(),
          pageService.getFooterContent()
        ]);
        if (mounted) {
          if (sRes.status === 'fulfilled' && sRes.value) setSettings(sRes.value);
          const baseContent = (cRes.status === 'fulfilled' && cRes.value) ? cRes.value : {};
          const footerContent = (fRes.status === 'fulfilled' && fRes.value) ? fRes.value : {};
          setContent({ ...baseContent, ...footerContent });
        }
      } catch (err) {
        console.warn('Global CMS load fallback', err);
      }
    }
    loadGlobalCms();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F3ED] text-[#2B2223] selection:bg-[#C98F8A] selection:text-[#FFFDFC]">
      <Header dynamicSettings={settings} />
      <motion.main
        key={location.pathname}
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: LUXURY_EASE }}
        className="flex-1"
      >
        {children || <Outlet />}
      </motion.main>
      <FloatingWhatsApp dynamicSettings={settings} />
      <Footer dynamicSettings={settings} dynamicContent={content} />
    </div>
  );
}
