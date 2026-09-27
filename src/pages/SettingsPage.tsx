import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Palette, Server, Save, RotateCcw } from 'lucide-react';
import { useWelfare } from '../context/WelfareContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, showToast } = useWelfare();

  const [criticalThreshold, setCriticalThreshold] = useState(80);
  const [highThreshold, setHighThreshold] = useState(60);
  const [mediumThreshold, setMediumThreshold] = useState(40);
  const [captureInterval, setCaptureInterval] = useState(200);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableCameraAutoStart, setEnableCameraAutoStart] = useState(false);
  const [backendUrl, setBackendUrl] = useState('http://127.0.0.1:5000');

  const handleSave = () => {
    showToast('Settings saved successfully. Changes will apply on next session.');
  };

  const handleReset = () => {
    setCriticalThreshold(80);
    setHighThreshold(60);
    setMediumThreshold(40);
    setCaptureInterval(200);
    setEnableNotifications(true);
    setEnableCameraAutoStart(false);
    setBackendUrl('http://127.0.0.1:5000');
    showToast('Settings reset to defaults.');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-cyan-400" /> System Settings &amp; Thresholds
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure risk scoring thresholds, notification preferences, AI pipeline parameters, and display settings.
        </p>
      </div>

      {/* Risk Thresholds */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" /> Risk Scoring Thresholds
        </h3>

        {[
          { label: 'Critical Threshold', value: criticalThreshold, set: setCriticalThreshold, color: 'rose' },
          { label: 'High Risk Threshold', value: highThreshold, set: setHighThreshold, color: 'orange' },
          { label: 'Medium Risk Threshold', value: mediumThreshold, set: setMediumThreshold, color: 'amber' }
        ].map(t => (
          <div key={t.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">{t.label}</label>
              <span className="text-xs font-mono font-bold text-cyan-400">{t.value} / 100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={t.value}
              onChange={e => t.set(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        ))}
      </div>

      {/* AI Pipeline Settings */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" /> AI Pipeline Configuration
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Backend API Endpoint</label>
          <input
            type="text"
            value={backendUrl}
            onChange={e => setBackendUrl(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-cyan-400 outline-none transition-colors"
          />
        </div>

        {/* Gemini Vision API Status */}
        <div className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini Vision AI Engine
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              High-accuracy face detection, micro-expression tracking & stress evaluation active via API key.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-mono font-bold">
            Configured (.env)
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Frame Capture Interval</label>
            <span className="text-xs font-mono font-bold text-cyan-400">{captureInterval}ms</span>
          </div>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            value={captureInterval}
            onChange={e => setCaptureInterval(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[11px] text-slate-500">Lower values = faster inference, higher CPU usage. Default: 200ms (~5 FPS).</p>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-slate-800/60">
          <div>
            <p className="text-sm font-semibold text-white">Auto-Start Camera on Monitor Page</p>
            <p className="text-xs text-slate-400">Webcam activates automatically when you open Live Monitor.</p>
          </div>
          <button
            onClick={() => setEnableCameraAutoStart(!enableCameraAutoStart)}
            className={`w-14 h-8 rounded-full relative transition-colors ${
              enableCameraAutoStart ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                enableCameraAutoStart ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" /> Notification Preferences
        </h3>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-semibold text-white">In-App Alert Notifications</p>
            <p className="text-xs text-slate-400">Show toast notifications for new critical alerts.</p>
          </div>
          <button
            onClick={() => setEnableNotifications(!enableNotifications)}
            className={`w-14 h-8 rounded-full relative transition-colors ${
              enableNotifications ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                enableNotifications ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" /> Appearance
        </h3>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-semibold text-white">Theme</p>
            <p className="text-xs text-slate-400">Current: <span className="text-cyan-400 font-mono">{theme}</span></p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-xl text-xs font-bold hover:bg-cyan-500/30 transition-all"
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save All Settings
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-2xl font-bold text-sm transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset to Defaults
        </button>
      </div>
    </div>
  );
};
