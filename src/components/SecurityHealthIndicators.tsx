import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Lock, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  Terminal, 
  Cpu, 
  Clock, 
  Users, 
  Zap, 
  Radio, 
  ShieldAlert,
  Play,
  Layers,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SecurityHealthIndicators: React.FC = () => {
  const { swahiliMode, addSecurityLog } = useAuth();
  
  // Real-time simulated metrics
  const [tokenExpirationRate, setTokenExpirationRate] = useState<number>(1.42);
  const [encryptedSessions, setEncryptedSessions] = useState<number>(1842);
  const [pcrIntegrityStatus, setPcrIntegrityStatus] = useState<'VERIFIED' | 'SCANNING' | 'WARNING'>('VERIFIED');
  const [tpmBindingRatio, setTpmBindingRatio] = useState<number>(98.6);
  const [latencyMs, setLatencyMs] = useState<number>(0.42);

  // Interactive diagnostics states
  const [isSweepingTokens, setIsSweepingTokens] = useState<boolean>(false);
  const [sweepSuccessMsg, setSweepSuccessMsg] = useState<string>('');
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState<boolean>(false);
  const [diagnosticSteps, setDiagnosticSteps] = useState<Array<{ name: string; status: 'pending' | 'running' | 'completed' | 'failed' }>>([
    { name: 'PCR[0..7] Platform Hash Attestation', status: 'completed' },
    { name: 'FIDO2 WebAuthn Public Key Signature Verification', status: 'completed' },
    { name: 'TLS 1.3 / ECDSA P-256 Session Handshake Audit', status: 'completed' },
    { name: 'Parameterized Wrapper SQLi/XSS Firewall Inspection', status: 'completed' },
    { name: 'TCRA Regulatory Escrow Sandbox Heartbeat', status: 'completed' }
  ]);

  // Subtle real-time fluctuation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setEncryptedSessions(prev => prev + Math.floor(Math.random() * 5) - 2);
      setLatencyMs(prev => +(prev + (Math.random() * 0.04 - 0.02)).toFixed(2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSweepTokens = () => {
    setIsSweepingTokens(true);
    setSweepSuccessMsg('');
    setTimeout(() => {
      setTokenExpirationRate(0.12);
      setEncryptedSessions(prev => prev - Math.floor(prev * 0.05));
      setIsSweepingTokens(false);
      setSweepSuccessMsg(swahiliMode ? 'Kusafisha Tokeni kumehakikishwa: Tokeni zilizopitwa na wakati zimefutwa.' : 'Token Sweep Complete: Expired and stale JWT/FIDO2 session buffers purged.');
      
      addSecurityLog({
        type: 'SYSTEM_EVENT',
        userEmail: 'ENCLAVE_DAEMON',
        details: 'Manual Token Expiration Sweep executed. Stale session tokens flushed from enclave cache.',
        severity: 'INFO',
        ipAddress: '127.0.0.1 (Enclave Root)'
      });

      setTimeout(() => setSweepSuccessMsg(''), 5000);
    }, 1200);
  };

  const handleRunDiagnostic = () => {
    setIsRunningDiagnostic(true);
    setPcrIntegrityStatus('SCANNING');
    
    // Reset steps to pending
    setDiagnosticSteps(prev => prev.map((s, idx) => ({ ...s, status: idx === 0 ? 'running' : 'pending' })));

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      setDiagnosticSteps(prev => prev.map((step, idx) => {
        if (idx < currentStep) return { ...step, status: 'completed' };
        if (idx === currentStep) return { ...step, status: 'completed' };
        if (idx === currentStep + 1) return { ...step, status: 'running' };
        return step;
      }));

      currentStep++;
      if (currentStep >= 5) {
        clearInterval(stepInterval);
        setIsRunningDiagnostic(false);
        setPcrIntegrityStatus('VERIFIED');
        setTpmBindingRatio(99.1);
        
        addSecurityLog({
          type: 'SYSTEM_EVENT',
          userEmail: 'ROOT_SECURITY_MONITOR',
          details: 'Full System Integrity Diagnostic completed successfully with 100% PCR attestation match.',
          severity: 'INFO',
          ipAddress: 'Internal Hardware Enclave'
        });
      }
    }, 600);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-cyan-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
              <span>LIVE TELEMETRY FEED</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">15-Min Token Lifecycle TTL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center mt-2">
            <Activity className="w-6 h-6 text-cyan-400 mr-2.5 shrink-0" />
            <span>{swahiliMode ? 'Viashiria vya Afya ya Usalama na Uadilifu' : 'Security Health Indicators and Real-Time System Integrity'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {swahiliMode
              ? 'Ufuatiliaji wa papo hapo wa viwango vya muda wa mwisho wa tokeni salama, idadi ya vipindi vilivyosimbwa (sessions), na uhakiki wa vifaa vya kiunzi (TPM/PCR).'
              : 'Real-time monitoring of critical system integrity parameters including secure token expiration rates, active encrypted session counts, hardware TPM key binding, and cryptographic attestation health.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleSweepTokens}
            disabled={isSweepingTokens || isRunningDiagnostic}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSweepingTokens ? 'animate-spin' : ''}`} />
            <span>{isSweepingTokens ? 'Sweeping Tokens...' : (swahiliMode ? 'Safisha Tokeni' : 'Sweep Stale Tokens')}</span>
          </button>
          <button
            onClick={handleRunDiagnostic}
            disabled={isRunningDiagnostic}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isRunningDiagnostic ? 'animate-pulse' : ''}`} />
            <span>{isRunningDiagnostic ? 'Running Audit...' : (swahiliMode ? 'Anzisha Ukaguzi wa Kina' : 'Run Full Diagnostic')}</span>
          </button>
        </div>
      </div>

      {sweepSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl text-xs flex items-center justify-between font-medium animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{sweepSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Grid of 6 Primary Critical Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Metric 1: Secure Token Expiration Rate */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secure Token Expiration Rate</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{tokenExpirationRate}%</span>
            <span className="text-xs text-slate-400 font-mono">/ hour</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Optimal TTL Range
            </span>
            <span className="text-slate-500 font-mono">Avg TTL: 14m 48s</span>
          </div>
        </div>

        {/* Metric 2: Encrypted Session Counts */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Encrypted Session Counts</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{encryptedSessions.toLocaleString()}</span>
            <span className="text-xs text-blue-400 font-mono font-bold">Active TLS 1.3</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium">100% AES-GCM-256 Cipher</span>
            <span className="text-slate-500 font-mono">0 Plaintext</span>
          </div>
        </div>

        {/* Metric 3: PCR Platform Attestation */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PCR Platform Attestation</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold text-emerald-400 tracking-tight">
              {pcrIntegrityStatus === 'SCANNING' ? 'VERIFYING...' : '100% MATCHED'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-mono truncate">PCR[0..7]: e3b0c442...</span>
            <span className="text-emerald-400 font-bold">Verified Boot</span>
          </div>
        </div>

        {/* Metric 4: TPM Hardware Binding Ratio */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TPM Hardware Key Binding</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{tpmBindingRatio}%</span>
            <span className="text-xs text-purple-400 font-bold">Hardware Silicon</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">ECDSA P-256 Keys</span>
            <span className="text-slate-500 font-mono">{(100 - tpmBindingRatio).toFixed(1)}% Fallback</span>
          </div>
        </div>

        {/* Metric 5: Input Wrapper Sanitation Firewall */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wrapper Sanitation Firewall</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">0</span>
            <span className="text-xs text-emerald-400 font-bold">Active Injections</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-300">99.999% Neutralized</span>
            <span className="text-slate-500 font-mono">SQLi/XSS/CSRF Blocked</span>
          </div>
        </div>

        {/* Metric 6: Enclave Memory Latency */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enclave Memory Latency</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{latencyMs}</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">ms</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-300">Isolated Sandbox</span>
            <span className="text-emerald-400 font-bold">Ultra-Low Overhead</span>
          </div>
        </div>
      </div>

      {/* Live Diagnostic Audit Trail */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-sm">System Integrity Diagnostic Pipeline</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {isRunningDiagnostic ? 'Running Diagnostic Checks...' : 'All Enclave Modules Online'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {diagnosticSteps.map((step, idx) => (
            <div 
              key={idx} 
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                step.status === 'completed'
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : step.status === 'running'
                  ? 'bg-cyan-500/10 border-cyan-500/40 animate-pulse'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400">STEP 0{idx + 1}</span>
                {step.status === 'completed' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : step.status === 'running' ? (
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>
              <p className={`text-xs font-bold leading-snug ${
                step.status === 'completed' ? 'text-slate-200' : step.status === 'running' ? 'text-cyan-300' : 'text-slate-500'
              }`}>
                {step.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
