'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { AdminItemModal } from '../../components/AdminItemModal';
import { CategoryId } from '../../types';

export default function AdminPage() {
  const {
    menuItems,
    isAdmin,
    setIsAdmin,
    setEditingItem,
    setIsItemModalOpen,
    deleteMenuItem,
    toggleItemAvailability,
    resetDefaultMenu,
  } = usePOS();

  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === '1234' || pin.toLowerCase() === 'cornfu' || pin === '') {
      setIsAdmin(true);
      setPin('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleQuickKey = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin === '1234') {
        setTimeout(() => {
          setIsAdmin(true);
          setPin('');
          setPinError(false);
        }, 200);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const filtered = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(adminSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // 1. Password Protected Login Screen if not authenticated
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-slate-800">
        <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl border border-slate-100 overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
          {/* Logo & Brand */}
          <div className="relative w-16 h-16 mx-auto mb-3 bg-white rounded-2xl p-1 border border-slate-100 shadow-sm">
            <Image
              src="/logo.png"
              alt="Corn Fu Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Cornfu Café Admin
          </h2>
          <p className="text-xs text-slate-400 mb-6 mt-0.5">
            Enter manager PIN to manage menu dishes, prices, and descriptions.
          </p>

          {/* PIN Indicator Dots */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                  pin.length > idx
                    ? 'bg-brand scale-110 shadow-sm shadow-brand/40'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {pinError && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold mb-4 bg-red-50 py-1.5 px-3 rounded-xl">
              <AlertCircle className="w-4 h-4" />
              <span>Incorrect PIN. Try 1234 or tap Quick Unlock.</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 mb-5 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleQuickKey(digit)}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-orange-100 active:text-brand text-slate-800 text-lg font-bold transition-all shadow-xs"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold transition-all"
            >
              Del
            </button>
            <button
              type="button"
              onClick={() => handleQuickKey('0')}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-orange-100 active:text-brand text-slate-800 text-lg font-bold transition-all shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleUnlock()}
              className="h-12 rounded-2xl bg-brand hover:bg-brand-600 text-white text-xs font-bold transition-all flex items-center justify-center shadow-md shadow-brand/20"
            >
              Enter
            </button>
          </div>

          {/* Quick Demo Unlock */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setPin('1234');
                setIsAdmin(true);
              }}
              className="text-xs font-semibold text-brand hover:text-brand-dark flex items-center justify-center gap-1.5 mx-auto py-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Unlock (Demo PIN: 1234)</span>
            </button>

            <Link
              href="/"
              className="text-xs font-medium text-slate-400 hover:text-slate-600 pt-1"
            >
              ← Back to Customer Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard once logged in
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      {/* Top Bar for Admin */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Corn Fu Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                  CORN FU <span className="text-brand">ADMIN</span>
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Manager Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Menu Management & Real-Time Price Editor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap justify-end">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Menu</span>
            </Link>

            <button
              onClick={() => {
                setEditingItem(null);
                setIsItemModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand/20 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add New Item</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset menu items to default list?')) {
                  resetDefaultMenu();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              title="Reset Default Menu Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAdmin(false)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all ml-1"
              title="Lock Admin Mode"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock / Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto w-full flex-1 px-4 sm:px-8 py-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Items</span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {menuItems.length}
            </p>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Food Menu</span>
            <p className="text-xl sm:text-2xl font-black text-brand mt-1">
              {menuItems.filter((i) => i.category === 'food').length}
            </p>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Drinks & Boba</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
              {menuItems.filter((i) => i.category !== 'food').length}
            </p>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Active Dishes</span>
            <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              {menuItems.filter((i) => i.isAvailable !== false).length}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search items by name or description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-brand"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'food', label: 'Food' },
              { id: 'espresso', label: 'Espresso' },
              { id: 'boba', label: 'Boba' },
              { id: 'matcha', label: 'Matcha' },
              { id: 'smoothies', label: 'Smoothies' },
              { id: 'juice', label: 'Juice' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Dish / Drink</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Price (₦)</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      No matching items found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Image & Title */}
                      <td className="px-5 py-3 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/80">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized={Boolean(item.image?.startsWith('/'))}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                            {item.name}
                          </span>
                          {item.tags?.[0] && (
                            <span className="text-[10px] text-slate-400">
                              {item.tags[0]}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 capitalize text-slate-500 font-semibold">
                        {item.category}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 font-black text-brand text-sm whitespace-nowrap">
                        ₦{item.price.toLocaleString()}
                        {item.price700ml && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            700ml: ₦{item.price700ml.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-5 py-3 text-slate-500 max-w-xs sm:max-w-sm">
                        <p className="line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </td>

                      {/* Visibility Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => toggleItemAvailability(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 ${
                            item.isAvailable !== false
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}
                        >
                          {item.isAvailable !== false ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-red-500" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Edit & Delete Action Buttons */}
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsItemModalOpen(true);
                            }}
                            className="p-2 bg-slate-100 hover:bg-brand hover:text-white text-slate-600 rounded-xl transition-all shadow-2xs"
                            title="Edit details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${item.name}"?`)) {
                                deleteMenuItem(item.id);
                              }
                            }}
                            className="p-2 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 rounded-xl transition-all shadow-2xs"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit & Add Item Modal */}
      <AdminItemModal />
    </div>
  );
}

