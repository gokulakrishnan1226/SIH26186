import { DetectedFace, EmotionResult } from '../types'

const EMOTIONS = [
  { name: 'Happy', emoji: '😊', color: '#10b981', stress: false },
  { name: 'Neutral', emoji: '😐', color: '#64748b', stress: false },
  { name: 'Sad', emoji: '😢', color: '#3b82f6', stress: true },
  { name: 'Angry', emoji: '🤬', color: '#ef4444', stress: true },
  { name: 'Fear', emoji: '😨', color: '#8b5cf6', stress: true },
  { name: 'Surprise', emoji: '😲', color: '#f59e0b', stress: false },
  { name: 'Disgust', emoji: '🤢', color: '#ec4899', stress: true },
]

interface Props {
  face: DetectedFace | null
  history: EmotionResult[]
  isStreaming: boolean
}

export default function EmotionPanel({ face, history, isStreaming }: Props) {
  const currentEmotion = EMOTIONS.find(e => e.name === face?.top_emotion)
  const recentEmotions = history.slice(-5).reverse()

  return (
    <div className="flex flex-col gap-5">
      {/* Hero detected emotion */}
      <div className="glass rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Detected Expression</p>

        {face && currentEmotion ? (
          <div className="flex items-center gap-4">
            <div className="text-5xl">{currentEmotion.emoji}</div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">{face.top_emotion}</p>
              <p className="text-sm mt-1 font-mono" style={{ color: currentEmotion.color }}>
                {face.confidence.toFixed(1)}% confidence
              </p>
              <p className={`text-xs mt-1 font-medium ${currentEmotion.stress ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentEmotion.stress ? '⚠ Stress Indicator' : '✓ Positive Indicator'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-slate-600">
            <div className="text-4xl opacity-30">😶</div>
            <p className="text-sm">{isStreaming ? 'No face detected' : 'Start camera to begin'}</p>
          </div>
        )}
      </div>

      {/* Emotion spectrum bars */}
      <div className="glass rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Emotion Spectrum</p>
          <span className="text-xs text-slate-600 font-mono">7 classes</span>
        </div>

        <div className="space-y-3">
          {EMOTIONS.map(emotion => {
            const pct = face?.probabilities[emotion.name] ?? 0
            const isTop = face?.top_emotion === emotion.name
            return (
              <div key={emotion.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm flex items-center gap-1.5 ${isTop ? 'text-white font-semibold' : 'text-slate-400'}`}>
                    <span className="text-base">{emotion.emoji}</span>
                    {emotion.name}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bar-animate"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${emotion.color}88, ${emotion.color})`,
                      boxShadow: isTop ? `0 0 8px ${emotion.color}60` : 'none',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent history */}
      <div className="glass rounded-2xl p-5">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Recent History</p>
        {recentEmotions.length > 0 ? (
          <div className="space-y-2">
            {recentEmotions.map((r, i) => {
              const e = EMOTIONS.find(em => em.name === r.emotion)
              return (
                <div key={i} className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-sm
                  ${i === 0 ? 'bg-slate-800/60' : ''}`}>
                  <span className="flex items-center gap-2">
                    <span>{e?.emoji}</span>
                    <span className="text-slate-300">{r.emotion}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500">{r.confidence.toFixed(0)}%</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-slate-600 text-sm">No history yet</p>
        )}
      </div>
    </div>
  )
}
