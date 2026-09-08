import { EmotionResult, AlertLevel } from '../types'

interface Props {
  score: number
  history: EmotionResult[]
  alertLevel: AlertLevel
}

const LEVEL_CONFIG = {
  low:      { label: 'LOW',      color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: '0 0 20px rgba(16,185,129,0.25)' },
  medium:   { label: 'MEDIUM',   color: '#f59e0b', bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   glow: '0 0 20px rgba(245,158,11,0.25)' },
  high:     { label: 'HIGH',     color: '#f97316', bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-400',  glow: '0 0 20px rgba(249,115,22,0.25)' },
  critical: { label: 'CRITICAL', color: '#f43f5e', bg: 'bg-rose-500/10',   border: 'border-rose-500/30',    text: 'text-rose-400',    glow: '0 0 20px rgba(244,63,94,0.3)' },
}

export default function StressGauge({ score, history, alertLevel }: Props) {
  const cfg = LEVEL_CONFIG[alertLevel]
  const clampedScore = Math.min(100, Math.max(0, score))

  // Build mini sparkline from recent 20 history items
  const sparkData = history.slice(-20)
  const maxH = 32

  return (
    <div className="glass rounded-2xl p-5" style={{ boxShadow: cfg.glow }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Stress Index</p>
        <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: cfg.color }} />
          {cfg.label}
        </div>
      </div>

      {/* Gauge bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs font-mono text-slate-600 mb-1.5">
          <span>0%</span>
          <span className={`font-bold text-sm ${cfg.text}`}>{clampedScore.toFixed(1)}%</span>
          <span>100%</span>
        </div>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
          {/* Zone markers */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 border-r border-slate-700/50" />
            <div className="flex-1 border-r border-slate-700/50" />
            <div className="flex-1 border-r border-slate-700/50" />
            <div className="flex-1" />
          </div>
          <div
            className="h-full rounded-full bar-animate"
            style={{
              width: `${clampedScore}%`,
              background: `linear-gradient(90deg, #10b981, #f59e0b, #f97316, #f43f5e)`,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-700 mt-1 px-0.5">
          <span>Calm</span><span>Mild</span><span>High</span><span>Critical</span>
        </div>
      </div>

      {/* Sparkline */}
      {sparkData.length > 1 && (
        <div className="mt-4">
          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Stress trend (last {sparkData.length} readings)</p>
          <svg width="100%" height={maxH} viewBox={`0 0 ${sparkData.length - 1} ${maxH}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cfg.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={cfg.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              points={sparkData.map((r, i) => {
                const stressVal = r.isStressed ? 70 : 20
                const y = maxH - (stressVal / 100) * maxH
                return `${i},${y}`
              }).join(' ')}
              fill="none"
              stroke={cfg.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      <p className="text-xs text-slate-600 mt-3">
        Based on Angry, Fear, Sad & Disgust emotion indicators
      </p>
    </div>
  )
}
