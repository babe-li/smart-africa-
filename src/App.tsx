import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { PRODUCTS } from './data/products';
import { Product, Category } from './types';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StorefrontView } from './components/StorefrontView';
import { OrdersView } from './components/OrdersView';
import { AdminPortalView } from './components/AdminPortalView';
import { ProductModal } from './components/ProductModal';
import { BiometricModal } from './components/BiometricModal';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';

const MainApplication: React.FC = () => {
  const { user, swahiliMode, logUserMovement } = useAuth();
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

  React.useEffect(() => {
    if ((activeTab === 'admin_portal' || activeTab === 'orders') && user?.role !== 'admin') {
      setActiveTab('store');
    }
  }, [activeTab, user]);

  const handleTabChange = (newTab: string) => {
    if ((newTab === 'admin_portal' || newTab === 'orders') && user?.role !== 'admin') {
      return;
    }
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

      {/* Main Container wrapper supporting responsive layout across all devices */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 pb-24">
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
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'admin_portal' && (
          <AdminPortalView
            products={products}
            onAddProduct={handleAddProduct}
          />
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="font-bold text-white text-sm mb-2">SmartTrade Africa Ltd</h4>
            <p className="text-slate-400 leading-relaxed">Tanzania's trusted digital commerce platform. Designed to eliminate online payment fraud and build customer trust.</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-2">Core Platform Pillars</h4>
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
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest font-bold text-slate-500 gap-4">
          <div className="flex gap-6">
            <span>&copy; 2026 SmartTrade Africa Ltd</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
          </div>
          <div className="flex items-center gap-4">
            <span>System Status: <span className="text-green-500">Active</span></span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              Platform Connected
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
        onOrderCompleted={() => setActiveTab(user?.role === 'admin' ? 'orders' : 'store')}
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
