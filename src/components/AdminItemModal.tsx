'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Sparkles, Check } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { CategoryId, MenuItem } from '../types';

const IMAGE_PRESETS = [
  { label: 'Pineapple Juice', url: '/pineapple-juice.jpg' },
  { label: 'Tigernut Drink', url: '/tigernut.jpg' },
  { label: 'Beef Shawarma', url: '/beef-shawarma.jpg' },
  { label: 'Chicken Shawarma', url: '/cornfu-shawarma.jpg' },
  { label: 'Chicken Salad', url: '/chicken-salad.jpg' },
  { label: 'Loaded Mishai', url: '/loaded-mishai.jpg' },
  { label: 'Smoothie Cup', url: '/cornfu-smoothie.jpg' },
  { label: 'Bubblegum Boba', url: '/bubblegum-boba.jpg' },
  { label: 'Strawberry Matcha', url: '/strawberry-matcha.jpg' },
  { label: 'Classic Boba', url: '/classic-boba.jpg' },
  { label: 'Taro Boba', url: '/taro-boba.jpg' },
  { label: 'Pistachio Boba', url: '/pistachio-boba.jpg' },
];

export const AdminItemModal: React.FC = () => {
  const {
    isItemModalOpen,
    setIsItemModalOpen,
    editingItem,
    setEditingItem,
    addMenuItem,
    updateMenuItem,
  } = usePOS();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [price, setPrice] = useState<string>('4500');
  const [price700ml, setPrice700ml] = useState<string>('');
  const [available, setAvailable] = useState<string>('30');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setPrice(String(editingItem.price));
      setPrice700ml(editingItem.price700ml ? String(editingItem.price700ml) : '');
      setAvailable(String(editingItem.available));
      setDescription(editingItem.description || '');
      setImageUrl(editingItem.image || '');
      setTagInput(editingItem.tags ? editingItem.tags.join(', ') : '');
      setIsAvailable(editingItem.isAvailable !== false);
    } else {
      // Defaults for new item
      setName('');
      setCategory('food');
      setPrice('4500');
      setPrice700ml('');
      setAvailable('25');
      setDescription('');
      setImageUrl('/pineapple-juice.jpg');
      setTagInput('Chef Special');
      setIsAvailable(true);
    }
  }, [editingItem, isItemModalOpen]);

  if (!isItemModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter an item name');
      return;
    }

    const parsedPrice = parseInt(price, 10) || 0;
    const parsedPrice700ml = price700ml.trim() ? parseInt(price700ml, 10) : undefined;
    const parsedStock = parseInt(available, 10) || 0;
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const fallbackImg =
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

    if (editingItem) {
      const updated: MenuItem = {
        ...editingItem,
        name: name.trim(),
        category,
        price: parsedPrice,
        price700ml: parsedPrice700ml,
        available: parsedStock,
        description: description.trim(),
        image: fallbackImg,
        tags,
        isAvailable,
      };
      updateMenuItem(updated);
    } else {
      addMenuItem({
        name: name.trim(),
        category,
        price: parsedPrice,
        price700ml: parsedPrice700ml,
        available: parsedStock,
        description: description.trim(),
        image: fallbackImg,
        tags,
        isAvailable,
      });
    }

    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <p className="text-xs text-slate-400">
              {editingItem
                ? 'Update pricing, availability, and item details'
                : 'Create and publish a new item to Cornfu Cafe menu'}
            </p>
          </div>
          <button
            onClick={() => {
              setIsItemModalOpen(false);
              setEditingItem(null);
            }}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item Name */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken Shawarma, Boba Pearl Delight"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:bg-white focus:outline-brand"
            />
          </div>

          {/* Category & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:bg-white focus:outline-brand"
              >
                <option value="food">Food Menu</option>
                <option value="espresso">Espresso Menu</option>
                <option value="boba">Boba Tea</option>
                <option value="matcha">Matcha Drinks</option>
                <option value="smoothies">Smoothies</option>
                <option value="juice">Fruit Juice</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                Price (₦ Naira) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-bold text-brand">₦</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="4500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-slate-800 font-bold focus:bg-white focus:outline-brand"
                />
              </div>
            </div>
          </div>

          {/* Optional: Boba 700ml Large Price */}
          {(category === 'boba' || Boolean(price700ml)) && (
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                700ml Large Price (₦ Naira) <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-bold text-emerald-600">₦</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={price700ml}
                  onChange={(e) => setPrice700ml(e.target.value)}
                  placeholder="e.g. 7500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-slate-800 font-bold focus:bg-white focus:outline-brand"
                />
              </div>
            </div>
          )}

          {/* Stock Count & Status Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
                Stock Count (Available)
              </label>
              <input
                type="number"
                min="0"
                value={available}
                onChange={(e) => setAvailable(e.target.value)}
                placeholder="30"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:bg-white focus:outline-brand"
              />
            </div>

            <div className="pt-4 sm:pt-6">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-brand rounded border-slate-300 focus:ring-brand accent-brand"
                />
                <span className="text-xs font-bold text-slate-700">
                  Visible & Available on Menu
                </span>
              </label>
            </div>
          </div>

          {/* Image URL & Preset Selection */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
              Image URL or Local Image Path
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/pineapple-juice.jpg or https://..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-brand"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Presets:
              </span>
              {IMAGE_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setImageUrl(preset.url)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                    imageUrl === preset.url
                      ? 'bg-brand text-white border-brand'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Preview image */}
            {imageUrl && (
              <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Tags & Badges */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-600 block mb-1">
              Dietary / Promo Badges (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. Best Seller, Spicy, 3 Pieces, Gluten Free"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-brand"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase text-slate-600">
                Item Description & Ingredients (Shown on Digital Menu) *
              </label>
              <span className="text-[10px] text-slate-400">
                {description.length} chars
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Juicy spiced shredded chicken wrapped in soft flatbread with creamy garlic sauce and fresh crunchy veggies..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-brand leading-relaxed resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsItemModalOpen(false);
                setEditingItem(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingItem ? 'Save Changes' : 'Publish Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

