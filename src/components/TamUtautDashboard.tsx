import React, { useState } from 'react';
import { INITIAL_TAM_METRICS } from '../data/trustData';
import { useAuth } from '../context/AuthContext';
import { BarChart3, TrendingUp, CheckCircle2, ShieldCheck, Award, Users, ThumbsUp, HeartHandshake } from 'lucide-react';

export const TamUtautDashboard: React.FC = () => {
  const { swahiliMode } = useAuth();
  const [activeModel, setActiveModel] = useState<'ALL' | 'TAM' | 'UTAUT'>('ALL');

  const filteredMetrics = activeModel === 'ALL'
    ? INITIAL_TAM_METRICS
    : INITIAL_TAM_METRICS.filter(m => m.category === activeModel);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-slate-200">
      {/* Course Header Banner */}
      <div className="bg-gradient-to-br from-blue-900/50 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="bg-blue-500/20 text-blue-400 font-mono text-xs px-2.5 py-1 rounded-full border border-blue-500/30 font-bold uppercase tracking-wider">
              Assignment Objectives #7 and #16
            </span>
            <h1 className="text-2xl font-bold mt-2.5 text-white">
              {swahiliMode ? 'Tathmini ya Kukubalika kwa Teknolojia (TAM and UTAUT)' : 'Technology Acceptance Model (TAM and UTAUT) Trust Evaluation'}
            </h1>
            <p className="text-sm font-medium text-slate-400 max-w-3xl mt-1 leading-relaxed">
              Evaluating how hardware biometrics, M-Pesa push notifications, and clear Swahili/English UI improve Technology Adoption, Perceived Usefulness (PU), and User Confidence across East Africa.
            </p>
          </div>

          <div className="bg-slate-950 text-white p-4 rounded-xl font-mono text-center shrink-0 border border-slate-800">
            <p className="text-slate-400 text-[10px]">OVERALL USER CONFIDENCE</p>
            <p className="text-3xl font-black text-blue-400 mt-1">95.8%</p>
            <p className="text-[10px] text-green-400 font-sans mt-0.5 font-bold">▲ High Adoption Rate</p>
          </div>
        </div>
      </div>

      {/* Trust Indicators Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg flex items-center space-x-3 hover:border-blue-500/50 transition-colors">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">HTTPS SSL / TLS 1.3</p>
            <h4 className="font-bold text-white text-sm">256-Bit Encrypted</h4>
            <p className="text-[10px] text-green-400 font-medium">Zero data leaks</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg flex items-center space-x-3 hover:border-blue-500/50 transition-colors">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 border border-blue-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Regulatory Badges</p>
            <h4 className="font-bold text-white text-sm">TCRA and TBS Verified</h4>
            <p className="text-[10px] text-blue-400 font-medium">Tanzania Standard</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg flex items-center space-x-3 hover:border-blue-500/50 transition-colors">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 border border-blue-500/20">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Payment Escrow</p>
            <h4 className="font-bold text-white text-sm">Buyer Protection</h4>
            <p className="text-[10px] text-purple-400 font-medium">100% Refundable</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg flex items-center space-x-3 hover:border-blue-500/50 transition-colors">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Social Influence</p>
            <h4 className="font-bold text-white text-sm">4.9/5 User Rating</h4>
            <p className="text-[10px] text-amber-400 font-medium">Over 1,800 reviews</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex space-x-2">
          {['ALL', 'TAM', 'UTAUT'].map(m => (
            <button
              key={m}
              onClick={() => setActiveModel(m as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeModel === m
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border border-blue-500'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-white border border-slate-700/60'
              }`}
            >
              {m === 'ALL' ? 'Compare All Dimensions' : m === 'TAM' ? 'TAM Model (Davis, 1989)' : 'UTAUT Model (Venkatesh, 2003)'}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 hidden md:inline font-medium">
          Showing {filteredMetrics.length} theoretical adoption dimensions
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMetrics.map(metric => (
          <div
            key={metric.id}
            className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg hover:border-blue-500/50 transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                metric.category === 'TAM' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
              }`}>
                {metric.category} THEORETICAL FRAMEWORK
              </span>
              <div className="flex items-center space-x-1.5 font-black text-lg text-green-400 font-mono">
                <span>{metric.score}%</span>
                <span className="text-xs font-sans font-normal text-slate-500">Adoption Score</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white">{metric.dimension}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{metric.description}</p>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>Implementation Benchmark</span>
                <span>{metric.score}/100</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-blue-600 to-emerald-400 h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>

            {/* Implemented Features List */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Implemented Software Features:
              </p>
              <ul className="space-y-2">
                {metric.implementedFeatures.map((feat, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mr-2 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Academic Conclusion Footer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-2">
          💡 Software Developer and Trust Analyst Summary (Course 428)
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          By linking hardware security (TPM / WebAuthn) directly with localized Tanzanian payment habits (M-Pesa USSD simulation), SmartTrade Africa bridges the trust gap identified in early East African e-commerce studies. Customers perceive high usefulness because checkout takes under 15 seconds, and high ease of use due to Amazon-like clarity and Swahili support.
        </p>
      </div>
    </div>
  );
};
