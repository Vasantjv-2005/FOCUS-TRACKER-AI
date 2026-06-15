import { motion } from "framer-motion";
import { Eye, Loader2, Scan, Sparkles, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  stream: MediaStream | null;
  focusScore: number;
  tracking: boolean;
  onTrack: () => void;
  onStop?: () => void;
}

export function LiveCameraFeed({ stream, focusScore, tracking, onTrack, onStop }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faceDetected, setFaceDetected] = useState(true);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => setFaceDetected(Math.random() > 0.15), 1400);
    return () => clearInterval(id);
  }, [tracking]);

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
          <div className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-primary backdrop-blur">
            Focus {focusScore}%
          </div>

          {tracking && (
            <>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_2px_var(--color-primary)]"
              />
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

      <div className="mt-3 grid grid-cols-3 gap-2 px-1 text-[11px]">
        <Stat icon={<Video className="h-3.5 w-3.5" />} label="Stream" ok={!!stream} />
        <Stat icon={<Scan className="h-3.5 w-3.5" />} label="Face" ok={faceDetected} />
        <Stat icon={<Eye className="h-3.5 w-3.5" />} label="Gaze" ok={tracking} />
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
