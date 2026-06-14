import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Activity, Clock, TrendingUp, Brain, EyeOff, Eye, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { s as saveFocusSnapshot } from "./api-DG4i5KnB.js";
import { u as useCamera, C as CameraPermissionDialog, L as LiveCameraFeed } from "./useCamera-CuPk07yi.js";
import { F as FocusSphere } from "./FocusSphere-C5OePAO9.js";
function DashboardHome() {
  const {
    stream,
    request
  } = useCamera();
  const [askPermission, setAskPermission] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [focusScore, setFocusScore] = useState(87);
  const [sessionId, setSessionId] = useState(null);
  const savingRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => setAskPermission(true), 600);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    setSessionId(localStorage.getItem("focusSessionId"));
  }, []);
  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => setFocusScore((s) => Math.max(45, Math.min(99, s + Math.round((Math.random() - 0.5) * 6)))), 1500);
    return () => clearInterval(id);
  }, [tracking]);
  const saveSnapshot = async (score = focusScore) => {
    if (!sessionId || savingRef.current) return;
    savingRef.current = true;
    try {
      await saveFocusSnapshot({
        sessionId,
        focusScore: score,
        eyeDetected: true,
        faceDetected: true,
        lookingAway: score < 60
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
  }, [tracking, sessionId, focusScore]);
  const handleStopTracking = async () => {
    setTracking(false);
    if (!sessionId) return;
    await saveSnapshot();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(CameraPermissionDialog, { open: askPermission, onAllow: async () => {
      setAskPermission(false);
      await request();
    }, onDeny: () => setAskPermission(false) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(StatCard, { icon: Activity, label: "Current Focus", value: `${focusScore}%`, delta: "+4.2%", tone: "emerald" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Clock, label: "Today's Study", value: "3h 42m", delta: "+38m", tone: "gold" }),
      /* @__PURE__ */ jsx(StatCard, { icon: TrendingUp, label: "Weekly Avg", value: "82%", delta: "+6%", tone: "emerald" }),
      /* @__PURE__ */ jsx(StatCard, { icon: Brain, label: "Total Sessions", value: "148", delta: "+12", tone: "gold" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-panel p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-end justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-accent", children: "Live monitoring" }),
              /* @__PURE__ */ jsx("h2", { className: "mt-1 font-display text-xl font-semibold", children: "Realtime focus signal" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary", children: tracking ? "Tracking" : "Idle" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 items-center gap-6 md:grid-cols-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(FocusSphere, { score: focusScore, size: 260 }) }),
            /* @__PURE__ */ jsx(LiveCameraFeed, { stream, focusScore, tracking, onTrack: () => setTracking((t) => !t), onStop: handleStopTracking })
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
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold", children: "Distraction analysis" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Today's session" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3", children: [
            /* @__PURE__ */ jsx(DistRow, { icon: EyeOff, label: "Looking away", value: "12", hint: "-3 vs yesterday" }),
            /* @__PURE__ */ jsx(DistRow, { icon: Clock, label: "Idle time", value: "6m 18s", hint: "2 short pauses" }),
            /* @__PURE__ */ jsx(DistRow, { icon: Eye, label: "Attention drops", value: "4", hint: "Mostly mid-session" }),
            /* @__PURE__ */ jsx(DistRow, { icon: Zap, label: "Flow moments", value: "3", hint: "20–35 min each", tone: "emerald" })
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
    /* @__PURE__ */ jsx("div", { className: `absolute -right-10 -top-10 h-28 w-28 rounded-full ${tone === "emerald" ? "bg-primary/25" : "bg-accent/25"} opacity-0 blur-2xl transition group-hover:opacity-100` }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-start justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: `grid h-10 w-10 place-items-center rounded-xl ${tone === "emerald" ? "bg-primary/10 text-primary glow-emerald" : "bg-accent/10 text-accent glow-gold"}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-primary", children: delta })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative mt-4 text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: `relative mt-1 font-display text-3xl font-semibold ${tone === "emerald" ? "text-gradient-emerald" : "text-gradient-gold"}`, children: value })
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
