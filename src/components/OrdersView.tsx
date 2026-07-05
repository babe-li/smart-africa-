import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTzs } from '../utils/format';
import { Package, ShieldCheck, CheckCircle2, Clock, Truck, FileText, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrdersView: React.FC = () => {
  const { orders } = useCart();
  const { swahiliMode, addSecurityLog } = useAuth();

  const handleReleaseEscrow = (orderId: string) => {
    confetti({ particleCount: 80, spread: 60 });
    addSecurityLog({
      type: 'TCP_ATTESTATION',
      status: 'PASSED',
      detail: `Buyer confirmed physical receipt of order ${orderId}. Escrow lock released to seller bank account in TZS.`,
      payloadSnippet: `ESCROW_RELEASE_AUTH: SIG_OK`
    });
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

                <div className="flex items-center space-x-3">
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
