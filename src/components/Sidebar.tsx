import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Video,
  Bell,
  Lightbulb,
  BarChart3,
  Settings,
  Shield,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useWelfare } from '../context/WelfareContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { alerts } = useWelfare();
  const unresolvedAlerts = alerts.filter(a => a.status !== 'resolved').length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Personnel', path: '/personnel', icon: Users },
    { name: 'Live Monitor', path: '/monitor', icon: Video },
    { name: 'Alerts', path: '/alerts', icon: Bell, badge: unresolvedAlerts },
    { name: 'Recommendations', path: '/recommendations', icon: Lightbulb },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 flex flex-col border-r glass ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header / Logo */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg leading-none tracking-wide text-white">
                Welfare<span className="text-cyan-400">Watch</span>
              </h1>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mt-1">
                CAPF Stress AI
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-500 text-white rounded-full pulse-ring">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-semibold text-sm shrink-0">
            WO
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate">Welfare Officer</h4>
              <p className="text-xs text-slate-400 truncate">CAPF Unit 42 • HQ</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
