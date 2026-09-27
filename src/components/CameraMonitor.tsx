import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Video, Camera, AlertCircle, RefreshCw, Activity, Sparkles } from 'lucide-react';
import { DetectedFace } from '../types';
import { useWelfare } from '../context/WelfareContext';

interface CameraMonitorProps {
  compact?: boolean;
}

export const CameraMonitor: React.FC<CameraMonitorProps> = ({ compact = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const [faces, setFaces] = useState<DetectedFace[]>([]);
  const [fps, setFps] = useState(0);
  const [error, setError] = useState('');
  const [backendOnline, setBackendOnline] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('Neutral');
  const [stressScore, setStressScore] = useState(35);
  const [activeEngine, setActiveEngine] = useState<'gemini' | 'local'>('local');
  const [microExpression, setMicroExpression] = useState('');
  const [snapshots, setSnapshots] = useState<{ id: string; time: string; emotion: string; score: number }[]>([]);

  const { showToast } = useWelfare();

  // Draw face overlays
  const drawOverlay = useCallback((faceList: DetectedFace[]) => {
    const canvas = overlayRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faceList.forEach(face => {
      const [rawX, y, w, h] = face.bbox;
      // Calculate mirrored X coordinate so box aligns with scale-x-[-1] video while text stays readable
      const x = canvas.width - rawX - w;
      const isStressed = ['Angry', 'Fear', 'Sad', 'Disgust'].includes(face.top_emotion);
      const color = isStressed ? '#ff1744' : '#00ff66'; // Vibrant Neon Emerald Green for normal/neutral

      // Bounding box with glowing neon stroke
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;

      // HUD Corner Accents
      const cs = Math.min(24, Math.floor(w * 0.2));
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      [
        [x, y, cs, 0, 0, cs],
        [x + w, y, -cs, 0, 0, cs],
        [x, y + h, cs, 0, 0, -cs],
        [x + w, y + h, -cs, 0, 0, -cs]
      ].forEach(([cx, cy, dx1, dy1, dx2, dy2]) => {
        ctx.beginPath();
        ctx.moveTo(cx + dx1, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy2);
        ctx.stroke();
      });

      // Label Badge - Un-mirrored Readable Text
      const engineBadge = face.engine === 'gemini' ? ' ✨ Gemini' : ' 🟢 Local Model';
      const label = `${face.top_emotion}${engineBadge} • ${face.confidence.toFixed(0)}%`;
      ctx.font = 'bold 13px Inter, sans-serif';
      const tw = ctx.measureText(label).width;
      const labelY = y - 28 > 0 ? y - 28 : y + h + 6;
      
      ctx.fillStyle = color;
      ctx.fillRect(x - 1, labelY, tw + 18, 24);
      ctx.fillStyle = isStressed ? '#ffffff' : '#090d16';
      ctx.fillText(label, x + 8, labelY + 16);
    });
  }, []);

  useEffect(() => {
    drawOverlay(faces);
  }, [faces, drawOverlay]);

  // Capture frame and send to Python Flask AI Backend
  const captureFrame = useCallback(async () => {
    if (isProcessingRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended || video.videoWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isProcessingRef.current = true;
    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);

      let res;
      try {
        res = await fetch('/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl }),
          signal: AbortSignal.timeout(3000)
        });
      } catch {
        res = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl }),
          signal: AbortSignal.timeout(3000)
        });
      }

      if (res && res.ok) {
        setBackendOnline(true);
        const data = await res.json();
        if (data.status === 'success' && data.faces && data.faces.length > 0) {
          setFaces(data.faces);
          if (data.engine) {
            setActiveEngine(data.engine);
          }
          const topFace = data.faces[0];
          const top = topFace.top_emotion;
          setCurrentEmotion(top);
          if (topFace.micro_expression) {
            setMicroExpression(topFace.micro_expression);
          }
          const calculatedStress = topFace.stress_score !== undefined
            ? topFace.stress_score
            : (['Angry', 'Fear', 'Sad', 'Disgust'].includes(top)
                ? Math.min(98, Math.round(topFace.confidence + 35))
                : Math.max(15, Math.round(100 - topFace.confidence)));
          setStressScore(calculatedStress);
        }
      } else {
        setBackendOnline(false);
      }
    } catch (e) {
      console.warn('Frame capture notice:', e);
      setBackendOnline(false);
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsStreaming(true);
      intervalRef.current = window.setInterval(captureFrame, 200);
      showToast('Live AI Optical Stress Monitor engaged');
    } catch (e: any) {
      setError('Webcam permission denied or camera not found.');
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsStreaming(false);
    setFaces([]);
  };

  useEffect(() => () => stopCamera(), []);

  const takeSnapshot = () => {
    if (!isStreaming) return;
    const snap = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      emotion: currentEmotion,
      score: stressScore
    };
    setSnapshots(prev => [snap, ...prev.slice(0, 4)]);
    showToast(`Snapshot logged: ${currentEmotion} (${stressScore}% Stress Index)`);
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col space-y-4">
      {/* Card Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live AI Optical Monitor
            </h3>
            <p className="text-xs font-mono">
              {backendOnline
                ? activeEngine === 'gemini'
                  ? <span className="text-amber-400 font-semibold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 inline" /> Gemini Vision AI Active</span>
                  : <span className="text-cyan-400">🟢 Local AI Engine Active</span>
                : <span className="text-slate-400">🟡 Standby / Local Mode</span>
              }
            </p>
          </div>
        </div>

        {isStreaming && (
          <span className="px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 pulse-ring">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> LIVE
          </span>
        )}
      </div>

      {/* Video Feed Area */}
      <div className="relative bg-slate-950 rounded-2xl aspect-video overflow-hidden border border-slate-800 flex items-center justify-center">
        {!isStreaming && (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Camera className="w-8 h-8" />
            </div>
            {error ? (
              <p className="text-xs text-rose-400 max-w-xs">{error}</p>
            ) : (
              <p className="text-xs text-slate-400 max-w-xs">
                Activate webcam to begin real-time facial micro-expression analysis & stress scoring.
              </p>
            )}
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover scale-x-[-1] ${isStreaming ? 'block' : 'hidden'}`}
        />
        <canvas
          ref={overlayRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
            isStreaming ? 'block' : 'hidden'
          }`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Live HUD Badges */}
        {isStreaming && (
          <>
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-mono text-cyan-300">
              Face Detected: <span className="font-bold text-white">{faces.length}</span>
            </div>
            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-mono text-slate-300">
              Engine: <span className="font-bold text-amber-400">{activeEngine === 'gemini' ? '✨ Gemini Vision' : '⚡ Local CNN'}</span>
            </div>
          </>
        )}
      </div>

      {/* Live Stress Gauge & Controls */}
      {isStreaming && (
        <div className="space-y-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Current Stress Score
            </span>
            <span
              className={`font-bold font-mono ${
                stressScore > 75
                  ? 'text-rose-400'
                  : stressScore > 50
                  ? 'text-amber-400'
                  : 'text-cyan-400'
              }`}
            >
              {stressScore} / 100
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stressScore > 75
                  ? 'bg-rose-500 glow-red'
                  : stressScore > 50
                  ? 'bg-amber-500'
                  : 'bg-cyan-400 glow-cyan'
              }`}
              style={{ width: `${stressScore}%` }}
            />
          </div>

          {microExpression && (
            <p className="text-xs text-slate-400 pt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Micro-expressions: <strong className="text-slate-200">{microExpression}</strong></span>
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={isStreaming ? stopCamera : startCamera}
          className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
            isStreaming
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25'
          }`}
        >
          <Camera className="w-4 h-4" />
          {isStreaming ? 'Stop Camera' : 'Start Camera Monitor'}
        </button>

        {isStreaming && (
          <button
            onClick={takeSnapshot}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-2xl font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" /> Log Snapshot
          </button>
        )}
      </div>
    </div>
  );
};
