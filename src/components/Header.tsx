import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Download,
  Clock,
  User,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useWelfare } from '../context/WelfareContext';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    alerts,
    personnel,
    searchQuery,
    setSearchQuery,
    setSelectedPersonnel,
    setExportModalOpen
  } = useWelfare();

  const [timeStr, setTimeStr] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }) +
          ' • ' +
          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const pathTitleMap: Record<string, string> = {
    '/': 'Dashboard Overview',
    '/personnel': 'Personnel Management',
    '/monitor': 'Live AI Emotion & Stress Monitor',
    '/alerts': 'Welfare Alerts & Incidents',
    '/recommendations': 'AI Welfare Recommendations',
    '/analytics': 'Analytical Reports & Stress Matrix',
    '/settings': 'System Settings & Thresholds'
  };

  const currentTitle = pathTitleMap[location.pathname] || 'Dashboard';

  const filteredPersonnel = searchQuery.trim()
    ? personnel.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.includes(searchQuery) ||
          p.unit.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-30 px-6 py-4 glass border-b border-slate-800/80 flex items-center justify-between gap-4">
      {/* Left Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>CAPF HQ</span>
          <span>/</span>
          <span className="text-cyan-400 font-semibold">{currentTitle}</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">{currentTitle}</h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar with Autocomplete */}
        <div className="relative">
          <div className="flex items-center bg-slate-900/80 border border-slate-700/60 rounded-xl px-3.5 py-2 w-64 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search ID, name, unit..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchResults && filteredPersonnel.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto"
              onMouseLeave={() => setShowSearchResults(false)}
            >
              {filteredPersonnel.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPersonnel(p);
                    setShowSearchResults(false);
                    setSearchQuery('');
                    navigate('/personnel');
                  }}
                  className="px-4 py-3 hover:bg-slate-800 flex items-center justify-between cursor-pointer border-b border-slate-800/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">#{p.id} • {p.unit}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      p.status === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    Risk: {p.riskScore}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-2 rounded-xl text-xs font-mono text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timeStr}</span>
        </div>

        {/* Export Report Button */}
        <button
          onClick={() => setExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold transition-all"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Report</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center pulse-ring">
                {alerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50"
              onMouseLeave={() => setShowNotifications(false)}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" /> Notifications
                </h4>
                <span className="text-xs text-slate-400 font-mono">{alerts.length} active</span>
              </div>
              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {alerts.map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/alerts');
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {a.priority.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400">{a.timestamp}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 mt-1 line-clamp-1">{a.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
