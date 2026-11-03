'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Edit2, Sparkles, UtensilsCrossed } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const ItemDetailModal: React.FC = () => {
  const {
    selectedItemForDetail,
    setSelectedItemForDetail,
    isAdmin,
    setEditingItem,
    setIsItemModalOpen,
  } = usePOS();

  const [selectedSize, setSelectedSize] = useState<'500ml' | '700ml'>('500ml');
  const [imageError, setImageError] = useState(false);

  if (!selectedItemForDetail) return null;

  const item = selectedItemForDetail;
  const fallbackImage =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  const activePrice =
    item.price700ml && selectedSize === '700ml' ? item.price700ml : item.price;

  const handleEdit = () => {
    setEditingItem(item);
    setIsItemModalOpen(true);
    setSelectedItemForDetail(null);
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'food':
        return 'Food Menu';
      case 'espresso':
        return 'Espresso Menu';
      case 'boba':
        return 'Boba Tea';
      case 'matcha':
        return 'Matcha Drinks';
      case 'smoothies':
        return 'Smoothies';
      case 'juice':
        return 'Fruit Juice';
      default:
        return 'Cornfu Special';
    }
  };

  return (
    // Tapping the backdrop/side closes the modal immediately!
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedItemForDetail(null);
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col my-auto relative">
        {/* Hero Image Section */}
        <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
          <Image
            src={imageError ? fallbackImage : item.image || fallbackImage}
            alt={item.name}
            fill
            unoptimized={Boolean(item.image?.startsWith('/'))}
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
            onError={() => setImageError(true)}
            priority
          />

          {/* Close button floating on image */}
          <button
            onClick={() => setSelectedItemForDetail(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all z-10"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Pill floating on image */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 z-10">
            <span className="bg-brand text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {getCategoryName(item.category)}
            </span>
            {item.tags &&
              item.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1">
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {item.name}
              </h2>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-2xl font-black text-brand tracking-tight">
                ₦{activePrice.toLocaleString()}
              </span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                Nigerian Naira
              </span>
            </div>
          </div>

          {/* Boba Tea Size Toggle if applicable */}
          {item.price700ml && (
            <div className="mb-4 p-2 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 ml-2">Choose Size:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSize('500ml')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSize === '500ml'
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  500ml • ₦{item.price.toLocaleString()}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSize('700ml')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSize === '700ml'
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  700ml • ₦{item.price700ml.toLocaleString()}
                </button>
              </div>
            </div>
          )}

          {/* Dish Description Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <UtensilsCrossed className="w-3.5 h-3.5 text-brand" />
              <span>Description</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-auto pt-2 flex items-center justify-end">
            <button
              onClick={() => setSelectedItemForDetail(null)}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors text-center shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
