import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Search, MapPin, ShoppingCart, ShieldCheck, Fingerprint, 
  Smartphone, Monitor, Globe, ChevronDown, UserCheck, Lock, LogOut 
} from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCart: () => void;
  onOpenAuthModal: () => void;
  onOpenBiometricModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CATEGORIES: Category[] = [
  'All',
  'Electronics and Gadgets',
  'Solar and Power Solutions',
  'Agriculture and Coffee',
  'Fashion and Kitenge',
  'Home and Kitchen'
];

export const Header: React.FC<HeaderProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onOpenCart,
  onOpenAuthModal,
  onOpenBiometricModal,
  activeTab,
  setActiveTab
}) => {
  const { user, logout, deviceViewMode, setDeviceViewMode, swahiliMode, setSwahiliMode } = useAuth();
  const { totalItems } = useCart();
  const [deliveryCity, setDeliveryCity] = useState('Dar es Salaam (Posta)');

  return (
    <header className="bg-slate-900 text-slate-200 sticky top-0 z-40 shadow-2xl border-b border-slate-800">
      {/* Topmost trust & simulation banner */}
      <div className="bg-slate-950 text-xs py-1.5 px-6 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3 font-mono">
          <span className="flex items-center gap-1.5 text-xs font-semibold bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            TCP Hardware Enclave: ACTIVE (256-Bit SSL)
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            🇹🇿 TCRA and TBS E-Commerce Trust Verified
          </span>
        </div>

        {/* View Mode & Language Toggles */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-800 rounded-full p-0.5 border border-slate-700">
            <button
              onClick={() => setDeviceViewMode('desktop')}
              className={`flex items-center px-2.5 py-0.5 rounded-full text-xs transition-colors ${
                deviceViewMode === 'desktop'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="View full Desktop interface"
            >
              <Monitor className="w-3 h-3 mr-1" />
              Desktop View
            </button>
            <button
              onClick={() => setDeviceViewMode('mobile')}
              className={`flex items-center px-2.5 py-0.5 rounded-full text-xs transition-colors ${
                deviceViewMode === 'mobile'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Simulate Mobile App frame"
            >
              <Smartphone className="w-3 h-3 mr-1" />
              Phone View
            </button>
          </div>

          <button
            onClick={() => setSwahiliMode(!swahiliMode)}
            className="flex items-center text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full border border-slate-700 text-blue-400 font-medium transition-colors"
          >
            <Globe className="w-3 h-3 mr-1.5 text-blue-400" />
            {swahiliMode ? '🇹🇿 Kiswahili' : '🇬🇧 English / TSh'}
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('store')} 
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-blue-500 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tighter text-blue-500 leading-none">
              SMART<span className="text-white">TRADE</span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-wider font-medium mt-0.5">
              {swahiliMode ? 'BIASHARA SALAMA NA AMINI' : 'SECURE TANZANIA COMMERCE'}
            </p>
          </div>
        </div>

        {/* Delivery Location Selector */}
        <div className="hidden lg:flex items-center text-xs hover:border hover:border-slate-700 p-2 rounded-xl cursor-pointer shrink-0 transition-colors">
          <MapPin className="w-4 h-4 text-blue-500 mr-2 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500">
              {swahiliMode ? 'Tuma mzigo kwenda:' : 'Deliver to Tanzania'}
            </p>
            <select
              value={deliveryCity}
              onChange={(e) => setDeliveryCity(e.target.value)}
              className="bg-transparent font-bold text-white text-xs outline-none cursor-pointer"
            >
              <option value="Dar es Salaam (Posta)" className="bg-slate-900 text-white">Dar es Salaam (Posta)</option>
              <option value="Dar es Salaam (Masaki)" className="bg-slate-900 text-white">Dar es Salaam (Masaki)</option>
              <option value="Arusha (CBD)" className="bg-slate-900 text-white">Arusha (CBD)</option>
              <option value="Mwanza (Rock City)" className="bg-slate-900 text-white">Mwanza (Rock City)</option>
              <option value="Zanzibar (Stone Town)" className="bg-slate-900 text-white">Zanzibar (Stone Town)</option>
              <option value="Dodoma (Capital City)" className="bg-slate-900 text-white">Dodoma (Capital City)</option>
            </select>
          </div>
        </div>

        {/* Search Bar with Category Selector */}
        <div className="flex-1 max-w-2xl hidden md:flex rounded-full overflow-hidden border border-slate-700 focus-within:border-blue-500 bg-slate-800 transition-colors shadow-inner">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Category)}
            className="bg-slate-800/80 text-slate-300 text-xs px-3.5 py-2.5 outline-none border-r border-slate-700 font-medium cursor-pointer max-w-[160px]"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder={swahiliMode ? "Tafuta soko salama (TSh)..." : "Search secure marketplace (TSh)..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-200 px-4 py-2 text-sm outline-none placeholder-slate-500 font-medium"
          />
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 font-bold flex items-center transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center space-x-4 shrink-0">
          {/* Biometric Quick Trigger */}
          <button
            onClick={onOpenBiometricModal}
            className="hidden sm:flex items-center space-x-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/30 text-xs font-semibold transition-colors group"
            title="Biometric Hardware Security Enclave"
          >
            <Fingerprint className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>{swahiliMode ? 'Kihisi Dole' : 'TCP Secured'}</span>
          </button>

          {/* Account Login / User Profile */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => setActiveTab('orders')}
                className="cursor-pointer hover:bg-slate-800 px-2.5 py-1 rounded-lg text-left transition-colors"
              >
                <p className="text-[10px] text-slate-400">
                  {swahiliMode ? 'Karibu,' : 'Welcome,'} {user.name.split(' ')[0]}
                </p>
                <p className="text-xs font-bold flex items-center text-white">
                  <UserCheck className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  {swahiliMode ? 'Akaunti Yangu' : 'My Account'}
                </p>
              </div>
              <button 
                onClick={logout} 
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-rose-500/20 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors"
                title="Logout securely"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={onOpenAuthModal}
              className="cursor-pointer hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 text-left transition-colors"
            >
              <p className="text-[10px] text-slate-500">
                {swahiliMode ? 'Mgeni' : 'Guest Status'}
              </p>
              <p className="text-xs font-bold flex items-center text-white">
                <Lock className="w-3 h-3 mr-1.5 text-blue-500" />
                {swahiliMode ? 'Ingia Akaunti' : 'Sign In Securely'}
              </p>
            </div>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-blue-600/20 transition-colors relative group"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span className="text-sm">{totalItems}</span>
            <span className="hidden sm:inline ml-1.5 text-xs font-semibold">
              {swahiliMode ? 'Kikapu' : 'Cart'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile search input when on small screen */}
      <div className="md:hidden px-4 pb-3 pt-1">
        <div className="flex rounded-full overflow-hidden border border-slate-700 bg-slate-800 focus-within:border-blue-500">
          <input
            type="text"
            placeholder={swahiliMode ? "Tafuta soko salama (TSh)..." : "Search secure marketplace..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-200 px-4 py-2 text-xs outline-none font-medium placeholder-slate-500"
          />
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 font-bold flex items-center">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-header Category Ribbon */}
      <div className="bg-slate-900/90 text-slate-400 text-xs px-6 py-2.5 flex items-center space-x-8 overflow-x-auto border-t border-slate-800">
        <button
          onClick={() => setActiveTab('store')}
          className={`font-semibold flex items-center whitespace-nowrap transition-colors ${
            activeTab === 'store' ? 'text-blue-400 border-b-2 border-blue-500 pb-1 font-bold' : 'hover:text-white'
          }`}
        >
          🏷️ {swahiliMode ? 'Duka Kuu (Featured Deals)' : 'Featured Deals'}
        </button>
        <button
          onClick={() => setActiveTab('tcp_security')}
          className={`font-semibold flex items-center whitespace-nowrap transition-colors ${
            activeTab === 'tcp_security' ? 'text-blue-400 border-b-2 border-blue-500 pb-1 font-bold' : 'hover:text-white'
          }`}
        >
          🛡️ TCP Security Enclave and Telemetry
        </button>
        <button
          onClick={() => setActiveTab('tam_analyzer')}
          className={`font-semibold flex items-center whitespace-nowrap transition-colors ${
            activeTab === 'tam_analyzer' ? 'text-blue-400 border-b-2 border-blue-500 pb-1 font-bold' : 'hover:text-white'
          }`}
        >
          📊 TAM and UTAUT Trust Analyzer
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`font-semibold flex items-center whitespace-nowrap transition-colors ${
            activeTab === 'orders' ? 'text-blue-400 border-b-2 border-blue-500 pb-1 font-bold' : 'hover:text-white'
          }`}
        >
          📦 {swahiliMode ? 'Oda and Risiti zangu' : 'Escrow Orders and Receipts'}
        </button>
        <button
          onClick={() => setActiveTab('admin_portal')}
          className={`font-semibold flex items-center whitespace-nowrap transition-colors ${
            activeTab === 'admin_portal' 
              ? 'text-blue-400 border-b-2 border-blue-500 pb-1 font-bold bg-blue-500/10 px-3 py-1 rounded-t-lg' 
              : 'text-slate-300 hover:text-white bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/60'
          }`}
        >
          👑 {swahiliMode ? 'Utawala (Admin Enclave)' : 'Admin Enclave and Telemetry'}
        </button>
        <span className="text-slate-800">|</span>
        <span className="text-xs text-slate-500 font-mono hidden xl:inline">
          🔒 SSL/TLS 1.3 End-to-End Encrypted Gateway
        </span>
      </div>
    </header>
  );
};
