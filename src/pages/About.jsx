import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Award, Palette, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { FEATURES } from '../config/features';

export default function About() {
  const values = [
    {
      title: 'Haute Couture Artistry',
      icon: Palette,
      desc: 'Every press-on set is hand-painted, layered with high-impact gel lacquer, and finished with real Swarovski crystals or hand-burnished mirror chrome.'
    },
    {
      title: 'Zero Natural Nail Thinning',
      icon: ShieldCheck,
      desc: 'We reject harmful electric drill filing and acetone soaking. Our sets apply with non-toxic medical tabs that protect your natural nail bed integrity.'
    },
    {
      title: 'Conscious Reusability',
      icon: Heart,
      desc: 'Crafted from multi-layered industrial acrylic polymers, our tips maintain structural rigidity and shine across up to 5 individual wears.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      <SEO
        title="About the Artist & Studio Story"
        description="Discover the philosophy behind Nailsbyhelina: Japanese gel formulations, handcrafted press-on craftsmanship, and bespoke reusable nail art."
        keywords="about nailsbyhelina, helina nail artist, luxury nail press-ons, handcrafted nails story"
      />
      
      {/* Editorial Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
            <Sparkles className="w-3.5 h-3.5 text-[#A87F45]" />
            <span>The Nailsbyhelina Story</span>
          </div>

          <h1 className="font-heading font-medium text-4xl sm:text-5xl lg:text-6xl text-[#313851] leading-tight">
            Redefining luxury nails <br />
            <span className="bg-gradient-to-r from-[#B26661] via-[#9C5550] to-[#8A4743] bg-clip-text text-transparent">
              as wearable jewelry.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#786866] leading-relaxed">
            Nailsbyhelina was founded on a simple conviction: modern women should never have to choose between salon-grade artistry and natural nail health.
          </p>

          <div className="p-4 rounded-2xl bg-[#EEF3EE] border border-[#879B83]/40 text-xs text-[#2B3B29] space-y-1">
            <span className="font-bold text-[#313851] block">[Note to Owner: Personalize this biography]</span>
            <p>You can replace this text with Helina's personal career background, training certifications, or founding story at any time.</p>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="relative aspect-[4/5] w-full max-w-md rounded-3xl overflow-hidden bg-[#F4ECE6] border border-[#D8C6C3] shadow-lg">
            <img
              src="/images/artist-elena.jpg"
              alt="Helina, Founder & Master Nail Sculptor"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#FFFDFC]/95 backdrop-blur-md border border-[#D8C6C3] shadow-xs">
              <h3 className="font-heading font-medium text-lg text-[#313851]">Helina</h3>
              <p className="text-xs text-[#786866]">Founder & Master Nail Sculptor • Atelier Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Atelier Philosophy */}
      <section className="bg-[#FFFDFC] rounded-3xl p-8 sm:p-12 border border-[#D8C6C3] shadow-xs space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-medium text-[#793D39]">Our Atelier Standard</span>
          <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
            Why We Handcraft Every Single Tip
          </h2>
          <p className="text-sm text-[#786866]">
            Unlike factory-printed plastic press-ons that snap in 24 hours, our sets are created like fine jewelry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="p-6 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/60 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFFDFC] text-[#9C5550] flex items-center justify-center border border-[#D8C6C3]/60">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-medium text-xl text-[#313851]">{v.title}</h3>
                <p className="text-xs text-[#453A3C] leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Meet the Studio Sculptors */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-medium text-[#793D39]">The Talent Behind The Art</span>
          <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
            Meet Our Senior Artisans
          </h2>
          <p className="text-sm text-[#786866]">
            Trained in Russian e-file cuticle precision, builder gel sculpting, and hand-painted Japanese nail art.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F4ECE6]">
              <img src="/images/artist-elena.jpg" alt="Helina" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-heading font-medium text-lg text-[#313851]">Helina</h3>
              <p className="text-xs text-[#9C5550] font-medium">Head Sculptor & Founder</p>
              <p className="text-xs text-[#786866] mt-1">Specializes in 3D acrylic roses, Russian dry manicure, and bridal custom suites.</p>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F4ECE6]">
              <img src="/images/artist-chloe.jpg" alt="Chloe" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-heading font-medium text-lg text-[#313851]">Chloe</h3>
              <p className="text-xs text-[#9C5550] font-medium">Lead Chrome & Glaze Artist</p>
              <p className="text-xs text-[#786866] mt-1">Master of iridescent mirror powders, Hailey Bieber glazed donuts, and cat-eye halos.</p>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F4ECE6]">
              <img src="/images/artist-sarah.jpg" alt="Sarah" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-heading font-medium text-lg text-[#313851]">Sarah</h3>
              <p className="text-xs text-[#9C5550] font-medium">Micro-French & Crystal Specialist</p>
              <p className="text-xs text-[#786866] mt-1">Expert in razor-sharp French tips, Swarovski setting, and celestial decal styling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#262D42] text-[#FFFDFC] border border-[#3A425E] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[#C8A46A] font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>{FEATURES.STUDIO_BOOKING_ENABLED ? 'In-Studio Experience' : 'Physical Studio • Coming Soon'}</span>
          </div>
          <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#FFFDFC]">
            {FEATURES.STUDIO_BOOKING_ENABLED 
              ? 'Experience Private 1-on-1 Studio Sessions' 
              : 'Our Private Studio Is Coming Soon'}
          </h2>
          <p className="text-xs sm:text-sm text-[#C2CBD3] max-w-xl">
            {FEATURES.STUDIO_BOOKING_ENABLED
              ? 'Reserve a private appointment with our master nail sculptors.'
              : 'We’re currently creating beautiful nail experiences online. Our private studio will soon open for personalised appointments. Until then, discover our handcrafted press-on collections online.'}
          </p>
        </div>

        <Link
          to={FEATURES.STUDIO_BOOKING_ENABLED ? "/book" : "/shop"}
          className="px-6 py-3 rounded-full text-xs font-semibold bg-[#9C5550] text-[#FFFDFC] hover:bg-[#8A4743] transition-colors shrink-0 shadow-xs flex items-center gap-2"
        >
          <span>{FEATURES.STUDIO_BOOKING_ENABLED ? 'Book a Studio Slot' : 'Shop Nail Sets'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

    </div>
  );
}
