'use client';

import React from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Apple,
  Coffee,
  Leaf,
  UtensilsCrossed,
  CupSoda,
  Wine,
  GlassWater,
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { MenuItem } from '../types';

export const MenuBoardPoster: React.FC = () => {
  const { menuItems, setSelectedItemForDetail } = usePOS();

  const foodItems = menuItems.filter((i) => i.category === 'food');
  const espressoItems = menuItems.filter((i) => i.category === 'espresso');
  const bobaItems = menuItems.filter((i) => i.category === 'boba');
  const matchaItems = menuItems.filter((i) => i.category === 'matcha');
  const smoothieItems = menuItems.filter((i) => i.category === 'smoothies');
  const juiceItems = menuItems.filter((i) => i.category === 'juice');

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/80 my-4 text-slate-800">
      {/* 1. Header (Matching Cornfu Poster) */}
      <header className="relative bg-[#132A1E] text-white px-6 py-6 sm:px-10 sm:py-8 overflow-hidden">
        {/* Subtle decorative leaf pattern overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#34D399_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Slogan */}
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-1 shadow-lg flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Cornfu Cafe Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase">
                  CORN FU <span className="text-amber-400">CAFÉ MENU</span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium tracking-wide mt-1">
                Great Food • Fresh Drinks • Everyday Joy
              </p>
            </div>
          </div>

          {/* Quality Badges matching the physical poster */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-emerald-800/80 border border-emerald-500/30 flex items-center justify-center text-amber-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">
                Quality<br />Ingredients
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-emerald-800/80 border border-emerald-500/30 flex items-center justify-center text-amber-400 mb-1">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">
                Great<br />Taste
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-emerald-800/80 border border-emerald-500/30 flex items-center justify-center text-amber-400 mb-1">
                <Apple className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">
                Healthy<br />Choices
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Menu Content: 2-Column Split matching the poster */}
      <div className="p-3.5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Food Menu + Espresso Menu (lg:col-span-7) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          {/* Section: FOOD MENU */}
          <div>
            <div className="inline-block bg-[#F59E0B] text-slate-900 font-black text-base sm:text-xl uppercase px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-xl shadow-xs tracking-wide mb-3 sm:mb-4">
              FOOD MENU
            </div>

            {/* Food Grid: 2 columns of rich cards with photo and price badge */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {foodItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemForDetail(item)}
                  className="group bg-slate-50 hover:bg-orange-50/40 border border-slate-200/80 hover:border-orange-200 rounded-2xl p-2.5 sm:p-3 transition-all cursor-pointer flex flex-col justify-between shadow-xs"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 mb-2 sm:mb-2.5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized={Boolean(item.image?.startsWith('/'))}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      {item.tags?.[0] || 'Cornfu Special'}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-brand transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Price:</span>
                    <span className="bg-[#1F2937] text-white text-[11px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: ESPRESSO MENU */}
          <div className="pt-2">
            <div className="inline-block bg-[#2E3830] text-amber-300 font-black text-base sm:text-lg uppercase px-4 py-1.5 rounded-xl shadow-xs tracking-wide mb-4 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>ESPRESSO MENU</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 divide-y divide-slate-200/70">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pb-2">
                {espressoItems.map((esp) => (
                  <div
                    key={esp.id}
                    onClick={() => setSelectedItemForDetail(esp)}
                    className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-white rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {esp.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-brand flex-shrink-0">
                      ₦{esp.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Boba, Matcha, Smoothies, Juice (lg:col-span-5) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section: BOBA TEA (500ml | 700ml table) */}
          <div>
            <div className="bg-[#1B3E2B] text-emerald-200 font-black text-sm uppercase px-3 py-1.5 rounded-xl flex items-center justify-between mb-3 shadow-xs">
              <div className="flex items-center gap-1.5">
                <CupSoda className="w-4 h-4 text-emerald-400" />
                <span>BOBA TEA</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-emerald-100">
                <span>500ml</span>
                <span>700ml</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 divide-y divide-slate-200/70 space-y-1">
              {bobaItems.map((boba) => (
                <div
                  key={boba.id}
                  onClick={() => setSelectedItemForDetail(boba)}
                  className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-white rounded-lg px-2 -mx-1 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800 truncate mr-2">
                    {boba.name}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-black text-slate-900 flex-shrink-0">
                    <span className="text-brand">₦{boba.price.toLocaleString()}</span>
                    <span className="text-slate-700">₦{boba.price700ml?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: MATCHA DRINKS */}
          <div>
            <div className="bg-[#2D4A22] text-lime-200 font-black text-sm uppercase px-3 py-1.5 rounded-xl flex items-center gap-1.5 mb-3 shadow-xs">
              <Leaf className="w-4 h-4 text-lime-400" />
              <span>MATCHA DRINKS</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1 divide-y divide-slate-200/70">
              {matchaItems.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => setSelectedItemForDetail(mat)}
                  className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-white rounded-lg px-2 -mx-1 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800 truncate mr-2">
                    {mat.name}
                  </span>
                  <span className="text-xs font-black text-brand flex-shrink-0">
                    ₦{mat.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: SMOOTHIES */}
          <div>
            <div className="bg-[#D97706] text-amber-50 font-black text-sm uppercase px-3 py-1.5 rounded-xl flex items-center gap-1.5 mb-3 shadow-xs">
              <Wine className="w-4 h-4 text-white" />
              <span>SMOOTHIES</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1 divide-y divide-slate-200/70">
              {smoothieItems.map((smo) => (
                <div
                  key={smo.id}
                  onClick={() => setSelectedItemForDetail(smo)}
                  className="py-1.5 first:pt-0 cursor-pointer hover:bg-white rounded-lg p-1.5 -mx-1 transition-colors flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800">{smo.name}</span>
                  <span className="text-xs font-black text-brand">
                    ₦{smo.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: FRUIT JUICE */}
          <div>
            <div className="bg-[#1A4329] text-emerald-200 font-black text-sm uppercase px-3 py-1.5 rounded-xl flex items-center gap-1.5 mb-3 shadow-xs">
              <GlassWater className="w-4 h-4 text-emerald-400" />
              <span>FRUIT JUICE</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1 divide-y divide-slate-200/70">
              {juiceItems.map((juc) => (
                <div
                  key={juc.id}
                  onClick={() => setSelectedItemForDetail(juc)}
                  className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-white rounded-lg px-2 -mx-1 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800">
                    {juc.name}
                  </span>
                  <span className="text-xs font-black text-brand flex-shrink-0">
                    ₦{juc.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Banner (Matching physical poster) */}
      <footer className="bg-[#132A1E] text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-emerald-900/60">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-amber-300 font-bold text-sm">
            Fresh, Tasty & Healthy
          </span>
          <span className="text-emerald-400">•</span>
          <span className="text-emerald-200 text-xs font-medium">
            Always a Good Idea
          </span>
        </div>

        <div className="text-[11px] text-emerald-300/80 font-medium">
          Cornfu Café • 40 Ekenna Street, Aba • Dine-In & Takeout
        </div>
      </footer>
    </div>
  );
};

