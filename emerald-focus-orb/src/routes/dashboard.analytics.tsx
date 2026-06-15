import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchSessionReport, fetchAnalyticsData, fetchDashboardStats } from "@/lib/api";

export const Route = createFileRoute("/dashboard/analytics")({
  component: Analytics,
});

function Analytics() {
  const [report, setReport] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const savedSessionId = localStorage.getItem("focusSessionId");
        if (savedSessionId) {
          const data = await fetchSessionReport(savedSessionId);
          setReport(data);
        } else {
          const statsData = await fetchDashboardStats();
          setStats(statsData.stats);
        }
      } catch (error) {
        console.error("Failed to load report or stats", error);
      }

      try {
        const data = await fetchAnalyticsData();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const daily = analytics?.daily || [];
  const weekly = analytics?.weekly || [];
  const monthly = analytics?.monthly || [];
  const distribution = analytics?.distribution || [];

  const average = report?.averageFocusScore ?? stats?.weeklyAvg ?? (analytics?.daily?.[analytics?.daily?.length - 1]?.score ?? 0);
  const distractionCount = report?.distractionCount ?? stats?.distractions?.lookingAway ?? 0;
  const totalRecords = report?.totalRecords ?? stats?.totalSessions ?? 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-accent">Analytics</div>
          <h1 className="mt-1 font-display text-3xl font-semibold">Performance overview</h1>
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-white/5 p-1 text-xs">
          <span className="rounded-lg bg-primary/15 px-3 py-1.5 text-primary">Live backend report</span>
          {["Day", "Week", "Month", "Year"].map((t, i) => (
            <button key={t} className={`rounded-lg px-3 py-1.5 ${i === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Avg focus" value={`${average.toFixed(1)}%`} tone="emerald" />
        <MetricCard label="Records" value={`${totalRecords}`} tone="gold" />
        <MetricCard label="Distractions" value={`${distractionCount}`} tone="emerald" />
        <MetricCard label="Status" value={report ? "Synced" : "Loading"} tone="gold" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Daily focus trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={daily}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke="#00A86B" strokeWidth={2.5} dot={{ fill: "#D4AF37", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly performance">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekly}>
              <defs>
                <linearGradient id="weekBar" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#00A86B" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="w" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="score" fill="url(#weekBar)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly improvement">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="m" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke="#D4AF37" strokeWidth={2.5} dot={{ fill: "#00A86B", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Study time distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={distribution} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
                {distribution.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

const tooltipStyle = { background: "rgba(13,22,38,0.95)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, fontSize: 12 };

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "emerald" | "gold" }) {
  return (
    <div className="glass-card p-4">
      <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-2xl font-semibold ${tone === "emerald" ? "text-gradient-emerald" : "text-gradient-gold"}`}>{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel p-5">
      <h3 className="mb-3 font-display text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}
