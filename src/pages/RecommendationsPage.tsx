import React from 'react';
import { Lightbulb, Zap, Clock, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useWelfare } from '../context/WelfareContext';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, applyRecommendation } = useWelfare();

  const typeConfig: Record<string, { emoji: string; color: string }> = {
    leave: { emoji: '🏖️', color: 'text-cyan-400' },
    rotation: { emoji: '🔄', color: 'text-emerald-400' },
    counseling: { emoji: '🧠', color: 'text-purple-400' },
    workload: { emoji: '⚖️', color: 'text-amber-400' }
  };

  const urgencyBadge: Record<string, string> = {
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <Lightbulb className="w-7 h-7 text-cyan-400" /> AI Welfare Recommendations
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Machine-generated actionable recommendations based on stress trend analysis, deployment history, and leave utilization patterns.
        </p>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-5">
        {recommendations.map(rec => {
          const tc = typeConfig[rec.type] || { emoji: '📋', color: 'text-slate-400' };

          return (
            <div
              key={rec.id}
              className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 hover:border-cyan-500/30 transition-all"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4 flex-1">
                  <span className="text-3xl">{tc.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{rec.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span className="font-mono">{rec.unit}</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {rec.targetPersonnel} personnel
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase font-mono ${urgencyBadge[rec.urgency]}`}>
                    {rec.urgency}
                  </span>
                  <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase font-mono ${
                    rec.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : rec.status === 'in-progress'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                      : 'bg-slate-700/30 text-slate-400 border-slate-700'
                  }`}>
                    {rec.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed">{rec.description}</p>

              {/* Impact Assessment */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/60 flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Projected Impact</p>
                  <p className="text-sm text-slate-200 mt-1">{rec.impact}</p>
                </div>
              </div>

              {/* Action */}
              {rec.status === 'pending' && (
                <button
                  onClick={() => applyRecommendation(rec.id)}
                  className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve &amp; Dispatch Action Plan
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
