import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Play, Pause, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { u as useCamera, C as CameraPermissionDialog, L as LiveCameraFeed } from "./useCamera-BXVtVLFl.js";
import { F as FocusSphere } from "./FocusSphere-DwEM2tbu.js";
import { e as endSessionApi, s as saveFocusSnapshot, a as startSessionApi } from "./api-CERjnBmU.js";
import { toast } from "sonner";
function SessionPage() {
  const {
    stream,
    request
  } = useCamera();
  const [ask, setAsk] = useState(false);
  const [running, setRunning] = useState(false);
  const [durationMins, setDurationMins] = useState(25);
  const [secs, setSecs] = useState(25 * 60);
  const [focus, setFocus] = useState(82);
  const [sessionId, setSessionId] = useState(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [mockState, setMockState] = useState("normal");
  const [isManualSim, setIsManualSim] = useState(false);
  const [cameraState, setCameraState] = useState("normal");
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
    }, 1e3);
    return () => clearInterval(id);
  }, [running, durationMins]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setFocus((f) => {
        let target = f;
        if (!faceDetected || mockState === "missing") {
          target = Math.max(0, f - 6 - Math.floor(Math.random() * 4));
        } else if (lookingAway || mockState === "distracted") {
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
  }, [running, mockState, faceDetected, eyeDetected, lookingAway]);
  const triggerSessionComplete = async () => {
    setRunning(false);
    toast.success("Focus session completed! Great job!", {
      id: "session-complete-toast"
    });
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
      toast.warning("Distraction detected! Please focus.", {
        id: "distraction-toast-session"
      });
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
        try {
          await saveFocusSnapshot({
            sessionId: nextSessionId,
            focusScore: focus,
            eyeDetected: eyeDetectedRef.current,
            faceDetected: faceDetectedRef.current,
            lookingAway: lookingAwayRef.current
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
        lookingAway: lookingAwayRef.current
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
    }, 5e3);
    return () => clearInterval(id);
  }, [running, sessionId]);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor(secs % 3600 / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(CameraPermissionDialog, { open: ask, onAllow: async () => {
      setAsk(false);
      await request();
    }, onDeny: () => setAsk(false) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel relative overflow-hidden p-8 text-center lg:col-span-2", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -right-10 top-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-accent", children: "Active session" }),
          /* @__PURE__ */ jsx(motion.div, { initial: {
            scale: 0.97,
            opacity: 0
          }, animate: {
            scale: 1,
            opacity: 1
          }, className: "mt-4 inline-block", children: /* @__PURE__ */ jsxs("div", { className: "font-display text-7xl font-semibold tabular-nums tracking-tight md:text-8xl", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gradient-emerald", children: hh }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: ":" }),
            /* @__PURE__ */ jsx("span", { className: "text-gradient-gold", children: mm }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: ":" }),
            /* @__PURE__ */ jsx("span", { className: "text-white/80", children: ss })
          ] }) }, running ? "live" : "idle"),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary", children: [
            /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${running ? "bg-primary animate-pulse" : "bg-muted-foreground"}` }),
            running ? saving ? "Saving focus snapshot…" : "Recording focus" : "Paused"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-2 gap-4 max-w-xs mx-auto animate-fade-in", children: [
            /* @__PURE__ */ jsxs("div", { className: "glass-card p-3 flex flex-col items-center justify-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Session Focus" }),
              /* @__PURE__ */ jsxs("span", { className: `mt-1 font-display text-xl font-bold ${focus >= 70 ? "text-gradient-emerald" : focus >= 40 ? "text-gradient-gold" : "text-gradient-rose font-semibold animate-pulse"}`, children: [
                focus,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "glass-card p-3 flex flex-col items-center justify-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Stepped Away" }),
              /* @__PURE__ */ jsx("span", { className: "mt-1 font-display text-xl font-bold text-white/90", children: localDistractions })
            ] })
          ] }),
          !running && /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold", children: "Session Length" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 justify-center", children: [1, 5, 15, 25, 45, 60, 90].map((mins) => /* @__PURE__ */ jsxs("button", { onClick: () => {
              setDurationMins(mins);
              setSecs(mins * 60);
            }, className: `rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${durationMins === mins ? "border-primary/40 bg-primary/10 text-primary glow-emerald" : "border-border bg-white/5 text-muted-foreground hover:text-foreground"}`, children: [
              mins,
              "m"
            ] }, mins)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-center gap-3", children: [
            !running ? /* @__PURE__ */ jsxs("button", { onClick: handleStartSession, className: "inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-emerald hover:brightness-110", children: [
              /* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }),
              " Start session"
            ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setRunning(false), className: "inline-flex items-center gap-2 rounded-2xl border border-border bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10", children: [
              /* @__PURE__ */ jsx(Pause, { className: "h-4 w-4" }),
              " Pause"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: handleEndSession, className: "inline-flex items-center gap-2 rounded-2xl border border-danger/40 bg-danger/10 px-6 py-3 text-sm font-semibold text-danger hover:bg-danger/15", children: [
              /* @__PURE__ */ jsx(Square, { className: "h-4 w-4" }),
              " End"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 flex justify-center relative", children: [
            /* @__PURE__ */ jsx(FocusSphere, { score: focus, size: 340, progress: secs / (durationMins * 60) }),
            running && detectionError && /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75 px-4 py-2.5 rounded-xl border border-danger/40 text-danger text-xs font-semibold text-center backdrop-blur shadow-lg animate-pulse", children: "⚠️ Error (person cannot detect)" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(LiveCameraFeed, { stream, focusScore: focus, tracking: running, onTrack: handleStartSession, onStop: handleEndSession, faceDetected, eyeDetected, lookingAway, detectionError, mockState, onMockStateChange: handleMockStateChange, onFaceNormal: handleCameraFaceNormal, onFaceDistracted: handleCameraFaceDistracted, onFaceMissing: handleCameraFaceMissing, isManualSim })
    ] })
  ] });
}
export {
  SessionPage as component
};
