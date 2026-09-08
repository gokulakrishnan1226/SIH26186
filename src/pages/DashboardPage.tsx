import React from 'react';
import {
  Users,
  AlertTriangle,
  Siren,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Shield,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useWelfare } from '../context/WelfareContext';
import { StatCard } from '../components/StatCard';
import { CameraMonitor } from '../components/CameraMonitor';
import {
  MONTHLY_TRENDS,
  RISK_DISTRIBUTION,
  UNIT_STRESS,
  INTERVENTION_EFFECTIVENESS
} from '../utils/mockData';
import { getRiskBadgeClass } from '../utils/helpers';

export const DashboardPage: React.FC = () => {
  const { stats, alerts, personnel, setSelectedPersonnel, acknowledgeAlert, resolveAlert } = useWelfare();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Personnel"
          value={stats.totalPersonnel}
          change={stats.trends.total}
          changeType="increase"
          icon={Users}
          color="cyan"
          sparklineData={[2400, 2500, 2650, 2720, 2800, 2847]}
          unitLabel="Active CAPF"
        />
        <StatCard
          title="At Risk Personnel"
          value={stats.atRisk}
          change={stats.trends.risk}
          changeType="increase"
          icon={AlertTriangle}
          color="amber"
          sparklineData={[140, 155, 160, 172, 180, 184]}
          unitLabel="Elevated Stress"
        />
        <StatCard
          title="Critical Cases"
          value={stats.criticalCases}
          change={stats.trends.critical}
          changeType="increase"
          icon={Siren}
          color="rose"
          sparklineData={[12, 15, 18, 20, 22, 23]}
          unitLabel="Requires Action"
        />
        <StatCard
          title="Interventions Given"
          value={stats.interventions}
          change={stats.trends.interventions}
          changeType="increase"
          icon={CheckCircle2}
          color="emerald"
          sparklineData={[100, 115, 128, 140, 148, 156]}
          unitLabel="Resolved This Month"
        />
      </div>

      {/* Main Grid: Charts & Camera */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Stress Trend Chart (2 columns) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> Monthly Stress & Risk Trajectories
              </h3>
              <p className="text-xs text-slate-400">12-Month aggregate trend data across units</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full font-semibold">
              Live Analytics
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_TRENDS}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '14px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="riskCount" name="At Risk" stroke="#ffb74d" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="criticalCount" name="Critical" stroke="#ef5350" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="interventions" name="Interventions" stroke="#66bb6a" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time AI Camera Feed Card */}
        <div className="lg:col-span-1">
          <CameraMonitor />
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Distribution Donut */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Risk Distribution Spectrum
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={RISK_DISTRIBUTION} dataKey="value" innerRadius={60} outerRadius={85} paddingAngle={4}>
                  {RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
            {RISK_DISTRIBUTION.map(r => (
              <div key={r.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                <span className="text-slate-300 font-medium truncate">{r.name}: {r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Stress Comparison Bar */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Unit-wise Average Stress Index
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={UNIT_STRESS} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <YAxis dataKey="unit" type="category" stroke="#64748b" fontSize={10} width={85} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="avgStress" fill="#00d4ff" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intervention Effectiveness Area */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Intervention Channels
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INTERVENTION_EFFECTIVENESS}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="counseling" stackId="1" stroke="#4fc3f7" fill="#4fc3f7" fillOpacity={0.6} />
                <Area type="monotone" dataKey="leaveRotation" stackId="1" stroke="#66bb6a" fill="#66bb6a" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Alerts & Personnel Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts (1 Col) */}
        <div className="lg:col-span-1 glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Siren className="w-5 h-5 text-rose-400" /> Recent Priority Alerts
            </h3>
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {alerts.map(a => (
              <div
                key={a.id}
                className={`p-4 rounded-2xl border transition-all ${
                  a.priority === 'critical'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : a.priority === 'high'
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono uppercase text-rose-400 flex items-center gap-1">
                    🚨 {a.priority}
                  </span>
                  <span className="text-[11px] text-slate-400">{a.timestamp}</span>
                </div>
                <p className="text-sm font-bold text-white mt-1.5">{a.title}</p>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{a.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => resolveAlert(a.id)}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-xl text-xs font-semibold hover:bg-cyan-500/30"
                  >
                    Resolve & Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personnel Table Preview (2 Cols) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Personnel Wellness Matrix
            </h3>
            <button
              onClick={() => navigate('/personnel')}
              className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
            >
              Full Roster <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                  <th className="py-3 px-3">ID / Name</th>
                  <th className="py-3 px-3">Unit</th>
                  <th className="py-3 px-3">Deployments</th>
                  <th className="py-3 px-3">Leave Util %</th>
                  <th className="py-3 px-3">Risk Score</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {personnel.slice(0, 5).map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-white text-sm">{p.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">#{p.id} • {p.role}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{p.unit}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{p.deployments} Ops</td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{p.leaveUtil}%</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-cyan-400">{p.riskScore}</span>
                        <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.riskScore > 75 ? 'bg-rose-500' : p.riskScore > 50 ? 'bg-amber-500' : 'bg-cyan-400'
                            }`}
                            style={{ width: `${p.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase ${getRiskBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setSelectedPersonnel(p)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
