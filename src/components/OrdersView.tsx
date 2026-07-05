import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTzs } from '../utils/format';
import { 
  Package, ShieldCheck, CheckCircle2, Clock, Truck, FileText, ArrowUpRight,
  Award, Sparkles, Activity, TrendingUp, UserCheck, ShieldAlert, Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrdersView: React.FC = () => {
  const { orders } = useCart();
  const { user, biometricStatus, swahiliMode, addSecurityLog } = useAuth();

  const handleReleaseEscrow = (orderId: string) => {
    confetti({ particleCount: 80, spread: 60 });
    addSecurityLog({
      type: 'TCP_ATTESTATION',
      status: 'PASSED',
      detail: `Buyer confirmed physical receipt of order ${orderId}. Escrow lock released to seller bank account in TZS.`,
      payloadSnippet: `ESCROW_RELEASE_AUTH: SIG_OK`
    });
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
          <p className="text-xs text-slate-400 mt-1">
            All purchases are backed by SmartTrade 100% Escrow Protection Guarantee supervised by TCRA guidelines.
          </p>
        </div>
        <div className="hidden sm:flex bg-blue-500/10 text-blue-400 p-3 rounded-xl border border-blue-500/20 items-center">
          <ShieldCheck className="w-6 h-6 mr-2" />
          <span className="text-xs font-bold">100% Fraud Free</span>
        </div>
      </div>

      {/* User Profile & Loyalty Points Display */}
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
                : 'Earn 1 SmartTrade Loyalty Point per 100 TZS purchase total. Redeemable for escrow fee waivers & priority shipping.'}
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
                        title="Mock Fraud Risk score calculated from WebAuthn verification status & browser TPM telemetry"
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

              {/* Security Receipt & Escrow Footer */}
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
    </div>
  );
};
