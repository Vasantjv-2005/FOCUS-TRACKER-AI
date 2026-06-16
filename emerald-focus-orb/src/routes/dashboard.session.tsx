import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CameraPermissionDialog } from "@/components/camera/CameraPermissionDialog";
import { LiveCameraFeed } from "@/components/camera/LiveCameraFeed";
import { FocusSphere } from "@/components/focus/FocusSphere";
import { useCamera } from "@/hooks/useCamera";
import { endSessionApi, saveFocusSnapshot, startSessionApi } from "@/lib/api";
import { getNextFocusScore } from "@/lib/focusScore";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/session")({
  component: SessionPage,
});

function SessionPage() {
  const { stream, request } = useCamera();
  const [ask, setAsk] = useState(false);
  const [running, setRunning] = useState(false);
  const [durationMins, setDurationMins] = useState(25);
  const [secs, setSecs] = useState(25 * 60);
  const [focus, setFocus] = useState(82);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  // Simulation states
  const [mockState, setMockState] = useState<"normal" | "distracted" | "missing">("normal");
  const [isManualSim, setIsManualSim] = useState(false);
  const [cameraState, setCameraState] = useState<"normal" | "distracted" | "missing">("normal");

  const activeState = isManualSim ? mockState : cameraState;
  const faceDetected = activeState !== "missing";
  const eyeDetected = activeState === "normal";
  const lookingAway = activeState === "distracted";
  const detectionError = activeState === "missing" ? "person cannot detect" : null;

  const [localDistractions, setLocalDistractions] = useState(0);

  const handleCameraFaceNormal = () => {
    if (!isManualSim) {
      setCameraState("normal");
    }
  };

  const handleCameraFaceDistracted = () => {
    if (!isManualSim) {
      if (cameraState === "normal") {
        setLocalDistractions((prev) => prev + 1);
        if (running && sessionId) {
          eyeDetectedRef.current = false;
          lookingAwayRef.current = true;
          void saveSnapshot();
        }
      }
      setCameraState("distracted");
    }
  };

  const handleCameraFaceMissing = () => {
    if (!isManualSim) {
      if (cameraState !== "missing") {
        if (running && sessionId) {
          faceDetectedRef.current = false;
          eyeDetectedRef.current = false;
          void saveSnapshot();
        }
      }
      setCameraState("missing");
    }
  };

  const handleMockStateChange = (state: "normal" | "distracted" | "missing") => {
    if (state === "normal") {
      setIsManualSim(false);
      setMockState("normal");
      setCameraState("normal");
    } else {
      setIsManualSim(true);
      setMockState(state);
      
      if (state === "distracted") {
        if (!lookingAwayRef.current) {
          setLocalDistractions((prev) => prev + 1);
          if (running && sessionId) {
            void saveSnapshot();
          }
        }
      } else if (state === "missing") {
        if (running && sessionId) {
          eyeDetectedRef.current = false;
          faceDetectedRef.current = false;
          void saveSnapshot();
        }
      }
    }
  };

  const eyeDetectedRef = useRef(eyeDetected);
  const faceDetectedRef = useRef(faceDetected);
  const lookingAwayRef = useRef(lookingAway);

  useEffect(() => {
    eyeDetectedRef.current = eyeDetected;
    faceDetectedRef.current = faceDetected;
    lookingAwayRef.current = lookingAway;
  }, [eyeDetected, faceDetected, lookingAway]);

  useEffect(() => {
    if (!stream) setAsk(true);
  }, [stream]);

  // Countdown Timer logic
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          clearInterval(id);
          void triggerSessionComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, durationMins]);

  // Smooth Focus Score simulation logic
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setFocus((f) => getNextFocusScore(f, faceDetected, eyeDetected, lookingAway));
    }, 1000);
    return () => clearInterval(id);
  }, [running, faceDetected, eyeDetected, lookingAway]);

  const triggerSessionComplete = async () => {
    setRunning(false);
    toast.success("Focus session completed! Great job!", { id: "session-complete-toast" });
    if (sessionId) {
      await saveSnapshot();
      try {
        await endSessionApi(sessionId);
      } catch (err) {
        console.error("Failed to end session on server", err);
      }
      localStorage.removeItem("focusSessionId");
      setSessionId(null);
    }
    setSecs(durationMins * 60);
    setMockState("normal");
    setCameraState("normal");
    setIsManualSim(false);
    setLocalDistractions(0);
  };

  useEffect(() => {
    const saved = localStorage.getItem("focusSessionId");
    if (saved) {
      setSessionId(saved);
    }
  }, []);

  useEffect(() => {
    if (lookingAway && running) {
      toast.warning("Distraction detected! Please focus.", { id: "distraction-toast-session" });
    }
  }, [lookingAway, running]);

  const handleStartSession = async () => {
    setRunning(true);
    setLocalDistractions(0);
    setFocus(100);
    if (secs === 0 || secs === durationMins * 60) {
      setSecs(durationMins * 60);
    }
    if (!sessionId) {
      try {
        const result = await startSessionApi();
        const nextSessionId = result.session._id;
        setSessionId(nextSessionId);
        localStorage.setItem("focusSessionId", nextSessionId);

        // Save initial snapshot immediately
        try {
          await saveFocusSnapshot({
            sessionId: nextSessionId,
            focusScore: focus,
            eyeDetected: eyeDetectedRef.current,
            faceDetected: faceDetectedRef.current,
            lookingAway: lookingAwayRef.current,
          });
        } catch (err) {
          console.error("Failed to save initial snapshot", err);
        }
      } catch (error) {
        console.error("Failed to start session", error);
      }
    }
  };

  const handleEndSession = async () => {
    setRunning(false);
    if (sessionId) {
      await saveSnapshot();
      try {
        await endSessionApi(sessionId);
      } catch (err) {
        console.error("Failed to end session on server", err);
      }
      localStorage.removeItem("focusSessionId");
      setSessionId(null);
    }
    setSecs(durationMins * 60);
    setMockState("normal");
    setCameraState("normal");
    setIsManualSim(false);
    setLocalDistractions(0);
  };

  const focusRef = useRef(focus);
  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);

  const saveSnapshot = async () => {
    const score = focusRef.current;
    if (!sessionId || savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    try {
      await saveFocusSnapshot({
        sessionId,
        focusScore: score,
        eyeDetected: eyeDetectedRef.current,
        faceDetected: faceDetectedRef.current,
        lookingAway: lookingAwayRef.current,
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
  }, [running, sessionId]);

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

            {/* Live session metrics grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-xs mx-auto animate-fade-in">
              <div className="glass-card p-3 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Session Focus</span>
                <span className={`mt-1 font-display text-xl font-bold ${
                  focus >= 70 
                    ? "text-gradient-emerald" 
                    : focus >= 40 
                      ? "text-gradient-gold" 
                      : "text-gradient-rose font-semibold animate-pulse"
                }`}>
                  {focus}%
                </span>
              </div>
              <div className="glass-card p-3 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Stepped Away</span>
                <span className="mt-1 font-display text-xl font-bold text-white/90">
                  {localDistractions}
                </span>
              </div>
            </div>

            {!running && (
              <div className="mt-6 flex flex-col items-center justify-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Session Length</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {[1, 5, 15, 25, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setDurationMins(mins);
                        setSecs(mins * 60);
                      }}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                        durationMins === mins
                          ? "border-primary/40 bg-primary/10 text-primary glow-emerald"
                          : "border-border bg-white/5 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            )}

             <div className="mt-8 flex justify-center gap-3">
              {!running ? (
                <button onClick={handleStartSession} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-emerald hover:brightness-110">
                  <Play className="h-4 w-4" /> Start session
                </button>
              ) : (
                <button onClick={() => setRunning(false)} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10">
                  <Pause className="h-4 w-4" /> Pause
                </button>
              )}
              <button
                onClick={handleEndSession}
                className="inline-flex items-center gap-2 rounded-2xl border border-danger/40 bg-danger/10 px-6 py-3 text-sm font-semibold text-danger hover:bg-danger/15"
              >
                <Square className="h-4 w-4" /> End
              </button>
            </div>

            <div className="mt-10 flex justify-center relative">
              <FocusSphere score={focus} size={340} progress={secs / (durationMins * 60)} />
              {running && detectionError && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75 px-4 py-2.5 rounded-xl border border-danger/40 text-danger text-xs font-semibold text-center backdrop-blur shadow-lg animate-pulse">
                  ⚠️ Error (person cannot detect)
                </div>
              )}
            </div>
          </div>
        </div>

        <LiveCameraFeed
          stream={stream}
          focusScore={focus}
          tracking={running}
          onTrack={handleStartSession}
          onStop={handleEndSession}
          faceDetected={faceDetected}
          eyeDetected={eyeDetected}
          lookingAway={lookingAway}
          detectionError={detectionError}
          mockState={mockState}
          onMockStateChange={handleMockStateChange}
          onFaceNormal={handleCameraFaceNormal}
          onFaceDistracted={handleCameraFaceDistracted}
          onFaceMissing={handleCameraFaceMissing}
          isManualSim={isManualSim}
        />
      </div>
    </>
  );
}

