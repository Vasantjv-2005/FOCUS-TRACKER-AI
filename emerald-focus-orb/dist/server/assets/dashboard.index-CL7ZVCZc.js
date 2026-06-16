import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Activity, Clock, TrendingUp, Brain, EyeOff, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { e as endSessionApi, s as saveFocusSnapshot, f as fetchDashboardStats, a as startSessionApi } from "./api-CERjnBmU.js";
import { u as useCamera, C as CameraPermissionDialog, L as LiveCameraFeed } from "./useCamera-BXVtVLFl.js";
import { F as FocusSphere } from "./FocusSphere-DwEM2tbu.js";
import { toast } from "sonner";
function DashboardHome() {
  const {
    stream,
    request
  } = useCamera();
  const [askPermission, setAskPermission] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [durationMins, setDurationMins] = useState(25);
  const [secs, setSecs] = useState(25 * 60);
  const [focusScore, setFocusScore] = useState(87);
  const [sessionId, setSessionId] = useState(null);
  const [stats, setStats] = useState(null);
  const savingRef = useRef(false);
  const focusScoreRef = useRef(focusScore);
  const [mockState, setMockState] = useState("normal");
  const [isManualSim, setIsManualSim] = useState(false);
  const [cameraState, setCameraState] = useState("normal");
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
  const handleMockStateChange = (state) => {
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
  const formatTime = (totalSeconds) => {
    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor(totalSeconds % 3600 / 60)).padStart(2, "0");
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
    }, 1e3);
    return () => clearInterval(id);
  }, [tracking, durationMins]);
  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => {
      loadStats();
    }, 1e4);
    return () => clearInterval(id);
  }, [tracking]);
  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => {
      setFocusScore((f) => {
        let target = f;
        if (!faceDetected) {
          target = Math.max(0, f - 6 - Math.floor(Math.random() * 4));
        } else if (lookingAway) {
          target = Math.max(40, f - 4 - Math.floor(Math.random() * 3));
        } else if (!eyeDetected) {
          target = Math.max(60, f - 3 - Math.floor(Math.random() * 2));
        } else {
          const recoveryRate = f < 70 ? 4 : 2;
          const maxFocus = 95 + Math.floor(Math.random() * 6);
          target = Math.min(maxFocus, f + recoveryRate + Math.floor(Math.random() * 2));
        }
        if (target === f && target > 85) {
          target = Math.min(100, Math.max(85, target + Math.round((Math.random() - 0.5) * 2)));
        }
        return target;
      });
    }, 1e3);
    return () => clearInterval(id);
  }, [tracking, faceDetected, eyeDetected, lookingAway]);
  const triggerSessionComplete = async () => {
    setTracking(false);
    toast.success("Focus session completed! Great job!", {
      id: "session-complete-toast"
    });
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
    setTimeout(loadStats, 1e3);
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
        lookingAway: lookingAwayRef.current
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
    }, 5e3);
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
      const result = await startSessionApi();
      const nextSessionId = result.session._id;
      setSessionId(nextSessionId);
      localStorage.setItem("focusSessionId", nextSessionId);
      try {
        await saveFocusSnapshot({
          sessionId: nextSessionId,
          focusScore: focusScoreRef.current,
          eyeDetected: eyeDetectedRef.current,
          faceDetected: faceDetectedRef.current,
          lookingAway: lookingAwayRef.current
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
    setTimeout(loadStats, 1e3);
  };
  const getTodayStudyVal = () => {
    const totalMins = (stats?.todayStudyMinutes || 0) + Math.floor(secs / 60);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(CameraPermissionDialog, { open: askPermission, onAllow: async () => {
      setAskPermission(false);
      await request();
    }, onDeny: () => setAskPermission(false) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: Activity, label: "Current Focus", value: tracking && detectionError ? "0% (Error)" : `${focusScore}%`, delta: tracking && detectionError ? "No Face" : "Live", tone: tracking && detectionError ? "danger" : "emerald" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Clock, label: "Today's Study", value: getTodayStudyVal(), delta: "Today", tone: "gold" }),
      /* @__PURE__ */ jsx(StatCard, { icon: TrendingUp, label: "Weekly Avg", value: `${stats?.weeklyAvg || 0}%`, delta: "Weekly", tone: "emerald" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Brain, label: "Total Sessions", value: `${stats?.totalSessions || 0}`, delta: "All-time", tone: "gold" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-panel p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-end justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-accent", children: "Live monitoring" }),
              /* @__PURE__ */ jsx("h2", { className: "mt-1 font-display text-xl font-semibold", children: "Realtime focus signal" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              tracking && /* @__PURE__ */ jsx("span", { className: "rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent font-mono animate-pulse", children: formatTime(secs) }),
              /* @__PURE__ */ jsx("span", { className: "rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary", children: tracking ? "Tracking" : "Idle" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-center gap-6 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center relative", children: [
              /* @__PURE__ */ jsx(FocusSphere, { score: focusScore, size: 260, progress: secs / (durationMins * 60) }),
              tracking && detectionError && /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75 px-4 py-2.5 rounded-xl border border-danger/40 text-danger text-xs font-semibold text-center backdrop-blur shadow-lg animate-pulse", children: "⚠️ Error (person cannot detect)" }),
              !tracking && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col items-center gap-1.5 z-10", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold", children: "Session Length" }),
                /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: [1, 5, 15, 25, 45, 60].map((mins) => /* @__PURE__ */ jsxs("button", { onClick: () => {
                  setDurationMins(mins);
                  setSecs(mins * 60);
                }, className: `rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${durationMins === mins ? "border-primary/40 bg-primary/10 text-primary glow-emerald" : "border-border bg-white/5 text-muted-foreground hover:text-foreground"}`, children: [
                  mins,
                  "m"
                ] }, mins)) })
              ] })
            ] }),
            /* @__PURE__ */ jsx(LiveCameraFeed, { stream, focusScore, tracking, onTrack: tracking ? handleStopTracking : handleStartTracking, onStop: handleStopTracking, faceDetected, eyeDetected, lookingAway, detectionError, mockState, onMockStateChange: handleMockStateChange, onFaceNormal: handleCameraFaceNormal, onFaceDistracted: handleCameraFaceDistracted, onFaceMissing: handleCameraFaceMissing, isManualSim })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-panel mt-6 p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold", children: "Focus timeline" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-1 rounded-lg border border-border bg-white/5 p-1 text-xs", children: ["1H", "Today", "7D", "30D"].map((t, i) => /* @__PURE__ */ jsx("button", { className: `rounded-md px-2.5 py-1 ${i === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`, children: t }, t)) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: timeline, children: [
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "focusFill", x1: "0", x2: "0", y1: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#00A86B", stopOpacity: 0.55 }),
              /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#00A86B", stopOpacity: 0 })
            ] }) }),
            /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.06)", vertical: false }),
            /* @__PURE__ */ jsx(XAxis, { dataKey: "t", stroke: "rgba(255,255,255,0.4)", fontSize: 11, tickLine: false, axisLine: false }),
            /* @__PURE__ */ jsx(YAxis, { stroke: "rgba(255,255,255,0.4)", fontSize: 11, tickLine: false, axisLine: false, domain: [0, 100] }),
            /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
              background: "rgba(13,22,38,0.95)",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: 12,
              fontSize: 12
            }, labelStyle: {
              color: "#94A3B8"
            } }),
            /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "score", stroke: "#00A86B", strokeWidth: 2.5, fill: "url(#focusFill)" })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-panel p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold", children: "Focus analysis" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Active monitoring stats" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3", children: [
            /* @__PURE__ */ jsx(DistRow, { icon: EyeOff, label: "Stepped away", value: `${(stats?.distractions?.attentionDrops ?? 0) + localAttentionDrops}`, hint: "Times face was missing" }),
            /* @__PURE__ */ jsx(DistRow, { icon: Clock, label: "Idle time", value: "0m", hint: "No activity detected" }),
            /* @__PURE__ */ jsx(DistRow, { icon: Zap, label: "Flow moments", value: "--", hint: "Focus score >= 85%", tone: "emerald" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-panel p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold", children: "Today by hour" }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-12 items-end gap-1.5", children: hourly.map((h, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full rounded-md bg-linear-to-t from-primary/40 to-accent/80", style: {
              height: `${Math.max(6, h)}%`
            } }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-muted-foreground", children: i })
          ] }, i)) })
        ] })
      ] })
    ] })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  tone
}) {
  return /* @__PURE__ */ jsxs(motion.div, { whileHover: {
    y: -4
  }, className: "glass-card group relative overflow-hidden p-5", children: [
    /* @__PURE__ */ jsx("div", { className: `absolute -right-10 -top-10 h-28 w-28 rounded-full ${tone === "emerald" ? "bg-primary/25" : tone === "gold" ? "bg-accent/25" : "bg-danger/25"} opacity-0 blur-2xl transition group-hover:opacity-100` }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-start justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: `grid h-10 w-10 place-items-center rounded-xl ${tone === "emerald" ? "bg-primary/10 text-primary glow-emerald" : tone === "gold" ? "bg-accent/10 text-accent glow-gold" : "bg-danger/10 text-danger glow-red animate-pulse"}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx("span", { className: `text-xs ${tone === "danger" ? "text-danger animate-pulse font-semibold" : "text-primary"}`, children: delta })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative mt-4 text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: `relative mt-1 font-display text-3xl font-semibold ${tone === "emerald" ? "text-gradient-emerald" : tone === "gold" ? "text-gradient-gold" : "text-gradient-rose font-semibold animate-pulse"}`, children: value })
  ] });
}
function DistRow({
  icon: Icon,
  label,
  value,
  hint,
  tone
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-white/5 p-3", children: [
    /* @__PURE__ */ jsx("div", { className: `grid h-9 w-9 place-items-center rounded-lg ${tone === "emerald" ? "bg-primary/15 text-primary" : "bg-white/5 text-accent"}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: label }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: hint })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "ml-auto font-display text-lg", children: value })
  ] });
}
const timeline = Array.from({
  length: 24
}, (_, i) => ({
  t: `${i}:00`,
  score: Math.round(55 + Math.sin(i / 3) * 18 + Math.random() * 12)
}));
const hourly = Array.from({
  length: 12
}, () => 20 + Math.random() * 80);
export {
  DashboardHome as component
};
