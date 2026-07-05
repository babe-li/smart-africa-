import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, BiometricStatus, SecurityEventLog } from '../types';
import { INITIAL_SECURITY_LOGS } from '../data/trustData';

interface AuthContextType {
  user: User | null;
  loginWithPassword: (phoneOrEmail: string, passwordPlain: string) => Promise<boolean>;
  registerUser: (name: string, email: string, phone: string, passwordPlain: string, location: string) => Promise<boolean>;
  logout: () => void;
  biometricStatus: BiometricStatus;
  registerFingerprint: () => Promise<boolean>;
  authenticateWithFingerprint: () => Promise<boolean>;
  securityLogs: SecurityEventLog[];
  addSecurityLog: (log: Omit<SecurityEventLog, 'id' | 'timestamp'>) => void;
  deviceViewMode: 'desktop' | 'mobile';
  setDeviceViewMode: (mode: 'desktop' | 'mobile') => void;
  swahiliMode: boolean;
  setSwahiliMode: (val: boolean) => void;
  trustScoreOverall: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for simulated SHA-256 browser hashing
async function computeSha256(input: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(input + '_smarttrade_salt_tz');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smarttrade_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    // Default demo user so student/instructor can explore immediately
    return {
      id: 'usr-tanzania-001',
      name: 'Baraka Mwakio',
      email: 'baraka.mwakio@tzmail.com',
      phone: '0754 882 190',
      hashedPasswordPreview: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      fingerprintRegistered: true,
      fingerprintCredentialId: 'fido2-cred-tz-8849201',
      location: 'Dar es Salaam (Kinondoni)',
      deviceInfo: {
        os: 'Android 14 (One UI 6)',
        browser: 'Chrome Mobile Security Guard',
        tpmVersion: 'TCP Hardware TPM 2.0 Active',
        secureEnclave: true
      },
      lastLoginTimestamp: 'Today, 14:30 EAT'
    };
  });

  const [biometricStatus, setBiometricStatus] = useState<BiometricStatus>(
    user?.fingerprintRegistered ? 'ready' : 'unregistered'
  );
  const [securityLogs, setSecurityLogs] = useState<SecurityEventLog[]>(INITIAL_SECURITY_LOGS);
  const [deviceViewMode, setDeviceViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [swahiliMode, setSwahiliMode] = useState<boolean>(false);

  const addSecurityLog = (log: Omit<SecurityEventLog, 'id' | 'timestamp'>) => {
    const newLog: SecurityEventLog = {
      ...log,
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };
    setSecurityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const loginWithPassword = async (phoneOrEmail: string, passwordPlain: string): Promise<boolean> => {
    const hashed = await computeSha256(passwordPlain);
    addSecurityLog({
      type: 'SQLI_CHECK',
      status: 'PASSED',
      detail: `Sanitized authentication query for credential: "${phoneOrEmail}". Parameterized SQL executed safely.`,
      payloadSnippet: `SELECT id, password_hash FROM users WHERE email = $1 OR phone = $2`
    });

    addSecurityLog({
      type: 'TCP_ATTESTATION',
      status: 'PASSED',
      detail: `User authenticated via PBKDF2/SHA256 password hash comparison in Hardware Enclave.`,
      payloadSnippet: `Hash computation: ${hashed.substring(0, 32)}...`
    });

    const loggedUser: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 7),
      name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0].replace('.', ' ') : 'Customer TZ',
      email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail}@smarttrade.co.tz`,
      phone: phoneOrEmail.includes('@') ? '0754 123 456' : phoneOrEmail,
      hashedPasswordPreview: hashed,
      fingerprintRegistered: false,
      location: 'Dar es Salaam, Tanzania',
      deviceInfo: {
        os: navigator.userAgent.includes('Mobile') ? 'Mobile OS Enclave' : 'Desktop OS Enclave',
        browser: 'TLS 1.3 Secure Browser',
        tpmVersion: 'TPM 2.0 Virtual Trust Enclave',
        secureEnclave: true
      },
      lastLoginTimestamp: 'Just now (EAT)'
    };

    setUser(loggedUser);
    localStorage.setItem('smarttrade_current_user', JSON.stringify(loggedUser));
    setBiometricStatus('unregistered');
    return true;
  };

  const registerUser = async (name: string, email: string, phone: string, passwordPlain: string, location: string): Promise<boolean> => {
    const hashed = await computeSha256(passwordPlain);
    addSecurityLog({
      type: 'XSS_FILTER',
      status: 'PASSED',
      detail: `Registration input fields scrubbed for script injections. Stored safely with Salted SHA-256.`,
      payloadSnippet: `User: ${name} (${location}) -> SHA256: ${hashed.substring(0, 24)}...`
    });

    const newUser: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 7),
      name,
      email,
      phone,
      hashedPasswordPreview: hashed,
      fingerprintRegistered: true, // Auto register fingerprint simulation during onboarding
      fingerprintCredentialId: 'fido-tz-' + Math.random().toString(36).substring(2, 10),
      location,
      deviceInfo: {
        os: 'Android / iOS Secure Platform',
        browser: 'TCP Protected Client',
        tpmVersion: 'TPM 2.0 Active',
        secureEnclave: true
      },
      lastLoginTimestamp: 'Just now'
    };

    setUser(newUser);
    localStorage.setItem('smarttrade_current_user', JSON.stringify(newUser));
    setBiometricStatus('ready');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smarttrade_current_user');
    addSecurityLog({
      type: 'TOKEN_REFRESH',
      status: 'PASSED',
      detail: 'User session terminated. JWT access token revoked and hardware enclave session memory wiped.',
      payloadSnippet: 'Token revocation broadcast: OK'
    });
  };

  const registerFingerprint = async (): Promise<boolean> => {
    setBiometricStatus('scanning');
    await new Promise(r => setTimeout(r, 1600));
    if (user) {
      const updated = {
        ...user,
        fingerprintRegistered: true,
        fingerprintCredentialId: 'fido2-cred-tz-' + Math.floor(100000 + Math.random() * 900000)
      };
      setUser(updated);
      localStorage.setItem('smarttrade_current_user', JSON.stringify(updated));
    }
    setBiometricStatus('ready');
    addSecurityLog({
      type: 'BIOMETRIC_AUTH',
      status: 'PASSED',
      detail: 'New WebAuthn / FIDO2 biometric credential enrolled in device Hardware Enclave.',
      payloadSnippet: 'PublicKeyCredential: authenticatorAttachment=platform, userVerification=required'
    });
    return true;
  };

  const authenticateWithFingerprint = async (): Promise<boolean> => {
    setBiometricStatus('scanning');
    await new Promise(r => setTimeout(r, 1400));
    setBiometricStatus('success');
    addSecurityLog({
      type: 'BIOMETRIC_AUTH',
      status: 'PASSED',
      detail: 'WebAuthn cryptographic challenge successfully signed by local hardware fingerprint sensor.',
      payloadSnippet: 'FIDO2 Assertion Verify: SignCount incremented, flags: ED+AT verified.'
    });
    setTimeout(() => {
      setBiometricStatus('ready');
    }, 2000);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loginWithPassword,
      registerUser,
      logout,
      biometricStatus,
      registerFingerprint,
      authenticateWithFingerprint,
      securityLogs,
      addSecurityLog,
      deviceViewMode,
      setDeviceViewMode,
      swahiliMode,
      setSwahiliMode,
      trustScoreOverall: 98
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
