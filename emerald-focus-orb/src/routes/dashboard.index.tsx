import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Brain, Clock, Eye, EyeOff, TrendingUp, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { saveFocusSnapshot, fetchDashboardStats, startSessionApi, endSessionApi } from "@/lib/api";
import { getNextFocusScore } from "@/lib/focusScore";
import { CameraPermissionDialog } from "@/components/camera/CameraPermissionDialog";
import { LiveCameraFeed } from "@/components/camera/LiveCameraFeed";
import { FocusSphere } from "@/components/focus/FocusSphere";
import { useCamera } from "@/hooks/useCamera";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { stream, request } = useCamera();
  const [askPermission, setAskPermission] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [durationMins, setDurationMins] = useState(25);
  const [secs, setSecs] = useState(25 * 60);
  const [focusScore, setFocusScore] = useState(87);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const savingRef = useRef(false);
  const focusScoreRef = useRef(focusScore);

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
  const [localAttentionDrops, setLocalAttentionDrops] = useState(0);

  const handleCameraFaceNormal = () => {
    if (!isManualSim) {
      setCameraState("normal");
    }
  };

  const handleCameraFaceDistracted = () => {
    if (!isManualSim) {
      if (cameraState === "normal") {
        setLocalDistractions((prev) => prev + 1);
        if (tracking && sessionId) {
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
        setLocalAttentionDrops((prev) => prev + 1);
        if (tracking && sessionId) {
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
          if (tracking && sessionId) {
            void saveSnapshot();
          }
        }
      } else if (state === "missing") {
        if (faceDetectedRef.current) {
          setLocalAttentionDrops((prev) => prev + 1);
          if (tracking && sessionId) {
            eyeDetectedRef.current = false;
            faceDetectedRef.current = false;
            void saveSnapshot();
          }
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
    focusScoreRef.current = focusScore;
  }, [focusScore]);

  const loadStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data.stats);
      if (data.stats && !tracking) {
        setFocusScore(data.stats.currentFocus || 80);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  useEffect(() => {
    const t = setTimeout(() => setAskPermission(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setSessionId(localStorage.getItem("focusSessionId"));
  }, []);

  useEffect(() => {
    loadStats();
  }, [tracking]);

  // Countdown Timer logic
  useEffect(() => {
    if (!tracking) return;
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
  }, [tracking, durationMins]);

  // Poll stats every 10 seconds while tracking to keep Today's Study updated in real-time
  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => {
      loadStats();
    }, 10000);
    return () => clearInterval(id);
  }, [tracking]);

  // Smooth Focus Score simulation logic
  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => {
      setFocusScore((f) => getNextFocusScore(f, faceDetected, eyeDetected, lookingAway));
    }, 1000);
    return () => clearInterval(id);
  }, [tracking, faceDetected, eyeDetected, lookingAway]);

  const triggerSessionComplete = async () => {
    setTracking(false);
    toast.success("Focus session completed! Great job!", { id: "session-complete-toast" });
    if (sessionId) {
      await saveSnapshot();
      if (!sessionId.startsWith("local_")) {
        try {
          await endSessionApi(sessionId);
        } catch (err) {
          console.error("Failed to end session on server", err);
        }
      }
      localStorage.removeItem("focusSessionId");
      setSessionId(null);
    }
    setSecs(durationMins * 60);
    setMockState("normal");
    setCameraState("normal");
    setIsManualSim(false);
    setLocalDistractions(0);
    setLocalAttentionDrops(0);
    setTimeout(loadStats, 1000);
  };

  const saveSnapshot = async () => {
    const score = focusScoreRef.current;
    if (!sessionId || sessionId.startsWith("local_") || savingRef.current) return;

    savingRef.current = true;
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
      savingRef.current = false;
    }
  };

  useEffect(() => {
    if (!tracking || !sessionId) return;

    const id = setInterval(() => {
      void saveSnapshot();
    }, 5000);

    return () => clearInterval(id);
  }, [tracking, sessionId]);

  const handleStartTracking = async () => {
    let activeStream = stream;
    if (!activeStream) {
      activeStream = await request();
    }
    if (!activeStream) {
      toast.error("Camera access is required to track eyes.");
      return;
    }

    setTracking(true);
    if (secs === 0 || secs === durationMins * 60) {
      setSecs(durationMins * 60);
    }
    setLocalDistractions(0);
    setLocalAttentionDrops(0);
    setFocusScore(100);

    try {
      // Start backend study session
      const result = await startSessionApi();
      const nextSessionId = result.session._id;
      setSessionId(nextSessionId);
      localStorage.setItem("focusSessionId", nextSessionId);

      // Save initial snapshot immediately
      try {
        await saveFocusSnapshot({
          sessionId: nextSessionId,
          focusScore: focusScoreRef.current,
          eyeDetected: eyeDetectedRef.current,
          faceDetected: faceDetectedRef.current,
          lookingAway: lookingAwayRef.current,
        });
      } catch (err) {
        console.error("Failed to save initial snapshot", err);
      }
    } catch (error) {
      console.error("Failed to start session on home dashboard", error);
      const fallbackId = `local_${Date.now()}`;
      setSessionId(fallbackId);
      localStorage.setItem("focusSessionId", fallbackId);
      toast.error("Running in local mode: Failed to sync with server.");
    }
  };

  const handleStopTracking = async () => {
    setTracking(false);
    if (sessionId) {
      await saveSnapshot();
      if (!sessionId.startsWith("local_")) {
        try {
          await endSessionApi(sessionId);
        } catch (err) {
          console.error("Failed to end session on server", err);
        }
      }
      localStorage.removeItem("focusSessionId");
      setSessionId(null);
    }
    setSecs(durationMins * 60);
    setMockState("normal");
    setCameraState("normal");
    setIsManualSim(false);
    setLocalDistractions(0);
    setLocalAttentionDrops(0);
    setTimeout(loadStats, 1000);
  };

  const getTodayStudyVal = () => {
    const totalMins = (stats?.todayStudyMinutes || 0) + Math.floor(secs / 60);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <>
      <CameraPermissionDialog
        open={askPermission}
        onAllow={async () => { setAskPermission(false); await request(); }}
        onDeny={() => setAskPermission(false)}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard 
          icon={Activity} 
          label="Current Focus" 
          value={tracking && detectionError ? "0% (Error)" : `${focusScore}%`} 
          delta={tracking && detectionError ? "No Face" : "Live"} 
          tone={tracking && detectionError ? "danger" : "emerald"} 
        />
        <StatCard icon={Clock} label="Today's Study" value={getTodayStudyVal()} delta="Today" tone="gold" />
        <StatCard icon={TrendingUp} label="Weekly Avg" value={`${stats?.weeklyAvg || 0}%`} delta="Weekly" tone="emerald" />
        <StatCard icon={Brain} label="Total Sessions" value={`${stats?.totalSessions || 0}`} delta="All-time" tone="gold" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Live focus monitoring */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-5">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-accent">Live monitoring</div>
                <h2 className="mt-1 font-display text-xl font-semibold">Realtime focus signal</h2>
              </div>
              <div className="flex items-center gap-2">
                {tracking && (
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent font-mono animate-pulse">
                    {formatTime(secs)}
                  </span>
                )}
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                  {tracking ? "Tracking" : "Idle"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center relative">
                <FocusSphere score={focusScore} size={260} progress={secs / (durationMins * 60)} />
                {tracking && detectionError && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75 px-4 py-2.5 rounded-xl border border-danger/40 text-danger text-xs font-semibold text-center backdrop-blur shadow-lg animate-pulse">
                    ⚠️ Error (person cannot detect)
                  </div>
                )}
                
                {!tracking && (
                  <div className="mt-4 flex flex-col items-center gap-1.5 z-10">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Session Length</span>
                    <div className="flex gap-1">
                      {[1, 5, 15, 25, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => {
                            setDurationMins(mins);
                            setSecs(mins * 60);
                          }}
                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
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
              </div>
              <LiveCameraFeed
                stream={stream}
                focusScore={focusScore}
                tracking={tracking}
                onTrack={tracking ? handleStopTracking : handleStartTracking}
                onStop={handleStopTracking}
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
          </div>

          {/* Timeline */}
          <div className="glass-panel mt-6 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Focus timeline</h3>
              <div className="flex gap-1 rounded-lg border border-border bg-white/5 p-1 text-xs">
                {["1H", "Today", "7D", "30D"].map((t, i) => (
                  <button key={t} className={`rounded-md px-2.5 py-1 ${i === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="focusFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#00A86B" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#00A86B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="t" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: "rgba(13,22,38,0.95)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: "#94A3B8" }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#00A86B" strokeWidth={2.5} fill="url(#focusFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Distraction */}
        <div className="space-y-6">
          <div className="glass-panel p-5">
            <h3 className="font-display text-lg font-semibold">Focus analysis</h3>
            <p className="mt-1 text-xs text-muted-foreground">Active monitoring stats</p>
            <div className="mt-5 space-y-3">
              <DistRow icon={EyeOff} label="Stepped away" value={`${(stats?.distractions?.attentionDrops ?? 0) + localAttentionDrops}`} hint="Times face was missing" />
              <DistRow icon={Clock} label="Idle time" value="0m" hint="No activity detected" />
              <DistRow icon={Zap} label="Flow moments" value="--" hint="Focus score >= 85%" tone="emerald" />
            </div>
          </div>

          <div className="glass-panel p-5">
            <h3 className="font-display text-lg font-semibold">Today by hour</h3>
            <div className="mt-4 grid grid-cols-12 items-end gap-1.5">
              {hourly.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-md bg-linear-to-t from-primary/40 to-accent/80"
                    style={{ height: `${Math.max(6, h)}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground">{i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  icon: Icon, label, value, delta, tone,
}: { icon: any; label: string; value: string; delta: string; tone: "emerald" | "gold" | "danger" }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card group relative overflow-hidden p-5">
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${
        tone === "emerald" ? "bg-primary/25" : tone === "gold" ? "bg-accent/25" : "bg-danger/25"
      } opacity-0 blur-2xl transition group-hover:opacity-100`} />
      <div className="relative flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${
          tone === "emerald" 
            ? "bg-primary/10 text-primary glow-emerald" 
            : tone === "gold" 
              ? "bg-accent/10 text-accent glow-gold" 
              : "bg-danger/10 text-danger glow-red animate-pulse"
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-xs ${tone === "danger" ? "text-danger animate-pulse font-semibold" : "text-primary"}`}>{delta}</span>
      </div>
      <div className="relative mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`relative mt-1 font-display text-3xl font-semibold ${
        tone === "emerald" 
          ? "text-gradient-emerald" 
          : tone === "gold" 
            ? "text-gradient-gold" 
            : "text-gradient-rose font-semibold animate-pulse"
      }`}>{value}</div>
    </motion.div>
  );
}

function DistRow({ icon: Icon, label, value, hint, tone }: { icon: any; label: string; value: string; hint: string; tone?: "emerald" }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white/5 p-3">
      <div className={`grid h-9 w-9 place-items-center rounded-lg ${tone === "emerald" ? "bg-primary/15 text-primary" : "bg-white/5 text-accent"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <div className="ml-auto font-display text-lg">{value}</div>
    </div>
  );
}

const timeline = Array.from({ length: 24 }, (_, i) => ({
  t: `${i}:00`,
  score: Math.round(55 + Math.sin(i / 3) * 18 + Math.random() * 12),
}));

const hourly = Array.from({ length: 12 }, () => 20 + Math.random() * 80);
