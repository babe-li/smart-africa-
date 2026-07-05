import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatTzs } from '../utils/format';
import { PaymentMethodType, Order } from '../types';
import { ShieldCheck, Fingerprint, Lock, CheckCircle2, Phone, CreditCard, AlertCircle, RefreshCw, X, MessageSquare, Send, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentSmsModal } from './PaymentSmsModal';

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
  const [sendSmsConfirm, setSendSmsConfirm] = useState(true);
  const [smsSentNotice, setSmsSentNotice] = useState<string | null>(null);
  const [customSmsRecipient, setCustomSmsRecipient] = useState('0754 882 190');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSmsInboxOpen, setIsSmsInboxOpen] = useState(false);
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

      const orderIdVal = 'TZ-ORD-' + Math.floor(100000 + Math.random() * 900000);
      const initialSmsList = sendSmsConfirm ? [{
        timestamp: new Date().toLocaleTimeString('en-TZ'),
        phone: phoneOrCard,
        message: swahiliMode
          ? `SMARTTRADE UTHIBITISHO: Oda #${orderIdVal} ya ${formatTzs(totalTzs)} imethibitishwa na imehifadhiwa kwenye Escrow salama.`
          : `SMARTTRADE CONFIRMATION: Order #${orderIdVal} of ${formatTzs(totalTzs)} confirmed and locked in Escrow. Reply YES to track.`
      }] : [];

      const newOrder: Order = {
        id: orderIdVal,
        items: [...cart],
        totalTzs,
        buyerPhone: phoneOrCard,
        smsHistory: initialSmsList,
        paymentTransaction: {
          id: 'TXN-' + method.toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
          orderId: orderIdVal,
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

      if (sendSmsConfirm) {
        addSecurityLog({
          type: 'SMS_DISPATCH',
          status: 'PASSED',
          detail: `SMS product purchase confirmation sent to phone number ${phoneOrCard} for Order #${orderIdVal}.`,
          payloadSnippet: `SMS_GATEWAY: DELIVERED (TCRA SMS Gateway v2)`
        });
        setSmsSentNotice(`Confirmation SMS dispatched to ${phoneOrCard}`);
        setTimeout(() => setIsSmsInboxOpen(true), 600);
      }

      setCompletedOrder(newOrder);
      setCustomSmsRecipient(phoneOrCard);
      addOrder(newOrder);
    } else {
      setStatus('failed');
    }
  };

  const handleManualSmsSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSmsRecipient || !completedOrder) return;
    const msgText = swahiliMode
      ? `SMARTTRADE UTHIBITISHO: Oda #${completedOrder.id} ya ${formatTzs(completedOrder.totalTzs)} imethibitishwa na imehifadhiwa kwenye Escrow salama.`
      : `SMARTTRADE CONFIRMATION: Order #${completedOrder.id} of ${formatTzs(completedOrder.totalTzs)} confirmed and locked in Escrow. Reply YES to track.`;
    
    addSecurityLog({
      type: 'SMS_DISPATCH',
      status: 'PASSED',
      detail: `Manual SMS verification confirmation sent to phone number ${customSmsRecipient} for Order #${completedOrder.id}.`,
      payloadSnippet: `SMS_GATEWAY: DELIVERED TO ${customSmsRecipient}`
    });

    setSmsSentNotice(`Confirmation message successfully sent to ${customSmsRecipient}!`);
    setIsSmsInboxOpen(true);
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
            <div className="py-6 space-y-4 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto border-2 border-green-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-white">
                  {swahiliMode ? 'Muamala Umekamilika kwa Usalama!' : 'Transaction Approved & Escrow Locked!'}
                </h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Payment of <span className="font-bold text-blue-400">{formatTzs(totalTzs)}</span> locked into TCRA Escrow.
                </p>
              </div>

              {/* SMS Dispatch & Phone Confirmation Card */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span className="flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>{swahiliMode ? 'Ujumbe wa SMS Umetumwa Kwenye Simu' : 'SMS Product Confirmation Sent'}</span>
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] uppercase font-mono">Delivered</span>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                  <p className="text-slate-500 text-[10px]">RECIPIENT: <span className="text-white font-bold">{customSmsRecipient}</span></p>
                  <p className="text-emerald-300 italic">
                    {swahiliMode 
                      ? `"SMARTTRADE: Oda yako #${completedOrder?.id || 'TZ-ORD'} ya ${formatTzs(totalTzs)} imethibitishwa! Imehifadhiwa Escrow salama."`
                      : `"SMARTTRADE: Your order #${completedOrder?.id || 'TZ-ORD'} of ${formatTzs(totalTzs)} is confirmed! Locked in Escrow. Reply YES to track shipment."`}
                  </p>
                </div>

                {smsSentNotice && (
                  <p className="text-[11px] text-emerald-400 font-bold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {smsSentNotice}
                  </p>
                )}

                {/* Manual Resend Form */}
                <form onSubmit={handleManualSmsSend} className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <input
                    type="text"
                    value={customSmsRecipient}
                    onChange={(e) => setCustomSmsRecipient(e.target.value)}
                    placeholder="Enter phone e.g. 0754 882 190"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition-colors shrink-0 cursor-pointer shadow"
                  >
                    <Send className="w-3 h-3" />
                    <span>{swahiliMode ? 'Tuma SMS' : 'Send SMS'}</span>
                  </button>
                </form>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px] text-left text-slate-400">
                <p>GATEWAY STATUS: <span className="text-green-400">HTTP 200 OK (Confirmed)</span></p>
                <p>BIOMETRIC ATTESTATION: <span className="text-white">VERIFIED FIDO2</span></p>
              </div>

              <button
                type="button"
                onClick={() => setIsSmsInboxOpen(true)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 text-xs cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-300 animate-bounce" />
                <span>{swahiliMode ? '📱 Fungua Simu Kuona Ujumbe wa SMS wa Malipo' : '📱 Open Simulated Phone Screen (View Payment SMS)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  clearCart();
                  onClose();
                  if (completedOrder) onOrderCompleted(completedOrder);
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 text-sm cursor-pointer"
              >
                {swahiliMode ? 'Angalia Oda Zangu & Escrow Tracker' : 'Done • View Orders & Escrow Tracker'}
              </button>
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

              {/* SMS Confirmation Toggle */}
              <label className="flex items-center space-x-2 bg-slate-950 p-3 rounded-xl border border-emerald-500/30 cursor-pointer hover:border-emerald-500/60 transition-colors">
                <input
                  type="checkbox"
                  checked={sendSmsConfirm}
                  onChange={(e) => setSendSmsConfirm(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200">
                  {swahiliMode
                    ? 'Tuma SMS ya uthibitisho wa kununua bidhaa kwenye simu '
                    : 'Send SMS confirmation message to phone number confirming buying product'}
                </span>
              </label>

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

      {completedOrder && (
        <PaymentSmsModal
          isOpen={isSmsInboxOpen}
          onClose={() => setIsSmsInboxOpen(false)}
          phone={customSmsRecipient}
          orderId={completedOrder.id}
          amountTzs={completedOrder.totalTzs}
          paymentMethod={method}
        />
      )}
    </div>
  );
};
