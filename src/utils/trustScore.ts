import { Product } from '../types';

export interface TrustScoreBreakdown {
  totalScore: number;
  tier: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  factors: {
    sellerVerification: {
      name: string;
      score: number;
      max: number;
      detail: string;
    };
    transactionHistory: {
      name: string;
      score: number;
      max: number;
      detail: string;
    };
    escrowAndDelivery: {
      name: string;
      score: number;
      max: number;
      detail: string;
    };
  };
}

export function calculateProductTrustScore(product: Product, swahiliMode: boolean = false): TrustScoreBreakdown {
  // Factor 1: UTAUT Seller Verification Status
  const baseVerification = product.seller.verified ? 25 : 10;
  const sellerBonus = Math.round((product.seller.trustScore || 90) * 0.15);
  const sellerScore = Math.min(40, baseVerification + sellerBonus);

  // Factor 2: TAM Positive Transaction History and Customer Satisfaction
  const ratingScore = Math.round(((product.rating || 4.5) / 5.0) * 28);
  const volumeBonus = Math.min(12, Math.round((product.reviewCount || 10) / 25));
  const historyScore = Math.min(40, ratingScore + volumeBonus);

  // Factor 3: TAM Ease of Use / UTAUT Effort Expectancy and Escrow Protection
  const securityScore = product.securityVerified ? 10 : 8;
  const deliveryScore = product.smartDelivery ? 10 : 7;
  const escrowScore = Math.min(20, securityScore + deliveryScore);

  const totalScore = Math.min(100, sellerScore + historyScore + escrowScore);

  let tier = swahiliMode ? 'Uwiano wa Juu (Daraja A+)' : 'Elite TAM/UTAUT Trust (A+)';
  let badgeBg = 'bg-emerald-500/15';
  let textColor = 'text-emerald-300';
  let borderColor = 'border-emerald-500/40';

  if (totalScore < 96) {
    tier = swahiliMode ? 'Uaminifu uliothibitishwa (Daraja A)' : 'High TAM/UTAUT Trust (A)';
    badgeBg = 'bg-blue-500/15';
    textColor = 'text-blue-300';
    borderColor = 'border-blue-500/40';
  }

  return {
    totalScore,
    tier,
    badgeBg,
    textColor,
    borderColor,
    factors: {
      sellerVerification: {
        name: swahiliMode ? 'Uthibitisho wa Muuzaji (UTAUT)' : 'UTAUT Seller Verification Status',
        score: sellerScore,
        max: 40,
        detail: swahiliMode
          ? `Muuzaji Mhakikiwa TBS/TCRA (${product.seller.name})`
          : `Verified TBS/TCRA Seller (${product.seller.name})`
      },
      transactionHistory: {
        name: swahiliMode ? 'Historia Chanya ya Manunuzi (TAM)' : 'TAM Positive Transaction History',
        score: historyScore,
        max: 40,
        detail: swahiliMode
          ? `Nyota ${product.rating}★ kati ya manunuzi ${product.reviewCount}+ yaliyofanikiwa`
          : `${product.rating}★ rating across ${product.reviewCount}+ positive transactions`
      },
      escrowAndDelivery: {
        name: swahiliMode ? 'Urahisi wa Escrow na Uwasilishaji' : 'UTAUT Effort Expectancy and Escrow',
        score: escrowScore,
        max: 20,
        detail: swahiliMode
          ? `${product.smartDelivery ? 'Uwasilishaji wa Haraka + ' : ''}Ulinzi wa Escrow 100%`
          : `${product.smartDelivery ? 'SmartDelivery TZ Priority + ' : ''}100% Escrow Protection`
      }
    }
  };
}
