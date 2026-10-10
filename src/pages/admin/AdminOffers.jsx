import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { offerService } from '../../services/offerService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import {
  Tag,
  Plus,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  Search,
  Sparkles
} from 'lucide-react';

export default function AdminOffers() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 10,
    promo_code: '',
    min_order_value: 0,
    is_active: true
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await offerService.getOffers({ activeOnly: false });
      setOffers(data || []);
    } catch (err) {
      console.error('Failed to load offers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 10,
      promo_code: '',
      min_order_value: 0,
      is_active: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || '',
      discount_type: offer.discount_type || 'percentage',
      discount_value: offer.discount_value,
      promo_code: offer.promo_code,
      min_order_value: offer.min_order_value || 0,
      is_active: offer.is_active
    });
    setShowModal(true);
  };

  const handleToggleActive = async (offer) => {
    const updatedStatus = !offer.is_active;
    try {
      await offerService.updateOffer(offer.id, { is_active: updatedStatus });
      setOffers(offers.map(o => o.id === offer.id ? { ...o, is_active: updatedStatus } : o));
      
      await auditService.logAction({
        action: updatedStatus ? 'OFFER_ACTIVATED' : 'OFFER_DEACTIVATED',
        entityType: 'offer',
        entityId: offer.id,
        details: { promo_code: offer.promo_code, is_active: updatedStatus },
        adminUser: user
      });

      showToast(`Promo ${offer.promo_code} ${updatedStatus ? 'activated' : 'paused'}.`);
    } catch (err) {
      console.error('Error toggling offer status', err);
      showToast('Failed to update offer status.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.promo_code) {
      showToast('Please provide a title and promo code.', 'error');
      return;
    }

    try {
      if (editingOffer) {
        const updated = await offerService.updateOffer(editingOffer.id, formData);
        setOffers(offers.map(o => o.id === editingOffer.id ? { ...o, ...formData } : o));
        
        await auditService.logAction({
          action: 'OFFER_UPDATED',
          entityType: 'offer',
          entityId: editingOffer.id,
          details: formData,
          adminUser: user
        });

        showToast(`Promo ${formData.promo_code} updated successfully.`);
      } else {
        const created = await offerService.createOffer(formData);
        setOffers([created, ...offers]);

        await auditService.logAction({
          action: 'OFFER_CREATED',
          entityType: 'offer',
          entityId: created.id,
          details: formData,
          adminUser: user
        });

        showToast(`Promo code ${formData.promo_code} created.`);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save offer', err);
      showToast('Error saving offer.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const offerToDelete = offers.find(o => o.id === id);
      await offerService.deleteOffer(id);
      setOffers(offers.filter(o => o.id !== id));
      setDeleteConfirmId(null);

      await auditService.logAction({
        action: 'OFFER_DELETED',
        entityType: 'offer',
        entityId: id,
        details: { promo_code: offerToDelete?.promo_code },
        adminUser: user
      });

      showToast('Offer deleted permanently.');
    } catch (err) {
      console.error('Failed to delete offer', err);
      showToast('Error deleting offer.', 'error');
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredOffers = offers.filter(o =>
    (o.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.promo_code || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Offers & Promotional Codes">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 transition-all ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-[#262D42] text-[#FFFDFC] border-[#C8A46A]/40'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-[#C8A46A] shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDFC] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#313851]/10">
            <h3 className="font-heading text-lg font-medium text-[#313851] mb-2">
              Delete Promo Code?
            </h3>
            <p className="text-xs text-[#313851]/70 leading-relaxed mb-6">
              Are you sure you want to delete this offer? Active orders will retain their historic discounts, but customers won't be able to apply this code anymore.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#313851]/70 hover:bg-[#F6F3ED]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDFC] rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#313851]/10 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#313851]/10 mb-6">
              <div>
                <h3 className="font-heading text-xl font-medium text-[#313851]">
                  {editingOffer ? 'Edit Promotional Offer' : 'Create New Promo Code'}
                </h3>
                <p className="text-xs text-[#313851]/60">Configure customer discount vouchers</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-[#313851]/60 hover:text-[#313851] hover:bg-[#F6F3ED]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Welcome Atelier Special"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Promo Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.promo_code}
                  onChange={e => setFormData({ ...formData, promo_code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                  placeholder="WELCOME10"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs font-mono font-bold tracking-wider text-[#313851] focus:outline-none focus:border-[#C8A46A] uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={e => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A] bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                    Discount Value {formData.discount_type === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formData.discount_type === 'percentage' ? '100' : '99999'}
                    value={formData.discount_value}
                    onChange={e => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.min_order_value}
                  onChange={e => setFormData({ ...formData, min_order_value: Number(e.target.value) })}
                  placeholder="0 for no minimum"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#313851] mb-1.5">
                  Description / Customer Terms
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Valid on first handcrafted nail set order only."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#313851]/20 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="offerActive"
                  checked={formData.is_active}
                  onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#C8A46A] border-[#313851]/30 focus:ring-[#C8A46A]"
                />
                <label htmlFor="offerActive" className="text-xs font-medium text-[#313851]">
                  Make offer active and available to customers immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#313851]/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#313851]/70 hover:bg-[#F6F3ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors"
                >
                  {editingOffer ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content View */}
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#313851]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search promos or titles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFFDFC] border border-[#313851]/15 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#C8A46A]" />
            <span>Create Promo Offer</span>
          </button>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-[#313851]/60">
            Loading promotional offers...
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 p-12 text-center">
            <Tag className="w-10 h-10 text-[#C8A46A] mx-auto mb-3 opacity-60" />
            <h4 className="font-heading text-lg font-medium text-[#313851] mb-1">
              No Offers Found
            </h4>
            <p className="text-xs text-[#313851]/60 mb-5">
              Create discount vouchers and seasonal incentives for your customer checkout.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#313851] text-[#FFFDFC]"
            >
              Add First Promo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 p-5 shadow-xs flex flex-col justify-between hover:border-[#C8A46A]/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#F6F3ED] text-[#313851] border border-[#313851]/15 tracking-wider">
                      {offer.promo_code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(offer)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                        offer.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}
                    >
                      {offer.is_active ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </div>

                  <h4 className="font-heading text-base font-medium text-[#313851] mb-1">
                    {offer.title}
                  </h4>
                  <p className="text-xs text-[#313851]/60 mb-4 line-clamp-2">
                    {offer.description || 'Applicable at customer checkout.'}
                  </p>

                  <div className="p-3 rounded-xl bg-[#F6F3ED]/70 border border-[#313851]/5 space-y-1.5 text-xs text-[#313851]/80 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#313851]/60">Benefit</span>
                      <span className="font-semibold text-[#313851]">
                        {offer.discount_type === 'percentage'
                          ? `${offer.discount_value}% OFF`
                          : `₹${offer.discount_value} OFF`}
                      </span>
                    </div>
                    {offer.min_order_value > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#313851]/60">Min Order</span>
                        <span className="font-semibold text-[#313851]">
                          ₹{offer.min_order_value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#313851]/10">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(offer)}
                    className="p-2 rounded-lg text-[#313851]/60 hover:text-[#313851] hover:bg-[#F6F3ED]"
                    title="Edit offer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(offer.id)}
                    className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    title="Delete offer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
