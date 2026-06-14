import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CameraPermissionDialog } from "@/components/camera/CameraPermissionDialog";
import { LiveCameraFeed } from "@/components/camera/LiveCameraFeed";
import { FocusSphere } from "@/components/focus/FocusSphere";
import { useCamera } from "@/hooks/useCamera";
import { endSessionApi, saveFocusSnapshot, startSessionApi } from "@/lib/api";

export const Route = createFileRoute("/dashboard/session")({
  component: SessionPage,
});

function SessionPage() {
  const { stream, request } = useCamera();
  const [ask, setAsk] = useState(false);
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);
  const [focus, setFocus] = useState(82);
  const [tracking, setTracking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!stream) setAsk(true);
  }, [stream]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecs((s) => s + 1);
      setFocus((f) => Math.max(40, Math.min(99, f + Math.round((Math.random() - 0.5) * 5))));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    const init = async () => {
      try {
        const result = await startSessionApi();
        const nextSessionId = result.session._id;
        setSessionId(nextSessionId);
        localStorage.setItem("focusSessionId", nextSessionId);
      } catch (error) {
        console.error("Failed to start session", error);
      }
    };

    init();
  }, []);

  const saveSnapshot = async (score = focus) => {
    if (!sessionId || savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    try {
      await saveFocusSnapshot({
        sessionId,
        focusScore: score,
        eyeDetected: true,
        faceDetected: true,
        lookingAway: score < 60,
      });
    } catch (error) {
      console.error("Failed to save focus snapshot", error);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  useEffect(() => {
    if (!running || !sessionId) return;

    const id = setInterval(() => {
      void saveSnapshot();
    }, 5000);

    return () => clearInterval(id);
  }, [running, sessionId, focus]);

  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <>
      <CameraPermissionDialog open={ask} onAllow={async () => { setAsk(false); await request(); }} onDeny={() => setAsk(false)} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-panel relative overflow-hidden p-8 text-center lg:col-span-2">
          <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -right-10 top-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.3em] text-accent">Active session</div>
            <motion.div
              key={running ? "live" : "idle"}
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 inline-block"
            >
              <div className="font-display text-7xl font-semibold tabular-nums tracking-tight md:text-8xl">
                <span className="text-gradient-emerald">{hh}</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-gradient-gold">{mm}</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-white/80">{ss}</span>
              </div>
            </motion.div>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <span className={`h-1.5 w-1.5 rounded-full ${running ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
              {running ? (saving ? "Saving focus snapshot…" : "Recording focus") : "Paused"}
            </div>

            <div className="mt-8 flex justify-center gap-3">
              {!running ? (
                <button onClick={() => setRunning(true)} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-emerald hover:brightness-110">
                  <Play className="h-4 w-4" /> Start session
                </button>
              ) : (
                <button onClick={() => setRunning(false)} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10">
                  <Pause className="h-4 w-4" /> Pause
                </button>
              )}
              <button
                onClick={async () => {
                  setRunning(false);
                  if (sessionId) {
                    await saveSnapshot();
                    await endSessionApi(sessionId);
                    localStorage.removeItem("focusSessionId");
                  }
                  setSecs(0);
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-danger/40 bg-danger/10 px-6 py-3 text-sm font-semibold text-danger hover:bg-danger/15"
              >
                <Square className="h-4 w-4" /> End
              </button>
            </div>

            <div className="mt-10 flex justify-center">
              <FocusSphere score={focus} size={240} />
            </div>
          </div>
        </div>

        <LiveCameraFeed stream={stream} focusScore={focus} tracking={tracking} onTrack={() => setTracking((t) => !t)} />
      </div>
    </>
  );
}
