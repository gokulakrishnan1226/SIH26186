import React from 'react';
import { Video, Shield, Cpu, Wifi } from 'lucide-react';
import { CameraMonitor } from '../components/CameraMonitor';

export const MonitorPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <Video className="w-7 h-7 text-cyan-400" /> Live AI Emotion &amp; Stress Monitor
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Full-screen real-time facial micro-expression analysis powered by your TensorFlow model on <code className="text-cyan-400 font-mono text-xs">face_model.h5</code>.
        </p>
      </div>

      {/* System Info Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/15 text-cyan-400 rounded-xl"><Cpu className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-slate-400 font-medium">AI Inference Engine</p>
            <p className="text-sm font-bold text-white">TensorFlow 2.21 • face_model.h5</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-xl"><Shield className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Detection Pipeline</p>
            <p className="text-sm font-bold text-white">Haar Cascade × 4 + CNN (48×48)</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl"><Wifi className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Backend Endpoint</p>
            <p className="text-sm font-bold text-white font-mono">127.0.0.1:5000/predict</p>
          </div>
        </div>
      </div>

      {/* Full-Width Camera */}
      <div className="max-w-4xl mx-auto">
        <CameraMonitor />
      </div>

      {/* Emotion Legend */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Emotion Classification Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { name: 'Happy', emoji: '😊', stress: false },
            { name: 'Neutral', emoji: '😐', stress: false },
            { name: 'Surprise', emoji: '😲', stress: false },
            { name: 'Sad', emoji: '😢', stress: true },
            { name: 'Angry', emoji: '😠', stress: true },
            { name: 'Fear', emoji: '😨', stress: true },
            { name: 'Disgust', emoji: '🤢', stress: true }
          ].map(e => (
            <div
              key={e.name}
              className={`p-3 rounded-xl border text-center ${
                e.stress
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-cyan-500/10 border-cyan-500/30'
              }`}
            >
              <span className="text-2xl">{e.emoji}</span>
              <p className="text-xs font-bold text-white mt-1">{e.name}</p>
              <p className={`text-[10px] font-mono ${e.stress ? 'text-rose-400' : 'text-cyan-400'}`}>
                {e.stress ? 'STRESS MARKER' : 'BASELINE'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
