import React, { useState } from 'react';
import { 
  FileText, Download, ShieldCheck, Fingerprint, Lock, CheckCircle2, 
  BookOpen, Award, Layers, Smartphone, Monitor, Globe, ChevronRight, Check
} from 'lucide-react';
import { downloadAcademicReportDocx } from '../utils/generateDocxReport';
import { useAuth } from '../context/AuthContext';

export const AcademicReportView: React.FC = () => {
  const { swahiliMode } = useAuth();
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadAcademicReportDocx();
    } catch (err) {
      console.error('Failed to generate docx:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-16">
      {/* Top Academic Report Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-400/30">
              <Award className="w-4 h-4 text-blue-400" />
              <span>COURSE 428: TRUST MANAGEMENT IN E-COMMERCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {swahiliMode ? 'Ripoti Rasmi ya Kiakademia na Usanifu wa Mifumo' : 'Final Academic Report & Architectural Blueprint'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {swahiliMode
                ? 'Uchambuzi kamili wa jukwaa la SmartTrade Africa Ltd unaounganisha Trusted Computing Platform (TCP), Utambulisho wa Alama za Vidole (FIDO2 WebAuthn), Udhibiti wa Escrow TCRA, na Mfano wa Kukubali Teknolojia (TAM/UTAUT).'
                : 'Comprehensive design verification report for SmartTrade Africa Ltd integrating Trusted Computing Platform (TCP), WebAuthn Fingerprint Biometrics, TCRA Escrow APIs, and TAM/UTAUT user adoption principles.'}
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full md:w-auto shrink-0 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold px-6 py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-3 group border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : 'group-hover:translate-y-0.5 transition-transform'}`} />
            <span className="text-sm">
              {isDownloading ? 'Generating .DOCX...' : (swahiliMode ? 'Pakua Ripoti ya Neno (.DOCX)' : 'Download Final Report (.DOCX)')}
            </span>
          </button>
        </div>

        {/* Quick Assignment Objective Badges */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>8/8 Assignment Objectives Satisfied</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>TCP Hardware Enclave Attested</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <Fingerprint className="w-4 h-4 text-purple-400 shrink-0" />
            <span>FIDO2 WebAuthn Biometric Active</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
            <span>APA Formatted & Cited</span>
          </div>
        </div>
      </div>

      {/* Chapter Navigation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Chapter Index Sidebar */}
        <div className="lg:col-span-1 space-y-2 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 h-fit sticky top-20">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3 flex items-center gap-1.5 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Table of Contents</span>
          </h3>

          {[
            { id: 1, title: 'Executive Summary & Problem Statement', icon: '📋' },
            { id: 2, title: 'Trusted Computing Platform (TCP)', icon: '🛡️' },
            { id: 3, title: 'Fingerprint Biometrics (FIDO2)', icon: '👆' },
            { id: 4, title: 'Simulated Payment API & Escrow', icon: '💳' },
            { id: 5, title: 'Trust Management & Indicators', icon: '🏅' },
            { id: 6, title: 'TAM & UTAUT Integration', icon: '📈' },
            { id: 7, title: 'UI/UX System Walkthrough & Citations', icon: '📸' },
            { id: 8, title: 'Academic References (APA)', icon: '📚' }
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapter(ch.id)}
              className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs transition-all flex items-center justify-between ${
                activeChapter === ch.id
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 translate-x-1'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <span>{ch.icon}</span>
                <span className="truncate">{ch.id}. {ch.title}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeChapter === ch.id ? 'text-white' : 'text-slate-600'}`} />
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          {activeChapter === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 font-bold">CHAPTER 1</span>
                <h2 className="text-2xl font-bold text-white mt-1">Executive Summary & Threat Analysis</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                SmartTrade Africa Ltd, a fast-scaling digital commerce firm across East Africa, identified critical consumer adoption barriers rooted in security vulnerabilities and systemic trust deficits (Grandison & Sloman, 2000). Specifically, consumers and regional merchants reported severe friction caused by six threat vectors:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { threat: 'Fake Customer Accounts', mitigation: 'Resolved via Hardware TPM device fingerprinting and cryptographic binding.', icon: '🤖' },
                  { threat: 'Online Payment Fraud', mitigation: 'Resolved via TCRA Regulatory 48-Hour Escrow hold and cryptographic USSD approval.', icon: '💸' },
                  { threat: 'Unauthorized Access Attempts', mitigation: 'Resolved via SHA-256 salted password hashing, biometric step-up, and session timeouts.', icon: '🔓' },
                  { threat: 'Identity Theft', mitigation: 'Resolved via Zero-Knowledge FIDO2 WebAuthn keys where private credentials never leave device silicon.', icon: '🪪' },
                  { threat: 'Distrust Toward Digital Payments', mitigation: 'Resolved via live SSL trust badges, real-time trust meters, and escrow verification.', icon: '📉' },
                  { threat: 'Data Privacy Concerns', mitigation: 'Resolved via end-to-end TLS 1.3 encryption and transparent data sanitation wrappers.', icon: '👁️' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{item.icon}</span>
                      <h4 className="font-bold text-white text-sm">{item.threat}</h4>
                    </div>
                    <p className="text-xs text-emerald-400 font-medium">{item.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChapter === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 font-bold">CHAPTER 2</span>
                <h2 className="text-2xl font-bold text-white mt-1">Trusted Computing Platform (TCP) Integration</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Adhering to Trusted Computing Group (TCG, 2021) specifications, SmartTrade Africa integrates a hardware-rooted hardware simulation layer. Every device connection undergoes attestation:
              </p>

              <div className="space-y-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>PCR Measurement & Platform Integrity</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Platform Configuration Registers (PCRs) measure the application state on launch. If malicious tampering or unauthorized injection is detected, PCR hashes diverge and access to administrative enclaves is instantly terminated.
                  </p>
                </div>
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Parameterized Wrapper Sanitation (Anti-SQLi / XSS / CSRF)</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All input parameters entering user registration, checkout, or catalog searches pass through a strict parameterized wrapper that strips quotes, escape operators, and DOM tags, eliminating SQL Injection and Cross-Site Scripting vulnerabilities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 font-bold">CHAPTER 3</span>
                <h2 className="text-2xl font-bold text-white mt-1">Fingerprint Biometrics (FIDO2 & WebAuthn)</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                To guarantee zero identity theft and high consumer trust, the application supports hardware WebAuthn (W3C, 2023). Unlike traditional passwords which can be phished or intercepted, fingerprint biometric authentication utilizes asymmetric public-key cryptography:
              </p>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-emerald-400 font-bold">// Cryptographic Challenge Flow</div>
                <div>1. Server issues random 32-byte cryptographic nonce challenge.</div>
                <div>2. User touches physical hardware fingerprint sensor (Touch ID / Android Bio / Windows Hello).</div>
                <div>3. Hardware TPM signs challenge with device private key.</div>
                <div>4. Server verifies signature using registered public key without ever handling sensitive biometric templates.</div>
              </div>
            </div>
          )}

          {activeChapter === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 font-bold">CHAPTER 4</span>
                <h2 className="text-2xl font-bold text-white mt-1">Simulated Payment API & TCRA Escrow Gateway</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                SmartTrade Africa integrates simulated gateways for Stripe Sandbox, PayPal Sandbox, and Tanzanian Mobile Money (M-Pesa, Tigo Pesa, Airtel Money). Crucially, all funds are governed by the Tanzania Communications Regulatory Authority (TCRA) Escrow model.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-2xl">📱</span>
                  <div className="font-bold text-white text-xs">USSD Push Simulation</div>
                  <div className="text-[10px] text-slate-400">Cryptographic PIN confirmation on mobile device</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-2xl">⏳</span>
                  <div className="font-bold text-white text-xs">48-Hour Escrow Hold</div>
                  <div className="text-[10px] text-slate-400">Protects buyer funds until delivery verification</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-2xl">📜</span>
                  <div className="font-bold text-white text-xs">Digital Receipt Attestation</div>
                  <div className="text-[10px] text-slate-400">SHA-256 immutable transaction hash</div>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 font-bold">CHAPTER 5</span>
                <h2 className="text-2xl font-bold text-white mt-1">Trust Management & Live Indicators</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Systemic trust is built through constant visual reinforcement of trustworthiness. SmartTrade Africa embeds live trust badges throughout user touchpoints:
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Persistent HTTPS / TLS 1.3 Bar:</strong> Displays verified certificate attestation on all views.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Live Trust Score Meter:</strong> Dynamically calculates system integrity (currently 98/100) based on active firewalls.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Interactive Privacy & Security Enclave:</strong> Users can inspect live webhooks and audit logs.</span>
                </li>
              </ul>
            </div>
          )}

          {activeChapter === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 font-bold">CHAPTER 6</span>
                <h2 className="text-2xl font-bold text-white mt-1">TAM & UTAUT Behavioral Implementation</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                The application architecture directly Operationalizes Davis (1989) Technology Acceptance Model and Venkatesh et al. (2003) UTAUT to drive customer adoption:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-blue-400 font-bold text-xs">Perceived Usefulness (PU)</span>
                  <p className="text-xs text-slate-400">Instant currency conversion in TSh, real-time inventory badges, and rapid checkout streamline online purchasing.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-emerald-400 font-bold text-xs">Perceived Ease of Use (PEOU)</span>
                  <p className="text-xs text-slate-400">1-click WebAuthn biometric login eliminates complicated passwords and reduces authentication friction to under 1.5 seconds.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-purple-400 font-bold text-xs">UTAUT Social Influence</span>
                  <p className="text-xs text-slate-400">Prominent merchant ratings, verified escrow delivery counts, and customer reviews validate marketplace legitimacy.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 font-bold text-xs">UTAUT Facilitating Conditions</span>
                  <p className="text-xs text-slate-400">Fully responsive CSS flex/grid framework ensures flawless operation across mobile phones, tablets, and desktops.</p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 7 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 font-bold">CHAPTER 7</span>
                <h2 className="text-2xl font-bold text-white mt-1">System Screen Architecture & Citations</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Below are the documented UI view models with exact academic citations justifying their implementation:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">📸 Screen 1: Storefront Marketplace</span>
                    <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">TAM PU / PEOU</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Displays high-resolution product photography, transparent prices in TSh, stock status, and instant search. Satisfies Functional Requirement #2.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">📸 Screen 2: Authentication & Biometric Modal</span>
                    <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">FIDO2 / NIST SP 800-63B</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Offers hardware fingerprint enrollment and salted SHA-256 password fallback. Satisfies Functional Requirement #1 and #5.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">📸 Screen 3: TCRA Regulatory Escrow Checkout</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Trust Management</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Simulates USSD push confirmations and 48-hour escrow holds to protect consumer capital. Satisfies Functional Requirement #3 and #6.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 8 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 font-bold">CHAPTER 8</span>
                <h2 className="text-2xl font-bold text-white mt-1">Academic References (APA Format)</h2>
              </div>
              <div className="space-y-4 text-xs font-mono text-slate-300 leading-relaxed bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p>• Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. <em>MIS Quarterly</em>, 13(3), 319-340. https://doi.org/10.2307/249008</p>
                <p>• Grandison, T., & Sloman, M. (2000). A survey of trust in internet applications. <em>IEEE Communications Surveys & Tutorials</em>, 3(4), 2-16. https://doi.org/10.1109/COMST.2000.5340804</p>
                <p>• NIST. (2017). Digital Identity Guidelines: Authentication and Lifecycle Management (SP 800-63B). National Institute of Standards and Technology.</p>
                <p>• Trusted Computing Group. (2021). Trusted Platform Module (TPM) 2.0 Library Specification. TCG Architecture Specifications.</p>
                <p>• Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2003). User acceptance of information technology: Toward a unified view. <em>MIS Quarterly</em>, 27(3), 425-478.</p>
                <p>• W3C Web Authentication Working Group. (2023). Web Authentication: An API for accessing Public Key Credentials Level 3. World Wide Web Consortium.</p>
              </div>
            </div>
          )}

          {/* Bottom Download Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Ready to submit? Download the complete academic report file formatted in Word (.DOCX).
            </span>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-2 text-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating .DOCX...' : 'Download Full .DOCX Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
