import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTzs } from '../utils/format';
import { PaymentMethodType, Order } from '../types';
import { ShieldCheck, Fingerprint, Lock, CheckCircle2, Phone, CreditCard, AlertCircle, RefreshCw, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const { cart, totalTzs, clearCart, escrowEnabled, addOrder } = useCart();
  const { user, authenticateWithFingerprint, addSecurityLog, swahiliMode } = useAuth();

  const [method, setMethod] = useState<PaymentMethodType>('mpesa');
  const [phoneOrCard, setPhoneOrCard] = useState('0754 882 190');
  const [address, setAddress] = useState('Masaki, Peninsula Road, Dar es Salaam');
  const [status, setStatus] = useState<'idle' | 'ussd_prompted' | 'biometric_verifying' | 'completed' | 'failed'>('idle');
  const [gatewayLog, setGatewayLog] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('ussd_prompted');
    setGatewayLog('Initiating HTTPS TLS 1.3 handshake with East Africa Payment Sandbox Gateway...');

    addSecurityLog({
      type: 'CSRF_VALIDATION',
      status: 'PASSED',
      detail: `Payment checkout request validated with cryptographically bound session nonce.`,
      payloadSnippet: `Gateway Request: method=${method.toUpperCase()}, amount=${totalTzs} TZS`
    });

    await new Promise(r => setTimeout(r, 1500));
    setGatewayLog(`Simulating USSD Push to ${phoneOrCard}: "Confirm payment of ${formatTzs(totalTzs)} to SMARTTRADE AFRICA LTD"`);

    await new Promise(r => setTimeout(r, 1500));
    setStatus('biometric_verifying');
    setGatewayLog('Prompting user for step-up hardware fingerprint / TouchID signature to authorize escrow transfer...');

    const bioSuccess = await authenticateWithFingerprint();
    if (bioSuccess) {
      setStatus('completed');
      setGatewayLog('Payment authorized! SHA-256 Digital Signature generated. TCRA Escrow locked.');

      addSecurityLog({
        type: 'TCP_ATTESTATION',
        status: 'PASSED',
        detail: `High-value checkout (${formatTzs(totalTzs)}) authorized via hardware WebAuthn fingerprint sensor.`,
        payloadSnippet: `ESCROW_TXN_HASH: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      });

      confetti({ particleCount: 100, spread: 70 });

      const newOrder: Order = {
        id: 'TZ-ORD-' + Math.floor(100000 + Math.random() * 900000),
        items: [...cart],
        totalTzs,
        paymentTransaction: {
          id: 'TXN-' + method.toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
          orderId: 'TZ-ORD-' + Math.floor(100000 + Math.random() * 900000),
          amountTzs: totalTzs,
          method,
          phoneOrCard: phoneOrCard.slice(0, 4) + ' *** ' + phoneOrCard.slice(-3),
          status: 'completed',
          cryptoSignature: 'SHA256-ESCROW-CONFIRMED-TZ' + Math.floor(10000 + Math.random() * 90000),
          timestamp: new Date().toLocaleString('en-TZ'),
          gatewayResponse: {
            status: 'SUCCESS',
            operator: method === 'mpesa' ? 'Vodacom Tanzania' : method === 'tigopesa' ? 'Tigo Pesa' : 'Flutterwave Sandbox',
            escrowProtection: escrowEnabled ? 'ACTIVE' : 'OPTED_OUT'
          }
        },
        status: 'Confirmed',
        shippingAddress: address,
        orderDate: new Date().toISOString().split('T')[0],
        escrowProtectionCode: 'ESCROW-TZ-SAFE-' + Math.floor(10000 + Math.random() * 90000)
      };

      addOrder(newOrder);
      setTimeout(() => {
        clearCart();
        onOrderCompleted(newOrder);
      }, 2200);
    } else {
      setStatus('failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-200 animate-in zoom-in-95 duration-200">
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-bold text-sm text-white">
                {swahiliMode ? 'Malipo Salama ya Mtandaoni' : 'Simulated Payment API Gateway'}
              </h3>
              <p className="text-[10px] text-slate-400">
                256-Bit SSL • TCRA Escrow Protected • Biometric Step-Up
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {status === 'completed' ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto border-2 border-green-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-xl text-white">
                {swahiliMode ? 'Muamala Umekamilika kwa Usalama!' : 'Transaction Approved Securely!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Payment of <span className="font-bold text-blue-400">{formatTzs(totalTzs)}</span> has been locked into Escrow. Your invoice and digital receipt have been generated.
              </p>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[10px] text-left text-slate-400">
                <p>STATUS: <span className="text-green-400">HTTP 200 OK (Gateway Confirmed)</span></p>
                <p>BIOMETRIC ATTESTATION: <span className="text-white">VERIFIED FIDO2</span></p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
              {/* Payment Gateway Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">
                  {swahiliMode ? 'Chagua Njia ya Malipo (Gateway)' : 'Select Tanzanian Payment Gateway'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'mpesa', label: 'Vodacom M-Pesa', icon: '📱' },
                    { id: 'tigopesa', label: 'Tigo Pesa', icon: '📶' },
                    { id: 'airtel', label: 'Airtel Money', icon: '🔴' },
                    { id: 'card', label: 'Visa/Mastercard', icon: '💳' },
                    { id: 'flutterwave', label: 'Flutterwave API', icon: '⚡' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id as PaymentMethodType)}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                        method === m.id
                          ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-lg shadow-blue-600/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span className="truncate">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone / Card Number */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {method === 'card'
                    ? 'Card Number (Simulated Sandbox)'
                    : swahiliMode
                    ? 'Namba ya Simu ya Malipo (USSD Push)'
                    : 'Mobile Money Number for USSD Push'}
                </label>
                <input
                  type="text"
                  required
                  value={phoneOrCard}
                  onChange={(e) => setPhoneOrCard(e.target.value)}
                  placeholder={method === 'card' ? '4242 4242 4242 4242' : '0754 882 190'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {swahiliMode ? 'Anwani ya Kufikishia Mzigo' : 'Tanzanian Shipping Address'}
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Live Status Log */}
              {status !== 'idle' && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-blue-500/40 text-[11px] font-mono space-y-1.5 animate-pulse">
                  <p className="text-blue-400 font-bold flex items-center">
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    {status === 'ussd_prompted' ? 'Awaiting Mobile Money USSD Approval...' : 'Verifying Biometric Sensor Signature...'}
                  </p>
                  <p className="text-slate-300">{gatewayLog}</p>
                </div>
              )}

              {/* Summary Bar */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-sm font-bold">
                <span className="text-slate-400">Total Due:</span>
                <span className="text-blue-400 font-bold text-lg">{formatTzs(totalTzs)}</span>
              </div>

              <button
                type="submit"
                disabled={status !== 'idle'}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center text-sm"
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                {status !== 'idle' ? 'Processing Gateway Handshake...' : `Authorize Payment of ${formatTzs(totalTzs)}`}
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-center space-x-4 text-[10px] text-slate-400">
            <span className="flex items-center">🔒 256-Bit SSL/TLS</span>
            <span className="flex items-center">🛡️ PCI-DSS Level 1 Sandbox</span>
            <span className="flex items-center">🖐️ FIDO2 WebAuthn</span>
          </div>
        </div>
      </div>
    </div>
  );
};
