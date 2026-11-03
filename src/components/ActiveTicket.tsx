'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  CheckCircle2,
  Printer,
  ShoppingBag,
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { PaymentMethod } from '../types';

export const ActiveTicket: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    isTicketOpen,
    setIsTicketOpen,
    completeOrder,
    recentOrder,
    setRecentOrder,
  } = usePOS();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [customerName, setCustomerName] = useState('Walk-in Guest');
  const [tableNumber, setTableNumber] = useState('Dine-in (T-04)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isTicketOpen) return null;

  const vatAmount = Math.round(cartTotal * 0.075);
  const finalTotal = cartTotal + vatAmount;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const order = completeOrder(paymentMethod, customerName, tableNumber);
      setIsProcessing(false);
      if (order) {
        setOrderSuccess(true);
      }
    }, 600);
  };

  const handleCloseSuccess = () => {
    setOrderSuccess(false);
    setRecentOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Active Order Ticket</h2>
              <p className="text-xs text-slate-400">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                title="Clear Ticket"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsTicketOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Modal / Banner */}
        {orderSuccess && recentOrder ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">Payment Successful!</h3>
            <p className="text-sm font-semibold text-brand mb-4">
              Order {recentOrder.orderNumber}
            </p>
            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left text-xs mb-6 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Customer:</span>
                <span className="font-semibold">{recentOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Method:</span>
                <span className="font-semibold uppercase">{recentOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Items:</span>
                <span className="font-semibold">
                  {recentOrder.items.reduce((s, i) => s + i.quantity, 0)} units
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Paid:</span>
                <span className="text-brand">₦{recentOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all text-xs"
              >
                <Printer className="w-4 h-4" />
                Print Thermal Receipt
              </button>
              <button
                onClick={handleCloseSuccess}
                className="w-full py-2.5 bg-orange-50 text-brand rounded-xl font-bold hover:bg-orange-100 transition-all text-xs"
              >
                Start New Ticket
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Ticket Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-semibold text-slate-600">Ticket is empty</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                    Tap any item or the + button from the menu to add to this order.
                  </p>
                </div>
              ) : (
                cart.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all shadow-sm"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs font-semibold text-brand mt-0.5">
                        ₦{(item.price * quantity).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        ₦{item.price.toLocaleString()} each
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center shadow-xs text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={quantity >= item.available}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center shadow-xs text-xs disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-slate-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Payment Methods & Totals */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-4">
                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Customer / Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 mt-1 focus:outline-brand"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Service / Table
                    </label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 mt-1 focus:outline-brand"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === 'transfer'
                          ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowRightLeft className="w-4 h-4 mb-1" />
                      <span>Transfer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1" />
                      <span>POS Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs font-bold transition-all ${
                        paymentMethod === 'cash'
                          ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Banknote className="w-4 h-4 mb-1" />
                      <span>Cash</span>
                    </button>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-800">
                      ₦{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (7.5%):</span>
                    <span className="font-semibold text-slate-800">
                      ₦{vatAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total:</span>
                    <span className="text-brand">₦{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  disabled={isProcessing}
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-brand hover:bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete & Charge ₦{finalTotal.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

