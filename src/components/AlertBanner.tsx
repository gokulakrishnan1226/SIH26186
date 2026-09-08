import { AlertLevel } from '../types'

interface Props {
  level: AlertLevel
  emotion: string
}

const CONFIG = {
  medium:   { bg: 'bg-amber-500/10',  border: 'border-amber-500/40',  text: 'text-amber-300',  icon: '⚠️', msg: 'Elevated stress indicators detected' },
  high:     { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-300', icon: '🔶', msg: 'High stress levels detected — monitor closely' },
  critical: { bg: 'bg-rose-500/10',   border: 'border-rose-500/40',   text: 'text-rose-300',   icon: '🚨', msg: 'CRITICAL stress detected — immediate attention required' },
}

export default function AlertBanner({ level, emotion }: Props) {
  const cfg = CONFIG[level as keyof typeof CONFIG]
  if (!cfg) return null

  return (
    <div className={`flex items-center gap-3 px-5 py-2.5 border-b text-sm font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      <span className="text-base">{cfg.icon}</span>
      <span>{cfg.msg}</span>
      <span className="ml-auto opacity-70 text-xs">Triggered by: {emotion}</span>
    </div>
  )
}
