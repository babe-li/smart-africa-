import React from 'react';
import { Product } from '../types';
import { formatTzs } from '../utils/format';
import { Star, ShieldCheck, CheckCircle2, ShoppingCart, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

          {/* Seller Trust Badge */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] bg-slate-800/80 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700/80">
            <div className="flex items-center truncate mr-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mr-1.5 shrink-0" />
              <span className="truncate font-medium text-xs">{product.seller.name}</span>
            </div>
            <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              {product.seller.trustScore}% Trust
            </span>
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
