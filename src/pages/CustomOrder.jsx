import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Palette, Upload, CheckCircle2, ArrowRight, 
  Ruler, HelpCircle, Phone, MessageSquare, Camera 
} from 'lucide-react';
import { createCustomOrder } from '../api';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function CustomOrder() {
  const { addToast } = useStore();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    shape: 'Almond',
    length: 'Medium',
    sizeType: 'Preset',
    presetSize: 'M',
    customSizes: { thumb: '', index: '', middle: '', ring: '', pinky: '' },
    themes: ['Chrome Mirror', 'Bridal Luxury'],
    colors: '',
    notes: '',
    photoPreview: null
  });

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.full_name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const shapes = ['Almond', 'Coffin', 'Square', 'Stiletto', 'Oval', 'Round'];
  const lengths = ['Short (Active)', 'Medium (Classic)', 'Long (Glam)', 'Extra Long (Editorial)'];
  const themesList = [
    'Bridal Luxury', 'Chrome Mirror', '3D Sculpted Gel', 
    'Minimal French', 'Baroque Gold Foil', 'Celestial Galaxy', 
    'Botanical Floral', 'Dark Romance'
  ];

  const handleThemeToggle = (theme) => {
    setFormData((prev) => {
      const exists = prev.themes.includes(theme);
      return {
        ...prev,
        themes: exists ? prev.themes.filter(t => t !== theme) : [...prev.themes, theme]
      };
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      addToast('Please enter your full name and phone number.', 'error');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      addToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createCustomOrder(formData);
      setSubmittedOrder(order);
      addToast('Custom set inquiry sent to our master artist! ✨', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      addToast('Could not submit custom order inquiry. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#EEF3EE] text-[#879B83] flex items-center justify-center mx-auto border border-[#879B83]/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#879B83] uppercase tracking-wider">
            Inquiry Registered
          </span>
          <h1 className="font-heading font-medium text-3xl sm:text-4xl text-[#313851]">
            Bespoke Request Received
          </h1>
          <p className="text-sm text-[#786866] max-w-md mx-auto">
            Your reference code is <strong>{submittedOrder.referenceId}</strong>. Our atelier master artist will review your moodboard within 4 hours.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs text-left text-xs space-y-2">
          <h3 className="font-heading font-medium text-base text-[#313851] border-b border-[#D8C6C3]/60 pb-2">
            Inquiry Summary
          </h3>
          <p><strong>Client:</strong> {submittedOrder.name} ({submittedOrder.phone})</p>
          <p><strong>Silhouette:</strong> {submittedOrder.shape} • {submittedOrder.length}</p>
          <p><strong>Size:</strong> {submittedOrder.sizeType === 'Preset' ? `Preset ${submittedOrder.presetSize}` : 'Custom mm provided'}</p>
          <p><strong>Themes:</strong> {submittedOrder.themes.join(', ')}</p>
          {submittedOrder.notes && <p><strong>Notes:</strong> {submittedOrder.notes}</p>}
          <p className="pt-2 text-[#786866]">
            Estimate: Starting from ₹1,499 (exact quotation shared over WhatsApp with 3D color mockups).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="px-6 py-3 rounded-full text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors"
          >
            Explore Ready-to-Wear Sets
          </Link>
          <button
            onClick={() => {
              setSubmittedOrder(null);
              setFormData({
                name: '', phone: '', email: '', shape: 'Almond', length: 'Medium',
                sizeType: 'Preset', presetSize: 'M', customSizes: { thumb: '', index: '', middle: '', ring: '', pinky: '' },
                themes: ['Chrome Mirror'], colors: '', notes: '', photoPreview: null
              });
            }}
            className="px-6 py-3 rounded-full text-xs font-semibold border border-[#D8C6C3] text-[#313851] hover:bg-[#F4ECE6] transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      <SEO
        title="Bespoke Custom Nail Art Commissions"
        description="Commission a 1-of-1 bespoke press-on nail set designed by master artist Helina. Upload inspiration photos and specify your nail shape and measurements."
        keywords="custom press on nails, bespoke nail art, personalized press on nails, bridal custom nails india"
      />
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-medium text-[#793D39]">
          <Palette className="w-3.5 h-3.5 text-[#9C5550]" />
          <span>Bespoke Haute Couture Studio</span>
        </div>
        <h1 className="font-heading font-medium text-4xl sm:text-5xl text-[#313851]">
          Request a Custom Press-On Set
        </h1>
        <p className="text-sm sm:text-base text-[#786866] max-w-2xl mx-auto leading-relaxed">
          Have an exact nail art dream from Pinterest, a bridal moodboard, or red carpet inspiration? Our master sculptors will hand-paint and hand-sculpt your bespoke set to your exact millimeter dimensions.
        </p>
      </div>

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-md space-y-8">
        
        {/* SECTION 1: Client Details */}
        <div className="space-y-4">
          <h2 className="font-heading font-medium text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-2">
            1. Your Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1">Full Name *</label>
              <input
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#313851] mb-1">Email Address</label>
              <input
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email address"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Nail Shape & Length */}
        <div className="space-y-4">
          <h2 className="font-heading font-medium text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-2">
            2. Silhouette & Length
          </h2>
          <div>
            <label className="block text-xs font-semibold text-[#313851] mb-2">Preferred Nail Shape</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {shapes.map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => setFormData({ ...formData, shape })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    formData.shape === shape
                      ? 'bg-[#9C5550] text-[#FFFDFC] border-[#9C5550] shadow-xs'
                      : 'bg-[#F6F3ED] text-[#313851] border-[#D8C6C3] hover:border-[#9C5550]'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#313851] mb-2">Desired Nail Length</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {lengths.map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setFormData({ ...formData, length: len })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                    formData.length === len
                      ? 'bg-[#313851] text-[#FFFDFC] border-[#313851] shadow-xs'
                      : 'bg-[#F6F3ED] text-[#313851] border-[#D8C6C3] hover:border-[#9C5550]'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: Sizing Specifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-2">
            <h2 className="font-heading font-medium text-xl text-[#313851]">
              3. Nail Sizing
            </h2>
            <Link to="/size-guide" target="_blank" className="text-xs font-semibold text-[#9C5550] hover:underline flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5" />
              <span>Open Size Chart (mm)</span>
            </Link>
          </div>

          <div className="flex gap-4 text-xs font-semibold">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sizeType"
                checked={formData.sizeType === 'Preset'}
                onChange={() => setFormData({ ...formData, sizeType: 'Preset' })}
                className="accent-[#9C5550]"
              />
              <span>Use Atelier Preset (XS / S / M / L)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sizeType"
                checked={formData.sizeType === 'Custom'}
                onChange={() => setFormData({ ...formData, sizeType: 'Custom' })}
                className="accent-[#9C5550]"
              />
              <span>Enter Exact Millimeters per Finger</span>
            </label>
          </div>

          {formData.sizeType === 'Preset' ? (
            <div className="grid grid-cols-4 gap-2 max-w-md">
              {['XS', 'S', 'M', 'L'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFormData({ ...formData, presetSize: sz })}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    formData.presetSize === sz
                      ? 'bg-[#313851] text-[#FFFDFC] border-[#313851]'
                      : 'bg-[#F6F3ED] text-[#313851] border-[#D8C6C3]'
                  }`}
                >
                  Size {sz}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 max-w-lg">
              {['thumb', 'index', 'middle', 'ring', 'pinky'].map((finger) => (
                <div key={finger}>
                  <label className="block text-[11px] font-semibold text-[#786866] capitalize mb-1">{finger} (mm)</label>
                  <input
                    type="text"
                    placeholder="e.g. 15mm"
                    value={formData.customSizes[finger]}
                    onChange={(e) => setFormData({
                      ...formData,
                      customSizes: { ...formData.customSizes, [finger]: e.target.value }
                    })}
                    className="w-full px-2 py-1.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: Design Aesthetics & Moodboard Photo */}
        <div className="space-y-4">
          <h2 className="font-heading font-medium text-xl text-[#313851] border-b border-[#D8C6C3]/60 pb-2">
            4. Art Inspiration & Theme
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#313851] mb-2">Style Elements (Select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {themesList.map((th) => {
                const active = formData.themes.includes(th);
                return (
                  <button
                    key={th}
                    type="button"
                    onClick={() => handleThemeToggle(th)}
                    className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${
                      active
                        ? 'bg-[#9C5550] text-[#FFFDFC] border-[#9C5550]'
                        : 'bg-[#F6F3ED] text-[#313851] border-[#D8C6C3] hover:border-[#9C5550]'
                    }`}
                  >
                    {active ? `✓ ${th}` : th}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#313851] mb-1">Color Palette Preferences</label>
            <input
              type="text"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              placeholder="Enter preferred colors (e.g. Rose Gold, Sheer Milk Glaze)"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] placeholder-[#8B7774] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#313851] mb-1">Inspiration Brief / Special Requests</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Tell us about the occasion (wedding, shoot, birthday), any crystal placement requests, or specific textures..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C6C3] bg-[#F6F3ED] text-[#313851] focus:bg-[#FFFDFC] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
            />
          </div>

          {/* Photo Upload / Preview */}
          <div>
            <label className="block text-xs font-semibold text-[#313851] mb-1">Upload Inspiration Photo / Pinterest Screenshot</label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-[#D8C6C3] bg-[#F6F3ED]/50">
              <label className="cursor-pointer px-4 py-2 rounded-full text-xs font-semibold bg-[#FFFDFC] border border-[#313851] text-[#313851] hover:bg-[#313851] hover:text-[#FFFDFC] transition-colors flex items-center gap-1.5 shadow-2xs">
                <Camera className="w-3.5 h-3.5" />
                <span>Choose Image</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

              {formData.photoPreview ? (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-20 rounded-xl overflow-hidden border border-[#D8C6C3]">
                    <img src={formData.photoPreview} alt="Moodboard preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-[#879B83] font-medium">✓ Inspiration photo attached</span>
                </div>
              ) : (
                <span className="text-xs text-[#786866]">JPG, PNG or WEBP up to 5MB</span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing notice & Submit */}
        <div className="pt-4 border-t border-[#D8C6C3]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#786866] block">Bespoke Couture Pricing</span>
            <span className="font-heading font-semibold text-xl text-[#262D42]">From ₹1,499 per set</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-full font-medium text-sm text-[#FFFDFC] flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
            style={{
              background: 'linear-gradient(135deg, #B26661 0%, #9C5550 55%, #8A4743 100%)'
            }}
          >
            <Sparkles className="w-4 h-4 text-[#C8A46A]" />
            <span>{submitting ? 'Submitting Brief...' : 'Submit Custom Order Request'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
