export type Category = 
  | 'All' 
  | 'Electronics and Gadgets' 
  | 'Solar and Power Solutions' 
  | 'Agriculture and Coffee' 
  | 'Fashion and Kitenge' 
  | 'Home and Kitchen';

export interface Product {
  id: string;
  name: string;
  swahiliName?: string;
  category: Category;
  priceTzs: number;
  originalPriceTzs?: number;
  rating: number;
  reviewCount: number;
  image: string;
  seller: {
    name: string;
    location: string;
    verified: boolean;
    trustScore: number; // out of 100
  };
  inStock: boolean;
  smartDelivery: boolean; // Amazon Prime equivalent in TZ
  description: string;
  features: string[];
  securityVerified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedTimestamp: number;
}

export type BiometricStatus = 'unregistered' | 'ready' | 'scanning' | 'success' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  hashedPasswordPreview: string;
  fingerprintRegistered: boolean;
  fingerprintCredentialId?: string;
  location: string;
  deviceInfo: {
    os: string;
    browser: string;
    tpmVersion: string;
    secureEnclave: boolean;
  };
  lastLoginTimestamp: string;
  role?: 'admin' | 'user';
}

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  passwordPlain: string;
  role: 'admin';
  addedBy: string;
  addedAt: string;
}

export interface UserMovementLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  actionType: 'LOGIN' | 'PAGE_VIEW' | 'SEARCH' | 'ADD_TO_CART' | 'CHECKOUT' | 'BIOMETRIC' | 'ADD_PRODUCT' | 'ADD_ADMIN' | 'LOGOUT';
  description: string;
  ipOrDevice?: string;
}

export type PaymentMethodType = 'mpesa' | 'tigopesa' | 'airtel' | 'card' | 'flutterwave';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amountTzs: number;
  method: PaymentMethodType;
  phoneOrCard: string;
  status: 'pending' | 'ussd_prompted' | 'biometric_verifying' | 'completed' | 'failed';
  cryptoSignature: string;
  timestamp: string;
  gatewayResponse: Record<string, any>;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalTzs: number;
  paymentTransaction: PaymentTransaction;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: string;
  orderDate: string;
  escrowProtectionCode: string;
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  type: 'SQLI_CHECK' | 'XSS_FILTER' | 'CSRF_VALIDATION' | 'BIOMETRIC_AUTH' | 'TCP_ATTESTATION' | 'TOKEN_REFRESH';
  status: 'PASSED' | 'BLOCKED' | 'WARNED';
  detail: string;
  payloadSnippet?: string;
}

export interface TamMetric {
  id: string;
  category: 'TAM' | 'UTAUT';
  dimension: string;
  score: number; // 0-100
  description: string;
  implementedFeatures: string[];
}

