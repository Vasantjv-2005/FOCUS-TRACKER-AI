import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { X, Camera, ShieldCheck, Loader2, Video, Scan, Sparkles } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
function CameraPermissionDialog({ open, onAllow, onDeny }) {
  return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md p-4",
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { scale: 0.92, y: 20, opacity: 0 },
          animate: { scale: 1, y: 0, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          transition: { type: "spring", stiffness: 220, damping: 22 },
          className: "glass-panel relative w-full max-w-md p-7",
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onDeny,
                className: "absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 glow-emerald", children: [
                /* @__PURE__ */ jsx(Camera, { className: "h-7 w-7 text-primary" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-2xl animate-pulse-ring" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-semibold", children: "Camera access required" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-muted-foreground", children: "Allow camera access for FocusTrack app to enable advanced focus analysis." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-2.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }),
              "Video is processed locally. Frames never leave your device."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onDeny,
                  className: "rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 transition",
                  children: "Block"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onAllow,
                  className: "rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-emerald transition hover:brightness-110",
                  children: "Allow"
                }
              )
            ] })
          ]
        }
      )
    }
  ) });
}
let faceDataLoaded = false;
let eyeDataLoaded = false;
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.body.appendChild(script);
  });
}
function LiveCameraFeed({
  stream,
  focusScore,
  tracking,
  onTrack,
  onStop,
  faceDetected = true,
  eyeDetected = true,
  lookingAway = false,
  detectionError = null,
  mockState = "normal",
  onMockStateChange,
  onFaceNormal,
  onFaceDistracted,
  onFaceMissing,
  isManualSim = false
}) {
  const videoRef = useRef(null);
  const trackTaskRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  useEffect(() => {
    if (!tracking || !videoRef.current || !stream) {
      if (trackTaskRef.current) {
        try {
          trackTaskRef.current.stop();
        } catch (e) {
          console.warn("Failed to stop tracking task:", e);
        }
        trackTaskRef.current = null;
      }
      return;
    }
    let isMounted = true;
    const startTracker = async () => {
      try {
        if (!window.tracking) {
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/tracking-min.js");
        }
        if (!faceDataLoaded) {
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/data/face-min.js");
          faceDataLoaded = true;
        }
        if (!eyeDataLoaded) {
          await loadScript("https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/data/eye-min.js");
          eyeDataLoaded = true;
        }
        if (!isMounted || !videoRef.current || !tracking) return;
        const trackingLib = window.tracking;
        if (!trackingLib) return;
        const faceTracker = new trackingLib.ObjectTracker("face");
        faceTracker.setInitialScale(4);
        faceTracker.setStepSize(3);
        faceTracker.setEdgesDensity(0.1);
        const eyeTracker = new trackingLib.ObjectTracker("eye");
        eyeTracker.setInitialScale(1);
        eyeTracker.setStepSize(2);
        eyeTracker.setEdgesDensity(0.1);
        let missingFramesCount = 0;
        let missingEyesCount = 0;
        const MISSING_THRESHOLD = 4;
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        const faceCanvas = document.createElement("canvas");
        faceCanvas.width = 160;
        faceCanvas.height = 160;
        const faceCtx = faceCanvas.getContext("2d");
        let facesCount = 0;
        let eyesCount = 0;
        let faceRect = null;
        faceTracker.on("track", (event) => {
          facesCount = event.data ? event.data.length : 0;
          faceRect = facesCount > 0 ? event.data[0] : null;
        });
        eyeTracker.on("track", (event) => {
          eyesCount = event.data ? event.data.length : 0;
        });
        const evaluateFocusState = () => {
          if (!tracking || !isMounted) return;
          if (isManualSim) return;
          if (facesCount === 0) {
            missingFramesCount++;
            if (missingFramesCount >= MISSING_THRESHOLD) {
              if (onFaceMissing) onFaceMissing();
            }
          } else {
            missingFramesCount = 0;
            const faceCenterX = faceRect ? faceRect.x + faceRect.width / 2 : 160;
            const offCenterRatio = Math.abs(faceCenterX - 160) / 160;
            const isOffCenter = offCenterRatio > 0.4;
            if (eyesCount === 0) {
              missingEyesCount++;
            } else {
              missingEyesCount = 0;
            }
            const isEyesMissing = missingEyesCount >= 5;
            if (isOffCenter || isEyesMissing) {
              if (onFaceDistracted) onFaceDistracted();
            } else {
              if (onFaceNormal) onFaceNormal();
            }
          }
        };
        const trackFrame = () => {
          if (!tracking || !isMounted || !videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
          try {
            if (ctx) {
              ctx.drawImage(videoRef.current, 0, 0, 320, 240);
              const imageData = ctx.getImageData(0, 0, 320, 240);
              facesCount = 0;
              faceRect = null;
              eyesCount = 0;
              faceTracker.track(imageData.data, 320, 240);
              if (facesCount > 0 && faceRect) {
                if (faceCtx) {
                  faceCtx.clearRect(0, 0, 160, 160);
                  const sx = Math.max(0, Math.min(320, faceRect.x));
                  const sy = Math.max(0, Math.min(240, faceRect.y));
                  const sw = Math.max(1, Math.min(320 - sx, faceRect.width));
                  const sh = Math.max(1, Math.min(240 - sy, faceRect.height));
                  faceCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, 160, 160);
                  const faceImageData = faceCtx.getImageData(0, 0, 160, 160);
                  eyeTracker.track(faceImageData.data, 160, 160);
                }
              }
              evaluateFocusState();
            }
          } catch (e) {
            console.warn("Failed to process face/eye tracking frame:", e);
          }
        };
        const intervalId = setInterval(trackFrame, 500);
        trackTaskRef.current = {
          stop: () => clearInterval(intervalId)
        };
      } catch (err) {
        console.error("Webcam tracking init failed:", err);
      }
    };
    void startTracker();
    return () => {
      isMounted = false;
      if (trackTaskRef.current) {
        try {
          trackTaskRef.current.stop();
        } catch (e) {
          console.warn("Clean up tracking task failed:", e);
        }
        trackTaskRef.current = null;
      }
    };
  }, [tracking, stream, mockState, isManualSim, onFaceNormal, onFaceDistracted, onFaceMissing]);
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      className: "glass-panel overflow-hidden p-3",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-video w-full overflow-hidden rounded-xl bg-black", children: [
          stream ? /* @__PURE__ */ jsx("video", { ref: videoRef, autoPlay: true, muted: true, playsInline: true, className: "h-full w-full object-cover -scale-x-100" }) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }) }),
          /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute inset-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white/80 backdrop-blur", children: [
              /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-danger animate-pulse" }),
              " Live"
            ] }),
            tracking && detectionError ? /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3 rounded-full bg-red-950/80 border border-red-500/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-red-400 backdrop-blur animate-pulse", children: "Error (person cannot detect)" }) : /* @__PURE__ */ jsxs("div", { className: "absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-primary backdrop-blur", children: [
              "Focus ",
              focusScore,
              "%"
            ] }),
            tracking && /* @__PURE__ */ jsxs(Fragment, { children: [
              !detectionError && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { y: 0 },
                  animate: { y: ["0%", "100%", "0%"] },
                  transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  className: "absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_2px_var(--color-primary)]"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 animate-pulse-ring rounded-full" }) })
            ] }),
            [
              "left-3 top-3 border-l-2 border-t-2",
              "right-3 top-3 border-r-2 border-t-2",
              "left-3 bottom-3 border-l-2 border-b-2",
              "right-3 bottom-3 border-r-2 border-b-2"
            ].map((c) => /* @__PURE__ */ jsx("div", { className: `absolute h-5 w-5 border-accent/60 ${c}` }, c))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 px-1 text-[11px]", children: [
          /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Video, { className: "h-3.5 w-3.5" }), label: "Stream", ok: !!stream }),
          /* @__PURE__ */ jsx(Stat, { icon: /* @__PURE__ */ jsx(Scan, { className: "h-3.5 w-3.5" }), label: "Face", ok: tracking ? faceDetected : false })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onTrack,
            className: "group relative mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary via-emerald-deep to-primary px-4 py-3 text-sm font-semibold text-primary-foreground glow-emerald transition hover:brightness-110",
            children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }),
              tracking ? "Tracking eyes…" : "Track My Eyes",
              /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-xl bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] bg-size-[200%_100%] opacity-0 transition group-hover:opacity-100", style: { animation: "shimmer 1.8s linear infinite" } })
            ]
          }
        ),
        tracking && onStop ? /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onStop,
            className: "mt-2 inline-flex w-full items-center justify-center rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger hover:bg-danger/15",
            children: "Stop tracking"
          }
        ) : null,
        tracking && onMockStateChange && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between rounded-xl border border-border bg-white/5 p-2 text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground font-medium pl-1", children: "Simulation Control:" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: ["normal", "distracted", "missing"].map((s) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onMockStateChange(s),
              className: `rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${mockState === s ? s === "normal" ? "bg-primary/20 text-primary border border-primary/30" : s === "distracted" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse" : "text-muted-foreground hover:bg-white/5"}`,
              children: s
            },
            s
          )) })
        ] })
      ]
    }
  );
}
function Stat({ icon, label, ok }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 rounded-lg border border-border bg-white/5 px-2 py-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: ok ? "text-primary" : "text-muted-foreground", children: icon }),
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: `ml-auto h-1.5 w-1.5 rounded-full ${ok ? "bg-primary shadow-[0_0_8px_var(--color-primary)]" : "bg-muted-foreground/40"}` })
  ] });
}
function useCamera() {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const request = useCallback(async () => {
    setRequesting(true);
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false
      });
      setStream(s);
      return s;
    } catch (e) {
      setError(e?.message ?? "Camera access denied");
      return null;
    } finally {
      setRequesting(false);
    }
  }, []);
  const stop = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }, [stream]);
  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);
  return { stream, error, requesting, request, stop };
}
export {
  CameraPermissionDialog as C,
  LiveCameraFeed as L,
  useCamera as u
};
