import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowUpRight } from 'lucide-react';
import { lookbookService } from '../services/lookbookService';

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#793D39] mb-1">
            <Camera className="w-3.5 h-3.5 text-[#9C5550]" />
            <span>As seen on Instagram</span>
          </div>
          <h2 
            className="font-heading font-medium text-3xl sm:text-4xl"
            style={{ color: '#313851' }}
          >
            The Nailsbyhelina Lookbook
          </h2>
          <p 
            className="text-sm mt-1"
            style={{ color: '#786866' }}
          >
            Real manicures, red carpet events, and studio inspirations. Tag @nailsbyhelina to be featured.
          </p>
        </div>

        <a
          href="https://www.instagram.com/nails.by.helina/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-sm transition-colors hover:opacity-80"
          style={{ color: '#A86F6B' }}
        >
          <span>Follow @nails.by.helina</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* Grid: 8 items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {lookbookItems.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.id}`}
            className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#F4ECE6] border border-[#D8C6C3] shadow-xs hover:shadow-md transition-all duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              width="300"
              height="375"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Overlay with original hover fade animation and luxury contrast color combo */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
              style={{
                background: 'linear-gradient(180deg, rgba(38,45,66,0.00) 35%, rgba(38,45,66,0.18) 55%, rgba(38,45,66,0.62) 78%, rgba(38,45,66,0.82) 100%)'
              }}
            >
              {/* Small overlay label: color: #E0BC7A with subtle text shadow */}
              <span 
                className="text-[11px] font-medium tracking-wide"
                style={{
                  color: '#E0BC7A',
                  textShadow: '0 1px 3px rgba(0,0,0,0.22)'
                }}
              >
                {item.tag}
              </span>

              {/* Main overlay title: color: #FFFDFC, font-weight: 500 with subtle text shadow */}
              <h4 
                className="font-heading text-lg leading-tight mt-0.5"
                style={{
                  color: '#FFFDFC',
                  fontWeight: 500,
                  textShadow: '0 1px 3px rgba(0,0,0,0.22)'
                }}
              >
                {item.title}
              </h4>

              {/* Card divider line: border-color: rgba(255,255,255,0.28) */}
              <div 
                className="flex items-center justify-between mt-2 pt-2 border-t"
                style={{ borderColor: 'rgba(255, 255, 255, 0.28)' }}
              >
                {/* Price: color: #FFFDFC, font-weight: 600 with subtle text shadow */}
                <span 
                  className="text-xs"
                  style={{
                    color: '#FFFDFC',
                    fontWeight: 600,
                    textShadow: '0 1px 3px rgba(0,0,0,0.22)'
                  }}
                >
                  {item.price}
                </span>

                {/* Shop set button with high contrast and smooth hover */}
                <span 
                  className="lookbook-shop-btn text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 transition-all duration-200"
                  style={{
                    background: 'rgba(255, 253, 252, 0.92)',
                    color: '#313851',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    textShadow: 'none'
                  }}
                >
                  <span>Shop set</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
