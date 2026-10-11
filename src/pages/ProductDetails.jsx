import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Heart, ShoppingBag, ShieldCheck, RefreshCw, Truck, 
  Ruler, Check, Bell, MapPin, ChevronRight, Share2, Sparkles, MessageSquarePlus, MessageSquare, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { getProductById, getProductReviews, addProductReview, checkPincodeDelivery } from '../api';
import { useStore } from '../store/useStore';
import SizeGuideModal from '../components/SizeGuideModal';
import RecentlyViewedRow from '../components/RecentlyViewedRow';
import Reveal from '../components/ui/Reveal';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { settingsService } from '../services/settingsService';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  
  // Selection state
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedDenomination, setSelectedDenomination] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  // Modals & form state
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(authUser?.email || '');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    author: authUser?.full_name || '',
    rating: 5,
    comment: '',
    customerPhoto: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Pincode state
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeChecking, setPincodeChecking] = useState(false);

  useEffect(() => {
    if (authUser) {
      if (authUser.full_name && !reviewForm.author) {
        setReviewForm(prev => ({ ...prev, author: authUser.full_name }));
      }
      if (authUser.email && !notifyEmail) {
        setNotifyEmail(authUser.email);
      }
    }
  }, [authUser]);

  const { toggleFavorite, isFavorite, addToCart, addRecentlyViewed, requestStockNotification, addToast } = useStore();

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [prod, settings] = await Promise.all([
          getProductById(id),
          settingsService.getSettings()
        ]);
        if (mounted) {
          if (settings) setSiteSettings(settings);
          setProduct(prod);
          setSelectedImage(prod.image);
          setSelectedShape(prod.shapes && prod.shapes.length > 0 ? prod.shapes[0] : 'Universal');
          if (prod.denominations && prod.denominations.length > 0) {
            setSelectedDenomination(prod.denominations[1] || prod.denominations[0]);
          }
          addRecentlyViewed(prod.id);

          // Fetch reviews
          const revs = await getProductReviews(prod.id);
          if (mounted) setReviews(revs);
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => { mounted = false; };
  }, [id, addRecentlyViewed]);


  const handlePincodeCheck = async (e) => {
    e.preventDefault();
    if (!pincodeInput) return;
    setPincodeChecking(true);
    const res = await checkPincodeDelivery(pincodeInput);
    setPincodeResult(res);
    setPincodeChecking(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const finalPrice = selectedDenomination || product.price;
    const itemToAdd = {
      ...product,
      price: finalPrice
    };
    addToCart(itemToAdd, {
      shape: selectedShape,
      size: selectedSize,
      quantity
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1100);
  };

  const handleStockNotifySubmit = (e) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    requestStockNotification(product.id, product.name, notifyEmail);
    setIsNotifyOpen(false);
    setNotifyEmail('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.comment.trim()) {
      addToast('Please provide your name and review message.', 'error');
      return;
    }
    setReviewSubmitting(true);
    try {
      const created = await addProductReview(product.id, reviewForm);
      setReviews(prev => [created, ...prev]);
      addToast('Thank you! Your verified review has been published. ✨', 'success');
      setIsReviewFormOpen(false);
      setReviewForm({ author: '', rating: 5, comment: '', customerPhoto: '' });
    } catch (err) {
      addToast('Failed to save review. Please try again.', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
          <div className="lg:col-span-6 aspect-[4/5] bg-[#F4ECE6] rounded-3xl" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-6 bg-[#F4ECE6] rounded w-1/3" />
            <div className="h-10 bg-[#F4ECE6] rounded w-3/4" />
            <div className="h-6 bg-[#F4ECE6] rounded w-1/4" />
            <div className="h-32 bg-[#F4ECE6] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="font-heading font-medium text-2xl text-[#313851]">Product Not Found</h2>
        <p className="text-sm text-[#786866] mt-2">The design you are looking for may have been archived.</p>
        <Link to="/shop" className="mt-6 inline-block px-6 py-2.5 rounded-full bg-[#9C5550] text-[#FFFDFC] text-sm font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(product.id);
  const inStock = product.inStock !== false;
  const currentPrice = selectedDenomination || product.price;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image.startsWith('http') ? product.image : `https://nailsbyhelina.com${product.image}`,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Nailsbyhelina"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `https://nailsbyhelina.com/product/${product.id}`,
      "priceCurrency": "INR",
      "price": currentPrice,
      "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewsCount || 42
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title={`${product.name} — Handcrafted Press-On Nails`}
        description={product.description}
        keywords={`${product.name}, luxury press-on nails, handcrafted reusable nails, nailsbyhelina ${product.category.toLowerCase()}`}
        image={product.image}
        type="product"
        schema={productSchema}
      />
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#786866]" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#313851] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D8C6C3]" />
        <Link to="/shop" className="hover:text-[#313851] transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D8C6C3]" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#313851] transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D8C6C3]" />
        <span className="text-[#313851] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* LEFT COLUMN: Gallery & Photos */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#F4ECE6] border border-[#D8C6C3] shadow-md group">
            <img
              src={selectedImage}
              alt={product.name}
              width="600"
              height="750"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />

            {/* Favorite & Share Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <motion.button
                onClick={() => toggleFavorite(product.id, product.name)}
                whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
                animate={isFav && !shouldReduceMotion ? { scale: [1, 1.22, 1] } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-sm ${
                  isFav ? 'bg-[#9C5550] text-[#FFFDFC]' : 'bg-[#FFFDFC]/90 text-[#313851] hover:text-[#9C5550]'
                }`}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-[#FFFDFC]' : ''}`} />
              </motion.button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  addToast('Link copied to clipboard! 🔗', 'info');
                }}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-[#FFFDFC]/90 text-[#313851] hover:text-[#9C5550] backdrop-blur-md transition-all shadow-sm"
                aria-label="Share product link"
                title="Copy Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* In-Stock / Sold Out Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
              {!inStock && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#262D42] text-[#FFFDFC] shadow-sm">
                  Sold out — restocking soon
                </span>
              )}
              {product.isBestSeller && inStock && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#9C5550] text-[#FFFDFC] shadow-sm">
                  Bestseller
                </span>
              )}
              {product.isNew && inStock && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#262D42] text-[#FFFDFC] shadow-sm">
                  New drop
                </span>
              )}
            </div>
          </div>

          {/* Alternate Thumbnail Previews */}
          <div className="grid grid-cols-4 gap-3">
            {[product.image, '/images/hero-showcase.jpg', '/images/bridal-campaign.jpg', '/images/studio-art-craft.jpg'].map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className={`aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all bg-[#F4ECE6] ${
                  selectedImage === imgUrl ? 'border-[#9C5550] shadow-sm scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Details, Selectors & Add To Bag */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header & Title */}
          <div className="space-y-2 border-b border-[#D8C6C3]/60 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F4ECE6] text-[#793D39] border border-[#D8C6C3]">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#A87F45] font-semibold">
                <Star className="w-4 h-4 fill-[#A87F45] text-[#A87F45]" />
                <span>{product.rating}</span>
                <span className="text-[#786866] font-normal">({reviews.length} atelier reviews)</span>
              </div>
            </div>

            <h1 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851] leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-heading font-medium text-3xl text-[#262D42]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#786866]">
                Includes GST • Complimentary adhesive tab kit
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#453A3C] leading-relaxed">
            {product.description}
          </p>

          {/* Denominations (for Gift Card) */}
          {product.denominations && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#313851]">Select Voucher Value</label>
              <div className="flex flex-wrap gap-2.5">
                {product.denominations.map((denom) => (
                  <button
                    key={denom}
                    onClick={() => setSelectedDenomination(denom)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedDenomination === denom
                        ? 'bg-[#313851] text-[#FFFDFC] border-[#313851]'
                        : 'bg-[#FFFDFC] text-[#313851] border-[#D8C6C3] hover:border-[#9C5550]'
                    }`}
                  >
                    ₹{denom.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nail Shape Selector */}
          {product.shapes && product.shapes.length > 0 && product.shapes[0] !== 'Universal' && product.shapes[0] !== 'Digital Voucher' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#313851]">Nail Shape Silhouette</label>
                <span className="text-xs text-[#793D39] font-medium">{selectedShape}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setSelectedShape(shape)}
                    className={`px-4 py-2 rounded-2xl text-xs font-medium border transition-all ${
                      selectedShape === shape
                        ? 'bg-[#9C5550] text-[#FFFDFC] border-[#9C5550] shadow-xs'
                        : 'bg-[#FFFDFC] text-[#313851] border-[#D8C6C3] hover:border-[#9C5550]'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nail Size Selector with Size Guide Modal Trigger */}
          {product.category === 'Press-ons' && product.id !== 'atelier-sizing-kit' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#313851]">Atelier Size Preset</label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#9C5550] hover:text-[#8A4743] transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide (mm chart)</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['XS', 'S', 'M', 'L'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedSize === sz
                        ? 'bg-[#313851] text-[#FFFDFC] border-[#313851] shadow-xs'
                        : 'bg-[#FFFDFC] text-[#313851] border-[#D8C6C3] hover:border-[#9C5550]'
                    }`}
                  >
                    Size {sz}
                  </button>
                ))}
              </div>
              <p className="text-[11.5px] text-[#786866] pt-0.5">
                Not sure about your size? <Link to="/product/atelier-sizing-kit" className="text-[#9C5550] font-medium underline">Order the ₹199 sizing kit</Link> with 100% store credit rebate.
              </p>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#D8C6C3] rounded-2xl bg-[#FFFDFC] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-[#313851] hover:bg-[#F4ECE6] transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-9 text-center text-sm font-semibold text-[#313851]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-[#313851] hover:bg-[#F4ECE6] transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Main Action Button */}
              {inStock ? (
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01, boxShadow: '0 10px 24px rgba(183, 127, 123, 0.22)' }}
                  transition={{ duration: 0.18 }}
                  className="relative overflow-hidden flex-1 py-3.5 px-6 rounded-full font-medium text-sm text-[#FFFDFC] flex items-center justify-center gap-2 shadow-sm transition-colors"
                  style={{
                    background: addedFeedback
                      ? '#2F7C56'
                      : 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)'
                  }}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4 animate-in zoom-in-50 duration-150" />
                      <span>Added ✓</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setIsNotifyOpen(true)}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="flex-1 py-3.5 px-6 rounded-full font-medium text-sm text-[#FFFDFC] bg-[#262D42] hover:bg-[#313851] flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Bell className="w-4 h-4 text-[#C8A46A]" />
                  <span>Notify Me When Back in Stock</span>
                </motion.button>
              )}
            </div>

            {/* Direct WhatsApp Concierge for Product */}
            <div className="pt-0.5 flex items-center justify-between text-xs text-[#786866]">
              <a
                href={`https://wa.me/${siteSettings?.whatsapp_raw_number || '919361405676'}?text=${encodeURIComponent(`Hi Nailsbyhelina, I’m interested in ${product.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#9C5550] transition-colors"
                aria-label={`Ask Nailsbyhelina concierge about ${product.name} on WhatsApp`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#879B83]" />
                <span>Questions about this set? <strong className="font-semibold text-[#313851] hover:underline">Chat on WhatsApp</strong> ({siteSettings?.whatsapp_number || '+91 93614 05676'})</span>
              </a>
            </div>
          </div>

          {/* PINCODE DELIVERY CHECKER */}
          <div className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#313851] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#9C5550]" />
                <span>Estimate Courier Delivery</span>
              </span>
              <span className="text-[11px] text-[#786866]">Free on orders above ₹999</span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your PIN code"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D8C6C3] bg-[#FFFDFC] text-[#313851] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
              />
              <button
                type="submit"
                disabled={pincodeChecking}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors"
              >
                {pincodeChecking ? 'Checking...' : 'Check'}
              </button>
            </form>

            {pincodeResult && (
              <div className={`text-xs p-2.5 rounded-xl border ${
                pincodeResult.serviceable 
                  ? 'bg-[#FFFDFC] border-[#879B83]/50 text-[#2B2223]' 
                  : 'bg-[#FBEBEA] border-[#D89B96] text-[#793D39]'
              }`}>
                {pincodeResult.serviceable ? (
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#313851] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#879B83]" />
                      <span>{pincodeResult.city}: {pincodeResult.estimate}</span>
                    </p>
                    <p className="text-[11px] text-[#786866]">Dispatched via {pincodeResult.carrier} • Cash on Delivery eligible</p>
                  </div>
                ) : (
                  <p>{pincodeResult.message}</p>
                )}
              </div>
            )}
          </div>

          {/* What's In The Box Strip */}
          <div className="pt-4 border-t border-[#D8C6C3]/60 space-y-2.5">
            <h4 className="text-xs font-semibold text-[#313851]">Included In Every Press-On Keepsake Box:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#453A3C]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#879B83]" />
                <span>24 Nails in 10 tailored sizes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#879B83]" />
                <span>48 Medical-grade adhesive tabs</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#879B83]" />
                <span>Studio dual-ended wooden stick</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#879B83]" />
                <span>Mini dual-sided nail buffer</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          REVIEWS & TESTIMONIALS SECTION
          ========================================================================= */}
      <section className="pt-10 border-t border-[#D8C6C3]/80 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-[#793D39]">Verified Atelier Feedback</span>
            <h2 className="font-heading font-medium text-3xl text-[#313851]">
              Customer Reviews ({reviews.length})
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-[#A87F45]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#A87F45] text-[#A87F45]" />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#313851]">{product.rating} out of 5.0</span>
              <span className="text-xs text-[#786866]">from certified clients</span>
            </div>
          </div>

          <button
            onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#FFFDFC] text-[#313851] border border-[#313851] hover:bg-[#313851] hover:text-[#FFFDFC] transition-all shadow-xs"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* WRITE A REVIEW ACCORDION / FORM */}
        {isReviewFormOpen && (
          <form 
            onSubmit={handleReviewSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-4 animate-in slide-in-from-top-2 duration-200"
          >
            <h3 className="font-heading font-medium text-xl text-[#313851]">
              Share Your Atelier Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#313851] mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#313851] mb-1">Star Rating</label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewForm.rating ? 'fill-[#A87F45] text-[#A87F45]' : 'text-[#D8C6C3]'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-[#313851] ml-2">{reviewForm.rating} Stars</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#313851] mb-1">Your Review</label>
              <textarea
                required
                rows={3}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="How did the fit, finish, and wear feel? Did you receive compliments?"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#786866]">
                Reviews are saved locally to your device moodboard.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-[#786866] hover:bg-[#F4ECE6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#9C5550] text-[#FFFDFC] hover:bg-[#8A4743] transition-colors"
                >
                  {reviewSubmitting ? 'Publishing...' : 'Publish Review'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* REVIEW LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#A87F45]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#A87F45] text-[#A87F45]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#786866]">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#453A3C] leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#D8C6C3]/50">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-medium text-sm text-[#313851]">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-[10px] font-semibold text-[#879B83] px-2 py-0.5 rounded-md bg-[#EEF3EE]">
                      Verified Buyer
                    </span>
                  )}
                </div>

                {rev.customerPhoto && (
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#D8C6C3]">
                    <img src={rev.customerPhoto} alt="Customer nail photo" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* RECENTLY VIEWED SECTION */}
      <RecentlyViewedRow excludeId={product.id} />

      {/* SIZE GUIDE MODAL */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />

      {/* NOTIFY ME MODAL */}
      <AnimatePresence>
        {isNotifyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsNotifyOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262D42]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D8C6C3] shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F4ECE6] text-[#793D39] flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-medium text-2xl text-[#313851]">
                  Back in Stock Alert
                </h3>
                <p className="text-xs text-[#786866] mt-1">
                  Enter your email address. We will notify you immediately once master artists craft the next batch of <strong>{product.name}</strong>.
                </p>
              </div>

              <form onSubmit={handleStockNotifySubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsNotifyOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-medium text-[#786866]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full text-xs font-semibold bg-[#9C5550] text-[#FFFDFC]"
                  >
                    Notify Me
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
