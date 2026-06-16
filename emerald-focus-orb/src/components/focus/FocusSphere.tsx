import { motion } from "framer-motion";

export function FocusSphere({ score = 87, size = 280, progress }: { score?: number; size?: number; progress?: number }) {
  const r = size / 2 - 16;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;

  const rTimer = size / 2 - 6;
  const cTimer = 2 * Math.PI * rTimer;
  const dashTimer = progress !== undefined ? progress * cTimer : cTimer;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Orbiting rings */}
      <div className="absolute inset-0 rounded-full border border-[oklch(0.82_0.14_88/0.25)] animate-spin-slow" />
      <div
        className="absolute inset-4 rounded-full border border-dashed border-[oklch(0.7_0.17_158/0.35)] animate-spin-slow"
        style={{ animationDirection: "reverse", animationDuration: "30s" }}
      />
      {/* Glow */}
      <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.17_158/0.45),transparent_70%)] blur-2xl" />

      {/* Sphere */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative rounded-full"
        style={{
          width: size - 32,
          height: size - 32,
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), rgba(0,168,107,0.25) 35%, rgba(0,40,30,0.9) 70%, #050816 100%)",
          boxShadow:
            "inset -20px -30px 60px rgba(0,0,0,0.7), inset 10px 10px 40px rgba(255,255,255,0.08), 0 30px 80px -20px rgba(0,168,107,0.55)",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_75%,rgba(212,175,55,0.18),transparent_60%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-6xl font-semibold text-gradient-emerald">
            {score}
            <span className="text-2xl text-white/60">%</span>
          </span>
          <span className="mt-1 text-xs uppercase tracking-[0.3em] text-white/50">Focus</span>
        </div>
      </motion.div>

      {/* Progress arcs */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="focusArc" x1="0" x2="1">
            <stop offset="0%" stopColor="#00A86B" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient id="timerArc" x1="0" x2="1">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F5E6A8" />
          </linearGradient>
        </defs>
        
        {/* Focus Score Arc */}
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="2" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#focusArc)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />

        {/* Timer Countdown Arc */}
        {progress !== undefined && (
          <>
            <circle cx={size / 2} cy={size / 2} r={rTimer} stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none" />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={rTimer}
              stroke="url(#timerArc)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={cTimer}
              initial={{ strokeDashoffset: cTimer }}
              animate={{ strokeDashoffset: cTimer - dashTimer }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}

