interface Props {
  fps: number
  faceCount: number
  historyCount: number
  backendOnline: boolean
}

export default function StatusBar({ fps, faceCount, historyCount, backendOnline }: Props) {
  return (
    <footer className="border-t border-slate-800/60 bg-[#080d1a]/80 backdrop-blur-sm py-2 px-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between text-[11px] font-mono text-slate-600">
        <span>SENTINEL v1.0 — AI Stress & Well-being Platform</span>
        <div className="flex items-center gap-4">
          <span>AI: <span className={backendOnline ? 'text-emerald-500' : 'text-rose-500'}>{backendOnline ? 'ONLINE' : 'OFFLINE'}</span></span>
          <span>FPS: <span className="text-slate-400">{fps}</span></span>
          <span>Faces: <span className="text-slate-400">{faceCount}</span></span>
          <span>Samples: <span className="text-slate-400">{historyCount}</span></span>
        </div>
      </div>
    </footer>
  )
}
