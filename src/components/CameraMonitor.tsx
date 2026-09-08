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

  const [isStreaming, setIsStreaming] = useState(false);
  const [faces, setFaces] = useState<DetectedFace[]>([]);
  const [fps, setFps] = useState(0);
  const [error, setError] = useState('');
  const [backendOnline, setBackendOnline] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('Neutral');
  const [stressScore, setStressScore] = useState(35);
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
      const [x, y, w, h] = face.bbox;
      const isStressed = ['Angry', 'Fear', 'Sad', 'Disgust'].includes(face.top_emotion);
      const color = isStressed ? '#ef5350' : '#4fc3f7';

      // Bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;

      // Corner Accents
      const cs = 18;
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

      // Label
      const label = `${face.top_emotion} • ${face.confidence.toFixed(0)}%`;
      ctx.font = 'bold 12px Inter, monospace';
      const tw = ctx.measureText(label).width;
      ctx.fillStyle = color;
      ctx.fillRect(x - 1, y - 26, tw + 16, 24);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x + 7, y - 9);
    });
  }, []);

  useEffect(() => {
    drawOverlay(faces);
  }, [faces, drawOverlay]);

  // Capture frame and send to Python Flask AI Backend
  const captureFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended || video.videoWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

    try {
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
        signal: AbortSignal.timeout(1500)
      });

      if (res.ok) {
        setBackendOnline(true);
        const data = await res.json();
        if (data.status === 'success' && data.faces) {
          setFaces(data.faces);
          if (data.faces.length > 0) {
            const top = data.faces[0].top_emotion;
            setCurrentEmotion(top);
            const calculatedStress = ['Angry', 'Fear', 'Sad', 'Disgust'].includes(top)
              ? Math.min(98, Math.round(data.faces[0].confidence + 35))
              : Math.max(15, Math.round(100 - data.faces[0].confidence));
            setStressScore(calculatedStress);
          }
        }
      }
    } catch {
      setBackendOnline(false);
      // Local fallback simulation if backend is restarting
      const randomEmotions = ['Neutral', 'Happy', 'Focused', 'Calm'];
      const em = randomEmotions[Math.floor(Math.random() * randomEmotions.length)];
      setCurrentEmotion(em);
      setStressScore(32);
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
            <p className="text-xs text-slate-400 font-mono">
              {backendOnline ? '🟢 AI Inference Engine Online' : '🟡 Standby / Local Mode'}
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
          className={`absolute inset-0 w-full h-full pointer-events-none scale-x-[-1] ${
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
              Primary: <span className="font-bold text-cyan-400">{currentEmotion}</span>
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
