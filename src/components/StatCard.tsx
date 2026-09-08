import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  color: 'cyan' | 'rose' | 'amber' | 'emerald';
  sparklineData: number[];
  unitLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  sparklineData,
  unitLabel
}) => {
  const colorMap = {
    cyan: {
      border: 'border-cyan-500/30',
      bgIcon: 'bg-cyan-500/15 text-cyan-400',
      line: '#00d4ff',
      glow: 'glow-cyan'
    },
    rose: {
      border: 'border-rose-500/30',
      bgIcon: 'bg-rose-500/15 text-rose-400',
      line: '#ef5350',
      glow: 'glow-red'
    },
    amber: {
      border: 'border-amber-500/30',
      bgIcon: 'bg-amber-500/15 text-amber-400',
      line: '#ffb74d',
      glow: 'glow-amber'
    },
    emerald: {
      border: 'border-emerald-500/30',
      bgIcon: 'bg-emerald-500/15 text-emerald-400',
      line: '#66bb6a',
      glow: 'glow-green'
    }
  };

  const currentStyle = colorMap[color];
  const chartData = sparklineData.map((v, i) => ({ i, val: v }));

  return (
    <div
      className={`glass-card rounded-2xl p-5 border ${currentStyle.border} transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${currentStyle.bgIcon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Main Value */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {value.toLocaleString()}
        </span>
        {unitLabel && <span className="text-xs text-slate-400 font-mono">{unitLabel}</span>}
      </div>

      {/* Footer & Sparkline */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60">
        <div
          className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
            changeType === 'increase'
              ? color === 'rose'
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-emerald-500/20 text-emerald-400'
              : 'bg-cyan-500/20 text-cyan-400'
          }`}
        >
          {changeType === 'increase' ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
        </div>

        {/* Mini Sparkline Chart */}
        <div className="w-24 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="val"
                stroke={currentStyle.line}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
