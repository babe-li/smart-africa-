import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTzs } from '../utils/format';
import { 
  Package, ShieldCheck, CheckCircle2, Clock, Truck, FileText, ArrowUpRight,
  Award, Sparkles, Activity, TrendingUp, UserCheck, ShieldAlert, Gift, MessageSquare, Phone, Send, Smartphone,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentSmsModal } from './PaymentSmsModal';

interface OrderTrackingProps {
  order: any;
  swahiliMode: boolean;
  updateOrderStatus: (id: string, status: any) => void;
  onReleaseEscrow: (id: string) => void;
}

const OrderTrackingTimeline: React.FC<OrderTrackingProps> = ({
  order,
  swahiliMode,
  updateOrderStatus,
  onReleaseEscrow
}) => {
  const [showLogs, setShowLogs] = React.useState(false);
  const [isSimulating, setIsSimulating] = React.useState(false);

  // Status mapping to steps: Confirmed=0, Processing=1, Shipped=2, Delivered=3
  const statusToStep: Record<string, number> = {
    'Confirmed': 0,
    'Processing': 1,
    'Shipped': 2,
    'Delivered': 3
  };

  const currentStep = statusToStep[order.status] ?? 0;

  const steps = [
    { key: 'Confirmed', label: swahiliMode ? 'Mkataba' : 'Escrow Secured', sub: swahiliMode ? 'Malipo Kwenye Escrow' : 'Payment locked', timeOffset: '09:30' },
    { key: 'Processing', label: swahiliMode ? 'Maandalizi' : 'Processing', sub: swahiliMode ? 'Imefungashwa Vizuri' : 'Packed & Inspected', timeOffset: '11:15' },
    { key: 'Shipped', label: swahiliMode ? 'Njiani' : 'In Transit', sub: swahiliMode ? 'Inasafirishwa Sasa' : 'Out for delivery', timeOffset: '14:00' },
    { key: 'Delivered', label: swahiliMode ? 'Imewasilishwa' : 'Delivered', sub: swahiliMode ? 'Mkataba Umekamilika' : 'Funds released', timeOffset: '16:45' }
  ];

  const getStepPercent = () => {
    if (currentStep === 0) return 12;
    if (currentStep === 1) return 40;
    if (currentStep === 2) return 72;
    return 100;
  };

  const sellerName = order.items[0]?.product?.seller?.name || 'SmartTrade Merchant';
  const sellerLocation = order.items[0]?.product?.seller?.location || 'Dar es Salaam';

  const handleNextSimulationStep = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      if (currentStep === 0) {
        updateOrderStatus(order.id, 'Processing');
      } else if (currentStep === 1) {
        updateOrderStatus(order.id, 'Shipped');
      } else if (currentStep === 2) {
        onReleaseEscrow(order.id);
      }
    }, 1000);
  };

  const getLogs = () => {
    const list = [
      { time: `${order.orderDate} 09:30 EAT`, text: swahiliMode ? 'Oda imepokelewa na kusajiliwa kwenye mfumo.' : 'Order successfully registered on SmartTrade secure node.' },
      { time: `${order.orderDate} 09:32 EAT`, text: swahiliMode ? 'Malipo yamehakikiwa na kulindwa kwenye akaunti ya Escrow.' : `M-Pesa Escrow funds locked. Escrow Protection Code ${order.escrowProtectionCode} activated under TCRA guidelines.` },
    ];

    if (currentStep >= 1) {
      list.push({
        time: `${order.orderDate} 11:15 EAT`,
        text: swahiliMode 
          ? `Muuzaji (${sellerName}) amethibitisha na kufungasha bidhaa huko ${sellerLocation}.` 
          : `Merchant (${sellerName}) has inspected, packed, and attached secure anti-tamper barcode seals in ${sellerLocation}.`
      });
    }

    if (currentStep >= 2) {
      list.push({
        time: `${order.orderDate} 14:00 EAT`,
        text: swahiliMode
          ? 'Mzigo umekabidhiwa kwa dereva wa SmartTrade na kuanza safari ya uwandani.'
          : 'Package dispatched. Handed over to smartDelivery Express Rider: Juma Hamisi (Vespa TZ-908, +255 764 921 002).'
      });
      list.push({
        time: `${order.orderDate} 15:30 EAT`,
        text: swahiliMode
          ? 'Mzigo umepita kituo cha ukaguzi cha kati na kuelekea anwani ya mteja.'
          : `Shipment arrived at Regional Transit Enclave. Dispatched toward delivery point at: ${order.shippingAddress}.`
      });
    }

    if (currentStep >= 3) {
      list.push({
        time: `${order.orderDate} 16:45 EAT`,
        text: swahiliMode
          ? 'Mteja amethibitisha kupokea bidhaa. Fedha za Escrow zimeachiwa kwenda kwa muuzaji.'
          : 'Delivery verification completed. Cryptographic signature approved. Escrow release executed successfully.'
      });
    }

    return list.reverse();
  };

  return (
    <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-5 mt-4 space-y-5">
      {/* Tracker Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-bold text-xs text-slate-200">
            {swahiliMode ? 'Mfuatiliaji wa Usafirishaji wa Wakati Halisi' : 'Real-Time smartDelivery Status'}
          </span>
          {currentStep === 2 && (
            <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30 animate-pulse">
              {swahiliMode ? 'Katika Usafirishaji' : 'Live Transit'}
            </span>
          )}
        </div>

        {/* Demo simulator controls */}
        <div className="flex items-center space-x-2">
          {currentStep < 3 ? (
            <button
              onClick={handleNextSimulationStep}
              disabled={isSimulating}
              className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-blue-500/15 hover:bg-blue-500/35 text-blue-300 border border-blue-500/30 transition-all cursor-pointer flex items-center space-x-1"
              title="Advance shipment stages to test dynamic telemetry"
            >
              {isSimulating ? (
                <>
                  <span className="w-2.5 h-2.5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></span>
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>
                    {currentStep === 0 && (swahiliMode ? 'Anza Maandalizi' : 'Simulate Processing')}
                    {currentStep === 1 && (swahiliMode ? 'Anza Kusafirisha' : 'Simulate Shipment')}
                    {currentStep === 2 && (swahiliMode ? 'Kamilisha Uwasilishaji' : 'Simulate Delivery')}
                  </span>
                </>
              )}
            </button>
          ) : (
            <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center space-x-1">
              <span>✓</span>
              <span>{swahiliMode ? 'Imekamilika' : 'Escrow Released'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="relative pt-2 pb-4">
        {/* Progress Background track line */}
        <div className="absolute top-[34px] left-8 right-8 h-1 bg-slate-800 rounded-full" />
        
        {/* Active glowing progress track line */}
        <div 
          className="absolute top-[34px] left-8 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
          style={{ width: `calc(${getStepPercent()}% - 32px)` }}
        />

        {/* Timeline Steps Grid */}
        <div className="grid grid-cols-4 relative z-10 text-center">
          {steps.map((s, index) => {
            const isCompleted = currentStep >= index;
            const isActive = currentStep === index;
            
            let StepIcon = Package;
            if (index === 0) StepIcon = ShieldCheck;
            if (index === 1) StepIcon = Package;
            if (index === 2) StepIcon = Truck;
            if (index === 3) StepIcon = CheckCircle2;

            return (
              <div key={s.key} className="flex flex-col items-center">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-slate-900 border-blue-400 text-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.4)] scale-110' 
                      : isCompleted 
                        ? 'bg-slate-900 border-emerald-400 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold mt-2 ${isActive ? 'text-blue-300' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                <span className="text-[8px] text-slate-500 hidden sm:block max-w-[100px] mt-0.5 leading-tight">
                  {s.sub}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transit Map / Live Route Simulation */}
      {currentStep === 2 && (
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-col md:flex-row items-stretch gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider">{swahiliMode ? 'Dereva wako' : 'smartDelivery Rider'}</span>
              <span className="text-blue-400 font-bold">ETA: 28 Mins</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold">
                JH
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">Juma Hamisi</p>
                <p className="text-[10px] text-slate-400">Vespa EV Boxer • TZ-908</p>
              </div>
              <a 
                href="tel:+255764921002"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Call Courier"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
              {swahiliMode ? 'Njia ya Usafirishaji' : 'Route Landmark Progression'}
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 relative">
              <div className="absolute top-1.5 left-2 right-2 h-0.5 bg-slate-800 z-0" />
              
              <div className="flex flex-col items-start relative z-10">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                <span className="mt-1 font-bold text-emerald-400">Merchant</span>
              </div>
              
              <div className="flex flex-col items-center relative z-10">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                <span className="mt-1 text-emerald-400">Mwenge</span>
              </div>

              <div className="flex flex-col items-center relative z-10">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-900 animate-pulse" />
                <span className="mt-1 font-bold text-blue-300">Transit Node</span>
              </div>

              <div className="flex flex-col items-end relative z-10">
                <span className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-900" />
                <span className="mt-1 text-slate-500">{swahiliMode ? 'Nyumbani' : 'Home'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Shipment Audit Log */}
      <div className="border-t border-slate-800 pt-3">
        <button 
          onClick={() => setShowLogs(!showLogs)}
          className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-white transition-colors py-1 cursor-pointer font-bold"
        >
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            {swahiliMode ? 'Kumbukumbu za Usafirishaji' : 'Detailed Delivery Telemetry Logs'}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {showLogs ? (swahiliMode ? 'Funga ▲' : 'Collapse ▲') : (swahiliMode ? 'Fungua ▼' : 'Expand ▼')}
          </span>
        </button>

        {showLogs && (
          <div className="mt-3.5 space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {getLogs().map((log, lIdx) => (
              <div key={lIdx} className="flex items-start text-[11px] font-mono leading-relaxed group">
                <span className="text-slate-500 shrink-0 w-32 select-none">{log.time}</span>
                <span className="text-slate-400 border-l border-slate-800 pl-3.5 relative py-0.5">
                  <span className="absolute -left-1 top-2 w-2 h-2 rounded-full bg-blue-500/40 group-first:bg-blue-400" />
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useCart();
  const { user, biometricStatus, swahiliMode, addSecurityLog } = useAuth();
  const [smsPhones, setSmsPhones] = React.useState<Record<string, string>>({});
  const [smsSentStatus, setSmsSentStatus] = React.useState<Record<string, string>>({});
  const [activeSmsOrder, setActiveSmsOrder] = React.useState<any | null>(null);

  const handleReleaseEscrow = (orderId: string) => {
    confetti({ particleCount: 80, spread: 60 });
    updateOrderStatus(orderId, 'Delivered');
    addSecurityLog({
      type: 'TCP_ATTESTATION',
      status: 'PASSED',
      detail: `Buyer confirmed physical receipt of order ${orderId}. Escrow lock released to seller bank account in TZS.`,
      payloadSnippet: `ESCROW_RELEASE_AUTH: SIG_OK`
    });
  };

  const handleSendOrderSms = (order: any) => {
    const targetPhone = smsPhones[order.id] || order.buyerPhone || '0754 882 190';
    addSecurityLog({
      type: 'SMS_DISPATCH',
      status: 'PASSED',
      detail: `SMS product buying confirmation dispatched to mobile number ${targetPhone} for Order #${order.id}.`,
      payloadSnippet: `SMS_GATEWAY: DELIVERED TO ${targetPhone}`
    });
    setSmsSentStatus(prev => ({ 
      ...prev, 
      [order.id]: swahiliMode ? `Ujumbe wa uthibitisho umetumwa kwenda ${targetPhone}` : `Confirmation SMS dispatched to ${targetPhone}` 
    }));
    setActiveSmsOrder(order);
  };

  // Calculate Loyalty Points based on total purchase spend
  const totalPurchaseTzs = orders.reduce((sum, ord) => sum + (ord.totalTzs || 0), 0);
  const loyaltyPoints = Math.floor(totalPurchaseTzs / 100);

  const getLoyaltyTier = (pts: number) => {
    if (pts >= 10000) return { name: swahiliMode ? 'Balozi wa Platinamu' : 'Platinum Ambassador', badgeBg: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 text-cyan-300', nextTier: 25000 };
    if (pts >= 2500) return { name: swahiliMode ? 'Dhahabu Maalum' : 'Gold Elite VIP', badgeBg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400 text-amber-300', nextTier: 10000 };
    if (pts >= 500) return { name: swahiliMode ? 'Mwanachama wa Fedha' : 'Silver Escrow VIP', badgeBg: 'bg-gradient-to-r from-slate-400/20 to-blue-400/20 border-slate-400 text-slate-200', nextTier: 2500 };
    return { name: swahiliMode ? 'Mwanachama Shujaa' : 'Bronze Trader', badgeBg: 'bg-gradient-to-r from-orange-600/20 to-amber-600/20 border-orange-500 text-orange-300', nextTier: 500 };
  };

  const tier = getLoyaltyTier(loyaltyPoints);
  const progressPercent = Math.min(100, Math.round((loyaltyPoints / tier.nextTier) * 100));

  // Calculate Fraud Risk Indicator score based on WebAuthn and browser telemetry
  const calculateFraudRisk = (orderId: string) => {
    const isWebAuthnReady = biometricStatus === 'ready' || biometricStatus === 'success' || user?.fingerprintRegistered;
    const isSecureEnclave = user?.deviceInfo?.secureEnclave;
    const baseScore = isWebAuthnReady ? 0.7 : (isSecureEnclave ? 2.1 : 4.8);
    const charSum = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockScore = Number((baseScore + (charSum % 12) * 0.1).toFixed(1));
    return {
      score: mockScore,
      level: mockScore < 2.0 ? 'MINIMAL' : (mockScore < 4.0 ? 'LOW' : 'MODERATE'),
      color: mockScore < 2.0 ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {swahiliMode ? 'Oda Zangu and Risiti za Kielektroniki' : 'Escrow Orders and Cryptographic Receipts'}
          </h1>
        </div>
        <div className="hidden sm:flex bg-blue-500/10 text-blue-400 p-3 rounded-xl border border-blue-500/20 items-center">
          <ShieldCheck className="w-6 h-6 mr-2" />
          <span className="text-xs font-bold">100% Fraud Free</span>
        </div>
      </div>

      {/* User Profile and Loyalty Points Display */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-blue-400/30 shrink-0">
              {user ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg font-bold text-white">
                  {user ? user.name : (swahiliMode ? 'Akaunti ya Mgeni' : 'Guest Account')}
                </h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shadow-sm ${tier.badgeBg}`}>
                  <Award className="w-3 h-3 mr-1" />
                  {tier.name}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                  {loyaltyPoints.toLocaleString()} {swahiliMode ? 'Pointi za Uaminifu' : 'Loyalty Pts'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                <span>{user?.email || 'user@smarttrade.co.tz'}</span>
                <span>•</span>
                <span>{user?.phone || '+255 754 *** ***'}</span>
                <span>•</span>
                <span className="text-blue-400 font-semibold flex items-center">
                  <UserCheck className="w-3 h-3 mr-1 inline" />
                  {user?.location || 'Dar es Salaam, TZ'}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center font-medium">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                {swahiliMode ? 'Jumla ya Manunuzi:' : 'Total Purchase Spend:'}
              </span>
              <span className="font-bold font-mono text-white">{formatTzs(totalPurchaseTzs)}</span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-400">
                  {swahiliMode ? 'Maendeleo ya Daraja:' : 'Tier Progress:'} <strong className="text-amber-300">{loyaltyPoints.toLocaleString()} Pts</strong>
                </span>
                <span className="text-slate-500">{tier.nextTier.toLocaleString()} Pts Goal</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              {swahiliMode
                ? 'Unapata Pointi 1 ya Uaminifu kwa kila TSh 100 unazotumia kulipia oda zilizohakikiwa na Escrow.'
                : 'Earn 1 SmartTrade Loyalty Point per 100 TZS purchase total. Redeemable for escrow fee waivers and priority shipping.'}
            </p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-12 text-center border border-slate-800 shadow-xl space-y-3">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-400">Add products to cart and complete secure checkout using M-Pesa, Tigo Pesa, or Card.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-200">
              {/* Order Header bar */}
              <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <span className="text-slate-500 block font-semibold text-[10px]">ORDER PLACED</span>
                    <span className="font-bold text-white">{order.orderDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold text-[10px]">TOTAL AMOUNT</span>
                    <span className="font-bold text-blue-400">{formatTzs(order.totalTzs)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold text-[10px]">DELIVERY TO</span>
                    <span className="font-bold text-white truncate max-w-[180px] block">{order.shippingAddress}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {(() => {
                    const risk = calculateFraudRisk(order.id);
                    return (
                      <span 
                        className={`px-2.5 py-1 rounded font-mono font-bold text-[10px] flex items-center border shadow-sm ${risk.color}`} 
                        title="Mock Fraud Risk score calculated from WebAuthn verification status and browser TPM telemetry"
                      >
                        <Activity className="w-3 h-3 mr-1" />
                        Fraud Risk: {risk.score}% ({risk.level})
                      </span>
                    );
                  })()}
                  <span className="font-mono text-[10px] bg-slate-800 text-blue-300 px-2.5 py-1 rounded font-bold border border-slate-700">
                    ID: #{order.id}
                  </span>
                  <span className={`px-2.5 py-1 rounded font-bold text-xs flex items-center ${
                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {order.status === 'Delivered' ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <Clock className="w-3.5 h-3.5 mr-1" />}
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 divide-y divide-slate-800">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.product.name}</h4>
                        <p className="text-xs text-blue-400">Seller: {item.product.seller.name}</p>
                        <p className="text-xs font-bold text-slate-300 mt-1">Qty: {item.quantity} × {formatTzs(item.product.priceTzs)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Real-Time Order Tracking and Shipment Telemetry */}
              <div className="px-6 pb-6">
                <OrderTrackingTimeline 
                  order={order} 
                  swahiliMode={swahiliMode} 
                  updateOrderStatus={updateOrderStatus} 
                  onReleaseEscrow={handleReleaseEscrow} 
                />
              </div>

              {/* Send Product Buying Confirmation SMS Box */}
              <div className="bg-slate-900/90 px-6 py-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">
                      {swahiliMode ? 'Tuma Ujumbe wa SMS Thabitishi' : 'Send Product Buying Confirmation SMS'}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {swahiliMode ? 'Tuma risiti au thibitisho la ununuzi kwenda kwenye simu ya mkononi.' : 'Dispatch instant SMS/WhatsApp delivery and escrow receipt to mobile number.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={smsPhones[order.id] !== undefined ? smsPhones[order.id] : (order.buyerPhone || '0754 882 190')}
                    onChange={(e) => setSmsPhones(prev => ({ ...prev, [order.id]: e.target.value }))}
                    placeholder="07xx xxx xxx"
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-emerald-500 transition-colors w-36 sm:w-40"
                  />
                  <button
                    onClick={() => setActiveSmsOrder(order)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-colors shadow shrink-0 cursor-pointer"
                    title="Launch Live SMS and WhatsApp Gateway Hub"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{swahiliMode ? '🚀 Tuma SMS Halisi / WhatsApp' : '🚀 Send Live SMS / WhatsApp'}</span>
                  </button>
                </div>
              </div>

              {smsSentStatus[order.id] && (
                <div className="bg-emerald-950/60 border-t border-emerald-500/30 px-6 py-2 text-[11px] text-emerald-300 font-mono flex items-center justify-between animate-in fade-in">
                  <span className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400 shrink-0" />
                    {smsSentStatus[order.id]}
                  </span>
                  <span className="text-[10px] text-emerald-400/80">TCRA Gateway • Verified</span>
                </div>
              )}

              {/* Security Receipt and Escrow Footer */}
              <div className="bg-slate-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono border-t border-slate-800">
                <div>
                  <div className="flex items-center space-x-2 text-green-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ESCROW PROTECTION CODE: {order.escrowProtectionCode}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Crypto Signature: {order.paymentTransaction.cryptoSignature} ({order.paymentTransaction.method.toUpperCase()})
                  </p>
                </div>

                <button
                  onClick={() => handleReleaseEscrow(order.id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center shadow-lg shadow-blue-600/20"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Confirm Delivery and Release Escrow Funds
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSmsOrder && (
        <PaymentSmsModal
          isOpen={!!activeSmsOrder}
          onClose={() => setActiveSmsOrder(null)}
          phone={smsPhones[activeSmsOrder.id] || activeSmsOrder.buyerPhone || '0754 882 190'}
          orderId={activeSmsOrder.id}
          amountTzs={activeSmsOrder.totalTzs}
          paymentMethod={activeSmsOrder.paymentTransaction?.method || 'mpesa'}
        />
      )}
    </div>
  );
};
