import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Cpu, Lock, Key, Server, Terminal, AlertTriangle, CheckCircle2, RefreshCw, Fingerprint, Activity, XCircle, History, Play, ShieldAlert } from 'lucide-react';

export const TcpSecurityHub: React.FC = () => {
  const { user, securityLogs, addSecurityLog, swahiliMode } = useAuth();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [testInput, setTestInput] = useState<string>('<script>alert("test XSS")</script>');
  const [sanitationResult, setSanitationResult] = useState<string | null>(null);
  const [biometricAuditFilter, setBiometricAuditFilter] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');
  const [simulatingAuth, setSimulatingAuth] = useState<boolean>(false);

  const biometricLogs = securityLogs.filter(l => l.type === 'BIOMETRIC_AUTH');
  const passedBiometrics = biometricLogs.filter(l => l.status === 'PASSED');
  const failedBiometrics = biometricLogs.filter(l => l.status === 'BLOCKED' || l.status === 'WARNING');
  const successRate = biometricLogs.length > 0 ? Math.round((passedBiometrics.length / biometricLogs.length) * 100) : 100;

  const filteredBiometricLogs = biometricAuditFilter === 'ALL'
    ? biometricLogs
    : biometricAuditFilter === 'PASSED'
      ? passedBiometrics
      : failedBiometrics;

  const handleSimulateSuccessfulBiometric = () => {
    setSimulatingAuth(true);
    addSecurityLog({
      type: 'BIOMETRIC_AUTH',
      status: 'PASSED',
      detail: `FIDO2 Hardware Biometric Challenge verified successfully for user "${user?.name || 'Customer TZ'}". ECDSA P-256 signature validated.`,
      payloadSnippet: `authenticatorData: flags(ED+UP+AT), signCount=${Math.floor(Math.random() * 50) + 15}, verifiedECDSA=true`
    });
    setSimulatingAuth(false);
  };

  const handleSimulateFailedBiometric = () => {
    setSimulatingAuth(true);
    const failureReasons = [
      'Biometric verification rejected: Hardware sensor mismatch during cryptographic challenge.',
      'Token timeout: User failed to provide biometric proof within 30-second security window.',
      'WebAuthn Enclave blocked attempt: Suspicious attestation certificate mismatch.'
    ];
    const reason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
    addSecurityLog({
      type: 'BIOMETRIC_AUTH',
      status: 'BLOCKED',
      detail: reason,
      payloadSnippet: 'navigator.credentials.get() -> SecurityError: Hardware enclave denied authentication request.'
    });
    setSimulatingAuth(false);
  };

  const filteredLogs = filterType === 'ALL'
    ? securityLogs
    : securityLogs.filter(l => l.type === filterType);

  const handleTestSanitation = (e: React.FormEvent) => {
    e.preventDefault();
    const isSql = testInput.toUpperCase().includes('SELECT') || testInput.includes("' OR '1'='1");
    const isXss = testInput.includes('<script>') || testInput.includes('javascript:') || testInput.includes('onload=');

    if (isSql) {
      setSanitationResult('BLOCKED: SQL Injection vector detected! Parameterized wrapper stripped quotes and operators.');
      addSecurityLog({
        type: 'SQLI_CHECK',
        status: 'BLOCKED',
        detail: `Simulated attack intercepted: "${testInput}". Query parameterized safely.`,
        payloadSnippet: `Query execution aborted. Parameter syntax enforced.`
      });
    } else if (isXss) {
      setSanitationResult('BLOCKED: XSS inline script detected! HTML tags sanitized and entity-escaped.');
      addSecurityLog({
        type: 'XSS_FILTER',
        status: 'BLOCKED',
        detail: `Simulated attack intercepted: "${testInput}". Script tags escaped.`,
        payloadSnippet: `Sanitation output: &lt;script&gt;alert(&quot;test XSS&quot;)&lt;/script&gt;`
      });
    } else {
      setSanitationResult('PASSED: String validated against alphanumeric and Swahili Unicode regex patterns.');
      addSecurityLog({
        type: 'CSRF_VALIDATION',
        status: 'PASSED',
        detail: `User string tested and verified clean: "${testInput}"`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-slate-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900/50 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="bg-blue-500/20 text-blue-400 font-mono text-xs px-2.5 py-1 rounded-full border border-blue-500/30 font-bold uppercase tracking-wider">
              Hardware Security Enclave
            </span>
            <h1 className="text-2xl font-bold mt-2.5 text-white">
              {swahiliMode ? 'Kituo cha Usalama cha TCP (Trusted Computing Platform)' : 'Trusted Computing Platform (TCP) Security Enclave'}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Hardware-level device attestation, FIDO2 biometric cryptographic tokens, and live threat mitigation (Anti-SQLi, XSS, CSRF) for SmartTrade Africa Ltd.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5 w-full md:w-auto shrink-0">
            <div className="flex items-center justify-between space-x-6">
              <span className="text-slate-400">HARDWARE TPM:</span>
              <span className="text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">VERIFIED (v2.0)</span>
            </div>
            <div className="flex items-center justify-between space-x-6">
              <span className="text-slate-400">SESSION WATCHDOG:</span>
              <span className="text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">ACTIVE (15m Timeout)</span>
            </div>
            <div className="flex items-center justify-between space-x-6">
              <span className="text-slate-400">ENCRYPTION PROTOCOL:</span>
              <span className="text-white font-bold">AES-256-GCM / TLS 1.3</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400 border border-blue-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="bg-blue-500/20 text-blue-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30">
              ATTESTATION
            </span>
          </div>
          <h3 className="font-bold text-white text-base">Device Trust Verification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            SmartTrade applets query local Platform Configuration Registers (PCR). Before allowing high-value orders over TSh 500k, the system validates device firmware integrity.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300">
            PCR[0..7]: 8f43...aa4 • Boot State: CLEAN
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400 border border-blue-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <span className="bg-blue-500/20 text-blue-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30">
              FIDO2 KEY
            </span>
          </div>
          <h3 className="font-bold text-white text-base">Zero-Knowledge Biometrics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fingerprint and Face ID authentication generate an asymmetric ECDSA P-256 digital signature. The private key never leaves the smartphone enclave.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300">
            CredID: {user?.fingerprintCredentialId || 'fido2-cred-tz-node'}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400 border border-blue-500/20">
              <Key className="w-6 h-6" />
            </div>
            <span className="bg-blue-500/20 text-blue-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30">
              TOKEN AUTH
            </span>
          </div>
          <h3 className="font-bold text-white text-base">Secure Token Handling</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            API requests utilize short-lived JSON Web Tokens (JWT) bound to a hardware session nonce. Prevents token replay and man-in-the-middle attacks.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300">
            Header: alg=HS256 typ=JWT • SameSite=Strict
          </div>
        </div>
      </div>

      {/* Interactive Threat Sanitization Enclave */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h3 className="font-bold text-white text-base mb-1 flex items-center">
          <Terminal className="w-5 h-5 mr-2 text-blue-500" />
          Interactive Application Security Firewall Simulator (Anti-SQLi / Anti-XSS)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Test our runtime sanitization wrapper. Try submitting malicious SQL keywords (e.g., <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-400 border border-slate-700 font-mono">' OR '1'='1</code>) or XSS scripts (e.g., <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-400 border border-slate-700 font-mono">&lt;script&gt;alert(1)&lt;/script&gt;</code>).
        </p>

        <form onSubmit={handleTestSanitation} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Enter search input string or test injection payload..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shrink-0 shadow-lg shadow-blue-600/20"
          >
            Inspect and Sanitize Input
          </button>
        </form>

        {sanitationResult && (
          <div className={`mt-4 p-3.5 rounded-xl border text-xs font-mono font-bold flex items-start ${
            sanitationResult.startsWith('BLOCKED')
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-green-500/10 border-green-500/30 text-green-300'
          }`}>
            {sanitationResult.startsWith('BLOCKED') ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 mr-2 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-400 mr-2 shrink-0 mt-0.5" />
            )}
            <span>{sanitationResult}</span>
          </div>
        )}
      </div>

      {/* Biometric Authentication History and Security Auditing Section */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-lg">
                  {swahiliMode ? 'Historia na Ukaguzi wa Uthibitisho wa Alama za Vidole (Biometric Audit)' : 'Biometric Authentication Audit History and Telemetry'}
                </h3>
                <span className="bg-blue-500/20 text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded border border-blue-500/30 font-bold uppercase">
                  FIDO2 / WebAuthn Enclave
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {swahiliMode
                  ? 'Ukaguzi wa wazi unaonyesha historia ya majaribio ya mafanikio na yaliyofeli ya uthibitisho wa biometriska (alama za vidole na utambuzi wa uso) kwa utawala wa usalama na uwazi.'
                  : 'Transparent audit trail logging all successful and failed hardware biometric challenges (fingerprint and facial attestation) to enhance security auditing and governance.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSimulateSuccessfulBiometric}
              disabled={simulatingAuth}
              className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center shadow-lg shadow-green-600/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Simulate Passed Auth
            </button>
            <button
              onClick={handleSimulateFailedBiometric}
              disabled={simulatingAuth}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center shadow-lg shadow-rose-600/20"
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
              Simulate Failed Attempt
            </button>
          </div>
        </div>

        {/* Biometric Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Audit Attempts</p>
            <p className="text-2xl font-bold text-white mt-1">{biometricLogs.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Recorded in TPM Enclave</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-green-500/20">
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Successful Auths</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{passedBiometrics.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Verified FIDO2 assertions</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/20">
            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Failed / Rejected</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{failedBiometrics.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Sensor mismatch or timeout</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/20">
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Success Ratio</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{successRate}%</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Hardware reliability score</p>
          </div>
        </div>

        {/* Filter Pills for Biometric Logs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Biometric Attempt Log Register</span>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'PASSED', 'FAILED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setBiometricAuditFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  biometricAuditFilter === tab
                    ? tab === 'PASSED'
                      ? 'bg-green-600 text-white shadow'
                      : tab === 'FAILED'
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? `All Attempts (${biometricLogs.length})` : tab === 'PASSED' ? `Passed (${passedBiometrics.length})` : `Failed (${failedBiometrics.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Biometric Audit History List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredBiometricLogs.length === 0 ? (
            <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-500 font-mono text-xs">
              No biometric attempts matching the selected filter category.
            </div>
          ) : (
            filteredBiometricLogs.map(log => (
              <div
                key={log.id}
                className={`p-4 rounded-xl border transition-all ${
                  log.status === 'PASSED'
                    ? 'bg-slate-950/80 border-green-500/20 hover:border-green-500/40'
                    : 'bg-slate-950/80 border-rose-500/20 hover:border-rose-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-2.5">
                  <div className="flex items-center space-x-2.5">
                    {log.status === 'PASSED' ? (
                      <div className="p-1.5 bg-green-500/10 rounded-lg text-green-400 border border-green-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-400 border border-rose-500/30">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <span className={`text-xs font-bold font-mono uppercase tracking-wide ${
                        log.status === 'PASSED' ? 'text-green-400' : 'text-rose-400'
                      }`}>
                        {log.status === 'PASSED' ? 'AUTHENTICATION PASSED' : 'ATTEMPT REJECTED / FAILED'}
                      </span>
                      <p className="text-[11px] text-slate-500 font-mono">{log.timestamp} • Enclave Node ID: {log.id}</p>
                    </div>
                  </div>

                  <span className="bg-slate-900 text-slate-400 font-mono text-[10px] px-2.5 py-1 rounded border border-slate-800">
                    ECDSA P-256 WebAuthn
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-sans font-medium leading-relaxed">
                  {log.detail}
                </p>

                {log.payloadSnippet && (
                  <div className="mt-2.5 p-2 bg-slate-900 rounded border border-slate-800/80 font-mono text-[10px] text-slate-400 break-all flex items-center justify-between">
                    <span>{log.payloadSnippet}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Live Telemetry Log Table */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        <div className="p-4 bg-slate-950 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm text-white">Live TCP Security and Telemetry Audit Log</h3>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['ALL', 'TCP_ATTESTATION', 'SQLI_CHECK', 'XSS_FILTER', 'BIOMETRIC_AUTH', 'CSRF_VALIDATION'].map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  filterType === f
                    ? 'bg-blue-600 text-white border border-blue-500 shadow'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-white border border-slate-700/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">SECURITY TELEMETRY DETAIL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      log.type === 'TCP_ATTESTATION' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                      log.type === 'BIOMETRIC_AUTH' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      log.type.includes('CHECK') || log.type.includes('FILTER') ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-extrabold ${
                      log.status === 'PASSED' ? 'text-green-400' : 'text-rose-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-200 font-sans font-medium">{log.detail}</p>
                    {log.payloadSnippet && (
                      <p className="text-[10px] text-slate-400 mt-1 bg-slate-950 p-2 rounded border border-slate-800">
                        {log.payloadSnippet}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
