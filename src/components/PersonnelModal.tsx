import React from 'react';
import {
  X,
  User,
  Shield,
  Activity,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useWelfare } from '../context/WelfareContext';
import { getRiskBadgeClass } from '../utils/helpers';

export const PersonnelModal: React.FC = () => {
  const { selectedPersonnel, setSelectedPersonnel, showToast } = useWelfare();

  if (!selectedPersonnel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/30">
              {selectedPersonnel.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{selectedPersonnel.name}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono font-bold uppercase ${getRiskBadgeClass(selectedPersonnel.status)}`}>
                  {selectedPersonnel.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                ID #{selectedPersonnel.id} • {selectedPersonnel.role} • {selectedPersonnel.unit}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedPersonnel(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 font-medium">Risk Score</span>
              <p className="text-2xl font-extrabold text-cyan-400 mt-1">{selectedPersonnel.riskScore} / 100</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 font-medium">Deployments</span>
              <p className="text-2xl font-extrabold text-white mt-1">{selectedPersonnel.deployments} Ops</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 font-medium">Leave Utilized</span>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">{selectedPersonnel.leaveUtil}%</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl">
              <span className="text-xs text-slate-400 font-medium">Psych Evaluation</span>
              <p className={`text-sm font-bold mt-2 ${selectedPersonnel.psychEvaluationDue ? 'text-rose-400' : 'text-emerald-400'}`}>
                {selectedPersonnel.psychEvaluationDue ? '⚠️ Action Required' : '✅ Clear'}
              </p>
            </div>
          </div>

          {/* Stress History Graph */}
          <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Recent Stress Index Trajectory
            </h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedPersonnel.stressHistory}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#00d4ff" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Officer Details & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm mb-2">Contact & Deployment Metadata</h4>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400" /> {selectedPersonnel.phone || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" /> {selectedPersonnel.email || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" /> {selectedPersonnel.location || 'Deployed HQ'}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-cyan-400" /> Last Check-in: {selectedPersonnel.lastAssessment}
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl space-y-3">
              <h4 className="font-bold text-white text-sm">Recommended Intervention Actions</h4>
              <button
                onClick={() => {
                  showToast(`Dispatched mandatory 7-day restorative leave order for #${selectedPersonnel.id}`);
                  setSelectedPersonnel(null);
                }}
                className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Issue Restorative Leave Order
              </button>
              <button
                onClick={() => {
                  showToast(`Scheduled immediate tele-psychiatry session for #${selectedPersonnel.id}`);
                  setSelectedPersonnel(null);
                }}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" /> Schedule Counselor Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
