import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { useWelfare } from '../context/WelfareContext';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert } = useWelfare();
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.priority === filter);

  const priorityConfig = {
    critical: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: '🚨', label: 'text-rose-400' },
    high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: '⚠️', label: 'text-orange-400' },
    medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'ℹ️', label: 'text-amber-400' }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <Bell className="w-7 h-7 text-cyan-400" /> Welfare Alerts &amp; Incidents
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          AI-generated priority alerts requiring welfare officer review and action.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 flex-wrap">
        {(['all', 'critical', 'high', 'medium'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              filter === f
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
            }`}
          >
            {f === 'all' ? `All (${alerts.length})` : `${f} (${alerts.filter(a => a.priority === f).length})`}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="glass-card rounded-3xl p-12 border border-slate-800 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-lg font-bold text-white">All Clear</p>
            <p className="text-sm text-slate-400">No alerts matching this filter.</p>
          </div>
        )}

        {filtered.map(alert => {
          const config = priorityConfig[alert.priority];
          return (
            <div
              key={alert.id}
              className={`glass-card rounded-3xl p-6 border ${config.border} ${config.bg} space-y-4 transition-all hover:shadow-xl`}
            >
              {/* Top Meta */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{config.icon}</span>
                  <span className={`text-xs font-bold font-mono uppercase ${config.label}`}>
                    {alert.priority} Priority
                  </span>
                  {alert.unit && (
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {alert.unit}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" /> {alert.timestamp}
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${
                    alert.status === 'unresolved'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-white">{alert.title}</h3>
                <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{alert.description}</p>
              </div>

              {/* Recommended Action */}
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/60">
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  Recommended Intervention
                </p>
                <p className="text-sm text-slate-200">{alert.actionRequired}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {alert.status === 'unresolved' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" /> Acknowledge
                  </button>
                )}
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Resolve &amp; Log Intervention
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
