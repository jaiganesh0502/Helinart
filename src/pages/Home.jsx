import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, RefreshCw, Clock, Flame } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ui/ProductGrid';
import Reveal from '../components/ui/Reveal';
import AnimatedButton from '../components/ui/AnimatedButton';
import HowItWorksSection from '../components/HowItWorksSection';
import LookbookGrid from '../components/LookbookGrid';
import SEO from '../components/SEO';
import { FEATURES } from '../config/features';
import { SOCIAL_LINKS } from '../config/social';
import { InstagramIcon, WhatsAppIcon } from '../components/SocialIcons';
import HeroLogoShowcase from '../components/HeroLogoShowcase';
import { contentService } from '../services/contentService';
import { settingsService } from '../services/settingsService';
import { categoryService } from '../services/categoryService';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "Nailsbyhelina Luxury Handcrafted Press-On Nails",
  "image": "https://nailsbyhelina.com/helinart-logo.png",
  "url": "https://nailsbyhelina.com",
  "telephone": "+919361405676",
  "email": "concierge@nailsbyhelina.com",
  "priceRange": "₹400 - ₹2,500",
  "currenciesAccepted": "INR",
  "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking",
  "sameAs": [
    "https://www.instagram.com/nails.by.helina/",
    "https://pinterest.com/nailsbyhelina"
  ]
};

const DEFAULT_HOME_CATEGORIES = [
  {
    name: 'Press-ons',
    title: 'Luxury Press-Ons',
    desc: 'Handcrafted reusable sets with professional-quality adhesive tabs.',
    image: '/images/design-sakura-chrome.jpg',
    tag: 'Most Popular'
  },
  {
    name: 'Gel kits',
    title: 'Studio Gel Kits',
    desc: 'DIY studio manicure kits with mini UV lamp & top coats.',
    image: '/images/service-gel.jpg',
    tag: 'Complete Set'
  },
  {
    name: 'Decals',
    title: 'Crystals & Decals',
    desc: 'Swarovski rhinestones and metallic celestial stickers.',
    image: '/images/design-starburst-french.jpg',
    tag: 'Nail Accents'
  },
  {
    name: 'Care',
    title: 'Cuticle & Nail Care',
    desc: 'Organic botanical oils and keratin strengthening serums.',
    image: '/images/studio-art-craft.jpg',
    tag: 'Nail Health'
  }
];

const fallbackCategoryVisuals = {
  'press-ons': { image: '/images/design-sakura-chrome.jpg', tag: 'Most Popular' },
  'gel-kits': { image: '/images/service-gel.jpg', tag: 'Complete Set' },
  'decals': { image: '/images/design-starburst-french.jpg', tag: 'Nail Accents' },
  'care': { image: '/images/studio-art-craft.jpg', tag: 'Nail Health' },
  'almond': { image: '/images/design-velvet-plum.jpg', tag: 'Signature Shape' },
  'coffin': { image: '/images/design-celestial-pearl.jpg', tag: 'Runway Look' },
  'french': { image: '/images/design-rose-quartz.jpg', tag: 'Trending' }
};

const heroStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04
    }
  }
};

const heroItemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: LUXURY_EASE
    }
  }
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homeContent, setHomeContent] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [categories, setCategories] = useState(DEFAULT_HOME_CATEGORIES);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [all, cmsContent, settings, catsData] = await Promise.all([
          getProducts(),
          contentService.getPublishedContent(),
          settingsService.getSettings(),
          categoryService.getCategories({ activeOnly: true })
        ]);
        if (mounted) {
          const picks = all.filter(p => p.isBestSeller || p.is_bestseller || p.isNew || p.is_new).slice(0, 4);
          setFeaturedProducts(picks.length ? picks : all.slice(0, 4));
          if (cmsContent) setHomeContent(cmsContent);
          if (settings) setSiteSettings(settings);
          if (catsData && catsData.length > 0) {
            const mapped = catsData.map(c => ({
              name: c.slug || c.name,
              title: c.name,
              desc: c.description || 'Artisan handcrafted press-on sets.',
              image: c.image_url || fallbackCategoryVisuals[c.slug]?.image || '/images/design-sakura-chrome.jpg',
              tag: c.tag || fallbackCategoryVisuals[c.slug]?.tag || 'Collection'
            }));
            setCategories(mapped.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic homepage data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  const studioBookingEnabled = siteSettings?.studio_booking_enabled !== undefined
    ? Boolean(siteSettings.studio_booking_enabled)
    : FEATURES.STUDIO_BOOKING_ENABLED;

  const instagramUrl = siteSettings?.instagram_url || SOCIAL_LINKS.instagram;
  const instagramHandle = siteSettings?.instagram_handle || SOCIAL_LINKS.instagramHandle;
  const whatsappNumber = siteSettings?.whatsapp_number || SOCIAL_LINKS.whatsappNumber;
  const whatsappChatUrl = siteSettings?.whatsapp_raw_number
    ? `https://wa.me/${siteSettings.whatsapp_raw_number}`
    : SOCIAL_LINKS.whatsappChatUrl;

  return (
    <div className="space-y-12 sm:space-y-16">
      <SEO 
        title="Luxury Handcrafted Press-On Nails | Nailsbyhelina Online Store"
        description="Discover salon-quality reusable press-on sets sculpted by master artists. Handcrafted luxury press-on nails delivered across India."
        keywords="luxury press on nails, nailsbyhelina, handcrafted press ons, reusable nails, gel manicure, wedding nails india"
        image="/helinart-logo.png"
        type="website"
        schema={homeSchema}
      />
      
      {/* =========================================================================
          1. EDITORIAL LUXURY HERO SECTION
          ========================================================================= */}
      <section className="relative pt-4 sm:pt-8 pb-4 overflow-hidden">
        
        {/* Soft Warm Champagne & Ivory Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-[#EEE6DE]/50 via-[#F4ECE6]/40 to-transparent blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Headline & Action with Staggered Entrance */}
            <motion.div
              variants={heroStaggerContainer}
              initial={shouldReduceMotion ? "visible" : "hidden"}
              animate="visible"
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              
              {/* Restrained Luxury Detail */}
              <motion.div variants={heroItemVariant}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39] shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#A87F45]" />
                  <span>{homeContent?.hero_eyebrow || 'New atelier collection drop'}</span>
                </div>
              </motion.div>

              <motion.h1 
                variants={heroItemVariant} 
                className="font-heading font-medium text-4xl sm:text-5xl lg:text-6xl tracking-normal text-[#313851] leading-[1.14]"
              >
                {homeContent?.hero_heading || 'Haute couture nail art,'} <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] bg-clip-text text-transparent">
                  {homeContent?.hero_highlight || 'made effortless.'}
                </span>
              </motion.h1>

              <motion.p 
                variants={heroItemVariant} 
                className="text-base sm:text-lg text-[#786866] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              >
                {homeContent?.hero_description || 'Discover professional-quality reusable press-on sets sculpted by master artists, delivered directly to your doorstep across India.'}
              </motion.p>

              {/* Action Buttons with Interactive Micro-Animations */}
              <motion.div variants={heroItemVariant} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <AnimatedButton
                  to="/shop"
                  variant="primary"
                  size="md"
                  withArrow={true}
                  className="w-full sm:w-auto"
                >
                  {homeContent?.primary_cta_text || 'Explore nail sets'}
                </AnimatedButton>

                <AnimatedButton
                  to="/studio"
                  variant="secondary"
                  size="md"
                  icon={Calendar}
                  className="w-full sm:w-auto"
                >
                  {homeContent?.secondary_cta_text || (studioBookingEnabled ? 'Book a studio slot' : 'Studio Opening Soon')}
                </AnimatedButton>
              </motion.div>

              {/* Subtle Hero Social & Contact Row */}
              <motion.div variants={heroItemVariant} className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-2.5 sm:gap-x-3 text-xs">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 py-2 px-1 text-[#786866] hover:text-[#313851] transition-all duration-200 hover:-translate-y-px min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550] rounded-lg"
                  aria-label={`Follow Nailsbyhelina on Instagram ${instagramHandle}`}
                >
                  <InstagramIcon className="w-[18px] h-[18px] text-[#A86F6B] group-hover:text-[#C98F8A] transition-colors shrink-0" />
                  <span className="leading-none">
                    Follow <strong className="font-semibold text-[#313851] underline decoration-[rgba(201,143,138,0.35)] underline-offset-3 group-hover:decoration-[#C98F8A]">{instagramHandle}</strong>
                  </span>
                </a>

                <span className="text-[#D8C6C3] hidden sm:inline select-none" aria-hidden="true">•</span>

                <a
                  href={whatsappChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 py-2 px-1 text-[#786866] hover:text-[#313851] transition-all duration-200 hover:-translate-y-px min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C5550] rounded-lg"
                  aria-label={`Message Nailsbyhelina on WhatsApp (${whatsappNumber})`}
                >
                  <WhatsAppIcon className="w-[18px] h-[18px] text-[#5F8D72] group-hover:text-[#4F7C63] transition-colors shrink-0" />
                  <span className="leading-none">
                    Message Us <strong className="font-semibold text-[#313851] underline decoration-[rgba(201,143,138,0.35)] underline-offset-3 group-hover:decoration-[#C98F8A]">{whatsappNumber}</strong>
                  </span>
                </a>
              </motion.div>

              {/* Factual Trust Row */}
              <motion.div variants={heroItemVariant} className="pt-5 border-t border-[#D8C6C3]/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="font-heading font-medium text-2xl text-[#313851]">3 Weeks</div>
                  <div className="text-xs text-[#786866]">Up to 3 weeks of wear</div>
                </div>
                <div>
                  <div className="font-heading font-medium text-2xl text-[#9C5550]">Up to 5x</div>
                  <div className="text-xs text-[#786866]">Reusable sets</div>
                </div>
                <div>
                  <div className="font-heading font-medium text-2xl text-[#A87F45]">100%</div>
                  <div className="text-xs text-[#786866]">Artisan Handcrafted</div>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Hero Visual: Animated Logo Showcase */}
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.18, ease: LUXURY_EASE }}
              className="lg:col-span-5 relative"
            >
              <HeroLogoShowcase />
            </motion.div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          2. CATEGORY JUMP SECTION (Seamless Vertical Flow)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={14} className="text-center max-w-2xl mx-auto mb-10 space-y-1.5">
          <span className="text-xs font-medium text-[#793D39]">Carefully curated</span>
          <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
            {homeContent?.collection_heading || 'Shop by Collection'}
          </h2>
          <p className="text-sm text-[#786866]">
            {homeContent?.collection_description || 'From red-carpet reusable press-ons to DIY professional gel sculpting kits.'}
          </p>
        </Reveal>

        <Reveal y={24} delay={0.08}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                whileHover={shouldReduceMotion ? {} : { y: -4 }}
                transition={{ duration: 0.25, ease: LUXURY_EASE }}
                className="h-full"
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group relative rounded-3xl overflow-hidden border border-[#D8C6C3] bg-glass-card p-4 flex flex-col justify-between hover:shadow-md hover:border-[#9C5550] transition-all duration-300 h-full"
                >
                  {/* Consistent 4:5 Aspect Ratio & Neutral Background */}
                  <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F4ECE6] mb-4">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      loading="lazy"
                      width="320"
                      height="400"
                      className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FFFDFC]/95 backdrop-blur-md text-[#313851] border border-[#D8C6C3] shadow-xs">
                      {cat.tag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading font-medium text-xl text-[#313851] group-hover:text-[#9C5550] transition-colors flex items-center justify-between">
                      <span>{cat.title}</span>
                      <ArrowRight className="w-4 h-4 text-[#9C5550] -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-xs text-[#786866] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>


      {/* =========================================================================
          3. FEATURED DESIGNS / TRENDING DROPS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={14} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#793D39] mb-1">
              <Flame className="w-4 h-4 text-[#9C5550] fill-[#9C5550]" />
              <span>Trending right now</span>
            </div>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
              Featured Masterpiece Sets
            </h2>
            <p className="text-sm text-[#786866] mt-1">
              Our most celebrated designs, loved by brides, stylists, and nail lovers.
            </p>
          </div>

          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 font-medium text-sm text-[#9C5550] hover:text-[#8A4743] transition-colors"
          >
            <span>View all 12 designs</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {/* Product Cards Grid with Staggered Viewport Entrance */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="rounded-3xl bg-[#FFFDFC] p-4 border border-[#D8C6C3] animate-pulse space-y-4">
                <div className="aspect-[4/5] rounded-2xl bg-[#F4ECE6]" />
                <div className="h-4 bg-[#F4ECE6] rounded w-3/4" />
                <div className="h-4 bg-[#F4ECE6] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        )}
      </section>


      {/* =========================================================================
          4. WHY NAILSBYHELINA — VALUE PROPOSITION
          ========================================================================= */}
      <section className="bg-[#F4ECE6]/50 py-14 sm:py-20 border-y border-[#D8C6C3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal y={14} className="text-center max-w-2xl mx-auto mb-12 space-y-1.5">
            <span className="text-xs font-medium text-[#786866]">The Nailsbyhelina advantage</span>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
              Why Choose Handcrafted Press-Ons?
            </h2>
            <p className="text-sm text-[#786866]">
              Zero studio wait times. Zero damage to natural nail beds. Complete elegance in 10 minutes.
            </p>
          </Reveal>

          <Reveal y={24} delay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <motion.div 
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                transition={{ duration: 0.2, ease: LUXURY_EASE }}
                className="bg-[#FFFDFC] rounded-3xl p-8 border border-[#D8C6C3] shadow-sm space-y-4 text-center sm:text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F4ECE6] text-[#793D39] flex items-center justify-center mx-auto sm:mx-0 border border-[#D8C6C3]/60">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-medium text-2xl text-[#313851]">
                  Ready in 10 Minutes
                </h3>
                <p className="text-sm text-[#453A3C] leading-relaxed">
                  Skip 2-hour studio appointments. Simply prep your natural nails with our included buffer, peel the medical adhesive tab, and press firmly for 30 seconds.
                </p>
              </motion.div>

              <motion.div 
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                transition={{ duration: 0.2, ease: LUXURY_EASE }}
                className="bg-[#FFFDFC] rounded-3xl p-8 border border-[#D8C6C3] shadow-sm space-y-4 text-center sm:text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#262D42] text-[#C8A46A] flex items-center justify-center mx-auto sm:mx-0 border border-[#C8A46A]/30">
                  <RefreshCw className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-medium text-2xl text-[#313851]">
                  Wear & Rewear Up to 5x
                </h3>
                <p className="text-sm text-[#453A3C] leading-relaxed">
                  Made with multi-layered high-impact polymers and non-fading cured gel lacquer, each tip can be safely removed with warm water and reapplied multiple times.
                </p>
              </motion.div>

              <motion.div 
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                transition={{ duration: 0.2, ease: LUXURY_EASE }}
                className="bg-[#FFFDFC] rounded-3xl p-8 border border-[#D8C6C3] shadow-sm space-y-4 text-center sm:text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#EEF3EE] text-[#879B83] flex items-center justify-center mx-auto sm:mx-0 border border-[#879B83]/40">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-medium text-2xl text-[#313851]">
                  Damage-Free Removal
                </h3>
                <p className="text-sm text-[#453A3C] leading-relaxed">
                  No harsh pure acetone soaking or electric drill filing needed. Gentle adhesive release oils keep your natural nail keratin intact and nourished.
                </p>
              </motion.div>

            </div>
          </Reveal>

        </div>
      </section>


      {/* =========================================================================
          4B. HOW IT WORKS 3-STEP PROCESS
          ========================================================================= */}
      <Reveal y={24}>
        <HowItWorksSection showFullPageLink={true} />
      </Reveal>


      {/* =========================================================================
          4C. INSTAGRAM LOOKBOOK CURATION
          ========================================================================= */}
      <Reveal y={24}>
        <LookbookGrid />
      </Reveal>


      {/* =========================================================================
          5. STUDIO SLOT BOOKING BANNER CTA
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={24}>
          <div 
            className="dark-section relative rounded-3xl sm:rounded-[36px] overflow-hidden p-8 sm:p-14 border border-[#3A425E] shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #262D42 0%, #313851 55%, #3A425E 100%)'
            }}
          >
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#FFFDFC] border border-white/20 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C8A46A]" />
                  <span>{FEATURES.STUDIO_BOOKING_ENABLED ? 'In-studio atelier experience' : 'Private Atelier In Preparation'}</span>
                </div>

                <h2 
                  className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl leading-tight"
                  style={{ color: '#FFFDFC' }}
                >
                  {FEATURES.STUDIO_BOOKING_ENABLED 
                    ? 'Want a personalized set crafted by our master artists?' 
                    : 'Our private studio is opening soon.'}
                </h2>

                <p 
                  className="text-sm sm:text-base max-w-xl leading-relaxed font-normal"
                  style={{ color: '#F4ECE6' }}
                >
                  {FEATURES.STUDIO_BOOKING_ENABLED
                    ? 'Book a 1-on-1 private appointment with our master nail sculptors. Choose from Russian dry manicure, custom chrome art, or sculpted extensions.'
                    : 'We’re currently creating beautiful nail experiences online. Our private studio will soon open for personalised appointments. Until then, discover our handcrafted press-on sets.'}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <AnimatedButton
                    to="/book"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    {FEATURES.STUDIO_BOOKING_ENABLED ? 'Book a studio slot online' : 'Studio Opening Soon'}
                  </AnimatedButton>
                  <span 
                    className="text-xs font-medium flex items-center justify-center gap-1.5"
                    style={{ color: '#A8C1A2' }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: '#879B83' }}
                    />
                    {FEATURES.STUDIO_BOOKING_ENABLED ? 'Real-time slots open for next 7 days' : 'Online Store Active • Express Delivery India-Wide'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-[#C8A46A]/40 shadow-xl rotate-2 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="/images/service-bridal.jpg"
                    alt="Nailsbyhelina studio art session"
                    loading="lazy"
                    width="224"
                    height="224"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>

          </div>
        </Reveal>
      </section>

    </div>
  );
}
