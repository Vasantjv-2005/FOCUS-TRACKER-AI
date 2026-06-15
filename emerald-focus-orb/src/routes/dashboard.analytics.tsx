import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchSessionReport, fetchAllSessions } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/analytics")({
  component: Analytics,
});

const tooltipStyle = { background: "rgba(13,22,38,0.95)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, fontSize: 12 };

const tabs = [
  { id: "live", label: "Live backend report" },
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" }
] as const;

function Analytics() {
  const [report, setReport] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"live" | "day" | "week" | "month" | "year">("week");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const savedSessionId = localStorage.getItem("focusSessionId");
      if (savedSessionId) {
        const reportData = await fetchSessionReport(savedSessionId);
        setReport(reportData);
      } else {
        setReport(null);
      }
    } catch (error) {
      console.error("Failed to load active session report", error);
      setReport(null);
    }

    try {
      const sessionsData = await fetchAllSessions();
      setSessions(sessionsData.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getFilteredSessions = () => {
    const now = new Date();
    if (activeTab === "day") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      return sessions.filter((s) => new Date(s.startTime) >= todayStart);
    }
    if (activeTab === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return sessions.filter((s) => new Date(s.startTime) >= weekAgo);
    }
    if (activeTab === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return sessions.filter((s) => new Date(s.startTime) >= monthAgo);
    }
    if (activeTab === "year") {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      return sessions.filter((s) => new Date(s.startTime) >= yearAgo);
    }
    return [];
  };

  const filteredSessions = getFilteredSessions();

  // Metrics calculations
  let average = 0;
  let totalRecords = 0;
  let distractionCount = 0;
  let statusText = "Idle";

  if (activeTab === "live") {
    const hasActiveSession = !!localStorage.getItem("focusSessionId");
    average = report?.averageFocusScore ?? 0;
    totalRecords = report?.totalRecords ?? 0;
    distractionCount = report?.distractionCount ?? 0;
    statusText = hasActiveSession ? (report ? "Active" : "Loading") : "Idle";
  } else {
    totalRecords = filteredSessions.length;
    distractionCount = filteredSessions.reduce((sum, s) => sum + (s.totalDistractions || 0), 0);
    const completedSessions = filteredSessions.filter((s) => s.endTime && s.averageFocusScore > 0);
    if (completedSessions.length > 0) {
      const sumFocus = completedSessions.reduce((sum, s) => sum + (s.averageFocusScore || 0), 0);
      average = sumFocus / completedSessions.length;
    }
    statusText = totalRecords > 0 ? "Synced" : "Idle";
  }

  const getLiveChartData = () => {
    if (!report?.focusLogs || report.focusLogs.length === 0) return [];
    return report.focusLogs.map((log: any) => ({
      t: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      score: log.focusScore,
    }));
  };

  const getDayChartData = () => {
    const todaySessions = [...filteredSessions].reverse(); // oldest first
    return todaySessions.map((s, idx) => ({
      name: `Session #${idx + 1}`,
      score: Math.round(s.averageFocusScore || 0),
    }));
  };

  const getWeekChartData = () => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);

      const daySessions = sessions.filter((s) => {
        const t = new Date(s.startTime).getTime();
        return t >= d.getTime() && t < nextDay.getTime();
      });

      const completed = daySessions.filter((s) => s.endTime && s.averageFocusScore > 0);
      const avg = completed.length > 0
        ? Math.round(completed.reduce((sum, s) => sum + s.averageFocusScore, 0) / completed.length)
        : 0;

      data.push({
        day: d.toLocaleDateString([], { weekday: 'short' }),
        score: avg,
      });
    }
    return data;
  };

  const getMonthChartData = () => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);

      const daySessions = sessions.filter((s) => {
        const t = new Date(s.startTime).getTime();
        return t >= d.getTime() && t < nextDay.getTime();
      });

      const completed = daySessions.filter((s) => s.endTime && s.averageFocusScore > 0);
      const avg = completed.length > 0
        ? Math.round(completed.reduce((sum, s) => sum + s.averageFocusScore, 0) / completed.length)
        : 0;

      data.push({
        date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        score: avg,
      });
    }
    return data;
  };

  const getYearChartData = () => {
    const data = [];
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIdx = d.getMonth();

      const monthSessions = sessions.filter((s) => {
        const date = new Date(s.startTime);
        return date.getMonth() === monthIdx && date.getFullYear() === year;
      });

      const completed = monthSessions.filter((s) => s.endTime && s.averageFocusScore > 0);
      const avg = completed.length > 0
        ? Math.round(completed.reduce((sum, s) => sum + s.averageFocusScore, 0) / completed.length)
        : 0;

      data.push({
        month: monthNames[monthIdx],
        score: avg,
      });
    }
    return data;
  };

  const getDistributionData = () => {
    let deepWorkCount = 0;
    let practiceCount = 0;
    let reviewCount = 0;
    let breaksCount = 0;

    const list = activeTab === "live" 
      ? (report?.averageFocusScore ? [ { averageFocusScore: report.averageFocusScore } ] : [])
      : filteredSessions;

    list.forEach((s: any) => {
      const score = s.averageFocusScore || 0;
      if (score >= 85) deepWorkCount++;
      else if (score >= 70) practiceCount++;
      else if (score >= 50) reviewCount++;
      else breaksCount++;
    });

    const total = deepWorkCount + practiceCount + reviewCount + breaksCount;
    if (total === 0) {
      return [
        { name: "Deep work", value: 0, color: "#00A86B" },
        { name: "Review", value: 0, color: "#D4AF37" },
        { name: "Practice", value: 0, color: "#00695C" },
        { name: "Breaks", value: 0, color: "#B87333" },
      ];
    }

    return [
      { name: "Deep work", value: Math.round((deepWorkCount / total) * 100), color: "#00A86B" },
      { name: "Review", value: Math.round((reviewCount / total) * 100), color: "#D4AF37" },
      { name: "Practice", value: Math.round((practiceCount / total) * 100), color: "#00695C" },
      { name: "Breaks", value: Math.round((breaksCount / total) * 100), color: "#B87333" },
    ];
  };

  const renderTrendChart = () => {
    if (activeTab === "live") {
      const data = getLiveChartData();
      if (data.length === 0) {
        return (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No live tracking session currently running.
          </div>
        );
      }
      return (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="t" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="score" stroke="#00A86B" strokeWidth={2.5} dot={{ fill: "#D4AF37", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (activeTab === "day") {
      const data = getDayChartData();
      if (data.length === 0) {
        return (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No study sessions recorded today.
          </div>
        );
      }
      return (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="score" stroke="#00A86B" strokeWidth={2.5} dot={{ fill: "#D4AF37", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (activeTab === "week") {
      const data = getWeekChartData();
      const hasData = data.some(d => d.score > 0);
      if (!hasData) {
        return (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No study sessions recorded in the last 7 days.
          </div>
        );
      }
      return (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="weekBar" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#00A86B" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="score" fill="url(#weekBar)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (activeTab === "month") {
      const data = getMonthChartData();
      const hasData = data.some(d => d.score > 0);
      if (!hasData) {
        return (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No study sessions recorded in the last 30 days.
          </div>
        );
      }
      return (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(val, i) => i % 5 === 0 ? val : ""} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="score" stroke="#D4AF37" strokeWidth={2.5} dot={{ fill: "#00A86B", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (activeTab === "year") {
      const data = getYearChartData();
      const hasData = data.some(d => d.score > 0);
      if (!hasData) {
        return (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No study sessions recorded in the last 12 months.
          </div>
        );
      }
      return (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="score" stroke="#00A86B" strokeWidth={2.5} dot={{ fill: "#D4AF37", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const distributionData = getDistributionData();
  const hasDistributionData = distributionData.some(d => d.value > 0);

  const getTrendTitle = () => {
    switch (activeTab) {
      case "live": return "Live session timeline";
      case "day": return "Today's focus trend";
      case "week": return "Weekly performance";
      case "month": return "Monthly improvement";
      case "year": return "Yearly focus trend";
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-accent">Analytics</div>
          <h1 className="mt-1 font-display text-3xl font-semibold">Performance overview</h1>
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-white/5 p-1 text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="flex h-96 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard label="Avg focus" value={`${average.toFixed(1)}%`} tone="emerald" />
            <MetricCard label="Records" value={`${totalRecords}`} tone="gold" />
            <MetricCard label="Distractions" value={`${distractionCount}`} tone="emerald" />
            <MetricCard label="Status" value={statusText} tone="gold" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title={getTrendTitle()}>
              {renderTrendChart()}
            </ChartCard>

            <ChartCard title="Study time distribution">
              {hasDistributionData ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={distributionData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
                      {distributionData.map((d) => <Cell key={d.name} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                  No distribution data available for this timeframe.
                </div>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

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
