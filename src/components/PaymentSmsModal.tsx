import React, { useState, useEffect } from 'react';
import { X, Smartphone, MessageSquare, CheckCircle2, ShieldCheck, Send, ExternalLink, Globe, Key, Terminal, AlertCircle } from 'lucide-react';
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
}) => {
  const { swahiliMode, addSecurityLog } = useAuth();
  
  // Clean phone number format for standard international delivery (+255 or international)
  const cleanPhoneInput = (p: string) => {
    const digits = p.replace(/\D/g, '');
    if (digits.startsWith('0')) return '255' + digits.slice(1);
    if (digits.startsWith('255')) return digits;
    if (digits.length === 9) return '255' + digits;
    return digits || '255754882190';
  };

  const [targetPhone, setTargetPhone] = useState(phone || '0754 882 190');
  const [activeTab, setActiveTab] = useState<'native' | 'whatsapp' | 'rest_api'>('native');
  const [messageText, setMessageText] = useState('');
  
  // REST API Gateway state
  const [gatewayProvider, setGatewayProvider] = useState<'africastalking' | 'twilio' | 'nextsms' | 'webhook'>('africastalking');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('smarttrade_sms_apikey') || '');
  const [apiSid, setApiSid] = useState(() => localStorage.getItem('smarttrade_sms_sid') || '');
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('smarttrade_sms_webhook') || 'https://api.sms-gateway.example.com/v1/send');
  const [isSendingRest, setIsSendingRest] = useState(false);
  const [restResponseLog, setRestResponseLog] = useState<{ status: number; text: string; success: boolean } | null>(null);

  useEffect(() => {
    setTargetPhone(phone || '0754 882 190');
    const defaultMsg = swahiliMode
      ? `SMARTTRADE UTHIBITISHO HALISI: Oda #${orderId} ya TSh ${amountTzs.toLocaleString()} kupitia ${paymentMethod.toUpperCase()} imethibitishwa! Pesa ipo kwenye Escrow salama chini ya uangalizi wa TCRA. Jibu OK au piga +255 754 882 190 kufuatilia mzigo wako.`
      : `SMARTTRADE LIVE CONFIRMATION: Order #${orderId} of ${formatTzs(amountTzs)} via ${paymentMethod.toUpperCase()} is confirmed! Funds locked in TCRA Escrow. Reply OK or call +255 754 882 190 to track shipment.`;
    setMessageText(defaultMsg);
  }, [phone, orderId, amountTzs, paymentMethod, swahiliMode]);

  if (!isOpen) return null;

  const handleSaveApiConfigs = () => {
    localStorage.setItem('smarttrade_sms_apikey', apiKey);
    localStorage.setItem('smarttrade_sms_sid', apiSid);
    localStorage.setItem('smarttrade_sms_webhook', webhookUrl);
  };

  const handleLaunchNativeSms = () => {
    const formattedPhone = cleanPhoneInput(targetPhone);
    const smsUri = `sms:+${formattedPhone}?body=${encodeURIComponent(messageText)}`;
    
    addSecurityLog({
      type: 'SMS_DISPATCH',
      status: 'PASSED',
      detail: `Real cellular SMS dispatch triggered to +${formattedPhone} via native mobile protocol (sms: URI).`,
      payloadSnippet: `PROTOCOL: sms:+${formattedPhone}`
    });

    window.open(smsUri, '_self');
  };

  const handleLaunchWhatsApp = () => {
    const formattedPhone = cleanPhoneInput(targetPhone);
    const waUri = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;
    
    addSecurityLog({
      type: 'SMS_DISPATCH',
      status: 'PASSED',
      detail: `Real WhatsApp delivery link opened for buyer number +${formattedPhone}.`,
      payloadSnippet: `PROTOCOL: https://wa.me/${formattedPhone}`
    });

    window.open(waUri, '_blank');
  };

  const handleExecuteRestApi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingRest(true);
    setRestResponseLog(null);
    handleSaveApiConfigs();

    const formattedPhone = '+' + cleanPhoneInput(targetPhone);

    try {
      if (gatewayProvider === 'webhook') {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
          },
          body: JSON.stringify({
            to: formattedPhone,
            message: messageText,
            senderId: 'SMARTTRADE',
            orderId,
            timestamp: new Date().toISOString()
          })
        });
        const respText = await res.text();
        setRestResponseLog({ status: res.status, text: respText || res.statusText, success: res.ok });
        addSecurityLog({
          type: 'SMS_DISPATCH',
          status: res.ok ? 'PASSED' : 'WARNED',
          detail: `Real HTTP Webhook POST sent to ${webhookUrl} for ${formattedPhone}. HTTP ${res.status}.`,
          payloadSnippet: respText.slice(0, 100)
        });
      } else if (gatewayProvider === 'twilio') {
        if (!apiSid || !apiKey) {
          setRestResponseLog({ status: 400, text: 'Twilio Account SID and Auth Token required. Please enter below or use 1-Click Native SMS.', success: false });
          setIsSendingRest(false);
          return;
        }
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${apiSid}/Messages.json`;
        const authHeader = 'Basic ' + btoa(`${apiSid}:${apiKey}`);
        const formData = new URLSearchParams();
        formData.append('To', formattedPhone);
        formData.append('From', 'SMARTTRADE');
        formData.append('Body', messageText);

        const res = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        });
        const respData = await res.text();
        setRestResponseLog({ status: res.status, text: respData, success: res.ok });
        addSecurityLog({
          type: 'SMS_DISPATCH',
          status: res.ok ? 'PASSED' : 'WARNED',
          detail: `Real Twilio REST API request executed for ${formattedPhone}. HTTP Status: ${res.status}.`,
          payloadSnippet: respData.slice(0, 100)
        });
      } else {
        // Africa's Talking / NextSMS direct API endpoint
        if (!apiKey) {
          setRestResponseLog({ status: 400, text: `API Key required for ${gatewayProvider.toUpperCase()}. Please enter below or click Native SMS / WhatsApp above to send instantly without keys.`, success: false });
          setIsSendingRest(false);
          return;
        }
        const targetUrl = gatewayProvider === 'africastalking'
          ? 'https://api.africastalking.com/version1/messaging'
          : 'https://messaging-service.co.tz/api/sms/v1/text/single';

        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ApiKey': apiKey,
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            username: apiSid || 'sandbox',
            to: formattedPhone,
            message: messageText,
            from: 'SMARTTRADE'
          })
        });
        const respText = await res.text();
        setRestResponseLog({ status: res.status, text: respText || res.statusText, success: res.ok });
        addSecurityLog({
          type: 'SMS_DISPATCH',
          status: res.ok ? 'PASSED' : 'WARNED',
          detail: `Real SMS API dispatch executed via ${gatewayProvider.toUpperCase()} for ${formattedPhone}.`,
          payloadSnippet: respText.slice(0, 100)
        });
      }
    } catch (err: any) {
      setRestResponseLog({
        status: 0,
        text: `Network CORS/Gateway Error: ${err.message}. To deliver immediately right now, click the 'Native SMS App' or 'Live WhatsApp' tab!`,
        success: false
      });
      addSecurityLog({
        type: 'SMS_DISPATCH',
        status: 'WARNED',
        detail: `Real REST Gateway network attempt to ${formattedPhone}. Fallback to Native SMS available.`,
        payloadSnippet: err.message
      });
    } finally {
      setIsSendingRest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-200">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center space-x-2">
                <span>{swahiliMode ? 'Tuma Ujumbe Halisi wa SMS / WhatsApp' : 'Real Live SMS and WhatsApp Gateway Hub'}</span>
                <span className="bg-emerald-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Real Delivery</span>
              </h3>
              <p className="text-xs text-slate-400">
                {swahiliMode ? 'Tuma risiti halisi kwenye simu ya mteja muda huu' : 'Direct cellular telecom and API delivery engine'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-950/60 px-4 pt-3 border-b border-slate-800 flex gap-1 overflow-x-auto scrollbar-none whitespace-nowrap shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('native')}
            className={`flex items-center space-x-1.5 pb-2.5 px-3 text-[11px] sm:text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'native'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{swahiliMode ? '1-Click SMS' : 'Native SMS'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center space-x-1.5 pb-2.5 px-3 text-[11px] sm:text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'whatsapp'
                ? 'border-green-400 text-green-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{swahiliMode ? 'WhatsApp' : 'WhatsApp Link'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rest_api')}
            className={`flex items-center space-x-1.5 pb-2.5 px-3 text-[11px] sm:text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'rest_api'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{swahiliMode ? 'REST API Gateway' : 'Cloud SMS API'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          
          {/* Recipient Input */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300">
              {swahiliMode ? 'Namba ya Simu ya Mteja (Recipient Phone Number):' : 'Recipient Phone Number:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
                placeholder="0754 882 190 or +255..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono text-sm text-white focus:border-emerald-500 outline-none transition-colors"
              />
              <span className="bg-slate-800 text-slate-300 px-2.5 py-2 rounded-xl font-mono text-[11px] shrink-0">
                +{cleanPhoneInput(targetPhone)}
              </span>
            </div>
          </div>

          {/* Message Text Area */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300 flex items-center justify-between">
              <span>{swahiliMode ? 'Ujumbe Halisi wa SMS / WhatsApp:' : 'Real Confirmation Message Body:'}</span>
              <span className="text-[10px] text-slate-500 font-mono">{messageText.length} chars</span>
            </label>
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-emerald-500 outline-none transition-colors leading-relaxed font-sans"
            />
          </div>

          {/* TAB 1: Native Cellular SMS */}
          {activeTab === 'native' && (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-300 text-sm">
                    {swahiliMode ? 'Uwasilishaji wa Papo Hapo Kupitia Mtandao wa Simu' : 'Real 1-Click Cellular SMS Delivery'}
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {swahiliMode
                      ? 'Kubofya kitufe hiki kutafungua app halisi ya SMS kwenye simu yako (Android au iOS) na kuweka namba hii tayari kutuma ujumbe huu kwa mteja mara moja.'
                      : 'Clicking below opens your device’s native SMS/Messages app pre-loaded with the exact phone number and receipt message. Tap send to transmit a 100% real telecom SMS.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunchNativeSms}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer text-sm"
              >
                <Smartphone className="w-4 h-4" />
                <span>{swahiliMode ? '🚀 Fungua App ya SMS na Tuma Halisi' : '🚀 Launch Cellular SMS App and Transmit Now'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: Live WhatsApp Link */}
          {activeTab === 'whatsapp' && (
            <div className="bg-green-950/30 border border-green-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-start space-x-2.5">
                <Globe className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-green-300 text-sm">
                    {swahiliMode ? 'Tuma Risiti Halisi Kwenye WhatsApp' : 'Real Official WhatsApp Live Delivery'}
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {swahiliMode
                      ? 'Ujumbe huu utatumwa moja kwa moja kwenye WhatsApp ya namba ya mteja (+255...). Njia nyepesi na ya uhakika nchini Tanzania.'
                      : 'Delivers the receipt and escrow tracker instantly via official WhatsApp Web or Mobile Chat.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunchWhatsApp}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{swahiliMode ? '💬 Fungua WhatsApp na Tuma Risiti' : '💬 Open Live WhatsApp Chat and Send Receipt'}</span>
              </button>
            </div>
          )}

          {/* TAB 3: REST API Gateway */}
          {activeTab === 'rest_api' && (
            <form onSubmit={handleExecuteRestApi} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-blue-400 flex items-center space-x-1">
                  <Terminal className="w-4 h-4 mr-1" />
                  <span>{swahiliMode ? 'Mipangilio ya API Gateway' : 'Live SMS REST API Gateway Settings'}</span>
                </span>
                <span className="text-[10px] text-slate-500">HTTP POST</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">Provider:</label>
                  <select
                    value={gatewayProvider}
                    onChange={(e: any) => setGatewayProvider(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                  >
                    <option value="africastalking">Africa's Talking (TZ/East Africa)</option>
                    <option value="twilio">Twilio Global REST API</option>
                    <option value="nextsms">NextSMS Tanzania Gateway</option>
                    <option value="webhook">Custom HTTP Webhook URL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">
                    {gatewayProvider === 'twilio' ? 'Account SID / Username:' : 'Sender ID / Username:'}
                  </label>
                  <input
                    type="text"
                    value={apiSid}
                    onChange={(e) => setApiSid(e.target.value)}
                    placeholder={gatewayProvider === 'twilio' ? 'ACxxxxx...' : 'SMARTTRADE'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {gatewayProvider === 'webhook' ? (
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">Webhook POST Endpoint URL:</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://api.gateway.com/send"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">
                    {gatewayProvider === 'twilio' ? 'Auth Token:' : 'API Key / Secret Token:'}
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter real live API secret key..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingRest}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition-all shadow flex items-center justify-center space-x-2 cursor-pointer text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingRest ? 'Executing Live HTTP POST...' : (swahiliMode ? '⚡ Tuma Kupitia Live API Gateway' : '⚡ Execute Live API Request')}</span>
              </button>

              {restResponseLog && (
                <div className={`p-3 rounded-xl border text-xs font-mono break-all ${
                  restResponseLog.success ? 'bg-green-950/40 border-green-500 text-green-300' : 'bg-amber-950/40 border-amber-500 text-amber-300'
                }`}>
                  <p className="font-bold mb-1">HTTP Result: Status {restResponseLog.status}</p>
                  <p className="text-[11px] opacity-90">{restResponseLog.text}</p>
                </div>
              )}
            </form>
          )}

        </div>

        {/* Footer Info */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 mr-1" />
            {swahiliMode ? 'Mawasiliano Halisi Yasiyokatizwa' : 'Real Cellular and Gateway Delivery Protocol'}
          </span>
          <span className="text-slate-500 font-mono text-[10px]">TCRA Compliant</span>
        </div>
      </div>
    </div>
  );
};

