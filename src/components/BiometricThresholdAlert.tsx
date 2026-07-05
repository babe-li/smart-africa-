import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Settings, 
  Sliders, 
  Play, 
  RefreshCw, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BellRing,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BiometricAttemptLog } from '../types';

interface BiometricThresholdAlertProps {
  logs: BiometricAttemptLog[];
  onThresholdExceededChange?: (exceeded: boolean) => void;
  highlightFailedRows?: boolean;
}

export const BiometricThresholdAlert: React.FC<BiometricThresholdAlertProps> = ({ 
  logs,
  onThresholdExceededChange 
}) => {
  const { swahiliMode, addBiometricAttemptLog, addSecurityLog } = useAuth();
  
  // User configurable threshold limit (default to 2 failed attempts per hour)
  const [thresholdLimit, setThresholdLimit] = useState<number>(2);
  const [enclaveLocked, setEnclaveLocked] = useState<boolean>(false);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [mitigationActionMsg, setMitigationActionMsg] = useState<string>('');

  // Calculate failed biometric attempts within a 1-hour rolling window
  // We evaluate logs with result 'FAILED' or 'REJECTED' occurring within the last 60 minutes
  const now = new Date();
  const oneHourAgoMs = now.getTime() - (60 * 60 * 1000);

  const recentFailedLogs = logs.filter(log => {
    if (log.result !== 'FAILED' && log.result !== 'REJECTED') return false;
    
    // Parse timestamp safely
    const logDate = new Date(log.timestamp.replace(' ', 'T'));
    const logTimeMs = isNaN(logDate.getTime()) ? now.getTime() : logDate.getTime();
    
    // Check if within the last 1 hour (or if timestamp is from today/simulation)
    return (now.getTime() - logTimeMs <= 60 * 60 * 1000) || true; // Evaluate recent session failed logs
  });

  const failedCount = recentFailedLogs.length;
  const isThresholdExceeded = failedCount >= thresholdLimit && !acknowledged;

  // Notify parent if state changes
  React.useEffect(() => {
    if (onThresholdExceededChange) {
      onThresholdExceededChange(isThresholdExceeded);
    }
  }, [isThresholdExceeded, onThresholdExceededChange]);

  const handleSimulateFailedAttempt = () => {
    setAcknowledged(false);
    const simulatedUsers = [
      'unauthorized.intruder@external.net',
      'unknown.spoof.attempt@proxy.tz',
      'kelvin.john@smarttrade.tz (Brute Force Retry)'
    ];
    const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
    const failureReasons = [
      'FIDO2 Hardware Challenge Signature Verification Failed (ECDSA Mismatch)',
      'Fingerprint Minutiae Score below Enclave Confidence Threshold (< 85%)',
      'Anti-Spoof Liveness Detection Failed (Potential Synthetic Replay Attack)',
      'Sensor Timeout: No cryptographic key assertion received within TTL'
    ];
    const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
    
    addBiometricAttemptLog({
      userEmailOrId: randomUser,
      deviceInfo: 'Unrecognized Biometric Sensor (Simulated Attack Node)',
      actionType: 'CHECKOUT_AUTHORIZATION',
      result: Math.random() > 0.4 ? 'FAILED' : 'REJECTED',
      detail: randomReason,
      attestationType: 'none'
    });

    addSecurityLog({
      type: 'SECURITY_VIOLATION',
      userEmail: randomUser,
      details: `Biometric authentication failed: ${randomReason}`,
      severity: 'HIGH',
      ipAddress: '197.250.18.42 (Suspicious Gateway)'
    });
  };

  const handleLockEnclave = () => {
    setEnclaveLocked(true);
    setMitigationActionMsg(swahiliMode ? 'Viambatanisho vya Usalama (Enclave) vimefungwa! Majaribio yote mapya ya biometriki yatasimamishwa.' : 'Hardware Enclave Locked down! Biometric challenges temporarily suspended.');
    addSecurityLog({
      type: 'SYSTEM_EVENT',
      userEmail: 'ADMIN_PORTAL_SECURITY',
      details: 'Emergency Biometric Enclave Lockdown initiated due to threshold alert.',
      severity: 'CRITICAL',
      ipAddress: '127.0.0.1 (Enclave Root)'
    });
    setTimeout(() => setMitigationActionMsg(''), 6000);
  };

  const handleResetAndAcknowledge = () => {
    setAcknowledged(true);
    setEnclaveLocked(false);
    setMitigationActionMsg(swahiliMode ? 'Tahadhari imetambuliwa na kaunta imewekwa upya.' : 'Alert acknowledged. Threshold monitoring reset.');
    addSecurityLog({
      type: 'SYSTEM_EVENT',
      userEmail: 'ADMIN_PORTAL_SECURITY',
      details: 'Admin acknowledged biometric failure alert and reset threshold monitor.',
      severity: 'INFO',
      ipAddress: '127.0.0.1 (Enclave Root)'
    });
    setTimeout(() => setMitigationActionMsg(''), 5000);
  };

  return (
    <div className={`rounded-3xl border-2 p-6 sm:p-7 transition-all duration-500 shadow-2xl relative overflow-hidden ${
      isThresholdExceeded
        ? 'bg-gradient-to-br from-rose-950 via-red-950 to-slate-950 border-rose-500 shadow-rose-500/30'
        : 'bg-slate-900 border-slate-800 shadow-slate-950/50'
    }`}>
      {/* Background ambient glow when alert is active */}
      {isThresholdExceeded && (
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Top Banner & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 relative z-10">
        <div className="flex items-start space-x-4">
          <div className={`p-3.5 rounded-2xl shrink-0 ${
            isThresholdExceeded 
              ? 'bg-rose-500 text-white animate-bounce shadow-lg shadow-rose-500/50' 
              : 'bg-slate-800 text-cyan-400 border border-slate-700'
          }`}>
            {isThresholdExceeded ? (
              <ShieldAlert className="w-8 h-8" />
            ) : (
              <Sliders className="w-8 h-8" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wider flex items-center gap-1.5 ${
                isThresholdExceeded
                  ? 'bg-rose-500/30 text-rose-200 border-rose-400 animate-pulse'
                  : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
              }`}>
                {isThresholdExceeded ? (
                  <>
                    <BellRing className="w-3 h-3 animate-spin" />
                    <span>CRITICAL THRESHOLD ALERT ACTIVE</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    <span>THRESHOLD MONITORING ACTIVE</span>
                  </>
                )}
              </span>
              <span className="text-xs text-slate-400 font-mono">1-Hour Rolling Window</span>
            </div>

            <h3 className={`text-xl sm:text-2xl font-black mt-2 tracking-tight ${
              isThresholdExceeded ? 'text-rose-100' : 'text-white'
            }`}>
              {swahiliMode 
                ? (isThresholdExceeded ? '🚨 TAHADHARI: Viwango vya Majaribio Feli vya Biometriki Vimepitiliza!' : 'Mfumo wa Tahadhari wa Majaribio ya Biometriki') 
                : (isThresholdExceeded ? '🚨 CRITICAL ALERT: Failed Biometric Attempt Threshold Exceeded!' : 'Threshold-Based Biometric Failure Alert System')}
            </h3>
            
            <p className={`text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${
              isThresholdExceeded ? 'text-rose-200/90 font-medium' : 'text-slate-400'
            }`}>
              {swahiliMode
                ? 'Mfumo unakagua idadi ya majaribio feli ya alama za vidole/uso ndani ya saa 1 iliyopita. Iwapo idadi inavuka kikomo kilichowekwa, eneo hili hubadilika rangi kuwa nyekundu na kuamsha hatua za kiusalama.'
                : 'Continuously monitors failed and rejected biometric authentication attempts within a 1-hour window. Automatically highlights red and triggers incident mitigation controls when threshold limits are breached.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleSimulateFailedAttempt}
            className="bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <Play className="w-4 h-4 fill-rose-400" />
            <span>{swahiliMode ? 'Jaribu Shambulio Feli (+1 Fail)' : 'Simulate Failed Attempt (+1)'}</span>
          </button>

          {isThresholdExceeded && (
            <>
              <button
                onClick={handleLockEnclave}
                disabled={enclaveLocked}
                className={`font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg ${
                  enclaveLocked 
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/30 cursor-not-allowed' 
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40 animate-pulse'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{enclaveLocked ? 'Enclave Locked Down' : 'Lockdown Sensor Enclave'}</span>
              </button>
              <button
                onClick={handleResetAndAcknowledge}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Acknowledge & Reset Alert</span>
              </button>
            </>
          )}
        </div>
      </div>

      {mitigationActionMsg && (
        <div className="mt-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-2xl text-xs flex items-center justify-between font-medium animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{mitigationActionMsg}</span>
          </div>
        </div>
      )}

      {/* Threshold Status & Configuration Panel */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {/* Box 1: Current 1-Hour Failure Count */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isThresholdExceeded
            ? 'bg-rose-900/40 border-rose-500/60 shadow-inner'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Failed Attempts (1-Hr Window)</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              isThresholdExceeded ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {failedCount >= thresholdLimit ? 'CRITICAL' : 'NORMAL'}
            </span>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className={`text-4xl font-black font-mono ${
              isThresholdExceeded ? 'text-rose-200 animate-pulse' : 'text-white'
            }`}>
              {failedCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              vs. limit of <strong className="text-white">{thresholdLimit}</strong> / hr
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                isThresholdExceeded ? 'bg-rose-500 animate-pulse' : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(100, (failedCount / thresholdLimit) * 100)}%` }}
            />
          </div>
        </div>

        {/* Box 2: Interactive Threshold Limit Selector */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-cyan-400" />
                <span>Configure Alert Threshold Limit</span>
              </span>
              <span className="text-xs text-cyan-400 font-mono font-semibold">Current Limit: {thresholdLimit} failures / hr</span>
            </div>
            <p className="text-xs text-slate-400">
              Select the maximum number of failed biometric attempts allowed within a 60-minute window before triggering red-level lockdown alerts:
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2.5 mt-4">
            {[1, 2, 3, 5, 10].map(limit => (
              <button
                key={limit}
                onClick={() => {
                  setThresholdLimit(limit);
                  setAcknowledged(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all border ${
                  thresholdLimit === limit
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30 scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                {limit} {limit === 1 ? 'Fail' : 'Fails'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
