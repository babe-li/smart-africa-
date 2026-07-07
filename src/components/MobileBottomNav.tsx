import React from 'react';
import { Home, Package, ShoppingCart, Fingerprint } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenBiometric: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenBiometric
}) => {
  const { totalItems } = useCart();
  const { user, swahiliMode } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-300 py-2 px-3 z-50 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex flex-col items-center text-[11px] transition-colors ${
            activeTab === 'store' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>{swahiliMode ? 'Duka' : 'Store'}</span>
        </button>

        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center text-[11px] transition-colors ${
              activeTab === 'orders' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5 text-blue-400" />
            <span>{swahiliMode ? 'Oda' : 'Orders'}</span>
          </button>
        )}

        {/* Center Biometric Touch Trigger */}
        <button
          onClick={onOpenBiometric}
          className="flex flex-col items-center justify-center -mt-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full w-12 h-12 shadow-lg shadow-blue-600/30 border-4 border-slate-950 transition-all hover:scale-105"
          title="Hardware Fingerprint Scan"
        >
          <Fingerprint className="w-6 h-6 stroke-[2.5]" />
        </button>

        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin_portal')}
            className={`flex flex-col items-center text-[11px] transition-colors ${
              activeTab === 'admin_portal' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-base leading-none mb-0.5">👑</span>
            <span>Admin</span>
          </button>
        )}

        <button
          onClick={onOpenCart}
          className="flex flex-col items-center text-[11px] text-slate-400 hover:text-white relative transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </div>
          <span>{swahiliMode ? 'Kikapu' : 'Cart'}</span>
        </button>
      </div>
    </div>
  );
};
