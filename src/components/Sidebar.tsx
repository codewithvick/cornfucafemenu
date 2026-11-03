'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutGrid,
  ReceiptText,
  Clock,
  Package,
  Bluetooth,
  RotateCw,
  Lock,
  Unlock,
  Sparkles,
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const Sidebar: React.FC = () => {
  const {
    isAdmin,
    setIsAdminAuthModalOpen,
    setIsAdmin,
    isTicketOpen,
    setIsTicketOpen,
    cartCount,
    isOrderHistoryOpen,
    setIsOrderHistoryOpen,
    isInventoryModalOpen,
    setIsInventoryModalOpen,
    printerConfig,
    setIsPrinterModalOpen,
    resetDefaultMenu,
  } = usePOS();

  const handleAdminToggle = () => {
    if (isAdmin) {
      // Exit admin mode
      setIsAdmin(false);
    } else {
      // Prompt password modal
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleRefresh = () => {
    if (confirm('Do you want to reload/reset menu data to defaults?')) {
      resetDefaultMenu();
    }
  };

  return (
    <aside className="w-[78px] md:w-[84px] bg-white border-r border-slate-100 flex flex-col items-center py-4 justify-between h-screen fixed left-0 top-0 z-30 select-none shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      {/* Top Branding */}
      <div className="flex flex-col items-center gap-1">
        {/* Official Corn Fu Logo */}
        <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-13 h-13 rounded-2xl p-0.5 flex items-center justify-center transition-transform hover:scale-105">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden relative shadow-sm border border-slate-100 bg-white">
              <Image
                src="/logo.png"
                alt="Corn Fu Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black tracking-wider text-slate-800 uppercase mt-0.5">
          CORNFU
        </span>
      </div>

      {/* Navigation Icons matching screenshot */}
      <nav className="flex flex-col items-center gap-4 my-auto w-full">
        {/* Menu/Grid (Active) */}
        <div className="relative w-full flex items-center justify-center">
          {/* Active orange pill indicator on screen edge */}
          <div className="absolute left-0 w-1.5 h-8 bg-brand rounded-r-full" />
          <button
            title="Menu & POS (Active)"
            className="w-12 h-12 rounded-xl bg-orange-50 text-brand flex items-center justify-center transition-all hover:bg-orange-100 shadow-sm"
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Orders / Cart / Dollar */}
        <div className="relative w-full flex items-center justify-center">
          <button
            onClick={() => setIsTicketOpen(!isTicketOpen)}
            title="Active Ticket / Orders"
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isTicketOpen
                ? 'bg-orange-50 text-brand font-semibold ring-2 ring-orange-200'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ReceiptText className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-3 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Order History / Clock */}
        <div className="relative w-full flex items-center justify-center">
          <button
            onClick={() => setIsOrderHistoryOpen(true)}
            title="Order History & Logs"
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isOrderHistoryOpen
                ? 'bg-orange-50 text-brand font-semibold'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Inventory / Stock Box */}
        <div className="relative w-full flex items-center justify-center">
          <button
            onClick={() => setIsInventoryModalOpen(true)}
            title="Live Inventory Manager"
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isInventoryModalOpen
                ? 'bg-orange-50 text-brand font-semibold'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Package className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Bluetooth Sync with dot indicator */}
        <div className="relative w-full flex items-center justify-center">
          <button
            onClick={() => setIsPrinterModalOpen(true)}
            title={`Bluetooth POS Printer (${printerConfig.status})`}
            className="w-12 h-12 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all relative"
          >
            <Bluetooth className="w-5 h-5 stroke-[1.8]" />
            <span
              className={`absolute top-2.5 right-3.5 w-2 h-2 rounded-full ring-2 ring-white ${
                printerConfig.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </button>
        </div>

        {/* Refresh Menu Data */}
        <div className="relative w-full flex items-center justify-center">
          <button
            onClick={handleRefresh}
            title="Refresh / Sync Menu Data"
            className="w-12 h-12 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all hover:rotate-90"
          >
            <RotateCw className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Admin Lock / Unlock Toggle */}
        <div className="relative w-full flex items-center justify-center">
          <button
            onClick={handleAdminToggle}
            title={isAdmin ? 'Admin Mode (Active) - Click to Lock' : 'Unlock Admin Dashboard'}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isAdmin
                ? 'bg-emerald-50 text-emerald-600 ring-2 ring-emerald-300'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isAdmin ? (
              <Unlock className="w-5 h-5 stroke-[2] text-emerald-600" />
            ) : (
              <Lock className="w-5 h-5 stroke-[1.8]" />
            )}
          </button>
        </div>
      </nav>

      {/* Bottom Profile Avatar matching screenshot */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleAdminToggle}
          title={isAdmin ? 'Signed in as Manager (Admin Mode)' : 'Admin Login'}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
            isAdmin
              ? 'bg-gradient-to-tr from-brand to-orange-400 text-white ring-2 ring-orange-200 shadow-orange-300/50'
              : 'bg-orange-50 text-brand border border-orange-200 hover:bg-orange-100'
          }`}
        >
          {isAdmin ? <Sparkles className="w-4 h-4 text-white" /> : 'A'}
        </button>
      </div>
    </aside>
  );
};

