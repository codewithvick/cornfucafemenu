'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { CategoryCards } from '../components/CategoryCards';
import { MenuCard } from '../components/MenuCard';
import { MenuBoardPoster } from '../components/MenuBoardPoster';
import { ItemDetailModal } from '../components/ItemDetailModal';
import { usePOS } from '../context/POSContext';
import { AlertCircle, LayoutGrid, FileText } from 'lucide-react';

export default function MenuPage() {
  const {
    filteredItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = usePOS();

  const [viewMode, setViewMode] = useState<'grid' | 'poster'>('grid');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 overflow-x-hidden max-w-full">
      {/* 1. Brand Top Bar (Clean Digital Menu Header) */}
      <Header />

      {/* 2. Main Content Container (Mobile Responsive, Fully Centered) */}
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-hidden">
        {/* View Mode Toggle & Subtitle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-2xl p-1 shadow-xs w-full sm:w-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Menu Grid</span>
            </button>
            <button
              onClick={() => setViewMode('poster')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'poster'
                  ? 'bg-[#132A1E] text-amber-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Menu Board</span>
            </button>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-400 font-medium text-center sm:text-right">
            {viewMode === 'grid'
              ? 'Tap any item to view culinary details'
              : 'Classic 2-column cafe board'}
          </p>
        </div>

        {/* View Mode Switching: Classic Poster vs Interactive Grid */}
        {viewMode === 'poster' ? (
          <main className="w-full">
            <MenuBoardPoster />
          </main>
        ) : (
          <>
            {/* Category Filter Tabs */}
            <CategoryCards />

            {/* Menu Items Grid */}
            <main className="w-full mt-2">
              {filteredItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-8 sm:my-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-50 text-brand flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1">No items found</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {searchQuery
                      ? `No dishes or drinks match "${searchQuery}".`
                      : 'No items in this category yet.'}
                  </p>
                  <div className="flex justify-center gap-2">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                      >
                        Clear Search
                      </button>
                    )}
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="px-4 py-2 bg-brand text-white rounded-xl text-xs font-bold hover:bg-brand-600 transition-all"
                      >
                        View All Items
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 pb-16">
                  {filteredItems.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </main>
          </>
        )}
      </div>

      {/* Footer Branding for Digital Menu */}
      <footer className="mt-auto bg-white border-t border-slate-100 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            © {new Date().getFullYear()} Cornfu Café Menu • 40 Ekenna Street, Aba
          </p>
          <div className="flex items-center gap-4 text-slate-500 font-semibold">
            <span>Dine-In</span>
            <span>•</span>
            <span>Takeout</span>
            <span>•</span>
            <span>Fresh Everyday</span>
          </div>
        </div>
      </footer>

      {/* Modal: Tap sides/backdrop to close */}
      <ItemDetailModal />
    </div>
  );
}
