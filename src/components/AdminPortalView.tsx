import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { TcpSecurityHub } from './TcpSecurityHub';
import { TamUtautDashboard } from './TamUtautDashboard';
import { SecurityHealthIndicators } from './SecurityHealthIndicators';
import { BiometricThresholdAlert } from './BiometricThresholdAlert';
import { ProductSalesAnalytics } from './ProductSalesAnalytics';
import { Product, Category, UserMovementLog } from '../types';
import { 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  PackagePlus, 
  Activity, 
  Lock, 
  Search, 
  Filter, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Eye, 
  Sparkles,
  Layers,
  Users,
  AlertTriangle,
  ShoppingCart,
  Package,
  ShoppingBag,
  Tag,
  BarChart3,
  Fingerprint,
  XCircle,
  Clock,
  Smartphone,
  Monitor,
  Terminal
} from 'lucide-react';

interface AdminPortalViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ products, onAddProduct }) => {
  const { user, adminList, addAdminAccount, userMovements, swahiliMode, biometricAttemptLogs } = useAuth();
  const { cart, totalItems, subtotalTzs, orders } = useCart();
  const [activeTab, setActiveTab] = useState<'movements' | 'inventory' | 'tcp_security' | 'biometric_logs' | 'tam_analyzer' | 'sales_analytics' | 'add_product' | 'add_admin' | 'security_health'>('movements');

  // Biometric log filter
  const [biometricFilter, setBiometricFilter] = useState<string>('ALL');
  const [isThresholdAlertActive, setIsThresholdAlertActive] = useState<boolean>(false);

  // Movement tracker filters
  const [movementSearch, setMovementSearch] = useState('');
  const [movementFilter, setMovementFilter] = useState<string>('ALL');

  // New Product Form state
  const [prodName, setProdName] = useState('');
  const [prodSwahiliName, setProdSwahiliName] = useState('');
  const [prodCategory, setProdCategory] = useState<Category>('Electronics and Gadgets');
  const [prodPrice, setProdPrice] = useState<number>(150000);
  const [prodOrigPrice, setProdOrigPrice] = useState<number>(180000);
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80');
  const [prodSellerName, setProdSellerName] = useState('Kariakoo Verified Store');
  const [prodSellerLoc, setProdSellerLoc] = useState('Kariakoo, Dar es Salaam');
  const [prodDesc, setProdDesc] = useState('');
  const [prodFeatureInput, setProdFeatureInput] = useState('');
  const [prodFeatures, setProdFeatures] = useState<string[]>([
    'TCRA Verified and Escrow Protected',
    '12-Month East African Warranty'
  ]);
  const [prodSuccessMsg, setProdSuccessMsg] = useState('');

  // New Admin Form state
  const [admEmail, setAdmEmail] = useState('');
  const [admName, setAdmName] = useState('');
  const [admPassword, setAdmPassword] = useState('');
  const [admSuccessMsg, setAdmSuccessMsg] = useState('');

  if (user?.role !== 'admin') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-6 shadow-2xl animate-in fade-in duration-300 my-12">
        <div className="w-20 h-20 bg-rose-500/10 border-2 border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {swahiliMode ? 'Imefungwa: Uruhusu wa Utawala Unahitajika' : 'Access Denied: Administrator Permission Required'}
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            {swahiliMode
              ? 'Hautaruhusiwa kuona eneo hili au telemetry bila idhini ya utawala. Tafadhali ingia na akaunti yenye mamlaka kamili ya msimamizi.'
              : 'You do not have permission to view the Admin Enclave, telemetry logs, or security analytics. Please authenticate with an authorized administrator account.'}
          </p>
        </div>
      </div>
    );
  }

  const filteredMovements = userMovements.filter(m => {
    if (movementFilter !== 'ALL' && m.actionType !== movementFilter) return false;
    if (!movementSearch.trim()) return true;
    const q = movementSearch.toLowerCase();
    return m.userName.toLowerCase().includes(q) ||
           m.userEmail.toLowerCase().includes(q) ||
           m.description.toLowerCase().includes(q) ||
           m.actionType.toLowerCase().includes(q);
  });

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const newProd: Product = {
      id: 'tz-custom-' + Math.random().toString(36).substring(2, 7),
      name: prodName.trim(),
      swahiliName: prodSwahiliName.trim() || prodName.trim(),
      category: prodCategory,
      priceTzs: Number(prodPrice) || 100000,
      originalPriceTzs: Number(prodOrigPrice) || (Number(prodPrice) * 1.2),
      rating: 5.0,
      reviewCount: 1,
      image: prodImage.trim() || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      seller: {
        name: prodSellerName.trim() || 'SmartTrade Verified Seller',
        location: prodSellerLoc.trim() || 'Dar es Salaam',
        verified: true,
        trustScore: 99
      },
      inStock: true,
      smartDelivery: true,
      description: prodDesc.trim() || 'High-quality Tanzanian marketplace product verified for escrow security and authenticity.',
      features: prodFeatures.length > 0 ? prodFeatures : ['100% Escrow Buyer Protection'],
      securityVerified: true
    };

    onAddProduct(newProd);
    setProdSuccessMsg(`Successfully listed "${newProd.name}" to the marketplace!`);
    setTimeout(() => setProdSuccessMsg(''), 4000);

    // Reset some fields
    setProdName('');
    setProdSwahiliName('');
    setProdDesc('');
  };

  const handleAddFeature = () => {
    if (prodFeatureInput.trim()) {
      setProdFeatures([...prodFeatures, prodFeatureInput.trim()]);
      setProdFeatureInput('');
    }
  };

  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admEmail.trim() || !admPassword.trim()) return;

    await addAdminAccount(admEmail, admName || admEmail.split('@')[0], admPassword);
    setAdmSuccessMsg(`Successfully added administrator credential for ${admEmail}!`);
    setAdmEmail('');
    setAdmName('');
    setAdmPassword('');
    setTimeout(() => setAdmSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                ROOT ENCLAVE SUPERADMIN
              </span>
              <span className="text-xs text-green-400 font-mono flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1.5 animate-pulse" />
                TELEMETRY ACTIVE
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">
              {swahiliMode ? 'Kituo cha Utawala cha SmartTrade' : 'SmartTrade Africa Admin and Movement Enclave'}
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as <span className="text-white font-mono">{user.email}</span> ({user.name})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <a
            href="/SmartTrade_IA428_Trust_Management_Report.docx"
            download="SmartTrade_IA428_Trust_Management_Report.docx"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95"
            title="Download IA 428 Academic Report with Screenshot Figures"
          >
            <span className="text-base">📄</span>
            <span>{swahiliMode ? 'Pakua Ripoti Rasmi (.DOCX)' : 'Download IA 428 Report (.DOCX)'}</span>
          </a>
          <button
            onClick={() => setActiveTab('movements')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'movements' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>User Movements ({userMovements.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'inventory' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart and Products ({cart.length + products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tcp_security')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'tcp_security' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>TCP Security Enclave</span>
          </button>
          <button
            onClick={() => setActiveTab('security_health')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'security_health' 
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Security Health Indicators</span>
          </button>
          <button
            onClick={() => setActiveTab('biometric_logs')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'biometric_logs' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-emerald-400" />
            <span>Biometric Attempt Logs ({biometricAttemptLogs?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('tam_analyzer')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'tam_analyzer' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>TAM and UTAUT Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('sales_analytics')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'sales_analytics' 
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>{swahiliMode ? 'Mauzo na Mwenendo (Recharts)' : 'Product Sales Trends (Recharts)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('add_product')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'add_product' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <PackagePlus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => setActiveTab('add_admin')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'add_admin' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Admin ({adminList.length})</span>
          </button>
        </div>
      </div>

      {/* Active Inventory and Live Carts Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center space-x-3">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Catalog Products</p>
            <p className="text-xl font-bold text-white mt-0.5">{products.length} Products</p>
            <p className="text-[10px] text-green-400 font-sans">{products.filter(p => p.inStock).length} active in stock</p>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center space-x-3">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live Cart Units Present</p>
            <p className="text-xl font-bold text-green-400 mt-0.5">{totalItems} Units</p>
            <p className="text-[10px] text-slate-400 font-sans">Across {cart.length} distinct items</p>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Historical Cart Events</p>
            <p className="text-xl font-bold text-purple-400 mt-0.5">{userMovements.filter(m => m.actionType === 'ADD_TO_CART').length} Additions</p>
            <p className="text-[10px] text-slate-400 font-sans">Logged in telemetry</p>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Completed Orders</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{orders.length} Orders</p>
            <p className="text-[10px] text-slate-400 font-sans">Escrow protected</p>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: USER MOVEMENTS TRACKER */}
      {activeTab === 'movements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <Activity className="w-5 h-5 text-blue-400 mr-2" />
                Real-Time User Movement and Telemetry Logs
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit trail tracking all customer interactions, logins, product views, and cart actions across Tanzanian nodes.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={movementSearch}
                  onChange={(e) => setMovementSearch(e.target.value)}
                  placeholder="Search user, action, email..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Action filters */}
          <div className="flex flex-wrap gap-2 text-xs">
            {['ALL', 'LOGIN', 'PAGE_VIEW', 'ADD_TO_CART', 'CHECKOUT', 'SEARCH', 'BIOMETRIC', 'ADD_PRODUCT', 'ADD_ADMIN'].map((action) => (
              <button
                key={action}
                onClick={() => setMovementFilter(action)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  movementFilter === action
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Movements table list */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">Time (EAT)</th>
                    <th className="py-3 px-4">User / Enclave Identity</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Activity Description</th>
                    <th className="py-3 px-4">Node / Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredMovements.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No movement telemetry matching current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMovements.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                        <td className="py-3 px-4">
                          <div className="font-sans font-bold text-white">{log.userName}</div>
                          <div className="text-[10px] text-slate-500">{log.userEmail}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            log.actionType === 'LOGIN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                            log.actionType === 'CHECKOUT' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                            log.actionType === 'ADD_TO_CART' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                            log.actionType === 'ADD_ADMIN' || log.actionType === 'ADD_PRODUCT' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                            'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {log.actionType}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-300 max-w-md">{log.description}</td>
                        <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">{log.ipOrDevice || 'Tanzania Edge Node'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: CART and PRODUCTS INVENTORY OVERVIEW */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Quick Jump to Sales Analytics Banner */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {swahiliMode ? 'Mchanganuo wa Mauzo na Grafu za Recharts' : 'Product Sales Performance and Trends Engine'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {swahiliMode
                    ? 'Tazama mwenendo wa mauzo, bidhaa zinazoongoza na kategoria kupitia grafu shirikishi za Recharts.'
                    : 'Visualize chronological revenue trends, unit velocity, and product category breakdowns using Recharts.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('sales_analytics')}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 transition-all shrink-0 flex items-center justify-center space-x-2"
            >
              <span>{swahiliMode ? 'Fungua Grafu za Mauzo' : 'Launch Sales Dashboard'}</span>
              <span>→</span>
            </button>
          </div>

          {/* Active Cart Summary Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center">
                  <ShoppingCart className="w-5 h-5 text-green-400 mr-2" />
                  {swahiliMode ? 'Mikokoteni Hai na Bidhaa Zilizomo (Live Carts)' : 'Live Active Carts and Items Present'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {swahiliMode
                    ? 'Orodha ya bidhaa zote zilizochaguliwa na wateja kwenye vikapu vyao sasa hivi.'
                    : 'Detailed breakdown of all items currently residing in active customer shopping carts.'}
                </p>
              </div>
              <div className="bg-slate-950 px-4 py-2 rounded-xl border border-green-500/30 text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Cart Value</span>
                <span className="text-sm font-bold text-green-400 font-mono">TSh {subtotalTzs.toLocaleString()}</span>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 font-mono text-xs">
                No items present in live customer carts right now. Items added will appear here instantly.
              </div>
            ) : (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold">
                        <th className="py-3 px-4">Product Present in Cart</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-center">Unit Price (TSh)</th>
                        <th className="py-3 px-4 text-center">Quantity Present</th>
                        <th className="py-3 px-4 text-right">Line Total (TSh)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {cart.map((item) => (
                        <tr key={item.product.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img src={item.product.image} alt={item.product.name} className="w-9 h-9 rounded-lg object-cover border border-slate-800 shrink-0" />
                              <div>
                                <div className="font-sans font-bold text-white text-xs line-clamp-1">{item.product.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">ID: {item.product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-sans text-slate-400">{item.product.category}</td>
                          <td className="py-3 px-4 text-center text-slate-300">{item.product.priceTzs.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="bg-green-500/20 text-green-400 font-bold px-2.5 py-1 rounded-lg border border-green-500/30">
                              {item.quantity} units
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-white">
                            {(item.product.priceTzs * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* All Catalog Products Present Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center">
                  <Package className="w-5 h-5 text-blue-400 mr-2" />
                  {swahiliMode ? 'Orodha ya Bidhaa Zote Zilizopo Katika Stoo' : 'Total Catalog Products Present in Marketplace'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {swahiliMode
                    ? `Jumla ya bidhaa ${products.length} zilizokaguliwa na kudhibitishwa kuuzwa nchini Tanzania.`
                    : `Complete inventory tally of all ${products.length} products active across Tanzanian regions.`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-500/20 text-blue-400 text-xs font-bold font-mono px-3 py-1.5 rounded-xl border border-blue-500/30">
                  Total Present: {products.length} Products
                </span>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold">
                      <th className="py-3 px-4">Product Name and Seller</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Price (TSh)</th>
                      <th className="py-3 px-4 text-center">Stock Status</th>
                      <th className="py-3 px-4 text-center">Trust and Security</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-slate-800 shrink-0" />
                            <div>
                              <div className="font-sans font-bold text-white text-xs line-clamp-1">{p.name}</div>
                              <div className="text-[10px] text-slate-500">{p.seller.name} • {p.seller.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-400">{p.category}</td>
                        <td className="py-3 px-4 text-right font-bold text-white">{p.priceTzs.toLocaleString()}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.inStock ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center space-x-1 text-blue-400 text-[10px]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: SECURITY HEALTH INDICATORS */}
      {(activeTab === 'security_health' || activeTab === 'tcp_security') && (
        <div className="space-y-6">
          <SecurityHealthIndicators />
        </div>
      )}

      {/* SUB-TAB: TCP SECURITY ENCLAVE */}
      {activeTab === 'tcp_security' && (
        <div className="space-y-6">
          <TcpSecurityHub />
        </div>
      )}

      {/* SUB-TAB: BIOMETRIC AUTHENTICATION ATTEMPT LOGS */}
      {(activeTab === 'biometric_logs' || activeTab === 'tcp_security') && (
        <div className="space-y-6">
          <BiometricThresholdAlert 
            logs={biometricAttemptLogs || []} 
            onThresholdExceededChange={setIsThresholdAlertActive} 
          />
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                  FIDO2 / WEBAUTHN HARDWARE ENCLAVE
                </span>
                <span className="text-xs text-slate-400 font-mono">256-Bit Cryptographic Telemetry</span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center mt-1.5">
                <Fingerprint className="w-5 h-5 text-emerald-400 mr-2 shrink-0" />
                <span>Biometric Authentication Attempt Logs</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Detailed audit trail showing exact timestamp, device/sensor platform telemetry, and verification result for all biometric attempts occurring across the platform.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
              {(['ALL', 'SUCCESS', 'FAILED', 'REJECTED'] as const).map(res => (
                <button
                  key={res}
                  onClick={() => setBiometricFilter(res)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    biometricFilter === res
                      ? res === 'SUCCESS' ? 'bg-emerald-600 text-white' : res === 'FAILED' || res === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {res === 'ALL' ? 'All Attempts' : res}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4 font-bold">Attempt ID</th>
                  <th className="py-3.5 px-4 font-bold">Timestamp</th>
                  <th className="py-3.5 px-4 font-bold">User Identity</th>
                  <th className="py-3.5 px-4 font-bold">Action Type</th>
                  <th className="py-3.5 px-4 font-bold">Device and Sensor Info</th>
                  <th className="py-3.5 px-4 font-bold">Result (Success/Fail)</th>
                  <th className="py-3.5 px-4 font-bold">Cryptographic Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300 font-medium">
                {biometricAttemptLogs
                  ?.filter(l => biometricFilter === 'ALL' || l.result === biometricFilter)
                  .map((log) => (
                    <tr 
                      key={log.id} 
                      className={`transition-colors ${
                        isThresholdAlertActive && (log.result === 'FAILED' || log.result === 'REJECTED')
                          ? 'bg-rose-950/70 text-rose-100 font-bold border-l-4 border-rose-500 hover:bg-rose-900/80'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{log.id}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-white font-semibold">{log.userEmailOrId}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.actionType === 'ENROLLMENT' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          log.actionType === 'CHECKOUT_AUTHORIZATION' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {log.actionType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          {log.deviceInfo.toLowerCase().includes('mobile') || log.deviceInfo.toLowerCase().includes('android') || log.deviceInfo.toLowerCase().includes('iphone') ? (
                            <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <Monitor className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="text-slate-200">{log.deviceInfo}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.result === 'SUCCESS' ? (
                          <span className="inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>SUCCESS</span>
                          </span>
                        ) : log.result === 'FAILED' ? (
                          <span className="inline-flex items-center space-x-1.5 bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full text-[11px] font-bold border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>FAILED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full text-[11px] font-bold border border-amber-500/30">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>REJECTED</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate" title={log.detail}>
                        {log.detail}
                      </td>
                    </tr>
                  ))}
                {(!biometricAttemptLogs || biometricAttemptLogs.length === 0) && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                      No biometric authentication attempts recorded in enclave memory yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* SUB-TAB: TAM AND UTAUT TRUST ANALYZER */}
      {activeTab === 'tam_analyzer' && (
        <div className="space-y-6">
          <TamUtautDashboard />
        </div>
      )}

      {/* SUB-TAB: PRODUCT SALES PERFORMANCE and TRENDS (RECHARTS) */}
      {activeTab === 'sales_analytics' && (
        <div className="space-y-6">
          <ProductSalesAnalytics products={products} />
        </div>
      )}

      {/* SUB-TAB 2: ADD PRODUCT */}
      {activeTab === 'add_product' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <PackagePlus className="w-5 h-5 text-blue-400 mr-2" />
                Add New Product to Live Catalog
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Products created here are immediately listed in the SmartTrade Africa storefront in Tanzanian Shillings.
              </p>
            </div>
          </div>

          {prodSuccessMsg && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-2xl flex items-center space-x-3 text-sm font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{prodSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddProductSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left col */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g., iPhone 15 Pro Max 256GB"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Swahili Name (Optional)</label>
                  <input
                    type="text"
                    value={prodSwahiliName}
                    onChange={(e) => setProdSwahiliName(e.target.value)}
                    placeholder="e.g., Simu ya Kisasa ya iPhone 15 Pro Max"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Category *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as Category)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Electronics and Gadgets">Electronics and Gadgets</option>
                      <option value="Solar and Power Solutions">Solar and Power Solutions</option>
                      <option value="Agriculture and Coffee">Agriculture and Coffee</option>
                      <option value="Fashion and Kitenge">Fashion and Kitenge</option>
                      <option value="Home and Kitchen">Home and Kitchen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Price (TZS) *</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Original Price (TZS)</label>
                    <input
                      type="number"
                      value={prodOrigPrice}
                      onChange={(e) => setProdOrigPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Seller Name *</label>
                    <input
                      type="text"
                      value={prodSellerName}
                      onChange={(e) => setProdSellerName(e.target.value)}
                      placeholder="e.g., Dar Tech Official"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Right col */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                  {/* Quick preset images */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-500 self-center mr-1">Quick Presets:</span>
                    {[
                      { label: 'Smartphone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Solar Inverter', url: 'https://images.unsplash.com/photo-1509391365360-bbbi007?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Tanzania Coffee', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Kitenge Fashion', url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80' }
                    ].map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setProdImage(preset.url)}
                        className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] font-medium transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Seller Location</label>
                  <input
                    type="text"
                    value={prodSellerLoc}
                    onChange={(e) => setProdSellerLoc(e.target.value)}
                    placeholder="e.g., Posta, Dar es Salaam"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Detailed description of the product..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center space-x-2 text-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Publish Product to Storefront</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: ADD ADMIN ACCOUNT */}
      {activeTab === 'add_admin' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 h-fit">
            <h3 className="text-base font-bold text-white flex items-center">
              <UserPlus className="w-5 h-5 text-blue-400 mr-2" />
              Add Another Admin
            </h3>
            <p className="text-xs text-slate-400">
              New administrator accounts will be granted full access to track user telemetry movements and add marketplace products.
            </p>

            {admSuccessMsg && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{admSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddAdminSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email / Username *</label>
                <input
                  type="text"
                  required
                  value={admEmail}
                  onChange={(e) => setAdmEmail(e.target.value)}
                  placeholder="admin2@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={admName}
                  onChange={(e) => setAdmName(e.target.value)}
                  placeholder="e.g., Neema Joseph"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={admPassword}
                  onChange={(e) => setAdmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 text-xs mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Authorize New Admin</span>
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center">
                <Users className="w-5 h-5 text-blue-400 mr-2" />
                Authorized Enclave Administrators ({adminList.length})
              </h3>
            </div>

            <div className="space-y-3">
              {adminList.map((adm) => (
                <div 
                  key={adm.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">
                      {adm.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-white">{adm.name}</h4>
                        {adm.email === 'myovelababeli@gmail.com' && (
                          <span className="bg-blue-500/20 text-blue-400 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                            ROOT CREDENTIAL
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-slate-400">{adm.email}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-[10px] text-slate-500 block">ADDED BY: {adm.addedBy}</span>
                    <span className="text-[10px] font-mono text-green-400 block">STATUS: ENCLAVE ATTESTED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
