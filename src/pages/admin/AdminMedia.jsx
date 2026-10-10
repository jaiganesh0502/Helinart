import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { productService } from '../../services/productService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import {
  FolderArchive,
  Upload,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Folder
} from 'lucide-react';

const FOLDERS = ['all', 'products', 'lookbook', 'homepage', 'offers', 'studio'];

const INITIAL_MEDIA = [
  {
    id: 'med-logo',
    name: 'helinart-logo.png',
    folder: 'homepage',
    url: '/helinart-logo.png',
    size: '180 KB',
    created_at: new Date().toISOString()
  },
  {
    id: 'med-p1',
    name: 'design-sakura-chrome.jpg',
    folder: 'products',
    url: '/images/design-sakura-chrome.jpg',
    size: '420 KB',
    created_at: new Date().toISOString()
  },
  {
    id: 'med-p2',
    name: 'design-french-pearl.jpg',
    folder: 'products',
    url: '/images/design-french-pearl.jpg',
    size: '390 KB',
    created_at: new Date().toISOString()
  },
  {
    id: 'med-p3',
    name: 'design-celestial-velvet.jpg',
    folder: 'products',
    url: '/images/design-celestial-velvet.jpg',
    size: '450 KB',
    created_at: new Date().toISOString()
  },
  {
    id: 'med-p4',
    name: 'design-emerald-aura.jpg',
    folder: 'products',
    url: '/images/design-emerald-aura.jpg',
    size: '410 KB',
    created_at: new Date().toISOString()
  },
  {
    id: 'med-p5',
    name: 'design-glazed-doughnut.jpg',
    folder: 'products',
    url: '/images/design-glazed-doughnut.jpg',
    size: '380 KB',
    created_at: new Date().toISOString()
  },
  {
    id: 'med-p6',
    name: 'design-noir-stiletto.jpg',
    folder: 'products',
    url: '/images/design-noir-stiletto.jpg',
    size: '440 KB',
    created_at: new Date().toISOString()
  },
  {
    id: 'med-p7',
    name: 'design-vintage-rose.jpg',
    folder: 'lookbook',
    url: '/images/design-vintage-rose.jpg',
    size: '400 KB',
    created_at: new Date().toISOString()
  },
  {
    id: 'med-p8',
    name: 'design-golden-hour.jpg',
    folder: 'lookbook',
    url: '/images/design-golden-hour.jpg',
    size: '430 KB',
    created_at: new Date().toISOString()
  }
];

const LOCAL_MEDIA_KEY = 'helinart_admin_media_v1';

export default function AdminMedia() {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [search, setSearch] = useState('');
  const [uploadFolder, setUploadFolder] = useState('products');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = () => {
    try {
      const stored = localStorage.getItem(LOCAL_MEDIA_KEY);
      if (stored) {
        setMediaItems(JSON.parse(stored));
      } else {
        setMediaItems(INITIAL_MEDIA);
        localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(INITIAL_MEDIA));
      }
    } catch (e) {
      setMediaItems(INITIAL_MEDIA);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await productService.uploadImage(file, uploadFolder);
      const newMedia = {
        id: 'med-' + Date.now(),
        name: file.name,
        folder: uploadFolder,
        url: publicUrl,
        size: `${Math.round(file.size / 1024)} KB`,
        created_at: new Date().toISOString()
      };

      const updated = [newMedia, ...mediaItems];
      setMediaItems(updated);
      localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(updated));

      await auditService.logAction({
        action: 'MEDIA_UPLOADED',
        entityType: 'media',
        entityId: newMedia.id,
        details: { folder: uploadFolder, name: file.name },
        adminUser: user
      });

      showToast(`Image "${file.name}" uploaded to ${uploadFolder}/`);
    } catch (err) {
      console.error('Upload failed', err);
      showToast('Image upload failed.', 'error');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleCopyUrl = (item) => {
    const absoluteUrl = item.url.startsWith('http')
      ? item.url
      : window.location.origin + item.url;

    navigator.clipboard.writeText(absoluteUrl);
    setCopiedId(item.id);
    showToast('Image URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id) => {
    const updated = mediaItems.filter(m => m.id !== id);
    setMediaItems(updated);
    localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(updated));
    setDeleteConfirmId(null);

    await auditService.logAction({
      action: 'MEDIA_DELETED',
      entityType: 'media',
      entityId: id,
      adminUser: user
    });

    showToast('Media asset removed.');
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredMedia = mediaItems.filter(item => {
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <AdminLayout title="Media Manager & Supabase Storage">
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
              Remove Media File?
            </h3>
            <p className="text-xs text-[#313851]/70 leading-relaxed mb-6">
              Are you sure? If this image is currently linked to any product or lookbook slide, ensure you update that reference.
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Upload & Control Header */}
        <div className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 p-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-xl font-medium text-[#313851] mb-1 flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-[#C8A46A]" />
              Brand Media Assets
            </h3>
            <p className="text-xs text-[#313851]/60">
              Manage product imagery, Lookbook editorials, and campaign creatives stored in Supabase.
            </p>
          </div>

          {/* Quick Uploader */}
          <div className="flex items-center gap-3">
            <select
              value={uploadFolder}
              onChange={e => setUploadFolder(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#313851]/20 text-xs text-[#313851] bg-[#F6F3ED] focus:outline-none focus:border-[#C8A46A]"
            >
              <option value="products">Folder: products/</option>
              <option value="lookbook">Folder: lookbook/</option>
              <option value="homepage">Folder: homepage/</option>
              <option value="offers">Folder: offers/</option>
              <option value="studio">Folder: studio/</option>
            </select>

            <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold bg-[#313851] text-[#FFFDFC] hover:bg-[#262D42] transition-colors flex items-center gap-2 shadow-xs shrink-0">
              <Upload className="w-4 h-4 text-[#C8A46A]" />
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Folder Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {FOLDERS.map((folder) => (
              <button
                key={folder}
                type="button"
                onClick={() => setSelectedFolder(folder)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  selectedFolder === folder
                    ? 'bg-[#313851] text-[#C8A46A] shadow-xs'
                    : 'bg-[#FFFDFC] text-[#313851]/70 hover:bg-[#F6F3ED] border border-[#313851]/10'
                }`}
              >
                {folder === 'all' ? 'All Folders' : `${folder}/`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xs">
            <Search className="w-4 h-4 text-[#313851]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by filename..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFFDFC] border border-[#313851]/15 text-xs text-[#313851] focus:outline-none focus:border-[#C8A46A]"
            />
          </div>
        </div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 p-12 text-center">
            <ImageIcon className="w-10 h-10 text-[#C8A46A] mx-auto mb-3 opacity-60" />
            <h4 className="font-heading text-lg font-medium text-[#313851] mb-1">
              No Media In This Folder
            </h4>
            <p className="text-xs text-[#313851]/60">
              Upload an image to start populating this folder.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFFDFC] rounded-2xl border border-[#313851]/10 overflow-hidden shadow-xs group hover:border-[#C8A46A]/50 transition-all flex flex-col justify-between"
              >
                {/* Image Preview Box */}
                <div className="relative aspect-square bg-[#F6F3ED] overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/helinart-logo.png';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#262D42]/80 backdrop-blur-xs text-[#FFFDFC]">
                    {item.folder}
                  </span>
                </div>

                {/* Info & Action Bar */}
                <div className="p-3">
                  <p className="text-xs font-medium text-[#313851] truncate mb-1" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-[#313851]/50 mb-3">
                    {item.size || 'Web Asset'}
                  </p>

                  <div className="flex items-center justify-between gap-1 pt-2 border-t border-[#313851]/10">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item)}
                      className="flex-1 py-1 px-2 rounded-lg text-[11px] font-medium bg-[#F6F3ED] text-[#313851] hover:bg-[#313851] hover:text-[#FFFDFC] transition-colors flex items-center justify-center gap-1.5"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#C8A46A]" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
