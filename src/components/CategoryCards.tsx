'use client';

import React, { useRef } from 'react';
import {
  LayoutGrid,
  UtensilsCrossed,
  Coffee,
  CupSoda,
  Leaf,
  Wine,
  GlassWater,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CategoryId } from '../types';

interface CategoryItem {
  id: CategoryId;
  name: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All Menu', icon: LayoutGrid },
  { id: 'food', name: 'Food Menu', icon: UtensilsCrossed },
  { id: 'espresso', name: 'Espresso Menu', icon: Coffee },
  { id: 'boba', name: 'Boba Tea', icon: CupSoda },
  { id: 'matcha', name: 'Matcha Drinks', icon: Leaf },
  { id: 'smoothies', name: 'Smoothies', icon: Wine },
  { id: 'juice', name: 'Fruit Juice', icon: GlassWater },
];

export const CategoryCards: React.FC = () => {
  const { selectedCategory, setSelectedCategory, categoriesCount } = usePOS();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-1 sm:py-2 w-full">
      {/* Scroll controls for desktop convenience */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Menu Categories
        </h2>
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel with mobile edge bleed and proper inset */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 sm:gap-3.5 overflow-x-auto pb-2 pt-0.5 px-4 sm:px-0 -mx-4 sm:mx-0 scrollbar-none no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          const count = categoriesCount[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 select-none text-left min-w-[125px] sm:min-w-[160px] ${
                isActive
                  ? 'bg-white border-2 border-brand text-brand shadow-sm shadow-orange-500/10 ring-2 ring-orange-500/10'
                  : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-brand text-white shadow-sm shadow-brand/30'
                    : 'bg-slate-100 text-slate-500 group-hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>

              {/* Category Info */}
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-xs sm:text-sm font-bold tracking-tight truncate ${
                    isActive ? 'text-brand' : 'text-slate-800'
                  }`}
                >
                  {cat.name}
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] font-medium ${
                    isActive ? 'text-orange-500/90' : 'text-slate-400'
                  }`}
                >
                  {count} items
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

