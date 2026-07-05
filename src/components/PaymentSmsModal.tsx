import React, { useState } from 'react';
import { X, Smartphone, MessageSquare, CheckCircle2, ShieldCheck, Send, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatTzs } from '../utils/format';

interface PaymentSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  orderId: string;
  amountTzs: number;
  paymentMethod: string;
  timestamp?: string;
  onSendReply?: (replyText: string) => void;
}

export const PaymentSmsModal: React.FC<PaymentSmsModalProps> = ({
  isOpen,
  onClose,
  phone,
  orderId,
  amountTzs,
  paymentMethod,
  timestamp = new Date().toLocaleTimeString('en-TZ', { hour: '2-digit', minute: '2-digit' }),
}) => {
  const { swahiliMode, addSecurityLog } = useAuth();
  const [messages, setMessages] = useState<Array<{ sender: 'gateway' | 'user'; text: string; time: string }>>([
    {
      sender: 'gateway',
      text: swahiliMode
        ? `THIBITISHO LA MALIPO: Umelipia kikamilifu TSh ${amountTzs.toLocaleString()} kwenda SmartTrade TCRA Escrow kupitia ${paymentMethod.toUpperCase()}. Oda yako #${orderId} imethibitishwa.`
        : `PAYMENT CONFIRMED: You have successfully paid ${formatTzs(amountTzs)} to SmartTrade TCRA Escrow via ${paymentMethod.toUpperCase()}. Your purchase for Order #${orderId} is confirmed and secured.`,
      time: timestamp
    },
    {
      sender: 'gateway',
      text: swahiliMode
        ? `CODE YA ESCROW: #ESC-${orderId}. Pesa zimehifadhiwa salama mpaka utakapothibitisha upokeaji wa mzigo. Jibu OK kuangalia hali ya mzigo.`
        : `ESCROW LOCK CODE: #ESC-${orderId}. Funds are securely held until delivery confirmation. Reply OK or STATUS to check shipment tracking.`,
      time: timestamp
    }
  ]);
  const [replyInput, setReplyInput] = useState('');

  if (!isOpen) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    const userMsgTime = new Date().toLocaleTimeString('en-TZ', { hour: '2-digit', minute: '2-digit' });
    const userMsgText = replyInput.trim();

    setMessages(prev => [...prev, { sender: 'user', text: userMsgText, time: userMsgTime }]);
    setReplyInput('');

    addSecurityLog({
      type: 'SMS_DISPATCH',
      status: 'PASSED',
      detail: `Buyer replied "${userMsgText}" from phone ${phone} to Payment Confirmation Gateway.`,
      payloadSnippet: `SMS_REPLY_INBOUND: ${userMsgText} (Order ${orderId})`
    });

    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('en-TZ', { hour: '2-digit', minute: '2-digit' });
      const autoReply = swahiliMode
        ? `SMARTTRADE MREJESHO: Oda #${orderId} ipo njiani (Priority Escrow Delivery). Muuzaji ametarifiwa kuanza usafirishaji mara moja!`
        : `SMARTTRADE GATEWAY: Order #${orderId} is locked and in preparation! Verified vendor alerted for immediate Priority Escrow Dispatch.`;
      setMessages(prev => [...prev, { sender: 'gateway', text: autoReply, time: replyTime }]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200">
        
        {/* Phone Frame Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs flex items-center space-x-1.5">
                <span>{swahiliMode ? 'Simu ya Mkononi SMS' : 'Simulated Mobile Inbox'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">{phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SMS Sender Info Header */}
        <div className="bg-emerald-950/60 px-4 py-2 border-b border-emerald-500/30 flex items-center justify-between text-[11px]">
          <span className="font-bold text-emerald-300 flex items-center">
            <MessageSquare className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            SMARTTRADE / {paymentMethod.toUpperCase()} GATEWAY
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-mono">
            VERIFIED SENDER
          </span>
        </div>

        {/* SMS Messages Thread */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-950/40 text-xs font-sans">
          <div className="text-center">
            <span className="bg-slate-800/80 text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
              {swahiliMode ? 'Leo - Malipo Yamethibitishwa' : 'Today - Payment Confirmed'}
            </span>
          </div>

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
              <span className="text-[9px] text-slate-500 font-mono px-1 flex items-center space-x-1">
                <span>{msg.time}</span>
                {msg.sender === 'user' && <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />}
              </span>
            </div>
          ))}
        </div>

        {/* SMS Reply Footer Box */}
        <form onSubmit={handleSendReply} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            placeholder={swahiliMode ? 'Jibu SMS au andika STATUS...' : 'Reply OK or type STATUS...'}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono transition-colors"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2 rounded-xl transition-colors shrink-0 shadow cursor-pointer"
            title="Reply to SMS"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Info */}
        <div className="bg-slate-900 px-3 py-2 border-t border-slate-800/80 text-[10px] text-center text-slate-400 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{swahiliMode ? 'TCRA & BOT Mobile Gateway' : 'TCRA & BOT Supervised SMS Gateway'}</span>
        </div>
      </div>
    </div>
  );
};
