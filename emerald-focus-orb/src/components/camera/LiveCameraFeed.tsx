import { motion } from "framer-motion";
import { Eye, Loader2, Scan, Sparkles, Video } from "lucide-react";
import { useEffect, useRef } from "react";

interface Props {
  stream: MediaStream | null;
  focusScore: number;
  tracking: boolean;
  onTrack: () => void;
  onStop?: () => void;
  faceDetected?: boolean;
  eyeDetected?: boolean;
  lookingAway?: boolean;
  detectionError?: string | null;
  mockState?: "normal" | "distracted" | "missing";
  onMockStateChange?: (state: "normal" | "distracted" | "missing") => void;
  onFaceNormal?: () => void;
  onFaceDistracted?: () => void;
  onFaceMissing?: () => void;
  isManualSim?: boolean;
}

let faceDataLoaded = false;
let eyeDataLoaded = false;

function loadScript(src: string): Promise<void> {
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

export function LiveCameraFeed({
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
  isManualSim = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackTaskRef = useRef<any>(null);

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
        if (!(window as any).tracking) {
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

        const trackingLib = (window as any).tracking;
        if (!trackingLib) return;

        const faceTracker = new trackingLib.ObjectTracker("face");
        faceTracker.setInitialScale(4);
        faceTracker.setStepSize(3);
        faceTracker.setEdgesDensity(0.1);

        const eyeTracker = new trackingLib.ObjectTracker("eye");
        eyeTracker.setInitialScale(1.0);
        eyeTracker.setStepSize(2);
        eyeTracker.setEdgesDensity(0.1);

        let missingFramesCount = 0;
        let missingEyesCount = 0;
        const MISSING_THRESHOLD = 4; // With 500ms intervals, 4 consecutive misses = 2 seconds

        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");

        // Face crop canvas for high accuracy eye tracking
        const faceCanvas = document.createElement("canvas");
        faceCanvas.width = 160;
        faceCanvas.height = 160;
        const faceCtx = faceCanvas.getContext("2d");

        let facesCount = 0;
        let eyesCount = 0;
        let faceRect: any = null;

        faceTracker.on("track", (event: any) => {
          facesCount = event.data ? event.data.length : 0;
          faceRect = facesCount > 0 ? event.data[0] : null;
        });

        eyeTracker.on("track", (event: any) => {
          eyesCount = event.data ? event.data.length : 0;
        });

        const evaluateFocusState = () => {
          if (!tracking || !isMounted) return;
          
          // If in a simulated override state (distracted/missing), ignore camera feedback
          if (isManualSim) return;

          if (facesCount === 0) {
            missingFramesCount++;
            if (missingFramesCount >= MISSING_THRESHOLD) {
              if (onFaceMissing) onFaceMissing();
            }
          } else {
            missingFramesCount = 0;
            const faceCenterX = faceRect ? (faceRect.x + faceRect.width / 2) : 160;
            const faceCenterY = faceRect ? (faceRect.y + faceRect.height / 2) : 120;

            // Center of the video/circle
            const centerX = 160;
            const centerY = 120;

            // Radius of the UI focus circle (the overlay uses a 160px diameter -> radius 80)
            const circleRadius = 80;

            const dx = faceCenterX - centerX;
            const dy = faceCenterY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Debounce eyesCount === 0 for 5 frames (2.5 seconds) to avoid blink glitches
            if (eyesCount === 0) {
              missingEyesCount++;
            } else {
              missingEyesCount = 0;
            }
            const isEyesMissing = missingEyesCount >= 5;

            // If the detected face is outside the central circle, treat as missing
            if (distance > circleRadius) {
              if (onFaceMissing) onFaceMissing();
            } else {
              // small off-center threshold inside the circle -> distracted
              const offCenterRatio = Math.abs(faceCenterX - centerX) / centerX;
              const isOffCenter = offCenterRatio > 0.25; // tightened threshold

              if (isOffCenter || isEyesMissing) {
                if (onFaceDistracted) onFaceDistracted();
              } else {
                if (onFaceNormal) onFaceNormal();
              }
            }
          }
        };

        const trackFrame = () => {
          if (!tracking || !isMounted || !videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
          
          try {
            if (ctx) {
              ctx.drawImage(videoRef.current, 0, 0, 320, 240);
              const imageData = ctx.getImageData(0, 0, 320, 240);
              
              // Reset values for this frame
              facesCount = 0;
              faceRect = null;
              eyesCount = 0;
              
              // Run face tracker
              faceTracker.track(imageData.data, 320, 240);

              // If face is found, crop and run eye tracker on face area
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

              // Evaluate states
              evaluateFocusState();
            }
          } catch (e) {
            console.warn("Failed to process face/eye tracking frame:", e);
          }
        };

        // Run tracking at 500ms intervals instead of 60fps
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden p-3"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        {stream ? (
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover -scale-x-100" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {/* Overlay HUD */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse" /> Live
          </div>
          
          {tracking && detectionError ? (
            <div className="absolute right-3 top-3 rounded-full bg-red-950/80 border border-red-500/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-red-400 backdrop-blur animate-pulse">
              Error (person cannot detect)
            </div>
          ) : (
            <div className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-primary backdrop-blur">
              Focus {focusScore}%
            </div>
          )}

          {tracking && (
            <>
              {!detectionError && (
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_2px_var(--color-primary)]"
                />
              )}
              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40">
                <div className="absolute inset-0 animate-pulse-ring rounded-full" />
              </div>
            </>
          )}

          {/* corners */}
          {[
            "left-3 top-3 border-l-2 border-t-2",
            "right-3 top-3 border-r-2 border-t-2",
            "left-3 bottom-3 border-l-2 border-b-2",
            "right-3 bottom-3 border-r-2 border-b-2",
          ].map((c) => (
            <div key={c} className={`absolute h-5 w-5 border-accent/60 ${c}`} />
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 px-1 text-[11px]">
        <Stat icon={<Video className="h-3.5 w-3.5" />} label="Stream" ok={!!stream} />
        <Stat icon={<Scan className="h-3.5 w-3.5" />} label="Face" ok={tracking ? faceDetected : false} />
      </div>

      <button
        onClick={onTrack}
        className="group relative mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary via-emerald-deep to-primary px-4 py-3 text-sm font-semibold text-primary-foreground glow-emerald transition hover:brightness-110"
      >
        <Sparkles className="h-4 w-4" />
        {tracking ? "Tracking eyes…" : "Track My Eyes"}
        <span className="absolute inset-0 rounded-xl bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] bg-size-[200%_100%] opacity-0 transition group-hover:opacity-100" style={{ animation: "shimmer 1.8s linear infinite" }} />
      </button>

      {tracking && onStop ? (
        <button
          onClick={onStop}
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger hover:bg-danger/15"
        >
          Stop tracking
        </button>
      ) : null}

      {tracking && onMockStateChange && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-white/5 p-2 text-xs">
          <span className="text-muted-foreground font-medium pl-1">Simulation Control:</span>
          <div className="flex gap-1">
            {(["normal", "distracted", "missing"] as const).map((s) => (
              <button
                key={s}
                onClick={() => onMockStateChange(s)}
                className={`rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
                  mockState === s
                    ? s === "normal"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : s === "distracted"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Stat({ icon, label, ok }: { icon: React.ReactNode; label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-white/5 px-2 py-1.5">
      <span className={ok ? "text-primary" : "text-muted-foreground"}>{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className={`ml-auto h-1.5 w-1.5 rounded-full ${ok ? "bg-primary shadow-[0_0_8px_var(--color-primary)]" : "bg-muted-foreground/40"}`} />
    </div>
  );
}


