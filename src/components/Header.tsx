'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = usePOS();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-3.5 sm:px-8 py-2.5 sm:py-3.5 border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3.5">
        {/* Left: Brand Identity with Official Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 self-start md:self-auto group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Corn Fu Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-slate-900 uppercase">
                CORN FU <span className="text-brand">CAFÉ MENU</span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-tight">
              40 Ekenna Street, Aba • Everyday Joy
            </p>
          </div>
        </Link>

        {/* Center / Right: Search Bar */}
        <div className="relative w-full md:w-96 lg:w-[480px]">
          <Search className="absolute left-3.5 top-2.5 sm:top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu (shawarma, wings, boba, smoothies...)"
            className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-10 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 sm:top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
