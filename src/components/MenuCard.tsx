'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Edit2, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';
import { usePOS } from '../context/POSContext';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const {
    isAdmin,
    setEditingItem,
    setIsItemModalOpen,
    setSelectedItemForDetail,
  } = usePOS();

  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  const handleOpenDetail = () => {
    setSelectedItemForDetail(item);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="group relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-100 hover:border-orange-200/90 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 active:scale-[0.99] shadow-xs"
    >
      {/* Top Image Preview */}
      <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 mb-2.5 sm:mb-3 shadow-inner">
        <Image
          src={imageError ? fallbackImage : item.image || fallbackImage}
          alt={item.name}
          fill
          unoptimized={Boolean(item.image?.startsWith('/'))}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          priority={false}
        />

        {/* Dietary / Special Tag */}
        {item.tags && item.tags.length > 0 && (
          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
            {item.tags[0]}
          </span>
        )}
      </div>

      {/* Middle Content: Title and Clean Description */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-xs sm:text-base font-bold text-slate-900 leading-snug group-hover:text-brand transition-colors mb-1 line-clamp-1">
          {item.name}
        </h3>

        {/* Pure Culinary Description */}
        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2 sm:mb-3 flex-grow font-normal">
          {item.description}
        </p>
      </div>

      {/* Bottom Row: Bold Price in Nigerian Naira (₦) */}
      <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between mt-auto">
        {item.price700ml ? (
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <div>
              <span className="text-xs sm:text-base font-black text-brand tracking-tight">
                ₦{item.price.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase ml-0.5">500ml</span>
            </div>
            <span className="text-slate-300 text-[10px]">•</span>
            <div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-600">
                ₦{item.price700ml.toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase ml-0.5">700ml</span>
            </div>
          </div>
        ) : (
          <span className="text-xs sm:text-base font-black text-brand tracking-tight">
            ₦{item.price.toLocaleString()}
          </span>
        )}

        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 group-hover:text-brand transition-colors">
          Details →
        </span>
      </div>
    </div>
  );
};
