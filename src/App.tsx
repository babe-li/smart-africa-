import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { PRODUCTS } from './data/products';
import { Product, Category } from './types';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StorefrontView } from './components/StorefrontView';
import { TcpSecurityHub } from './components/TcpSecurityHub';
import { TamUtautDashboard } from './components/TamUtautDashboard';
import { OrdersView } from './components/OrdersView';
import { AdminPortalView } from './components/AdminPortalView';
import { ProductModal } from './components/ProductModal';
import { BiometricModal } from './components/BiometricModal';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Smartphone, Monitor } from 'lucide-react';

const MainApplication: React.FC = () => {
  const { deviceViewMode, setDeviceViewMode, swahiliMode, logUserMovement } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smarttrade_products');
    if (saved) {
      try { return JSON.parse(saved); } catch { return PRODUCTS; }
    }
    return PRODUCTS;
  });

  const [activeTab, setActiveTab] = useState<string>('store');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => {
      const updated = [newProduct, ...prev];
      localStorage.setItem('smarttrade_products', JSON.stringify(updated));
      return updated;
    });
    logUserMovement('ADD_PRODUCT', `Listed new product: ${newProduct.name} (TSh ${newProduct.priceTzs.toLocaleString()})`);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    logUserMovement('PAGE_VIEW', `Navigated to section tab: ${newTab.toUpperCase()}`);
  };

  // Filter search queries
  const searchedProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
      (p.swahiliName && p.swahiliName.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('store');
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (activeTab !== 'store') setActiveTab('store');
        }}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenBiometricModal={() => setIsBiometricModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Main Container wrapper supporting Phone Frame View mode */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-24">
        {deviceViewMode === 'mobile' ? (
          <div className="max-w-sm mx-auto my-2 bg-slate-900 p-3 rounded-[3rem] shadow-[0_0_50px_rgba(30,58,138,0.25)] border-[8px] border-slate-800 relative min-h-[750px] flex flex-col">
            {/* Phone Notch */}
            <div className="w-32 h-5 bg-slate-950 mx-auto rounded-b-xl flex items-center justify-center space-x-1.5 mb-3">
              <div className="w-2 h-2 rounded-full bg-slate-700" />
              <div className="w-8 h-1 rounded-full bg-slate-700" />
            </div>

            {/* Phone screen internal content */}
            <div className="flex-1 bg-slate-950 text-slate-200 rounded-[2rem] overflow-y-auto p-3 space-y-4 max-h-[680px] border border-slate-800/80">
              <div className="bg-blue-600/20 border border-blue-500/40 text-blue-300 px-3 py-1.5 rounded-xl text-center text-xs font-black shadow-sm flex items-center justify-between">
                <span>🇹🇿 SMARTTRADE MOBILE APP</span>
                <button 
                  onClick={() => setDeviceViewMode('desktop')} 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded text-[9px] transition-colors"
                >
                  Exit Phone View
                </button>
              </div>

              {activeTab === 'store' && (
                <StorefrontView
                  products={searchedProducts}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={(cat) => {
                    setSelectedCategory(cat);
                    logUserMovement('SEARCH', `Filtered store category: ${cat}`);
                  }}
                  onSelectProduct={(p) => {
                    setSelectedProduct(p);
                    logUserMovement('PAGE_VIEW', `Inspected product details: ${p.name}`);
                  }}
                  onAddToCart={(p) => {
                    addToCart(p, 1);
                    logUserMovement('ADD_TO_CART', `Added product to cart: ${p.name}`);
                  }}
                />
              )}
              {activeTab === 'tcp_security' && <TcpSecurityHub />}
              {activeTab === 'tam_analyzer' && <TamUtautDashboard />}
              {activeTab === 'orders' && <OrdersView />}
              {activeTab === 'admin_portal' && (
                <AdminPortalView
                  products={products}
                  onAddProduct={handleAddProduct}
                />
              )}
            </div>
          </div>
        ) : (
          <div>
            {activeTab === 'store' && (
              <StorefrontView
                products={searchedProducts}
                selectedCategory={selectedCategory}
                setSelectedCategory={(cat) => {
                  setSelectedCategory(cat);
                  logUserMovement('SEARCH', `Filtered store category: ${cat}`);
                }}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  logUserMovement('PAGE_VIEW', `Inspected product details: ${p.name}`);
                }}
                onAddToCart={(p) => {
                  addToCart(p, 1);
                  logUserMovement('ADD_TO_CART', `Added product to cart: ${p.name}`);
                }}
              />
            )}
            {activeTab === 'tcp_security' && <TcpSecurityHub />}
            {activeTab === 'tam_analyzer' && <TamUtautDashboard />}
            {activeTab === 'orders' && <OrdersView />}
            {activeTab === 'admin_portal' && (
              <AdminPortalView
                products={products}
                onAddProduct={handleAddProduct}
              />
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation App Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenBiometric={() => setIsBiometricModalOpen(true)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-6 pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h4 className="font-bold text-white text-sm mb-2">SmartTrade Africa Ltd</h4>
            <p className="text-slate-400 leading-relaxed">Tanzania's trusted digital commerce platform. Designed to eliminate online payment fraud and build customer trust.</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-2">Course 428 Objectives</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Trusted Computing Platform (TCP)</li>
              <li>• Fingerprint Biometric Auth (WebAuthn)</li>
              <li>• TAM and UTAUT Acceptance Analysis</li>
              <li>• Escrow Buyer Protection Gateway</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-2">Tanzania Delivery Regions</h4>
            <p className="text-slate-400 leading-relaxed">Dar es Salaam, Arusha, Mwanza, Dodoma, Zanzibar (Unguja and Pemba), Moshi, Tanga, Mbeya, and Morogoro.</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-2">Security Compliance</h4>
            <p className="text-blue-400 font-mono text-[11px] space-y-1 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              <span className="block">✔ HTTPS TLS 1.3 Active</span>
              <span className="block">✔ SQLi Parameterized Wrapper</span>
              <span className="block">✔ XSS and CSRF Token Validation</span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest font-bold text-slate-500 gap-4">
          <div className="flex gap-6">
            <span>&copy; 2024 SmartTrade Africa Ltd</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">TCP Compliance Statement</span>
          </div>
          <div className="flex items-center gap-4">
            <span>System Status: <span className="text-green-500">Secure</span></span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              Secure API Connected
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => addToCart(p, qty)}
        onInstantBuy={(p) => {
          addToCart(p, 1);
          setSelectedProduct(null);
          setIsCartDrawerOpen(true);
        }}
      />

      <BiometricModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOrderCompleted={() => setActiveTab('orders')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApplication />
      </CartProvider>
    </AuthProvider>
  );
}
