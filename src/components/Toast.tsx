import React from 'react';
import { CheckCircle, Info } from 'lucide-react';
import { useWelfare } from '../context/WelfareContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useWelfare();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-slate-900 border border-cyan-500/40 text-cyan-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
        <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
        <span className="text-sm font-semibold">{toastMessage}</span>
      </div>
    </div>
  );
};
