import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Fingerprint, ShieldCheck, X, CheckCircle, AlertCircle, Cpu, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({ isOpen, onClose }) => {
  const { user, biometricStatus, registerFingerprint, authenticateWithFingerprint, swahiliMode } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'scan' | 'fido_protocol'>('scan');

  if (!isOpen) return null;

  const handleScanClick = async () => {
    if (!user?.fingerprintRegistered) {
      await registerFingerprint();
      confetti({ particleCount: 60, spread: 55 });
    } else {
      await authenticateWithFingerprint();
      confetti({ particleCount: 60, spread: 55 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-200 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
              <Fingerprint className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {swahiliMode ? 'Uthibitisho wa Kihisi Dole (WebAuthn)' : 'Hardware Biometric Authentication'}
              </h3>
              <p className="text-[10px] text-slate-400">
                TCP FIDO2 Platform Security Enclave • Course 428
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

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('scan')}
            className={`flex-1 py-2.5 text-center transition-colors ${
              activeSubTab === 'scan'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🖐️ {swahiliMode ? 'Gusa Kihisi' : 'Live Fingerprint Scanner'}
          </button>
          <button
            onClick={() => setActiveSubTab('fido_protocol')}
            className={`flex-1 py-2.5 text-center transition-colors ${
              activeSubTab === 'fido_protocol'
                ? 'bg-slate-800 text-green-400 border-b-2 border-green-500 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔐 FIDO2 Protocol Telemetry
          </button>
        </div>

        {activeSubTab === 'scan' ? (
          <div className="p-6 flex flex-col items-center text-center space-y-6">
            {/* Status box */}
            <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Hardware Enclave Status:</span>
              <span className="font-mono font-bold text-green-400 flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1" />
                TPM 2.0 PROTECTED SENSOR
              </span>
            </div>

            {/* Interactive Fingerprint Circle */}
            <div className="relative">
              <div 
                onClick={handleScanClick}
                className={`w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative ${
                  biometricStatus === 'scanning'
                    ? 'bg-blue-500/20 border-4 border-blue-400 animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                    : biometricStatus === 'success'
                    ? 'bg-green-500/20 border-4 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                    : 'bg-slate-950 border-4 border-slate-800 hover:border-blue-500/80 hover:bg-slate-800 shadow-xl'
                }`}
              >
                <Fingerprint 
                  className={`w-20 h-20 transition-all duration-300 ${
                    biometricStatus === 'scanning'
                      ? 'text-blue-400 animate-bounce'
                      : biometricStatus === 'success'
                      ? 'text-green-400 scale-110'
                      : 'text-slate-300'
                  }`} 
                />

                {biometricStatus === 'scanning' && (
                  <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin" />
                )}
              </div>
            </div>

            {/* Instruction Text */}
            <div className="space-y-1">
              <h4 className="font-bold text-base text-white">
                {biometricStatus === 'scanning'
                  ? (swahiliMode ? 'Inasoma alama ya kidole...' : 'Verifying Hardware Signature...')
                  : biometricStatus === 'success'
                  ? (swahiliMode ? 'Uhakika! Utambulisho Umekamilika' : 'Biometric Challenge Verified!')
                  : !user?.fingerprintRegistered
                  ? (swahiliMode ? 'Bofya duara kujiandikisha na alama ya kidole' : 'Click sensor circle to enroll device fingerprint')
                  : (swahiliMode ? 'Bofya kihisi kuthibitisha muamala' : 'Click sensor to authenticate securely')}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {!user?.fingerprintRegistered
                  ? 'Replaces passwords with zero-knowledge cryptographic key pairs stored directly inside your phone or laptop TPM.'
                  : 'FIDO2 private key never leaves the secure hardware enclave. Prevents phishing and identity theft.'}
              </p>
            </div>

            <button
              onClick={handleScanClick}
              disabled={biometricStatus === 'scanning'}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center text-sm"
            >
              <Fingerprint className="w-4 h-4 mr-2" />
              {biometricStatus === 'scanning'
                ? 'Executing Cryptographic Challenge...'
                : !user?.fingerprintRegistered
                ? 'Enroll Fingerprint Credential'
                : 'Simulate Biometric Scan'}
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4 font-mono text-xs overflow-y-auto max-h-96">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <p className="text-blue-400 font-bold">// FIDO2 WebAuthn Cryptographic Handshake</p>
              <p className="text-slate-400">
                1. Server sends random nonce challenge: <span className="text-white">0x89F3...21B0</span>
              </p>
              <p className="text-slate-400">
                2. TPM Hardware verifies user via Fingerprint sensor.
              </p>
              <p className="text-slate-400">
                3. Private Key signs challenge inside isolated Trusted Execution Environment (TEE).
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <p className="text-green-400 font-bold mb-1">// Authenticator Assertion Payload</p>
              <pre className="text-[10px] text-slate-300 overflow-x-auto leading-relaxed">
{`{
  "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiVFRaXzg4...",
  "authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2NF...",
  "signature": "MEQCIFG1y+0o1jE3K8x2u0...zR9881A==",
  "userHandle": "${user?.id || 'usr-tanzania-001'}",
  "hardwareAttestation": "TPM_2.0_PASSED"
}`}
              </pre>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed font-sans">
              <strong>Course 428 Application:</strong> By integrating WebAuthn, SmartTrade Africa eliminates credentials stolen via phishing or database leaks. Even if server databases are compromised, attackers obtain only public keys.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
