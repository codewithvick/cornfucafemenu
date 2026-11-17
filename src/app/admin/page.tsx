'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const POS_MASTER_ADMIN_URL = 'https://pos.cornfucafe.shop/admin';

export default function AdminRedirectPage() {
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = POS_MASTER_ADMIN_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-md max-w-md w-full rounded-3xl p-8 shadow-2xl border border-slate-700 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
          <ShieldCheck className="w-9 h-9 text-orange-500" />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          Master Admin Moved
        </h1>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Digital menu prices, images, and item availability are now managed centrally from the{' '}
          <span className="font-bold text-orange-400">Cornfu POS Master Admin</span>.
        </p>

        <a
          href={POS_MASTER_ADMIN_URL}
          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-sm group"
        >
          <span>Open Master Admin</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>

        <p className="text-xs text-slate-400 mt-4">
          Redirecting automatically in <span className="font-semibold text-orange-400">{seconds}s</span>...
        </p>
      </div>
    </div>
  );
}
