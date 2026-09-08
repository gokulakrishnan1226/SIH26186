import React, { useState, useMemo } from 'react';
import { Users, Search, Filter, SortAsc, SortDesc, Eye } from 'lucide-react';
import { useWelfare } from '../context/WelfareContext';
import { getRiskBadgeClass } from '../utils/helpers';
import { RiskLevel } from '../types';

export const PersonnelPage: React.FC = () => {
  const { personnel, setSelectedPersonnel } = useWelfare();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RiskLevel | 'all'>('all');
  const [sortKey, setSortKey] = useState<'riskScore' | 'name' | 'deployments'>('riskScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    let list = [...personnel];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.id.includes(q) ||
          p.unit.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter(p => p.status === statusFilter);
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'riskScore') cmp = a.riskScore - b.riskScore;
      else if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'deployments') cmp = a.deployments - b.deployments;
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return list;
  }, [personnel, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = sortDir === 'desc' ? SortDesc : SortAsc;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-cyan-400" /> Personnel Welfare Roster
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Comprehensive view of all monitored CAPF personnel with stress scoring and intervention history.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center gap-4">
        <div className="flex items-center bg-slate-900/80 border border-slate-700/60 rounded-xl px-3.5 py-2.5 flex-1 min-w-[200px] focus-within:border-cyan-400 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by ID, name, unit or role..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="bg-slate-900 border border-slate-700 text-sm text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
          >
            <option value="all">All Statuses</option>
            <option value="critical">Critical</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-400 ml-auto">
          Showing {paginated.length} of {filtered.length} personnel
        </span>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider bg-slate-900/50">
                <th className="py-4 px-4">ID</th>
                <th className="py-4 px-4 cursor-pointer select-none" onClick={() => toggleSort('name')}>
                  <span className="flex items-center gap-1">Name {sortKey === 'name' && <SortIcon className="w-3 h-3" />}</span>
                </th>
                <th className="py-4 px-4">Unit</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4 cursor-pointer select-none" onClick={() => toggleSort('deployments')}>
                  <span className="flex items-center gap-1">Deployments {sortKey === 'deployments' && <SortIcon className="w-3 h-3" />}</span>
                </th>
                <th className="py-4 px-4">Leave %</th>
                <th className="py-4 px-4 cursor-pointer select-none" onClick={() => toggleSort('riskScore')}>
                  <span className="flex items-center gap-1">Risk Score {sortKey === 'riskScore' && <SortIcon className="w-3 h-3" />}</span>
                </th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Check</th>
                <th className="py-4 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paginated.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3.5 px-4 font-mono text-slate-400">#{p.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white text-sm">{p.name}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{p.unit}</td>
                  <td className="py-3.5 px-4 text-slate-300">{p.role}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{p.deployments}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{p.leaveUtil}%</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-cyan-400 w-8">{p.riskScore}</span>
                      <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            p.riskScore > 75 ? 'bg-rose-500' : p.riskScore > 50 ? 'bg-amber-500' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${p.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase ${getRiskBadgeClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">{p.lastAssessment}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => setSelectedPersonnel(p)}
                      className="p-2 bg-slate-800 hover:bg-cyan-500/20 text-cyan-400 border border-slate-700 rounded-xl opacity-60 group-hover:opacity-100 transition-all"
                      title="Inspect Personnel"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              ← Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
