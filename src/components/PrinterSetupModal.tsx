'use client';

import React, { useState } from 'react';
import {
  Printer,
  X,
  Bluetooth,
  Wifi,
  Usb,
  CheckCircle2,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const PrinterSetupModal: React.FC = () => {
  const { isPrinterModalOpen, setIsPrinterModalOpen, printerConfig, updatePrinterConfig } =
    usePOS();

  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isPrinterModalOpen) return null;

  const handleTestPrint = () => {
    setIsTesting(true);
    setTestSuccess(false);
    setTimeout(() => {
      setIsTesting(false);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Receipt & KOT Printer Setup
              </h3>
              <p className="text-xs text-slate-400">
                Configure thermal receipt printers, Bluetooth sync & kitchen routing
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPrinterModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Settings */}
          <div className="space-y-4">
            {/* Connection Type */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-2">
                Interface Connection
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updatePrinterConfig({ type: 'bluetooth' })}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    printerConfig.type === 'bluetooth'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bluetooth className="w-4 h-4 mb-1" />
                  <span>Bluetooth</span>
                </button>
                <button
                  type="button"
                  onClick={() => updatePrinterConfig({ type: 'usb' })}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    printerConfig.type === 'usb'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Usb className="w-4 h-4 mb-1" />
                  <span>USB POS</span>
                </button>
                <button
                  type="button"
                  onClick={() => updatePrinterConfig({ type: 'network' })}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    printerConfig.type === 'network'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Wifi className="w-4 h-4 mb-1" />
                  <span>Network IP</span>
                </button>
              </div>
            </div>

            {/* Selected Printer Device */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-1">
                Active Printer Model
              </label>
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{printerConfig.printerName}</span>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>
            </div>

            {/* Paper Width */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5">
                Paper Roll Width
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updatePrinterConfig({ paperWidth: '80mm' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                    printerConfig.paperWidth === '80mm'
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  80mm (Standard POS)
                </button>
                <button
                  type="button"
                  onClick={() => updatePrinterConfig({ paperWidth: '58mm' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                    printerConfig.paperWidth === '58mm'
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  58mm (Mobile Mini)
                </button>
              </div>
            </div>

            {/* Automation Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
                <span>Auto-print receipt on order checkout</span>
                <input
                  type="checkbox"
                  checked={printerConfig.autoPrintReceipt}
                  onChange={(e) =>
                    updatePrinterConfig({ autoPrintReceipt: e.target.checked })
                  }
                  className="w-4 h-4 text-brand rounded border-slate-300 accent-brand"
                />
              </label>
              <label className="flex items-center justify-between text-xs font-medium text-slate-700 cursor-pointer">
                <span>Auto-print KOT for Kitchen staff</span>
                <input
                  type="checkbox"
                  checked={printerConfig.autoPrintKOT}
                  onChange={(e) =>
                    updatePrinterConfig({ autoPrintKOT: e.target.checked })
                  }
                  className="w-4 h-4 text-brand rounded border-slate-300 accent-brand"
                />
              </label>
            </div>

            {/* Test Print Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestPrint}
                disabled={isTesting}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Feeding Paper & Testing...</span>
                  </>
                ) : testSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Test Print OK!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Print Test Thermal Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Thermal Receipt Live Preview */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase text-slate-400 mb-2">
              Receipt Preview ({printerConfig.paperWidth})
            </span>

            {/* Jagged / Monospace Paper Container */}
            <div
              className={`w-full max-w-[260px] bg-amber-50/40 p-4 rounded-xl border border-dashed border-amber-300 font-mono text-[11px] text-slate-800 shadow-inner select-none ${
                isTesting ? 'animate-pulse' : ''
              }`}
            >
              <div className="text-center border-b border-dashed border-slate-400 pb-2 mb-2">
                <p className="font-bold text-xs uppercase tracking-wider">CORNFU CAFE</p>
                <p className="text-[9px] text-slate-500">Fast Food & Artisan Boba</p>
                <p className="text-[9px] text-slate-500">Victoria Island, Lagos</p>
                <p className="text-[9px] text-slate-500">Tel: +234 812 345 6789</p>
              </div>

              <div className="space-y-1 mb-2 text-[10px]">
                <div className="flex justify-between">
                  <span>Order: #CF-1042</span>
                  <span>POS-01</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Date: 02/11/26</span>
                  <span>1:38 PM</span>
                </div>
              </div>

              {/* Items Sample */}
              <div className="border-t border-b border-dashed border-slate-400 py-1.5 my-1.5 space-y-1">
                <div className="flex justify-between">
                  <span>1x Chicken Shawarma</span>
                  <span>₦4,500</span>
                </div>
                <div className="flex justify-between">
                  <span>1x Tiger Brown Sugar Boba</span>
                  <span>₦4,200</span>
                </div>
              </div>

              <div className="space-y-0.5 text-[10px] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₦8,700</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>VAT (7.5%):</span>
                  <span>₦653</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-300">
                  <span>TOTAL:</span>
                  <span>₦9,353</span>
                </div>
              </div>

              <div className="text-center pt-3 text-[9px] text-slate-500 border-t border-dashed border-slate-300 mt-2">
                <p>Payment: POS TRANSFER</p>
                <p className="mt-1 font-semibold">Thank you for dining at Cornfu!</p>
                <p className="text-[8px] mt-0.5 text-slate-400">*** CUSTOMER COPY ***</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            onClick={() => setIsPrinterModalOpen(false)}
            className="px-6 py-2 bg-brand text-white rounded-xl text-xs font-bold hover:bg-brand-600 transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

