import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { settingsService } from '../services/settingsService';
import { contentService } from '../services/contentService';

export default function CustomerLayout({ children }) {
  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadGlobalCms() {
      try {
        const [s, c] = await Promise.all([
          settingsService.getSettings(),
          contentService.getPublishedContent()
        ]);
        if (mounted) {
          if (s) setSettings(s);
          if (c) setContent(c);
        }
      } catch (err) {
        // fallback
      }
    }
    loadGlobalCms();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F3ED] text-[#2B2223] selection:bg-[#C98F8A] selection:text-[#FFFDFC]">
      <Header dynamicSettings={settings} />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <FloatingWhatsApp dynamicSettings={settings} />
      <Footer dynamicSettings={settings} dynamicContent={content} />
    </div>
  );
}
