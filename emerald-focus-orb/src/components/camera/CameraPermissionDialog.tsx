import { AnimatePresence, motion } from "framer-motion";
import { Camera, ShieldCheck, X } from "lucide-react";

interface Props {
  open: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export function CameraPermissionDialog({ open, onAllow, onDeny }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="glass-panel relative w-full max-w-md p-7"
          >
            <button
              onClick={onDeny}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 glow-emerald">
                <Camera className="h-7 w-7 text-primary" />
                <div className="absolute inset-0 rounded-2xl animate-pulse-ring" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">Camera access required</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Allow camera access for FocusTrack app to enable advanced focus analysis.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Video is processed locally. Frames never leave your device.
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onDeny}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 transition"
              >
                Block
              </button>
              <button
                onClick={onAllow}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-emerald transition hover:brightness-110"
              >
                Allow
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
