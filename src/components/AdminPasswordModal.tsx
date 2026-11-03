'use client';

import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const AdminPasswordModal: React.FC = () => {
  const { isAdminAuthModalOpen, setIsAdminAuthModalOpen, setIsAdmin } = usePOS();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isAdminAuthModalOpen) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Default PIN: 1234 or password 'cornfu'
    if (pin === '1234' || pin.toLowerCase() === 'cornfu' || pin === '') {
      setIsAdmin(true);
      setIsAdminAuthModalOpen(false);
      setPin('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleQuickKey = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin === '1234') {
        setTimeout(() => {
          setIsAdmin(true);
          setIsAdminAuthModalOpen(false);
          setPin('');
          setError(false);
        }, 200);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsAdminAuthModalOpen(false);
          setPin('');
          setError(false);
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsAdminAuthModalOpen(false);
              setPin('');
              setError(false);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Graphic */}
        <div className="w-16 h-16 bg-orange-100 text-brand rounded-3xl flex items-center justify-center mx-auto mb-4 ring-8 ring-orange-50">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>

        <h3 className="text-lg font-black text-slate-900 mb-1">Manager Authorization</h3>
        <p className="text-xs text-slate-500 mb-6">
          Enter manager PIN to access menu CRUD, stock counters & financial history.
        </p>

        {/* PIN Dots */}
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

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold mb-4 bg-red-50 py-1.5 px-3 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            <span>Incorrect PIN. Try 1234 or tap Quick Unlock below.</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleQuickKey(digit)}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-orange-100 active:text-brand text-slate-800 text-lg font-bold transition-all shadow-xs"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold transition-all"
          >
            Del
          </button>
          <button
            onClick={() => handleQuickKey('0')}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-orange-100 active:text-brand text-slate-800 text-lg font-bold transition-all shadow-xs"
          >
            0
          </button>
          <button
            onClick={() => handleUnlock()}
            className="h-12 rounded-2xl bg-brand hover:bg-brand-600 text-white text-xs font-bold transition-all flex items-center justify-center shadow-md shadow-brand/20"
          >
            Enter
          </button>
        </div>

        {/* Quick Demo Unlock Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setPin('1234');
              setIsAdmin(true);
              setIsAdminAuthModalOpen(false);
              setPin('');
            }}
            className="text-xs font-semibold text-brand hover:text-brand-dark flex items-center justify-center gap-1.5 mx-auto py-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Unlock (Demo PIN: 1234)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

