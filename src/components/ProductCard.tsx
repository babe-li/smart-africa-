import React, { useState } from 'react';
import { Product } from '../types';
import { formatTzs } from '../utils/format';
import { Star, ShieldCheck, CheckCircle2, ShoppingCart, Truck, Info, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateProductTrustScore } from '../utils/trustScore';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart
}) => {
  const { swahiliMode } = useAuth();
  const [showTrustDetails, setShowTrustDetails] = useState(false);
  const trustBreakdown = calculateProductTrustScore(product, swahiliMode);

  const discountPercent = product.originalPriceTzs
    ? Math.round(((product.originalPriceTzs - product.priceTzs) / product.originalPriceTzs) * 100)
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group text-slate-200 shadow-lg">
      {/* Top Image Box */}
      <div>
        <div 
          onClick={() => onSelect(product)}
          className="relative h-44 bg-slate-800 rounded-lg overflow-hidden cursor-pointer mb-3 border border-slate-700/50"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-500/30 backdrop-blur-md">
            Verified
          </div>
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
              -{discountPercent}% OFF
            </span>
          )}
          {product.smartDelivery && (
            <span className="absolute bottom-2 left-2 bg-slate-900/90 text-blue-300 font-semibold text-[10px] px-2.5 py-0.5 rounded-full flex items-center border border-blue-500/30 backdrop-blur-md">
              <Truck className="w-3 h-3 mr-1 text-blue-400" />
              SmartDelivery TZ
            </span>
          )}
        </div>

        {/* Content Details */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="bg-slate-800 text-slate-300 font-medium px-2.5 py-0.5 rounded-full text-[10px] border border-slate-700">
              {product.category}
            </span>
            <div className="flex items-center text-amber-400 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
              <span>{product.rating}</span>
              <span className="text-slate-500 font-normal ml-1">({product.reviewCount})</span>
            </div>
          </div>

          <h3 
            onClick={() => onSelect(product)}
            className="font-bold text-white text-sm line-clamp-2 hover:text-blue-400 cursor-pointer transition-colors mt-1 leading-snug"
          >
            {swahiliMode && product.swahiliName ? product.swahiliName : product.name}
          </h3>

          {/* Seller & TAM/UTAUT Trust Indicator */}
          <div className="mt-2.5 space-y-2 bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/80 transition-colors hover:border-blue-500/50 shadow-inner">
            <div className="flex items-center justify-between text-xs gap-1">
              <div className="flex items-center truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-1.5 shrink-0" />
                <span className="truncate font-medium text-slate-200">{product.seller.name}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTrustDetails(!showTrustDetails);
                }}
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border shadow-sm transition-all cursor-pointer hover:scale-105 shrink-0 ${trustBreakdown.badgeBg} ${trustBreakdown.textColor} ${trustBreakdown.borderColor}`}
                title="Calculated from UTAUT Seller Verification & TAM Transaction History"
              >
                <ShieldCheck className="w-3 h-3 mr-0.5" />
                <span>{trustBreakdown.totalScore}/100 Trust</span>
              </button>
            </div>

            {/* Compact TAM/UTAUT Tier & Progress Bar */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setShowTrustDetails(!showTrustDetails);
              }}
              className="cursor-pointer group/bar space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="group-hover/bar:text-slate-200 transition-colors flex items-center font-medium">
                  <span>TAM/UTAUT Trust Factor</span>
                  <span className="ml-1.5 text-[8px] uppercase tracking-wider bg-slate-700/80 px-1 py-0.2 rounded text-slate-300 font-mono">
                    {showTrustDetails ? (swahiliMode ? 'Funga' : 'Hide') : (swahiliMode ? 'Eleza' : 'Details')}
                  </span>
                </span>
                <span className={`font-bold text-[10px] ${trustBreakdown.textColor}`}>{trustBreakdown.tier}</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-700/60">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${trustBreakdown.totalScore}%` }}
                />
              </div>
            </div>

            {/* Expandable TAM/UTAUT Factors Drawer inside ProductCard */}
            {showTrustDetails && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="mt-2 pt-2 border-t border-slate-700/80 space-y-1.5 text-[10px] bg-slate-950/90 p-2.5 rounded-lg animate-in fade-in duration-200"
              >
                <div className="font-bold text-slate-200 flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="flex items-center">
                    <Award className="w-3 h-3 mr-1 text-blue-400" />
                    {swahiliMode ? 'Mchanganuo wa Uaminifu:' : 'TAM/UTAUT Trust Model:'}
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{trustBreakdown.totalScore}/100</span>
                </div>
                
                <div className="space-y-0.5">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span className="truncate pr-1">1. {trustBreakdown.factors.sellerVerification.name}</span>
                    <span className="font-mono font-bold text-blue-400 shrink-0">{trustBreakdown.factors.sellerVerification.score}/{trustBreakdown.factors.sellerVerification.max}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 pl-2 leading-tight">{trustBreakdown.factors.sellerVerification.detail}</p>
                </div>

                <div className="space-y-0.5 pt-1">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span className="truncate pr-1">2. {trustBreakdown.factors.transactionHistory.name}</span>
                    <span className="font-mono font-bold text-emerald-400 shrink-0">{trustBreakdown.factors.transactionHistory.score}/{trustBreakdown.factors.transactionHistory.max}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 pl-2 leading-tight">{trustBreakdown.factors.transactionHistory.detail}</p>
                </div>

                <div className="space-y-0.5 pt-1">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span className="truncate pr-1">3. {trustBreakdown.factors.escrowAndDelivery.name}</span>
                    <span className="font-mono font-bold text-amber-400 shrink-0">{trustBreakdown.factors.escrowAndDelivery.score}/{trustBreakdown.factors.escrowAndDelivery.max}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 pl-2 leading-tight">{trustBreakdown.factors.escrowAndDelivery.detail}</p>
                </div>
              </div>
            )}
          </div>

          {/* Price Box */}
          <div className="mt-3 mb-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-bold text-blue-400">
                {formatTzs(product.priceTzs)}
              </span>
              {product.originalPriceTzs && (
                <span className="text-xs text-slate-500 line-through font-medium">
                  {formatTzs(product.originalPriceTzs)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              {swahiliMode ? 'Bei imehusisha kodi ya Tanzania (VAT Included)' : 'VAT Included • Escrow Buyer Protected'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex gap-2 border-t border-slate-800/80">
        <button
          onClick={() => onSelect(product)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-lg transition-colors border border-slate-700"
        >
          {swahiliMode ? 'Angalia' : 'Details'}
        </button>
        <button
          onClick={() => onAddToCart(product)}
          className="flex-[1.5] bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-blue-600/20 group/btn"
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5 group-hover/btn:scale-110 transition-transform" />
          {swahiliMode ? 'Weka Kikapuni' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
