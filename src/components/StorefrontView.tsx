import React, { useState } from 'react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Truck, Fingerprint, Award, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { calculateProductTrustScore } from '../utils/trustScore';

interface StorefrontViewProps {
  products: Product[];
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onAddToCart
}) => {
  const { swahiliMode } = useAuth();
  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high' | 'trust'>('rating');

  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'trust') {
        return calculateProductTrustScore(b, swahiliMode).totalScore - calculateProductTrustScore(a, swahiliMode).totalScore;
      }
      if (sortBy === 'price_low') return a.priceTzs - b.priceTzs;
      if (sortBy === 'price_high') return b.priceTzs - a.priceTzs;
      return 0;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sophisticated Dark Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/80 via-slate-900 to-slate-950 text-slate-200 p-6 md:p-8 shadow-2xl border border-slate-800">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09m11.192-3.177A11.952 11.952 0 0012 20.3m6.561-8.347a11.952 11.952 0 01-1.127 5.143L16 16.5M12 11a4 4 0 100-8 4 4 0 000 8z"></path>
          </svg>
        </div>
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{swahiliMode ? 'JUKWAA LA BIASHARA YA KIDIJITALI • TANZANIA' : 'TANZANIA DIGITAL COMMERCE • VERIFIED PLATFORM'}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white">
            {swahiliMode
              ? 'Biashara Salama na Amini kwa Tanzania'
              : 'Secure Commerce Backed by TCP Enclave and Hardware Biometrics'}
          </h1>
        </div>
      </div>

      {/* Category Pills and Sorting Controls */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 overflow-x-auto w-full md:w-auto">
          {[
            'All',
            'Electronics and Gadgets',
            'Solar and Power Solutions',
            'Agriculture and Coffee',
            'Fashion and Kitenge',
            'Home and Kitchen'
          ].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border border-blue-500'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-800/80 border border-slate-700/60 hover:border-blue-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
          <span className="text-xs font-bold text-slate-400 flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-blue-400" />
            {swahiliMode ? 'Panga kwa:' : 'Sort By:'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 outline-none cursor-pointer focus:border-blue-500 transition-colors"
          >
            <option value="rating">Top Rated (Stars)</option>
            <option value="trust">Highest TAM/UTAUT Trust Score</option>
            <option value="price_low">Price: Low to High (TSh)</option>
            <option value="price_high">Price: High to Low (TSh)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-12 text-center border border-slate-800 shadow-xl space-y-3">
          <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-white text-base">No products matched your search</h3>
          <p className="text-xs text-slate-400">Try selecting a different category or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
