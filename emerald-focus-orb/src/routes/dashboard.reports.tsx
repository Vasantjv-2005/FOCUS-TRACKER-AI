import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

export const Route = createFileRoute("/dashboard/reports")({
  component: Reports,
});

const reports = [
  { kind: "Daily", title: "Today's focus report", date: "Jun 4, 2026", focus: 87, time: "3h 42m" },
  { kind: "Weekly", title: "Week 23 — deep work review", date: "May 29 – Jun 4", focus: 82, time: "21h 14m" },
  { kind: "Monthly", title: "May 2026 — productivity summary", date: "May 2026", focus: 79, time: "92h 08m" },
];

function Reports() {
  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.25em] text-accent">Reports</div>
        <h1 className="mt-1 font-display text-3xl font-semibold">Download your insights</h1>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass-panel relative overflow-hidden p-6"
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">{r.kind}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{r.title}</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Mini label="Avg focus" value={`${r.focus}%`} tone="emerald" />
                <Mini label="Study time" value={r.time} tone="gold" />
              </div>
              <div className="mt-6 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground glow-emerald hover:brightness-110">
                  <FileText className="h-3.5 w-3.5" /> PDF
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-2.5 text-xs font-semibold hover:bg-white/10">
                  <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-white/5 hover:bg-white/10">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone: "emerald" | "gold" }) {
  return (
    <div className="rounded-xl border border-border bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-lg ${tone === "emerald" ? "text-gradient-emerald" : "text-gradient-gold"}`}>{value}</div>
    </div>
  );
}
