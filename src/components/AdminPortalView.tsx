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
  Terminal,
  Mail,
  Send,
  Inbox,
  LogOut,
  Check,
  Loader2
} from 'lucide-react';
import { 
  googleSignIn, 
  googleSignOut, 
  getGmailAccessToken, 
  sendGmailEmail, 
  listGmailMessages, 
  parseGmailMessage, 
  initGmailAuth,
  setGmailAccessToken
} from '../utils/gmail';
import { User as FirebaseUser } from 'firebase/auth';

interface AdminPortalViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onRemoveDuplicates: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ 
  products, 
  onAddProduct,
  onRemoveProduct,
  onRemoveDuplicates
}) => {
  const { user, adminList, addAdminAccount, userMovements, swahiliMode, biometricAttemptLogs } = useAuth();
  const { cart, totalItems, subtotalTzs, orders } = useCart();
  const [activeTab, setActiveTab] = useState<'movements' | 'inventory' | 'tcp_security' | 'biometric_logs' | 'tam_analyzer' | 'sales_analytics' | 'add_product' | 'add_admin' | 'security_health' | 'gmail_hub'>('movements');

  // Gmail State variables
  const [gmailUser, setGmailUser] = useState<FirebaseUser | null>(null);
  const [gmailToken, setGmailToken] = useState<string | null>(null);
  const [gmailIsLoading, setGmailIsLoading] = useState<boolean>(true);
  const [gmailRecipient, setGmailRecipient] = useState<string>('myovelababeli@gmail.com');
  const [gmailSubject, setGmailSubject] = useState<string>('SmartTrade Africa Notification');
  const [gmailBody, setGmailBody] = useState<string>(`<h3>SmartTrade Tanzania - Order Receipt</h3>
<p>Habari,</p>
<p>Oda yako imehakikiwa na kulindwa kwa Escrow chini ya mwongozo wa TCRA na Benki Kuu ya Tanzania.</p>
<p>Asante kwa kufanya biashara nasi!</p>`);
  const [gmailMessages, setGmailMessages] = useState<any[]>([]);
  const [gmailSelectedMsg, setGmailSelectedMsg] = useState<any | null>(null);
  const [gmailIsSending, setGmailIsSending] = useState<boolean>(false);
  const [gmailIsFetching, setGmailIsFetching] = useState<boolean>(false);
  const [gmailSendSuccess, setGmailSendSuccess] = useState<boolean>(false);
  const [gmailSendError, setGmailSendError] = useState<string | null>(null);
  const [gmailFetchError, setGmailFetchError] = useState<string | null>(null);

  // Initialize Gmail authorization state listener
  React.useEffect(() => {
    const unsubscribe = initGmailAuth(
      (user, token) => {
        setGmailUser(user);
        setGmailToken(token);
        setGmailIsLoading(false);
      },
      () => {
        setGmailUser(null);
        setGmailToken(null);
        setGmailIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGmailLogin = async () => {
    try {
      setGmailIsLoading(true);
      const res = await googleSignIn();
      if (res) {
        setGmailUser(res.user);
        setGmailToken(res.accessToken);
      }
    } catch (err: any) {
      console.error('Failed to authenticate with Google Gmail:', err);
    } finally {
      setGmailIsLoading(false);
    }
  };

  const handleGmailLogout = async () => {
    try {
      await googleSignOut();
      setGmailUser(null);
      setGmailToken(null);
      setGmailMessages([]);
      setGmailSelectedMsg(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleFetchEmails = async () => {
    if (!getGmailAccessToken()) return;
    setGmailIsFetching(true);
    setGmailFetchError(null);
    try {
      const msgs = await listGmailMessages('subject:(SmartTrade OR Oda OR Receipt OR Payment OR Escrow OR Invoice)');
      const parsed = msgs.map(msg => parseGmailMessage(msg)).filter(Boolean);
      setGmailMessages(parsed);
    } catch (err: any) {
      console.error('Failed to list Gmail messages:', err);
      setGmailFetchError(err.message || 'Failed to sync emails');
    } finally {
      setGmailIsFetching(false);
    }
  };

  // Automatically fetch emails when token is acquired or when tab is activated
  React.useEffect(() => {
    if (activeTab === 'gmail_hub' && gmailToken) {
      handleFetchEmails();
    }
  }, [activeTab, gmailToken]);

  const EMAIL_TEMPLATES = [
    {
      name: 'Escrow Secured (EN)',
      subject: 'SmartTrade Africa - Escrow Funds Locked Successfully',
      body: `<h3>🔒 SmartTrade Tanzania Escrow Confirmation</h3>
<p>Hello,</p>
<p>Your payment has been successfully verified and locked in our TCRA-authorized Escrow ledger.</p>
<p><strong>Order ID:</strong> #ST-90372<br>
<strong>Escrow Protection Code:</strong> ST-MPESA-SECURE</p>
<p>The merchant has been notified to begin package preparation immediately. Funds will only be released to the merchant once you physically receive and verify the item.</p>
<p>Thank you for trading securely,<br>SmartTrade Team</p>`
    },
    {
      name: 'Escrow Secured (SW)',
      subject: 'SmartTrade Africa - Malipo ya Escrow Yamethibitishwa',
      body: `<h3>🔒 Uthibitisho wa Malipo ya Escrow - SmartTrade</h3>
<p>Habari,</p>
<p>Malipo yako yamehakikiwa na kuhifadhiwa salama kwenye mfumo wetu wa Escrow chini ya mwongozo wa TCRA.</p>
<p><strong>Namba ya Oda:</strong> #ST-90372<br>
<strong>Namba ya Uthibitisho:</strong> ST-MPESA-SECURE</p>
<p>Muuzaji amearifiwa kuanza kuandaa mzigo wako sasa. Fedha zitatumwa kwa muuzaji tu baada ya wewe kupokea na kukagua bidhaa yako.</p>
<p>Asante kwa kutumia SmartTrade,<br>Timu ya SmartTrade</p>`
    },
    {
      name: 'Package in Transit (EN)',
      subject: 'SmartTrade Africa - Your Order is Out for Delivery',
      body: `<h3>🚚 Your Package is Out for Delivery!</h3>
<p>Hi there,</p>
<p>Your SmartTrade order has been handed over to our verified smartDelivery courier and is currently in transit to your shipping address.</p>
<p><strong>Rider Name:</strong> Juma Hamisi (+255 764 921 002)<br>
<strong>Vehicle:</strong> Vespa EV Boxer (TZ-908)</p>
<p>Please have your Escrow Protection Code ready to complete the cryptographic handoff upon physical delivery.</p>
<p>Best regards,<br>smartDelivery Logistics</p>`
    }
  ];

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailRecipient || !gmailSubject || !gmailBody) return;
    setGmailIsSending(true);
    setGmailSendError(null);
    setGmailSendSuccess(false);
    try {
      await sendGmailEmail(gmailRecipient, gmailSubject, gmailBody);
      setGmailSendSuccess(true);
      setTimeout(() => {
        handleFetchEmails();
      }, 1200);
    } catch (err: any) {
      console.error('Failed to send email:', err);
      setGmailSendError(err.message || 'Failed to dispatch email');
    } finally {
      setGmailIsSending(false);
    }
  };

  // Check if there are any duplicate products by name or id
  const hasDuplicates = products.some((p, index) => {
    return products.findIndex(x => x.name.toLowerCase().trim() === p.name.toLowerCase().trim() || x.id === p.id) !== index;
  });

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
          <button
            onClick={() => setActiveTab('gmail_hub')}
            className={`flex-1 md:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'gmail_hub' 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-400" />
            <span>Gmail Hub</span>
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
              <div className="flex items-center gap-3 flex-wrap">
                {hasDuplicates && (
                  <button
                    onClick={onRemoveDuplicates}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-md active:scale-95"
                    title={swahiliMode ? 'Ondoa bidhaa zote zenye majina sawa' : 'Deduplicate products with identical names'}
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span>{swahiliMode ? 'Ondoa Nakala Rudufu' : 'Remove All Duplicates'}</span>
                  </button>
                )}
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
                      <th className="py-3 px-4 text-center">Actions</th>
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
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              if (confirm(swahiliMode ? `Ondoa "${p.name}" kutoka stoo?` : `Are you sure you want to remove "${p.name}"?`)) {
                                onRemoveProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                            title={swahiliMode ? 'Ondoa Bidhaa' : 'Remove Product'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* SUB-TAB: GMAIL INTEGRATION HUB */}
      {activeTab === 'gmail_hub' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Auth & Compose Email */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Google Connection Status Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Google Workspace Identity
                </h3>

                {gmailIsLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 text-rose-500 animate-spin mr-2" />
                    <span className="text-xs text-slate-400 font-mono">Connecting secure gateway...</span>
                  </div>
                ) : !gmailUser ? (
                  <div className="space-y-4 text-center py-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Gmail API Integration Required</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                        Authorize this app to send official order invoices and transaction confirmations directly using your secure Gmail mailbox.
                      </p>
                    </div>
                    <button
                      onClick={handleGmailLogin}
                      className="inline-flex items-center space-x-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-all shadow-md text-xs cursor-pointer active:scale-95"
                    >
                      {/* Google G Icon SVG */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.72v3.08h3.95c2.31-2.13 3.63-5.27 3.63-8.65z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.5 1.18-3.98 1.18-3.07 0-5.67-2.08-6.6-4.88H1.32v3.18A12 12 0 0 0 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.4 14.31A7.16 7.16 0 0 1 5 12c0-.8.14-1.58.4-2.31V6.51H1.32A11.94 11.94 0 0 0 0 12c0 2.05.52 4.02 1.32 5.78l4.08-3.47z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.93 11.93 0 0 0 12 0 12 12 0 0 0 1.32 6.51l4.08 3.47c.93-2.8 3.53-4.88 6.6-4.88z"
                        />
                      </svg>
                      <span>Connect Gmail Account</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="flex items-center space-x-3 min-w-0">
                      {gmailUser.photoURL ? (
                        <img 
                          src={gmailUser.photoURL} 
                          alt="Google Profile" 
                          className="w-10 h-10 rounded-xl border border-rose-500/20 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold shrink-0">
                          {gmailUser.displayName?.charAt(0) || 'G'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{gmailUser.displayName || 'Google Account'}</h4>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{gmailUser.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleGmailLogout}
                      className="p-2 text-slate-400 hover:text-white hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                      title="Disconnect Account"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Compose and Dispatch Box */}
              {gmailUser && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center">
                      <Send className="w-4 h-4 text-rose-400 mr-2" />
                      Dispatch Custom Email Notification
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Send instantaneous escrow confirmation or status updates with complete HTML rendering.
                    </p>
                  </div>

                  {gmailSendSuccess && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Email successfully dispatched via Gmail API!</span>
                    </div>
                  )}

                  {gmailSendError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span className="truncate">{gmailSendError}</span>
                    </div>
                  )}

                  {/* Predefined templates selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Template Presets
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {EMAIL_TEMPLATES.map((tmpl, tIdx) => (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => {
                            setGmailSubject(tmpl.subject);
                            setGmailBody(tmpl.body);
                            setGmailSendSuccess(false);
                          }}
                          className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold rounded-lg border border-slate-800 transition-colors cursor-pointer"
                        >
                          {tmpl.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSendCustomEmail} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Recipient Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={gmailRecipient}
                        onChange={(e) => setGmailRecipient(e.target.value)}
                        placeholder="buyer@gmail.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Subject Line *
                      </label>
                      <input
                        type="text"
                        required
                        value={gmailSubject}
                        onChange={(e) => setGmailSubject(e.target.value)}
                        placeholder="Order Confirmation"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        HTML Body Markup *
                      </label>
                      <textarea
                        rows={7}
                        required
                        value={gmailBody}
                        onChange={(e) => setGmailBody(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors font-mono resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={gmailIsSending}
                      className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2 text-xs cursor-pointer active:scale-95"
                    >
                      {gmailIsSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching RFC 822 MIME payload...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Transmit Secure Invoice Email</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right Column: Live Inbox Viewer */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 h-full flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center">
                        <Inbox className="w-5 h-5 text-rose-400 mr-2" />
                        Live Synchronized Gmail Ledger
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Query live emails with keywords matching escrow receipts directly from your account.
                      </p>
                    </div>

                    {gmailUser && (
                      <button
                        onClick={handleFetchEmails}
                        disabled={gmailIsFetching}
                        className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white border border-slate-800 rounded-xl transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
                      >
                        <Loader2 className={`w-3.5 h-3.5 ${gmailIsFetching ? 'animate-spin text-rose-400' : ''}`} />
                        <span>{gmailIsFetching ? 'Syncing...' : 'Sync Inbox'}</span>
                      </button>
                    )}
                  </div>

                  {gmailFetchError && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs font-bold mt-4">
                      {gmailFetchError}
                    </div>
                  )}

                  {!gmailUser ? (
                    <div className="text-center py-20 text-slate-500 space-y-3">
                      <Inbox className="w-12 h-12 mx-auto text-slate-700" />
                      <p className="text-xs max-w-xs mx-auto">
                        Please authorize your Google account in the left panel to synchronize your live mailbox here.
                      </p>
                    </div>
                  ) : gmailIsFetching && gmailMessages.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-mono text-xs space-y-3 flex flex-col items-center">
                      <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                      <span>Synchronizing live Gmail ledger nodes...</span>
                    </div>
                  ) : gmailMessages.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 space-y-3">
                      <Inbox className="w-12 h-12 mx-auto text-slate-700" />
                      <p className="text-xs max-w-xs mx-auto">
                        No trade-related emails found. Try sending a secure invoice to see it indexed here in real time.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto pr-1 mt-4">
                      {gmailMessages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => setGmailSelectedMsg(msg)}
                          className={`py-3.5 px-3 rounded-2xl cursor-pointer hover:bg-slate-950/60 transition-all flex items-start gap-3.5 border border-transparent ${
                            gmailSelectedMsg?.id === msg.id ? 'bg-slate-950/80 border-rose-500/20 shadow-md' : ''
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-extrabold shrink-0">
                            {msg.from?.charAt(0).toUpperCase() || 'M'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white truncate max-w-[150px]">{msg.from || 'Unknown'}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{msg.date ? new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                            </div>
                            <h4 className="text-xs font-bold text-rose-300 mt-1 truncate">{msg.subject}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{msg.snippet}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected email contents viewer overlay / box */}
                {gmailSelectedMsg && (
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 mt-6 relative animate-in slide-in-from-bottom-4 duration-300">
                    <button
                      onClick={() => setGmailSelectedMsg(null)}
                      className="absolute top-4 right-4 text-xs font-bold text-slate-500 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Close Viewer
                    </button>

                    <div className="space-y-4">
                      <div className="border-b border-slate-800 pb-3">
                        <span className="text-[9px] font-bold font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                          RFC 822 SECURE VIEW
                        </span>
                        <h4 className="text-sm font-bold text-white mt-2 leading-snug">
                          {gmailSelectedMsg.subject}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2 font-mono">
                          <span><strong>From:</strong> {gmailSelectedMsg.from}</span>
                          <span>•</span>
                          <span><strong>Date:</strong> {gmailSelectedMsg.date}</span>
                        </div>
                      </div>

                      {/* Display the html contents or text securely */}
                      <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 text-xs text-slate-300 max-h-60 overflow-y-auto leading-relaxed overflow-x-auto">
                        {gmailSelectedMsg.body?.includes('<') ? (
                          <div dangerouslySetInnerHTML={{ __html: gmailSelectedMsg.body }} />
                        ) : (
                          <pre className="whitespace-pre-wrap font-sans font-medium">{gmailSelectedMsg.body}</pre>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
