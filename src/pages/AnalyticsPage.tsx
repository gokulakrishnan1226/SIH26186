import React from 'react';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  MONTHLY_TRENDS,
  RISK_DISTRIBUTION,
  UNIT_STRESS,
  INTERVENTION_EFFECTIVENESS
} from '../utils/mockData';

const tooltipStyle = { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '14px', color: '#fff' };

const radarData = [
  { metric: 'Duty Hours', A: 85, B: 60 },
  { metric: 'Sleep Quality', A: 40, B: 75 },
  { metric: 'Leave Util', A: 30, B: 70 },
  { metric: 'Peer Rating', A: 60, B: 80 },
  { metric: 'Physical Health', A: 55, B: 85 },
  { metric: 'Mental Wellness', A: 35, B: 72 }
];

const heatmapData = [
  { day: 'Mon', '06:00': 22, '09:00': 45, '12:00': 60, '15:00': 72, '18:00': 55, '21:00': 38 },
  { day: 'Tue', '06:00': 18, '09:00': 40, '12:00': 58, '15:00': 68, '18:00': 50, '21:00': 35 },
  { day: 'Wed', '06:00': 25, '09:00': 50, '12:00': 65, '15:00': 80, '18:00': 62, '21:00': 40 },
  { day: 'Thu', '06:00': 20, '09:00': 42, '12:00': 55, '15:00': 75, '18:00': 58, '21:00': 42 },
  { day: 'Fri', '06:00': 30, '09:00': 55, '12:00': 70, '15:00': 85, '18:00': 65, '21:00': 45 },
  { day: 'Sat', '06:00': 15, '09:00': 30, '12:00': 42, '15:00': 50, '18:00': 38, '21:00': 28 },
  { day: 'Sun', '06:00': 12, '09:00': 25, '12:00': 35, '15:00': 40, '18:00': 30, '21:00': 22 }
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-cyan-400" /> Analytical Reports &amp; Stress Matrix
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Comprehensive data visualization of personnel stress patterns, intervention efficacy, and unit performance.
        </p>
      </div>

      {/* Row 1: Full-Width Trend */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" /> 12-Month Risk &amp; Intervention Overlay
          </h3>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TRENDS}>
              <defs>
                <linearGradient id="gradRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb74d" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ffb74d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCrit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef5350" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef5350" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradInterv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#66bb6a" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#66bb6a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="riskCount" name="At Risk" stroke="#ffb74d" strokeWidth={2} fill="url(#gradRisk)" />
              <Area type="monotone" dataKey="criticalCount" name="Critical" stroke="#ef5350" strokeWidth={2} fill="url(#gradCrit)" />
              <Area type="monotone" dataKey="interventions" name="Interventions" stroke="#66bb6a" strokeWidth={2} fill="url(#gradInterv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Three Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-cyan-400" /> Risk Distribution
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={RISK_DISTRIBUTION} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={4}>
                  {RISK_DISTRIBUTION.map((entry, i) => (
                    <Cell key={`c-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800/60 pt-3">
            {RISK_DISTRIBUTION.map(r => (
              <div key={r.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                <span className="text-slate-300">{r.name}: {r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Stress Bar Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Unit Stress Comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={UNIT_STRESS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="unit" stroke="#64748b" fontSize={9} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="avgStress" name="Avg Stress" fill="#00d4ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar: At-Risk vs Healthy */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            At-Risk vs Healthy Profiles
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis stroke="#334155" fontSize={9} domain={[0, 100]} />
                <Radar name="At-Risk Profile" dataKey="A" stroke="#ef5350" fill="#ef5350" fillOpacity={0.3} />
                <Radar name="Healthy Profile" dataKey="B" stroke="#4fc3f7" fill="#4fc3f7" fillOpacity={0.3} />
                <Legend />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Stress Heatmap and Intervention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Stress Heatmap */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Weekly Stress Intensity Heatmap
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="py-2 px-3 text-left text-slate-400 font-mono">Day</th>
                  {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map(t => (
                    <th key={t} className="py-2 px-3 text-slate-400 font-mono text-center">{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map(row => (
                  <tr key={row.day}>
                    <td className="py-2 px-3 font-bold text-white font-mono">{row.day}</td>
                    {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map(t => {
                      const val = (row as any)[t] as number;
                      const opacity = Math.min(1, val / 100);
                      const bg =
                        val > 70 ? `rgba(239, 83, 80, ${opacity})` :
                        val > 45 ? `rgba(255, 183, 77, ${opacity})` :
                        `rgba(79, 195, 247, ${opacity * 0.7})`;
                      return (
                        <td key={t} className="py-2 px-3 text-center">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold font-mono mx-auto text-white"
                            style={{ backgroundColor: bg }}
                          >
                            {val}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intervention Channels */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Intervention Channel Effectiveness
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INTERVENTION_EFFECTIVENESS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area type="monotone" dataKey="counseling" name="Counseling" stroke="#4fc3f7" fill="#4fc3f7" fillOpacity={0.5} stackId="1" />
                <Area type="monotone" dataKey="leaveRotation" name="Leave Rotation" stroke="#66bb6a" fill="#66bb6a" fillOpacity={0.5} stackId="1" />
                <Area type="monotone" dataKey="dutyReassignment" name="Duty Reassignment" stroke="#ffb74d" fill="#ffb74d" fillOpacity={0.5} stackId="1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
