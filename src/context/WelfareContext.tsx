import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Personnel,
  AlertItem,
  SystemStats,
  Recommendation,
  RiskLevel
} from '../types';
import {
  INITIAL_PERSONNEL,
  INITIAL_ALERTS,
  INITIAL_STATS,
  INITIAL_RECOMMENDATIONS
} from '../utils/mockData';

interface WelfareContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  personnel: Personnel[];
  alerts: AlertItem[];
  stats: SystemStats;
  recommendations: Recommendation[];
  selectedPersonnel: Personnel | null;
  setSelectedPersonnel: (p: Personnel | null) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  applyRecommendation: (id: string) => void;
  addPersonnel: (p: Omit<Personnel, 'id' | 'stressHistory'>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
}

const WelfareContext = createContext<WelfareContextType | undefined>(undefined);

export const WelfareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('welfare_theme') as 'dark' | 'light') || 'dark';
  });
  const [personnel, setPersonnel] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [stats, setStats] = useState<SystemStats>(INITIAL_STATS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('welfare_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    showToast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'acknowledged' as const } : a))
    );
    showToast('Alert status updated to Acknowledged');
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setStats(prev => ({
      ...prev,
      criticalCases: Math.max(0, prev.criticalCases - 1),
      interventions: prev.interventions + 1
    }));
    showToast('Alert resolved & intervention logged');
  };

  const applyRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'in-progress' as const } : r))
    );
    showToast('Welfare action plan dispatched');
  };

  const addPersonnel = (newP: Omit<Personnel, 'id' | 'stressHistory'>) => {
    const id = Math.floor(1000 + Math.random() * 9000).toString();
    const created: Personnel = {
      ...newP,
      id,
      stressHistory: [
        { date: 'Today', score: newP.riskScore }
      ]
    };
    setPersonnel(prev => [created, ...prev]);
    setStats(prev => ({
      ...prev,
      totalPersonnel: prev.totalPersonnel + 1,
      atRisk: newP.riskScore > 60 ? prev.atRisk + 1 : prev.atRisk
    }));
    showToast(`Personnel #${id} registered successfully`);
  };

  return (
    <WelfareContext.Provider
      value={{
        theme,
        toggleTheme,
        personnel,
        alerts,
        stats,
        recommendations,
        selectedPersonnel,
        setSelectedPersonnel,
        acknowledgeAlert,
        resolveAlert,
        applyRecommendation,
        addPersonnel,
        toastMessage,
        showToast,
        searchQuery,
        setSearchQuery,
        exportModalOpen,
        setExportModalOpen
      }}
    >
      {children}
    </WelfareContext.Provider>
  );
};

export const useWelfare = () => {
  const context = useContext(WelfareContext);
  if (!context) {
    throw new Error('useWelfare must be used within a WelfareProvider');
  }
  return context;
};
