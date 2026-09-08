import { RiskLevel, Personnel } from '../types';

export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'critical':
      return '#ef5350';
    case 'high':
      return '#ff7043';
    case 'medium':
      return '#ffb74d';
    case 'low':
      return '#66bb6a';
    case 'normal':
    default:
      return '#4fc3f7';
  }
};

export const getRiskBadgeClass = (level: RiskLevel): string => {
  switch (level) {
    case 'critical':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/40 glow-red';
    case 'high':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'medium':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    case 'low':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    case 'normal':
    default:
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
  }
};

export const exportToCSV = (data: Personnel[], filename = 'personnel-welfare-report.csv') => {
  const headers = ['ID', 'Name', 'Unit', 'Role', 'Deployments', 'Leave Util %', 'Risk Score', 'Status', 'Last Assessment'];
  const rows = data.map(p => [
    p.id,
    `"${p.name}"`,
    `"${p.unit}"`,
    `"${p.role}"`,
    p.deployments,
    `${p.leaveUtil}%`,
    p.riskScore,
    p.status.toUpperCase(),
    `"${p.lastAssessment}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
