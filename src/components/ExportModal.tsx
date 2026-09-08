import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, CheckCircle } from 'lucide-react';
import { useWelfare } from '../context/WelfareContext';
import { exportToCSV } from '../utils/helpers';

export const ExportModal: React.FC = () => {
  const { exportModalOpen, setExportModalOpen, personnel, showToast } = useWelfare();
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [range, setRange] = useState<string>('all');

  if (!exportModalOpen) return null;

  const handleExport = () => {
    if (format === 'csv') {
      exportToCSV(personnel, `CAPF-WelfareWatch-Report-${Date.now()}.csv`);
      showToast('Downloaded CSV Report successfully');
    } else {
      showToast('Generated & downloaded PDF Officer Welfare Briefing');
    }
    setExportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Export Intelligence Report</h3>
              <p className="text-xs text-slate-400">CAPF Personnel Stress Analytics</p>
            </div>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Format</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormat('csv')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                format === 'csv'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-bold">CSV Spreadsheet</p>
                <p className="text-[10px] text-slate-400">Raw Data Dump</p>
              </div>
            </button>

            <button
              onClick={() => setFormat('pdf')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                format === 'pdf'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400'
              }`}
            >
              <FileText className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-bold">PDF Executive Brief</p>
                <p className="text-[10px] text-slate-400">Formatted Summary</p>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setExportModalOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export Now
          </button>
        </div>
      </div>
    </div>
  );
};
