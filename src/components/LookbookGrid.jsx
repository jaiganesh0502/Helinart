import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { lookbookService } from '../services/lookbookService';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.985
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      ease: LUXURY_EASE
    }
  }
};

export default function LookbookGrid() {
  const defaultItems = [
    {
      id: 'sakura-chrome-luxe',
      image: '/images/design-sakura-chrome.jpg',
      title: 'Sakura Velvet Chrome',
      price: '₹1,199',
      tag: '@nailsbyhelina • Bridal Suite'
    },
    {
      id: 'crystal-micro-french',
      image: '/images/design-crystal-french.jpg',
      title: 'Crystal Micro-French',
      price: '₹1,299',
      tag: '@nailsbyhelina • Editorial Chic'
    },
    {
      id: 'vanilla-glaze-donut',
      image: '/images/design-vanilla-glaze.jpg',
      title: 'Vanilla Glaze French',
      price: '₹899',
      tag: '@nailsbyhelina • Everyday Glow'
    },
    {
      id: 'golden-empress-stiletto',
      image: '/images/design-golden-empress.jpg',
      title: 'Golden Empress Luxe',
      price: '₹1,599',
      tag: '@nailsbyhelina • 24K Gold Accent'
    },
    {
      id: 'sculpted-3d-floral',
      image: '/images/design-3d-floral.jpg',
      title: 'Sculpted 3D Rose Petals',
      price: '₹1,449',
      tag: '@nailsbyhelina • Haute Couture'
    },
    {
      id: 'midnight-navy-aurora',
      image: '/images/design-navy-luxe.jpg',
      title: 'Midnight Navy Velvet',
      price: '₹1,099',
      tag: '@nailsbyhelina • Constellation'
    },
    {
      id: 'celestial-starburst-decals',
      image: '/images/design-starburst-french.jpg',
      title: 'Celestial Starburst Accents',
      price: '₹499',
      tag: '@nailsbyhelina • Metallic Stars'
    },
    {
      id: 'swarovski-bridal-crystal-pack',
      image: '/images/design-swarovski-bridal.jpg',
      title: 'Swarovski Bridal Crystals',
      price: '₹699',
      tag: '@nailsbyhelina • High Jewelry'
    }
  ];

  const [lookbookItems, setLookbookItems] = useState(defaultItems);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    async function loadLookbook() {
      try {
        const dynamicItems = await lookbookService.getLookbookItems({ activeOnly: true });
        if (mounted && dynamicItems && dynamicItems.length > 0) {
          setLookbookItems(dynamicItems.map(item => ({
            id: item.product_id || item.id,
            image: item.image_url || item.image,
            title: item.title,
            price: item.subtitle || 'Haute Couture',
            tag: item.instagram_caption || '@nailsbyhelina • Atelier'
          })));
        }
      } catch (e) {
        // Fallback to defaultItems
      }
    }
    loadLookbook();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="lookbook" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5, ease: LUXURY_EASE }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#793D39] mb-1">
            <Camera className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>As seen on Instagram</span>
          </div>
          <h2 
            className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]"
          >
            The Nailsbyhelina Lookbook
          </h2>
          <p 
            className="text-sm mt-1 text-[#786866]"
          >
            Real manicures, red carpet events, and studio inspirations. Tag @nailsbyhelina to be featured.
          </p>
        </div>

        <a
          href="https://www.instagram.com/nails.by.helina/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-sm text-[#A86F6B] hover:text-[#8A4743] transition-colors group"
        >
          <span>Follow @nails.by.helina</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.div>

      {/* Grid: 8 items with Staggered Viewport Reveal */}
      <motion.div
        variants={gridVariants}
        initial={shouldReduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.05, margin: "0px 0px -30px 0px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {lookbookItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : { y: -3 }}
            transition={{ duration: 0.25, ease: LUXURY_EASE }}
            className="rounded-3xl"
          >
            <Link
              to={`/product/${item.id}`}
              className="group relative block aspect-[4/5] rounded-3xl overflow-hidden bg-[#F4ECE6] border border-[#D8C6C3] shadow-xs hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                width="300"
                height="375"
                className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-500 ease-out"
              />

              {/* Overlay with smooth hover entrance and micro-movement */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                style={{
                  background: 'linear-gradient(180deg, rgba(38,45,66,0.00) 35%, rgba(38,45,66,0.22) 55%, rgba(38,45,66,0.68) 78%, rgba(38,45,66,0.86) 100%)'
                }}
              >
                {/* Small overlay tag */}
                <span 
                  className="text-[11px] font-medium tracking-wide text-[#E0BC7A] drop-shadow-xs"
                >
                  {item.tag}
                </span>

                {/* Main overlay title with subtle upward glide */}
                <h4 
                  className="font-heading text-lg leading-tight mt-0.5 text-[#FFFDFC] font-medium drop-shadow-xs translate-y-1 group-hover:translate-y-0 transition-transform duration-300"
                >
                  {item.title}
                </h4>

                {/* Card divider & CTA */}
                <div 
                  className="flex items-center justify-between mt-2 pt-2 border-t border-white/30"
                >
                  <span 
                    className="text-xs text-[#FFFDFC] font-semibold drop-shadow-xs"
                  >
                    {item.price}
                  </span>

                  <span 
                    className="lookbook-shop-btn text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 transition-all duration-200 bg-white/95 text-[#313851] border border-white/40 backdrop-blur-xs opacity-90 group-hover:opacity-100 group-hover:scale-[1.02]"
                  >
                    <span>Shop set</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
