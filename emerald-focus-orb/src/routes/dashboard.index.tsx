import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Brain, Clock, Eye, EyeOff, TrendingUp, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { saveFocusSnapshot } from "@/lib/api";
import { CameraPermissionDialog } from "@/components/camera/CameraPermissionDialog";
import { LiveCameraFeed } from "@/components/camera/LiveCameraFeed";
import { FocusSphere } from "@/components/focus/FocusSphere";
import { useCamera } from "@/hooks/useCamera";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { stream, request } = useCamera();
  const [askPermission, setAskPermission] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [focusScore, setFocusScore] = useState(87);
  const [sessionId, setSessionId] = useState<string | null>(null);
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
        lookingAway: score < 60,
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
  }, [tracking, sessionId, focusScore]);

  const handleStopTracking = async () => {
    setTracking(false);
    if (!sessionId) return;
    await saveSnapshot();
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
        <StatCard icon={Activity} label="Current Focus" value={`${focusScore}%`} delta="+4.2%" tone="emerald" />
        <StatCard icon={Clock} label="Today's Study" value="3h 42m" delta="+38m" tone="gold" />
        <StatCard icon={TrendingUp} label="Weekly Avg" value="82%" delta="+6%" tone="emerald" />
        <StatCard icon={Brain} label="Total Sessions" value="148" delta="+12" tone="gold" />
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
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                {tracking ? "Tracking" : "Idle"}
              </span>
            </div>

            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
              <div className="flex justify-center">
                <FocusSphere score={focusScore} size={260} />
              </div>
              <LiveCameraFeed
                stream={stream}
                focusScore={focusScore}
                tracking={tracking}
                onTrack={() => setTracking((t) => !t)}
                onStop={handleStopTracking}
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
            <h3 className="font-display text-lg font-semibold">Distraction analysis</h3>
            <p className="mt-1 text-xs text-muted-foreground">Today's session</p>
            <div className="mt-5 space-y-3">
              <DistRow icon={EyeOff} label="Looking away" value="12" hint="-3 vs yesterday" />
              <DistRow icon={Clock} label="Idle time" value="6m 18s" hint="2 short pauses" />
              <DistRow icon={Eye} label="Attention drops" value="4" hint="Mostly mid-session" />
              <DistRow icon={Zap} label="Flow moments" value="3" hint="20–35 min each" tone="emerald" />
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
}: { icon: any; label: string; value: string; delta: string; tone: "emerald" | "gold" }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card group relative overflow-hidden p-5">
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${tone === "emerald" ? "bg-primary/25" : "bg-accent/25"} opacity-0 blur-2xl transition group-hover:opacity-100`} />
      <div className="relative flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone === "emerald" ? "bg-primary/10 text-primary glow-emerald" : "bg-accent/10 text-accent glow-gold"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs text-primary">{delta}</span>
      </div>
      <div className="relative mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`relative mt-1 font-display text-3xl font-semibold ${tone === "emerald" ? "text-gradient-emerald" : "text-gradient-gold"}`}>{value}</div>
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
