import React from 'react';
import { Product } from '../types';
import { formatTzs } from '../utils/format';
import { X, Star, ShieldCheck, Truck, CheckCircle2, Lock, ShoppingCart, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateProductTrustScore } from '../utils/trustScore';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onInstantBuy: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy
}) => {
  const { swahiliMode } = useAuth();
  if (!product) return null;

  const trustBreakdown = calculateProductTrustScore(product, swahiliMode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 text-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header bar */}
        <div className="bg-slate-950 text-white p-4 flex items-center justify-between sticky top-0 z-10 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-mono font-bold text-slate-300">
              SMARTTRADE TRUST ENCLAVE VERIFIED ITEM #TZ-{product.id.toUpperCase()}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Image and Trust Badges */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Regulatory and Enterprise TAM/UTAUT Trust Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-blue-300 font-bold">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>{swahiliMode ? 'Tathmini ya TAM na UTAUT' : 'TAM/UTAUT Product Trust Model'}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${trustBreakdown.badgeBg} ${trustBreakdown.textColor} ${trustBreakdown.borderColor}`}>
                  {trustBreakdown.totalScore}/100 Score
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider">SELLER LEGITIMACY</p>
                  <p className="font-bold text-white truncate">{product.seller.name}</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider">TRUST LEVEL</p>
                  <p className={`font-bold ${trustBreakdown.textColor}`}>{trustBreakdown.tier}</p>
                </div>
              </div>

              {/* Itemized TAM/UTAUT breakdown */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800/80 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">• UTAUT Seller Status:</span>
                  <span className="font-mono font-bold text-blue-400">{trustBreakdown.factors.sellerVerification.score}/{trustBreakdown.factors.sellerVerification.max} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">• TAM Positive Tx History:</span>
                  <span className="font-mono font-bold text-emerald-400">{trustBreakdown.factors.transactionHistory.score}/{trustBreakdown.factors.transactionHistory.max} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">• UTAUT Escrow and Effort:</span>
                  <span className="font-mono font-bold text-amber-400">{trustBreakdown.factors.escrowAndDelivery.score}/{trustBreakdown.factors.escrowAndDelivery.max} pts</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 pt-1">
                🔒 Funds held in TCRA-supervised escrow until delivery is confirmed by fingerprint or Face ID.
              </p>
            </div>
          </div>

          {/* Right Column: Specs, Price, Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="bg-blue-500/20 text-blue-400 font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  {product.category}
                </span>
                {product.smartDelivery && (
                  <span className="bg-slate-800 text-blue-400 font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center border border-slate-700">
                    <Truck className="w-3.5 h-3.5 mr-1 text-blue-400" />
                    SmartDelivery TZ
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white leading-snug">
                {swahiliMode && product.swahiliName ? product.swahiliName : product.name}
              </h2>

              <div className="mt-2 flex items-center space-x-3">
                <div className="flex items-center text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-semibold text-slate-400">
                  {product.reviewCount} {swahiliMode ? 'Maoni yaliyohakikiwa' : 'Verified Reviews'}
                </span>
              </div>

              {/* Price Banner */}
              <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {swahiliMode ? 'BEI RASMI (TANZANIA SHILLINGS)' : 'OFFICIAL TANZANIAN SHILLING PRICE'}
                </p>
                <div className="flex items-baseline space-x-3 mt-0.5">
                  <span className="text-2xl font-bold text-white">
                    {formatTzs(product.priceTzs)}
                  </span>
                  {product.originalPriceTzs && (
                    <span className="text-sm line-through text-slate-500 font-medium">
                      {formatTzs(product.originalPriceTzs)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-green-400 font-bold mt-1 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-400" />
                  {swahiliMode ? 'Inapatikana stoku • Uhakika wa Malipo 100%' : 'In Stock • 100% Escrow Fraud Protection Guarantee'}
                </p>
              </div>

              {/* Description and Features */}
              <div className="mt-4">
                <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-1">
                  {swahiliMode ? 'Maelezo ya bidhaa' : 'Product Overview'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-2">
                  {swahiliMode ? 'Vipengele Muhimu (Key Features)' : 'Key Security and Hardware Features'}
                </h4>
                <ul className="space-y-1.5">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  onAddToCart(product, 1);
                  onClose();
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-blue-600/20"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {swahiliMode ? 'Weka kwenye Kikapu' : 'Add to Shopping Cart'}
              </button>

              <button
                onClick={() => {
                  onInstantBuy(product);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center transition-colors border border-slate-700"
              >
                <Lock className="w-4 h-4 mr-2 text-blue-400" />
                {swahiliMode ? 'Nunua Sasa kwa Usalama' : 'Instant Escrow Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
