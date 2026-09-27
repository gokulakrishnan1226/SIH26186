import { useRef, useEffect, useCallback, useState } from 'react'
import { DetectedFace } from '../types'

interface Props {
  isStreaming: boolean
  onToggle: (val: boolean) => void
  onFrame: (dataUrl: string) => void
  faces: DetectedFace[]
  fps: number
}

export default function CameraFeed({ isStreaming, onToggle, onFrame, faces, fps }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<number | null>(null)
  const [error, setError] = useState('')

  const drawOverlay = useCallback((faceList: DetectedFace[]) => {
    const canvas = overlayRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const ctx = canvas.getContext('2d')!
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    faceList.forEach(face => {
      const [x, y, w, h] = face.bbox
      const isStressed = ['Angry', 'Fear', 'Sad', 'Disgust'].includes(face.top_emotion)
      const color = isStressed ? '#f43f5e' : '#10b981'

      // Box
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.shadowColor = color
      ctx.shadowBlur = 8
      ctx.strokeRect(x, y, w, h)
      ctx.shadowBlur = 0

      // Corner accents
      const cs = 18
      ctx.lineWidth = 4
      ctx.strokeStyle = color
      ;[
        [x, y, cs, 0, 0, cs],
        [x + w, y, -cs, 0, 0, cs],
        [x, y + h, cs, 0, 0, -cs],
        [x + w, y + h, -cs, 0, 0, -cs],
      ].forEach(([cx, cy, dx1, dy1, dx2, dy2]) => {
        ctx.beginPath()
        ctx.moveTo(cx + dx1, cy)
        ctx.lineTo(cx, cy)
        ctx.lineTo(cx, cy + dy2)
        ctx.stroke()
      })

      // Label
      const label = `${face.top_emotion}  ${face.confidence.toFixed(0)}%`
      ctx.font = 'bold 13px Inter, sans-serif'
      const tw = ctx.measureText(label).width
      ctx.fillStyle = color
      ctx.fillRect(x - 1, y - 28, tw + 18, 26)
      ctx.fillStyle = '#fff'
      ctx.fillText(label, x + 8, y - 10)
    })
  }, [])

  useEffect(() => {
    drawOverlay(faces)
  }, [faces, drawOverlay])

  const capture = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.paused || video.ended || video.videoWidth === 0) return
    const ctx = canvas.getContext('2d')!
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    onFrame(canvas.toDataURL('image/jpeg', 0.8))
  }, [onFrame])

  const startCamera = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      onToggle(true)
      intervalRef.current = window.setInterval(capture, 150)
    } catch (e: any) {
      setError('Camera access denied. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    onToggle(false)
  }

  useEffect(() => () => stopCamera(), [])

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col">
      {/* Video area */}
      <div className="relative bg-black aspect-video w-full">
        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            {error
              ? <p className="text-rose-400 text-sm max-w-xs text-center">{error}</p>
              : <p className="text-slate-500 text-sm">Camera feed will appear here</p>
            }
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)', display: isStreaming ? 'block' : 'none' }}
        />
        <canvas
          ref={overlayRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ transform: 'scaleX(-1)', display: isStreaming ? 'block' : 'none' }}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* FPS badge */}
        {isStreaming && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-xs font-mono text-cyan-400 px-2 py-1 rounded-md border border-cyan-500/20">
            {fps} FPS
          </div>
        )}

        {/* Face count badge */}
        {isStreaming && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-xs font-mono text-slate-300 px-2 py-1 rounded-md border border-slate-700/50">
            {faces.length} face{faces.length !== 1 ? 's' : ''} detected
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 flex items-center justify-between border-t border-slate-800">
        <span className="text-xs text-slate-500">
          {isStreaming ? 'Sending frames to AI Engine every 150ms' : 'Press Start to begin real-time analysis'}
        </span>
        <button
          onClick={isStreaming ? stopCamera : startCamera}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
            ${isStreaming
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-lg shadow-cyan-500/30'
            }`}
        >
          {isStreaming ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              Stop Camera
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
              Start Camera
            </>
          )}
        </button>
      </div>
    </div>
  )
}
