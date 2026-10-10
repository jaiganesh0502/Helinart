import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal SEO & Meta Tags Component for Nailsbyhelina
 * Dynamically updates document.title, standard meta descriptions, keywords,
 * Open Graph (og:title, og:description, og:image, og:url, og:type), Twitter cards,
 * canonical link tag, and JSON-LD structured data on route changes.
 */
export default function SEO({
  title,
  description,
  keywords,
  image = '/helinart-logo.png',
  type = 'website',
  schema
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Dynamic document.title
    const baseBrand = 'Nailsbyhelina';
    const siteSubtitle = 'Luxury Nail Art Studio & Press-Ons in Bengaluru';
    const fullTitle = title ? `${title} | ${baseBrand}` : `${baseBrand} — ${siteSubtitle}`;
    document.title = fullTitle;

    // Helper function to safely set or create meta elements
    const setMeta = (attributeName, attributeValue, content) => {
      if (content === undefined || content === null) return;
      let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    const defaultDesc = 'Handcrafted luxury press-on sets, bespoke gel art kits, and couture reusable nail designs by Nailsbyhelina.';
    const metaDescription = description || defaultDesc;
    setMeta('name', 'description', metaDescription);

    const defaultKeywords = 'luxury press on nails, nailsbyhelina, handcrafted press on nails, reusable nails, gel manicure, wedding nails india, couture nail art';
    setMeta('name', 'keywords', keywords || defaultKeywords);

    // 3. Open Graph Metadata
    const canonicalOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://nailsbyhelina.com';
    const currentUrl = `${canonicalOrigin}${location.pathname}`;
    const absoluteImage = image.startsWith('http') ? image : `${canonicalOrigin}${image}`;

    setMeta('property', 'og:site_name', 'Nailsbyhelina');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', metaDescription);
    setMeta('property', 'og:url', currentUrl);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', absoluteImage);
    setMeta('property', 'og:image:alt', title || 'Nailsbyhelina Luxury Nail Studio');

    // 4. Twitter Card Metadata
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', metaDescription);
    setMeta('name', 'twitter:image', absoluteImage);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // 6. JSON-LD Structured Data
    let scriptTag = document.querySelector('script#seo-structured-data');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'seo-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clean up structured data on route unmount
      const existingScript = document.querySelector('script#seo-structured-data');
      if (existingScript) existingScript.remove();
    };
  }, [title, description, keywords, image, type, schema, location.pathname]);

  return null;
}
