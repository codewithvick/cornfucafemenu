'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Package, X, Plus, Minus, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const InventoryModal: React.FC = () => {
  const { isInventoryModalOpen, setIsInventoryModalOpen, menuItems, updateStock, toggleItemAvailability } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');

  if (!isInventoryModalOpen) return null;

  const filtered = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'low') return matchesSearch && item.available > 0 && item.available <= 10;
    if (filterType === 'out') return matchesSearch && (item.available <= 0 || item.isAvailable === false);
    return matchesSearch;
  });

  const totalStock = menuItems.reduce((acc, i) => acc + i.available, 0);
  const totalSold = menuItems.reduce((acc, i) => acc + i.sold, 0);
  const lowStockCount = menuItems.filter((i) => i.available > 0 && i.available <= 10).length;
  const outOfStockCount = menuItems.filter((i) => i.available <= 0 || i.isAvailable === false).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Live Inventory Manager</h3>
              <p className="text-xs text-slate-400">
                Track available units, sold history, and perform instant batch restocks
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsInventoryModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inventory Summary Cards */}
        <div className="p-6 pb-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Stock</span>
            <p className="text-lg font-black text-slate-800 mt-0.5">{totalStock} units</p>
          </div>
          <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-emerald-600">Total Sold</span>
            <p className="text-lg font-black text-emerald-700 mt-0.5">{totalSold} units</p>
          </div>
          <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-amber-700">Low Stock (&le;10)</span>
            <p className="text-lg font-black text-amber-800 mt-0.5">{lowStockCount} items</p>
          </div>
          <div className="bg-red-50/70 border border-red-200 p-3 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-red-600">Out of Stock</span>
            <p className="text-lg font-black text-red-700 mt-0.5">{outOfStockCount} items</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory items..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-brand"
            />
          </div>

          <div className="flex gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({menuItems.length})
            </button>
            <button
              onClick={() => setFilterType('low')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'low'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setFilterType('out')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'out'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              Sold Out ({outOfStockCount})
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-10">No matching items found</p>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      ₦{item.price.toLocaleString()} • Sold: {item.sold}
                    </p>
                  </div>
                </div>

                {/* Stock Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xs font-black ${
                        item.available <= 0
                          ? 'text-red-500'
                          : item.available <= 10
                          ? 'text-amber-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {item.available} in stock
                    </span>
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className="text-[10px] text-slate-400 hover:text-brand font-medium underline"
                    >
                      {item.isAvailable !== false ? 'Hide from Menu' : 'Show on Menu'}
                    </button>
                  </div>

                  {/* Restock Buttons */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                    <button
                      onClick={() => updateStock(item.id, -1)}
                      disabled={item.available <= 0}
                      className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center shadow-xs text-xs disabled:opacity-40"
                      title="Deduct 1"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => updateStock(item.id, 5)}
                      className="px-2 h-7 rounded-lg bg-orange-50 text-brand font-bold hover:bg-orange-100 flex items-center justify-center text-xs"
                      title="Add 5"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => updateStock(item.id, 20)}
                      className="px-2 h-7 rounded-lg bg-brand text-white font-bold hover:bg-brand-600 flex items-center justify-center text-xs"
                      title="Batch Restock +20"
                    >
                      +20
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            onClick={() => setIsInventoryModalOpen(false)}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

