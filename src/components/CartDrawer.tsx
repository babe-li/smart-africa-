import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTzs } from '../utils/format';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, Lock, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    subtotalTzs, 
    shippingFeeTzs, 
    totalTzs, 
    escrowEnabled, 
    setEscrowEnabled 
  } = useCart();
  const { swahiliMode } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-200 w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm text-white">
              {swahiliMode ? 'Kikapu Changu cha Bidhaa' : 'Shopping Cart'} ({totalItems})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6 space-y-3">
              <div className="bg-slate-800 p-4 rounded-full">
                <ShoppingBag className="w-12 h-12 text-slate-500" />
              </div>
              <p className="font-bold text-white text-sm">
                {swahiliMode ? 'Kikapu chako kipo tupu' : 'Your SmartTrade Cart is Empty'}
              </p>
              <p className="text-xs max-w-xs text-slate-400">
                Explore our catalog of verified smartphones, solar systems, coffee, and fashion priced in Tanzanian Shillings.
              </p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 relative group"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-white truncate">
                    {swahiliMode && item.product.swahiliName ? item.product.swahiliName : item.product.name}
                  </h4>
                  <p className="text-[11px] text-blue-400 font-semibold truncate mt-0.5">
                    {item.product.seller.name}
                  </p>
                  <p className="font-bold text-white text-xs mt-1">
                    {formatTzs(item.product.priceTzs)}
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 hover:bg-slate-800 text-slate-300 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 hover:bg-slate-800 text-slate-300 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors ml-auto"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Escrow Toggle */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
            {/* Escrow Buyer Protection Card */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
              <label className="flex items-start justify-between cursor-pointer">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-blue-300 block">
                      {swahiliMode ? 'Ulinzi wa Pesa (Escrow Buyer Protection)' : '100% Escrow Buyer Protection Guarantee'}
                    </span>
                    <span className="text-[10px] text-slate-300 leading-tight block mt-0.5">
                      Hold seller payout until you inspect and approve product delivery.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={escrowEnabled}
                  onChange={(e) => setEscrowEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                />
              </label>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({totalItems} items):</span>
                <span className="font-bold text-white">{formatTzs(subtotalTzs)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center">
                  <Truck className="w-3.5 h-3.5 mr-1 text-blue-400" />
                  Shipping Fee (TZ):
                </span>
                <span className="font-bold text-green-400">
                  {shippingFeeTzs === 0 ? 'FREE (Over 500k TSh)' : formatTzs(shippingFeeTzs)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Order Amount:</span>
                <span className="text-blue-400">{formatTzs(totalTzs)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-3 py-3 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-blue-600/20"
              >
                <span>{swahiliMode ? 'Endelea Kulipia' : 'Proceed to Secure Checkout'}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
