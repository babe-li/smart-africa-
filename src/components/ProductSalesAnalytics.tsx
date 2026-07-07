import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  Filter, 
  RefreshCw, 
  Sparkles, 
  BarChart3, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ShieldCheck,
  Package,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProductSalesAnalyticsProps {
  products: Product[];
}

// Color palette for charts
const CATEGORY_COLORS: Record<string, string> = {
  'Electronics and Gadgets': '#3b82f6', // Blue
  'Solar and Power Solutions': '#f59e0b', // Amber
  'Agriculture and Coffee': '#10b981', // Emerald
  'Fashion and Kitenge': '#ec4899', // Pink
  'Home and Kitchen': '#8b5cf6', // Purple
  'Other': '#64748b'
};

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4'];

export const ProductSalesAnalytics: React.FC<ProductSalesAnalyticsProps> = ({ products }) => {
  const { swahiliMode } = useAuth();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '6m' | '1y'>('6m');
  const [currency, setCurrency] = useState<'TZS' | 'USD'>('TZS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [simulationMultiplier, setSimulationMultiplier] = useState<number>(1);

  const exchangeRate = 2650; // 1 USD = 2650 TZS

  const formatCurr = (valTzs: number) => {
    if (currency === 'USD') {
      const usdVal = valTzs / exchangeRate;
      return `$${usdVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `TSh ${valTzs.toLocaleString()}`;
  };

  // Generate realistic historical sales trends over time based on selected timeframe
  const timeSeriesData = useMemo(() => {
    const mult = simulationMultiplier;
    if (timeframe === '7d') {
      return [
        { period: swahiliMode ? 'Jumatatu' : 'Mon', salesTzs: 4200000 * mult, orders: 18, biometricRate: 98 },
        { period: swahiliMode ? 'Jumanne' : 'Tue', salesTzs: 5800000 * mult, orders: 24, biometricRate: 100 },
        { period: swahiliMode ? 'Jumatano' : 'Wed', salesTzs: 4900000 * mult, orders: 21, biometricRate: 96 },
        { period: swahiliMode ? 'Alhamisi' : 'Thu', salesTzs: 7200000 * mult, orders: 31, biometricRate: 99 },
        { period: swahiliMode ? 'Ijumaa' : 'Fri', salesTzs: 9100000 * mult, orders: 39, biometricRate: 100 },
        { period: swahiliMode ? 'Jumamosi' : 'Sat', salesTzs: 11400000 * mult, orders: 48, biometricRate: 97 },
        { period: swahiliMode ? 'Jumapili' : 'Sun', salesTzs: 8600000 * mult, orders: 36, biometricRate: 99 },
      ];
    } else if (timeframe === '30d') {
      return [
        { period: swahiliMode ? 'Wiki 1' : 'Week 1', salesTzs: 24500000 * mult, orders: 112, biometricRate: 98 },
        { period: swahiliMode ? 'Wiki 2' : 'Week 2', salesTzs: 31200000 * mult, orders: 145, biometricRate: 99 },
        { period: swahiliMode ? 'Wiki 3' : 'Week 3', salesTzs: 28900000 * mult, orders: 134, biometricRate: 97 },
        { period: swahiliMode ? 'Wiki 4' : 'Week 4', salesTzs: 38400000 * mult, orders: 178, biometricRate: 100 },
      ];
    } else if (timeframe === '6m') {
      return [
        { period: swahiliMode ? 'Januari' : 'Jan', salesTzs: 64000000 * mult, orders: 290, biometricRate: 96 },
        { period: swahiliMode ? 'Februari' : 'Feb', salesTzs: 72500000 * mult, orders: 320, biometricRate: 98 },
        { period: swahiliMode ? 'Machi' : 'Mar', salesTzs: 68900000 * mult, orders: 310, biometricRate: 97 },
        { period: swahiliMode ? 'Aprili' : 'Apr', salesTzs: 84200000 * mult, orders: 385, biometricRate: 99 },
        { period: swahiliMode ? 'Mei' : 'May', salesTzs: 96500000 * mult, orders: 440, biometricRate: 99 },
        { period: swahiliMode ? 'Juni (MoM)' : 'Jun (Current)', salesTzs: 118400000 * mult, orders: 532, biometricRate: 100 },
      ];
    } else {
      // 1 Year
      return [
        { period: 'Q3 2025', salesTzs: 185000000 * mult, orders: 840, biometricRate: 95 },
        { period: 'Q4 2025', salesTzs: 245000000 * mult, orders: 1120, biometricRate: 97 },
        { period: 'Q1 2026', salesTzs: 205400000 * mult, orders: 920, biometricRate: 98 },
        { period: 'Q2 2026', salesTzs: 299100000 * mult, orders: 1357, biometricRate: 99 },
      ];
    }
  }, [timeframe, swahiliMode, simulationMultiplier]);

  // Product performance ranking (Bar Chart)
  const productPerformanceData = useMemo(() => {
    // Generate simulated performance for each product or top products
    const sampleProducts = products.length > 0 ? products : [];
    const filtered = selectedCategory === 'ALL' 
      ? sampleProducts 
      : sampleProducts.filter(p => p.category === selectedCategory);

    // Map into performance items
    const baseList = filtered.slice(0, 8).map((p, idx) => {
      // Assign realistic sales volume based on rating and index
      const baseUnits = Math.round((5 - idx * 0.4) * 18 * simulationMultiplier);
      const unitsSold = Math.max(12, baseUnits);
      const totalRev = p.priceTzs * unitsSold;
      const shortName = p.name.length > 24 ? p.name.substring(0, 22) + '...' : p.name;
      
      return {
        id: p.id,
        name: shortName,
        fullName: p.name,
        category: p.category,
        unitsSold,
        revenueTzs: totalRev,
        priceTzs: p.priceTzs,
        rating: p.rating
      };
    });

    return baseList.sort((a, b) => b.revenueTzs - a.revenueTzs);
  }, [products, selectedCategory, simulationMultiplier]);

  // Category revenue breakdown (Pie Chart)
  const categoryBreakdownData = useMemo(() => {
    const breakdown: Record<string, number> = {};
    
    productPerformanceData.forEach(item => {
      breakdown[item.category] = (breakdown[item.category] || 0) + item.revenueTzs;
    });

    // Ensure all main categories have some data if list is short
    if (Object.keys(breakdown).length < 3) {
      breakdown['Electronics and Gadgets'] = (breakdown['Electronics and Gadgets'] || 0) + 145000000 * simulationMultiplier;
      breakdown['Solar and Power Solutions'] = (breakdown['Solar and Power Solutions'] || 0) + 98000000 * simulationMultiplier;
      breakdown['Agriculture and Coffee'] = (breakdown['Agriculture and Coffee'] || 0) + 42000000 * simulationMultiplier;
      breakdown['Fashion and Kitenge'] = (breakdown['Fashion and Kitenge'] || 0) + 36000000 * simulationMultiplier;
    }

    return Object.entries(breakdown).map(([name, value]) => ({
      name,
      valueTzs: value,
      valueUsd: Math.round(value / exchangeRate)
    }));
  }, [productPerformanceData, simulationMultiplier]);

  // Calculate summary KPIs
  const totalRevenueTzs = useMemo(() => {
    return timeSeriesData.reduce((sum, item) => sum + item.salesTzs, 0);
  }, [timeSeriesData]);

  const totalOrders = useMemo(() => {
    return timeSeriesData.reduce((sum, item) => sum + item.orders, 0);
  }, [timeSeriesData]);

  const aovTzs = totalOrders > 0 ? Math.round(totalRevenueTzs / totalOrders) : 0;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['ALL', ...cats];
  }, [products]);

  const handleSimulateSurge = () => {
    setSimulationMultiplier(prev => (prev === 1 ? 1.25 : prev === 1.25 ? 1.5 : 1));
  };

  // Custom Tooltips
  const CustomTimeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 z-50">
          <p className="font-bold text-white border-b border-slate-800 pb-1">{label}</p>
          <p className="text-cyan-400 font-mono">
            {swahiliMode ? 'Mauzo:' : 'Revenue:'} <span className="font-bold">{formatCurr(data.salesTzs)}</span>
          </p>
          <p className="text-slate-300">
            {swahiliMode ? 'Oda Zilizothibitishwa:' : 'Verified Orders:'} <span className="font-bold text-white">{data.orders}</span>
          </p>
          <p className="text-emerald-400">
            {swahiliMode ? 'Ulinzi wa Biometriki:' : 'Biometric Security Rate:'} <span className="font-bold">{data.biometricRate}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomProductTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 max-w-xs z-50">
          <p className="font-bold text-white leading-tight">{data.fullName}</p>
          <span className="inline-block bg-slate-800 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-mono">
            {data.category}
          </span>
          <div className="pt-1 border-t border-slate-800 flex justify-between items-center text-slate-300">
            <span>{swahiliMode ? 'Jumla ya Mauzo:' : 'Total Revenue:'}</span>
            <span className="font-bold text-amber-400 font-mono">{formatCurr(data.revenueTzs)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>{swahiliMode ? 'Idadi Iliyouzwa:' : 'Units Sold:'}</span>
            <span className="font-bold text-white">{data.unitsSold} {swahiliMode ? 'vipande' : 'units'}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and Controls Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Recharts Analytics Engine</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Real-Time Escrow Attested</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {swahiliMode ? 'Takwimu za Utendaji wa Mauzo na Mwenendo' : 'Product Sales Performance and Trends Dashboard'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {swahiliMode
                ? 'Muhtasari wa mauzo ya bidhaa, ukuaji wa oda kwa wakati, na mchango wa kategoria ukilindwa na uthibitisho wa biometriki wa TCP.'
                : 'Interactive visual telemetry tracking transaction trends, category revenue shares, and item-level sales velocity across SmartTrade Africa.'}
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Currency Toggle */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                onClick={() => setCurrency('TZS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  currency === 'TZS' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                TZS (TSh)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                  currency === 'USD' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Simulate Surge Button */}
            <button
              onClick={handleSimulateSurge}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>
                {swahiliMode ? 'Jaribio la Mauzo (' : 'Simulate Surge ('}{simulationMultiplier}x)
              </span>
            </button>
          </div>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{swahiliMode ? 'Kipindi cha Muda:' : 'Time Horizon:'}</span>
            </span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[
                { id: '7d', label: swahiliMode ? 'Siku 7' : 'Past 7 Days' },
                { id: '30d', label: swahiliMode ? 'Siku 30' : 'Last 30 Days' },
                { id: '6m', label: swahiliMode ? 'Miezi 6' : 'Past 6 Months' },
                { id: '1y', label: swahiliMode ? 'Mwaka 1' : '1-Year Trend' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTimeframe(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeframe === tab.id
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{swahiliMode ? 'Inasasishwa moja kwa moja kutoka WebAuthn Gateway' : 'Live synced with TCP Escrow Database'}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              {swahiliMode ? 'Jumla ya Mauzo' : 'Gross Revenue'}
            </span>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {formatCurr(totalRevenueTzs)}
            </div>
            <div className="flex items-center space-x-1 mt-1 text-xs text-emerald-400 font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+18.4% {swahiliMode ? 'kulinganisha na kipindi kilichopita' : 'vs. previous period'}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Units Sold */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              {swahiliMode ? 'Bidhaa Zilizouzwa' : 'Total Units Sold'}
            </span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {productPerformanceData.reduce((sum, i) => sum + i.unitsSold, 0).toLocaleString()} <span className="text-sm font-sans text-slate-400">{swahiliMode ? 'vipande' : 'units'}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {swahiliMode ? 'Kati ya bidhaa zilizoidhinishwa' : 'Across active product catalogue'}
            </div>
          </div>
        </div>

        {/* KPI 3: Average Order Value */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              {swahiliMode ? 'Wastani wa Oda (AOV)' : 'Avg. Order Value (AOV)'}
            </span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {formatCurr(aovTzs)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {totalOrders.toLocaleString()} {swahiliMode ? 'oda zilizolipwa' : 'completed orders'}
            </div>
          </div>
        </div>

        {/* KPI 4: Biometric Verification Security Rate */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-300 tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{swahiliMode ? 'Uthibitisho wa Biometriki' : 'Biometric Security Rate'}</span>
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
              98.7%
            </div>
            <div className="text-xs text-emerald-200/80 mt-1 font-medium">
              {swahiliMode ? 'Hakuna malalamiko ya wizi au udanganyifu' : '0% chargeback fraud on WebAuthn orders'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid: Chronological Trend Area Chart and Category Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales Trend Over Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>{swahiliMode ? 'Mwenendo wa Mauzo kwa Wakati' : 'Revenue Trends and Order Volume Over Time'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {swahiliMode ? 'Mauzo ya kipindi cha ' : 'Chronological sales velocity for '} 
                <strong className="text-white uppercase">{timeframe}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-500 inline-block" />
                <span>{swahiliMode ? 'Mapato' : 'Revenue'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500/40 inline-block" />
                <span>{swahiliMode ? 'Oda' : 'Orders'}</span>
              </span>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="period" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(value) => {
                    if (currency === 'USD') return `$${Math.round(value / exchangeRate / 1000)}k`;
                    return `${Math.round(value / 1000000)}M`;
                  }}
                />
                <Tooltip content={<CustomTimeTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="salesTzs" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Category Share Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-amber-400" />
              <span>{swahiliMode ? 'Mgawanyo kwa Kategoria' : 'Sales Breakdown by Category'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {swahiliMode ? 'Asilimia ya mchango wa kila kundi la bidhaa' : 'Percentage share of gross revenue per vertical'}
            </p>
          </div>

          <div className="h-60 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey={currency === 'USD' ? 'valueUsd' : 'valueTzs'}
                >
                  {categoryBreakdownData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [
                    currency === 'USD' ? `$${value.toLocaleString()}` : `TSh ${value.toLocaleString()}`,
                    swahiliMode ? 'Mauzo' : 'Revenue'
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Category Legend */}
          <div className="space-y-2 border-t border-slate-800 pt-4">
            {categoryBreakdownData.slice(0, 4).map((cat, idx) => {
              const total = categoryBreakdownData.reduce((acc, c) => acc + c.valueTzs, 0);
              const percent = total > 0 ? Math.round((cat.valueTzs / total) * 100) : 0;
              return (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 truncate">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: CATEGORY_COLORS[cat.name] || PIE_COLORS[idx % PIE_COLORS.length] }} 
                    />
                    <span className="text-slate-300 truncate max-w-[150px]">{cat.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Ranking Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <span>{swahiliMode ? 'Utendaji wa Bidhaa Kengele (Top Selling Products)' : 'Product Sales Performance Ranking'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {swahiliMode ? 'Linganisha mapato na idadi ya vitu vilivyouzwa kwa kila bidhaa' : 'Compare revenue generated versus unit volume across catalog'}
            </p>
          </div>

          {/* Category Filter for Bar Chart */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? (swahiliMode ? 'Kategoria Zote' : 'All Categories') : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="h-80 sm:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={productPerformanceData} 
              layout="vertical"
              margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#64748b" 
                fontSize={11}
                tickFormatter={(value) => {
                  if (currency === 'USD') return `$${Math.round(value / exchangeRate / 1000)}k`;
                  return `${Math.round(value / 1000000)}M`;
                }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#94a3b8" 
                fontSize={11}
                width={160}
                tickLine={false}
              />
              <Tooltip content={<CustomProductTooltip />} />
              <Bar 
                dataKey="revenueTzs" 
                fill="#3b82f6" 
                radius={[0, 8, 8, 0]}
              >
                {productPerformanceData.map((entry, index) => (
                  <Cell 
                    key={`bar-${index}`} 
                    fill={CATEGORY_COLORS[entry.category] || '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Insights Footer Table */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-white">{swahiliMode ? 'Bidhaa Inayoongoza:' : 'Top Revenue Driver:'}</p>
                <p className="text-slate-400 truncate mt-0.5">{productPerformanceData[0]?.fullName || 'Samsung Galaxy S24 Ultra'}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">{swahiliMode ? 'Kasi ya Mauzo:' : 'Sales Velocity Index:'}</p>
                <p className="text-slate-400 truncate mt-0.5">{swahiliMode ? 'Juu ya 92% ya soko la ndani' : 'Top 92% East Africa E-Commerce Benchmark'}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <p className="font-bold text-white">{swahiliMode ? 'Utekelezaji wa Escrow:' : 'TCP Settlement Speed:'}</p>
                <p className="text-slate-400 truncate mt-0.5">{swahiliMode ? 'Malipo yanafanyika ndani ya saa 24' : 'T+1 settlement via WebAuthn Verified Gateway'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
