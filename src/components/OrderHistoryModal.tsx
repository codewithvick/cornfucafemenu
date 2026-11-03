'use client';

import React from 'react';
import { Clock, X, Printer, CheckCircle, ArrowRightLeft, CreditCard, Banknote } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { PaymentMethod } from '../types';

export const OrderHistoryModal: React.FC = () => {
  const { isOrderHistoryOpen, setIsOrderHistoryOpen, orders, setRecentOrder, setIsTicketOpen } = usePOS();

  if (!isOrderHistoryOpen) return null;

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'transfer':
        return <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />;
      case 'card':
        return <CreditCard className="w-3.5 h-3.5 text-purple-500" />;
      case 'cash':
        return <Banknote className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Order History & Sales Logs</h3>
              <p className="text-xs text-slate-400">
                Audit tickets, view receipts, and monitor daily register revenue
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metric Bar */}
        <div className="p-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-orange-50/70 border border-orange-200 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-orange-600">Total Shift Revenue</span>
            <p className="text-xl font-black text-brand mt-0.5">₦{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-slate-500">Tickets Processed</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">{orders.length} tickets</p>
          </div>
          <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-emerald-600">Payment Health</span>
            <p className="text-xl font-black text-emerald-700 mt-0.5">100% Settled</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="flex-1 overflow-y-auto px-6 py-3 divide-y divide-slate-100">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">No orders registered yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Completed orders will automatically appear here with full receipt details.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{ord.orderNumber}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                      {ord.tableNumber || 'Takeout'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                      {getMethodIcon(ord.paymentMethod)}
                      {ord.paymentMethod}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {ord.customerName} • {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {ord.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-sm font-black text-brand">₦{ord.total.toLocaleString()}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-0.5">
                      <CheckCircle className="w-2.5 h-2.5" /> Paid
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setRecentOrder(ord);
                      setIsTicketOpen(true);
                      setIsOrderHistoryOpen(false);
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                    title="View Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

