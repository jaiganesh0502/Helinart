import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { pageService, DEFAULT_PAGES } from '../../services/pageService';
import { faqService } from '../../services/faqService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  Send,
  Save,
  HelpCircle,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Search,
  RotateCcw,
  Check,
  Shield,
  Layers
} from 'lucide-react';

const PAGE_DEFINITIONS = [
  { slug: 'about', name: 'About the Artist & Studio', path: '/about', icon: Sparkles, category: 'Story & Brand' },
  { slug: 'faq', name: 'Frequently Asked Questions', path: '/faq', icon: HelpCircle, category: 'Customer Guidance' },
  { slug: 'contact', name: 'Contact & Concierge Desk', path: '/contact', icon: FileText, category: 'Support & Help' },
  { slug: 'shipping-returns', name: 'Shipping, Delivery & Returns', path: '/shipping-returns', icon: FileText, category: 'Policies & Legal' },
  { slug: 'privacy-policy', name: 'Privacy Policy & Data Protection', path: '/privacy-policy', icon: Shield, category: 'Policies & Legal' },
  { slug: 'terms-of-service', name: 'Terms & Conditions of Service', path: '/terms-of-service', icon: FileText, category: 'Policies & Legal' },
  { slug: 'sizing-guide', name: 'Atelier Sizing Guide & mm Chart', path: '/size-guide', icon: Layers, category: 'Customer Guidance' },
  { slug: 'how-press-ons-work', name: 'How Press-Ons Work', path: '/how-it-works', icon: Layers, category: 'Customer Guidance' },
  { slug: 'track-order', name: 'Track Order Information', path: '/track-order', icon: FileText, category: 'Support & Help' },
  { slug: 'studio-concierge', name: 'Studio Concierge Information', path: '/book', icon: Sparkles, category: 'Story & Brand' },
  { slug: 'footer', name: 'Footer Content & Branding', path: '/', icon: FileText, category: 'Global Layout' }
];

export default function AdminPages() {
  const { user } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'policies', 'guidance', 'faqs'
  const [search, setSearch] = useState('');
  
  // Editor state
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // FAQ management state
  const [faqs, setFaqs] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: '',
    category: 'Sizing & Fit',
    sort_order: 1,
    is_active: true
  });
  const [faqSaving, setFaqSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allPages, allFaqs] = await Promise.allSettled([
        pageService.getAllPages(),
        faqService.getFaqs(false)
      ]);

      if (allPages.status === 'fulfilled' && Array.isArray(allPages.value)) {
        setPages(allPages.value);
      }
      if (allFaqs.status === 'fulfilled' && Array.isArray(allFaqs.value)) {
        setFaqs(allFaqs.value);
      }
    } catch (err) {
      console.error('[CMS] Failed to load pages data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Open editor for a specific page
  const handleOpenEdit = (pageDef) => {
    const existing = pages.find(p => p.slug === pageDef.slug) || DEFAULT_PAGES[pageDef.slug] || {
      id: pageDef.slug,
      slug: pageDef.slug,
      title: pageDef.name,
      subtitle: '',
      status: 'published',
      seo_title: '',
      seo_description: '',
      content: {}
    };

    setEditingPage(pageDef);
    setFormData({
      title: existing.title || '',
      subtitle: existing.subtitle || '',
      seo_title: existing.seo_title || '',
      seo_description: existing.seo_description || '',
      content: JSON.parse(JSON.stringify(existing.content || {}))
    });
  };

  const handleContentFieldChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value
      }
    }));
  };

  const handleSaveDraft = async () => {
    if (!editingPage || !formData) return;
    setSaving(true);
    try {
      await pageService.saveDraft(editingPage.slug, formData, user);
      await auditService.logAction({
        action: 'PAGE_UPDATED',
        entityType: 'content_page',
        entityId: editingPage.slug,
        details: { status: 'draft', title: formData.title },
        adminUser: user
      });
      showToast(`Draft saved for "${editingPage.name}".`);
      await loadData();
    } catch (err) {
      alert('Failed to save draft: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!editingPage || !formData) return;
    setPublishing(true);
    try {
      await pageService.publishPage(editingPage.slug, formData, user);
      await auditService.logAction({
        action: 'PAGE_PUBLISHED',
        entityType: 'content_page',
        entityId: editingPage.slug,
        details: { status: 'published', title: formData.title },
        adminUser: user
      });
      showToast(`"${editingPage.name}" published live to storefront!`);
      await loadData();
      setEditingPage(null);
    } catch (err) {
      alert('Failed to publish page: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  // FAQ Actions
  const handleOpenFaqModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqFormData({
        question: faq.question || '',
        answer: faq.answer || '',
        category: faq.category || 'Sizing & Fit',
        sort_order: faq.sort_order || 1,
        is_active: faq.is_active !== false
      });
    } else {
      setEditingFaq('new');
      setFaqFormData({
        question: '',
        answer: '',
        category: 'Sizing & Fit',
        sort_order: (faqs.length + 1),
        is_active: true
      });
    }
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    if (!faqFormData.question.trim() || !faqFormData.answer.trim()) {
      alert('Please provide both question and answer.');
      return;
    }
    setFaqSaving(true);
    try {
      if (editingFaq && editingFaq !== 'new') {
        await faqService.updateFaq(editingFaq.id, faqFormData);
        await auditService.logAction({
          action: 'FAQ_UPDATED',
          entityType: 'faq',
          entityId: editingFaq.id,
          details: { question: faqFormData.question },
          adminUser: user
        });
        showToast('FAQ updated successfully.');
      } else {
        await faqService.createFaq(faqFormData);
        await auditService.logAction({
          action: 'FAQ_CREATED',
          entityType: 'faq',
          entityId: 'new',
          details: { question: faqFormData.question },
          adminUser: user
        });
        showToast('New FAQ created.');
      }
      setEditingFaq(null);
      await loadData();
    } catch (err) {
      alert('Failed to save FAQ: ' + err.message);
    } finally {
      setFaqSaving(false);
    }
  };

  const handleDeleteFaq = async (id, question) => {
    if (!window.confirm(`Delete question: "${question}"?`)) return;
    try {
      await faqService.deleteFaq(id);
      await auditService.logAction({
        action: 'FAQ_DELETED',
        entityType: 'faq',
        entityId: id,
        details: { question },
        adminUser: user
      });
      showToast('FAQ deleted.');
      await loadData();
    } catch (err) {
      alert('Failed to delete FAQ: ' + err.message);
    }
  };

  // Filter pages
  const filteredPages = PAGE_DEFINITIONS.filter(def => {
    if (activeTab === 'policies' && def.category !== 'Policies & Legal') return false;
    if (activeTab === 'guidance' && def.category !== 'Customer Guidance') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return def.name.toLowerCase().includes(q) || def.slug.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AdminLayout title="Pages & Policies CMS">
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8C6C3]/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl text-[#313851]">
              Informational Pages & Policies
            </h1>
            <p className="text-xs text-[#786866] mt-1">
              Manage all public customer-facing content pages, legal terms, sizing manuals, and interactive FAQs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenFaqModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-xs font-semibold text-[#793D39] hover:bg-[#EAE1DA] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New FAQ</span>
            </button>
          </div>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-[#EEF3EE] border border-[#879B83]/40 text-xs font-medium text-[#2D5A27] flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#43623E]" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-[#43623E] hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Filter & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#313851] text-[#FFFDFC]'
                  : 'bg-[#FFFDFC] text-[#786866] border border-[#D8C6C3] hover:text-[#313851]'
              }`}
            >
              All Pages ({PAGE_DEFINITIONS.length})
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'policies'
                  ? 'bg-[#313851] text-[#FFFDFC]'
                  : 'bg-[#FFFDFC] text-[#786866] border border-[#D8C6C3] hover:text-[#313851]'
              }`}
            >
              Policies & Legal
            </button>
            <button
              onClick={() => setActiveTab('guidance')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'guidance'
                  ? 'bg-[#313851] text-[#FFFDFC]'
                  : 'bg-[#FFFDFC] text-[#786866] border border-[#D8C6C3] hover:text-[#313851]'
              }`}
            >
              Customer Guidance
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === 'faqs'
                  ? 'bg-[#313851] text-[#FFFDFC]'
                  : 'bg-[#FFFDFC] text-[#786866] border border-[#D8C6C3] hover:text-[#313851]'
              }`}
            >
              FAQs Manager ({faqs.length})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-[#786866] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter pages..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs bg-[#FFFDFC] border border-[#D8C6C3] text-[#313851] placeholder-[#786866]/60 focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
            />
          </div>
        </div>

        {/* =========================================================================
            VIEW 1: FAQS ACCORDION MANAGER TAB
            ========================================================================= */}
        {activeTab === 'faqs' ? (
          <div className="bg-[#FFFDFC] rounded-3xl p-6 border border-[#D8C6C3] space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
              <div>
                <h2 className="font-heading text-lg text-[#313851]">Active FAQ Question Library</h2>
                <p className="text-xs text-[#786866]">These questions render in the customer interactive accordion at /faq</p>
              </div>
              <button
                onClick={() => handleOpenFaqModal()}
                className="px-3.5 py-2 rounded-full bg-[#9C5550] text-white text-xs font-semibold hover:bg-[#8A4743] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-[#786866]">Loading FAQs...</div>
            ) : faqs.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#786866]">No FAQs configured. Add your first question above.</div>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-2xl bg-[#F6F3ED] border border-[#D8C6C3]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5DCD5] text-[#313851] uppercase tracking-wider">
                          {faq.category}
                        </span>
                        <span className="text-[10px] text-[#786866]">Order: #{faq.sort_order || (idx + 1)}</span>
                        {faq.is_active ? (
                          <span className="text-[10px] text-[#43623E] font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#43623E]" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#786866] font-semibold">Paused</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#313851]">{faq.question}</h4>
                      <p className="text-xs text-[#786866] line-clamp-2">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenFaqModal(faq)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#313851] bg-[#FFFDFC] border border-[#D8C6C3] hover:text-[#9C5550] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id, faq.question)}
                        className="p-1.5 rounded-lg text-[#B24A45] hover:bg-[#FDF2F1] transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
              VIEW 2: CONTENT PAGES LIST
              ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((def) => {
              const Icon = def.icon;
              const pageData = pages.find(p => p.slug === def.slug) || DEFAULT_PAGES[def.slug] || {};
              const isPublished = pageData.status === 'published';
              const lastUpdated = pageData.updated_at
                ? new Date(pageData.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                : 'Default Seed';

              return (
                <div
                  key={def.slug}
                  className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#D8C6C3] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#9C5550]/60 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-[#F4ECE6] text-[#9C5550] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-2">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#EEF3EE] text-[#43623E] border border-[#879B83]/30">
                            <CheckCircle className="w-3 h-3 text-[#43623E]" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FFF8E7] text-[#8A6D3B] border border-[#E0CF9B]">
                            <Clock className="w-3 h-3 text-[#8A6D3B]" />
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#786866] uppercase tracking-wider block">
                        {def.category}
                      </span>
                      <h3 className="font-heading text-lg font-medium text-[#313851] mt-0.5">
                        {def.name}
                      </h3>
                      <p className="text-xs text-[#786866] line-clamp-2 mt-1">
                        {pageData.subtitle || pageData.title || 'Informational page content'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D8C6C3]/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#786866]">Updated: {lastUpdated}</span>

                    <div className="flex items-center gap-2">
                      <a
                        href={def.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[#786866] hover:text-[#313851] hover:bg-[#F6F3ED] transition-colors"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(def)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9C5550] text-[#FFFDFC] text-xs font-semibold hover:bg-[#8A4743] transition-colors shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Page</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            EDITOR MODAL / PANE
            ========================================================================= */}
        {editingPage && formData && (
          <div className="fixed inset-0 z-50 bg-[#262D42]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#FFFDFC] rounded-3xl border border-[#D8C6C3] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#D8C6C3]/80 flex items-center justify-between bg-[#F6F3ED]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl text-[#313851]">{editingPage.name}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E5DCD5] text-[#313851]">
                      slug: {editingPage.slug}
                    </span>
                  </div>
                  <p className="text-xs text-[#786866] mt-0.5">Edit structured fields. Save as draft or publish live directly to Supabase.</p>
                </div>

                <button
                  onClick={() => setEditingPage(null)}
                  className="p-1.5 rounded-full text-[#786866] hover:text-[#313851] hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Basic Meta Fields */}
                <div className="space-y-4 p-4 rounded-2xl bg-[#F6F3ED]/50 border border-[#D8C6C3]/60">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#793D39]">Headline & Presentation</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block font-semibold text-[#313851] mb-1">Page Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D8C6C3] text-xs text-[#313851] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#313851] mb-1">Subtitle / Eyebrow Text</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D8C6C3] text-xs text-[#313851] focus:outline-none focus:ring-1 focus:ring-[#9C5550]"
                      />
                    </div>
                  </div>
                </div>

                {/* Page Specific Structured Fields */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#793D39]">Page Structured Content</h3>

                  {editingPage.slug === 'about' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Introductory Statement</label>
                        <textarea
                          rows={3}
                          value={formData.content?.intro || ''}
                          onChange={(e) => handleContentFieldChange('intro', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs focus:ring-1 focus:ring-[#9C5550]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Brand Story & Philosophy</label>
                        <textarea
                          rows={4}
                          value={formData.content?.brand_story || ''}
                          onChange={(e) => handleContentFieldChange('brand_story', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs focus:ring-1 focus:ring-[#9C5550]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Studio Craftsmanship Guarantee</label>
                        <textarea
                          rows={3}
                          value={formData.content?.craftsmanship || ''}
                          onChange={(e) => handleContentFieldChange('craftsmanship', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs focus:ring-1 focus:ring-[#9C5550]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Artist / Founder Name</label>
                          <input
                            type="text"
                            value={formData.content?.artist_name || ''}
                            onChange={(e) => handleContentFieldChange('artist_name', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Artist Title</label>
                          <input
                            type="text"
                            value={formData.content?.artist_title || ''}
                            onChange={(e) => handleContentFieldChange('artist_title', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {editingPage.slug === 'contact' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Support Message</label>
                        <textarea
                          rows={3}
                          value={formData.content?.support_message || ''}
                          onChange={(e) => handleContentFieldChange('support_message', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Response Time Text</label>
                          <input
                            type="text"
                            value={formData.content?.response_time_text || ''}
                            onChange={(e) => handleContentFieldChange('response_time_text', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Concierge Operating Hours</label>
                          <input
                            type="text"
                            value={formData.content?.business_hours || ''}
                            onChange={(e) => handleContentFieldChange('business_hours', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {editingPage.slug === 'shipping-returns' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Shipping Overview</label>
                        <textarea
                          rows={2}
                          value={formData.content?.overview || ''}
                          onChange={(e) => handleContentFieldChange('overview', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Expected Transit Time</label>
                          <input
                            type="text"
                            value={formData.content?.expected_delivery_time || ''}
                            onChange={(e) => handleContentFieldChange('expected_delivery_time', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Free Shipping Threshold (₹)</label>
                          <input
                            type="number"
                            value={formData.content?.free_shipping_threshold || 999}
                            onChange={(e) => handleContentFieldChange('free_shipping_threshold', Number(e.target.value))}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Hygiene Seal & Return Eligibility</label>
                        <textarea
                          rows={3}
                          value={formData.content?.returns_eligibility || ''}
                          onChange={(e) => handleContentFieldChange('returns_eligibility', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Damaged in Transit Protocol</label>
                        <textarea
                          rows={2}
                          value={formData.content?.damaged_product_process || ''}
                          onChange={(e) => handleContentFieldChange('damaged_product_process', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {editingPage.slug === 'privacy-policy' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Last Updated Tagline</label>
                        <input
                          type="text"
                          value={formData.content?.last_updated || 'October 2026'}
                          onChange={(e) => handleContentFieldChange('last_updated', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">1. Introduction</label>
                        <textarea
                          rows={3}
                          value={formData.content?.introduction || ''}
                          onChange={(e) => handleContentFieldChange('introduction', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">2. Information We Collect</label>
                        <textarea
                          rows={3}
                          value={formData.content?.collected_info || ''}
                          onChange={(e) => handleContentFieldChange('collected_info', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">3. Payment Data Security</label>
                        <textarea
                          rows={2}
                          value={formData.content?.payment_security || ''}
                          onChange={(e) => handleContentFieldChange('payment_security', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {editingPage.slug === 'terms-of-service' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Last Updated Tagline</label>
                        <input
                          type="text"
                          value={formData.content?.last_updated || 'October 2026'}
                          onChange={(e) => handleContentFieldChange('last_updated', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">1. General Overview</label>
                        <textarea
                          rows={3}
                          value={formData.content?.general_overview || ''}
                          onChange={(e) => handleContentFieldChange('general_overview', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">2. Handcrafted Product Variance</label>
                        <textarea
                          rows={3}
                          value={formData.content?.handcrafted_variance || ''}
                          onChange={(e) => handleContentFieldChange('handcrafted_variance', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">3. In-Studio Booking & Deposit Terms</label>
                        <textarea
                          rows={3}
                          value={formData.content?.booking_terms || ''}
                          onChange={(e) => handleContentFieldChange('booking_terms', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {editingPage.slug === 'sizing-guide' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Sizing Instructions Introduction</label>
                        <textarea
                          rows={3}
                          value={formData.content?.instructions || ''}
                          onChange={(e) => handleContentFieldChange('instructions', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Sizing Tips</label>
                        <textarea
                          rows={2}
                          value={formData.content?.tips || ''}
                          onChange={(e) => handleContentFieldChange('tips', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Custom Sizing Information</label>
                        <textarea
                          rows={2}
                          value={formData.content?.custom_sizing_info || ''}
                          onChange={(e) => handleContentFieldChange('custom_sizing_info', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {editingPage.slug === 'footer' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Brand Mission Blurb</label>
                        <textarea
                          rows={3}
                          value={formData.content?.brand_mission || ''}
                          onChange={(e) => handleContentFieldChange('brand_mission', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Concierge Heading</label>
                          <input
                            type="text"
                            value={formData.content?.concierge_heading || 'Studio Concierge'}
                            onChange={(e) => handleContentFieldChange('concierge_heading', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Business Hours</label>
                          <input
                            type="text"
                            value={formData.content?.business_hours || 'Mon – Sun: 10:00 AM – 7:00 PM'}
                            onChange={(e) => handleContentFieldChange('business_hours', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Newsletter Title</label>
                          <input
                            type="text"
                            value={formData.content?.newsletter_heading || 'The Atelier Gazette'}
                            onChange={(e) => handleContentFieldChange('newsletter_heading', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#313851] mb-1">Copyright Line</label>
                          <input
                            type="text"
                            value={formData.content?.copyright_text || ''}
                            onChange={(e) => handleContentFieldChange('copyright_text', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {editingPage.slug === 'studio-concierge' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Opening Soon Statement</label>
                        <textarea
                          rows={3}
                          value={formData.content?.opening_soon_message || ''}
                          onChange={(e) => handleContentFieldChange('opening_soon_message', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Booking Information Description</label>
                        <textarea
                          rows={3}
                          value={formData.content?.booking_information || ''}
                          onChange={(e) => handleContentFieldChange('booking_information', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {editingPage.slug === 'track-order' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Tracking Instructions</label>
                        <textarea
                          rows={3}
                          value={formData.content?.instructions || ''}
                          onChange={(e) => handleContentFieldChange('instructions', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#313851] mb-1">Courier Transit Guarantee</label>
                        <textarea
                          rows={2}
                          value={formData.content?.courier_info || ''}
                          onChange={(e) => handleContentFieldChange('courier_info', e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FFFDFC] border border-[#D8C6C3] text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Fallback JSON view for complex structured items */}
                  {['how-press-ons-work'].includes(editingPage.slug) && (
                    <div>
                      <p className="text-xs text-[#786866] mb-2">Step data is structured in JSON for sequence and icon mappings:</p>
                      <textarea
                        rows={6}
                        value={JSON.stringify(formData.content?.steps || [], null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleContentFieldChange('steps', parsed);
                          } catch (err) {}
                        }}
                        className="w-full font-mono text-[11px] p-3 rounded-xl bg-[#F6F3ED] border border-[#D8C6C3] text-[#313851]"
                      />
                    </div>
                  )}
                </div>

                {/* SEO Optimization */}
                <div className="p-4 rounded-2xl bg-[#F6F3ED]/40 border border-[#D8C6C3]/60 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#793D39]">Search Engine Meta (SEO)</h3>
                  <div>
                    <label className="block font-semibold text-[#313851] mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D8C6C3] text-xs text-[#313851]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#313851] mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={formData.seo_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D8C6C3] text-xs text-[#313851]"
                    />
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 border-t border-[#D8C6C3]/80 bg-[#F6F3ED] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#D8C6C3] text-xs font-semibold text-[#313851] hover:bg-[#EAE1DA] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Page</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={saving || publishing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#D8C6C3] text-xs font-semibold text-[#786866] hover:text-[#313851] hover:bg-[#EAE1DA] transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving Draft...' : 'Save Draft'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={saving || publishing}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#9C5550] text-white text-xs font-semibold hover:bg-[#8A4743] transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{publishing ? 'Publishing...' : 'Publish Live'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            PREVIEW MODAL
            ========================================================================= */}
        {previewModalOpen && formData && editingPage && (
          <div className="fixed inset-0 z-60 bg-[#262D42]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#F6F3ED] rounded-3xl border border-[#D8C6C3] max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 bg-[#FFFDFC] border-b border-[#D8C6C3] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#313851]">Customer Preview: {editingPage.name}</span>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="px-3 py-1 rounded-full bg-[#F4ECE6] text-[#793D39] font-medium"
                >
                  Close Preview
                </button>
              </div>

              <div className="p-8 sm:p-12 overflow-y-auto max-w-3xl mx-auto space-y-8 text-xs text-[#453A3C] leading-relaxed">
                <div className="text-center space-y-3">
                  {formData.subtitle && (
                    <span className="inline-block px-3 py-1 rounded-full bg-[#F4ECE6] border border-[#D8C6C3] text-[11px] font-medium text-[#793D39]">
                      {formData.subtitle}
                    </span>
                  )}
                  <h1 className="font-heading text-3xl sm:text-4xl text-[#313851]">
                    {formData.title}
                  </h1>
                </div>

                <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-8 border border-[#D8C6C3] space-y-6">
                  {Object.entries(formData.content || {}).map(([key, val]) => {
                    if (typeof val === 'string' && val.length > 0) {
                      return (
                        <div key={key} className="space-y-1">
                          <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#9C5550]">
                            {key.replace(/_/g, ' ')}
                          </h4>
                          <p className="text-xs text-[#313851] leading-relaxed whitespace-pre-line">{val}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            FAQ CREATE / EDIT MODAL
            ========================================================================= */}
        {editingFaq && (
          <div className="fixed inset-0 z-50 bg-[#262D42]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFDFC] rounded-3xl border border-[#D8C6C3] max-w-lg w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#D8C6C3]/60 pb-3">
                <h3 className="font-heading text-lg text-[#313851]">
                  {editingFaq === 'new' ? 'Add New Question' : 'Edit FAQ Question'}
                </h3>
                <button onClick={() => setEditingFaq(null)} className="text-[#786866] hover:text-[#313851]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#313851] mb-1">Question *</label>
                  <input
                    type="text"
                    required
                    value={faqFormData.question}
                    onChange={(e) => setFaqFormData(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="e.g. How long do press-ons last?"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D8C6C3] text-xs text-[#313851] focus:ring-1 focus:ring-[#9C5550]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#313851] mb-1">Answer *</label>
                  <textarea
                    rows={4}
                    required
                    value={faqFormData.answer}
                    onChange={(e) => setFaqFormData(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Comprehensive answer explaining techniques, care, or timing..."
                    className="w-full p-3 rounded-xl bg-white border border-[#D8C6C3] text-xs text-[#313851] focus:ring-1 focus:ring-[#9C5550]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#313851] mb-1">Category</label>
                    <select
                      value={faqFormData.category}
                      onChange={(e) => setFaqFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D8C6C3] text-xs text-[#313851]"
                    >
                      <option value="Sizing & Fit">Sizing & Fit</option>
                      <option value="Application & Hold">Application & Hold</option>
                      <option value="Reusability & Care">Reusability & Care</option>
                      <option value="Shipping & Delivery">Shipping & Delivery</option>
                      <option value="Studio Bookings">Studio Bookings</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#313851] mb-1">Display Sort Order</label>
                    <input
                      type="number"
                      value={faqFormData.sort_order}
                      onChange={(e) => setFaqFormData(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D8C6C3] text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="faq-active"
                    checked={faqFormData.is_active}
                    onChange={(e) => setFaqFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded text-[#9C5550]"
                  />
                  <label htmlFor="faq-active" className="text-xs text-[#313851] select-none">
                    Active & visible to customers in interactive FAQ
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8C6C3]/60">
                  <button
                    type="button"
                    onClick={() => setEditingFaq(null)}
                    className="px-4 py-2 rounded-full bg-[#F6F3ED] text-xs font-semibold text-[#786866]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={faqSaving}
                    className="px-5 py-2 rounded-full bg-[#9C5550] text-white text-xs font-semibold hover:bg-[#8A4743] transition-colors"
                  >
                    {faqSaving ? 'Saving...' : 'Save Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
