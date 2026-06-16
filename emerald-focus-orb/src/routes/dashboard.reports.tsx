import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Calendar, Loader2, Brain, Clock, ShieldAlert, Award, PlayCircle, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAllSessions, fetchSessionReport, SessionRecord, endSessionApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/reports")({
  component: Reports,
});

function Reports() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stoppingId, setStoppingId] = useState<string | null>(null);
  const [timeNow, setTimeNow] = useState(Date.now());

  const loadSessions = async () => {
    try {
      const data = await fetchAllSessions();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions for report", error);
      toast.error("Failed to load study sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStopTrackingInReports = async (sessionId: string) => {
    setStoppingId(sessionId);
    try {
      await endSessionApi(sessionId);
      if (localStorage.getItem("focusSessionId") === sessionId) {
        localStorage.removeItem("focusSessionId");
      }
      toast.success("Tracking stopped and session completed!");
      await loadSessions();
    } catch (err: any) {
      console.error("Failed to stop tracking", err);
      toast.error(err.message || "Failed to stop tracking");
    } finally {
      setStoppingId(null);
    }
  };

  const downloadPDF = async (session: SessionRecord) => {
    try {
      const data = await fetchSessionReport(session._id);
      
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Popup blocked! Please allow popups to download PDF.");
        return;
      }

      const startTimeStr = new Date(session.startTime).toLocaleString();
      const endTimeStr = session.endTime ? new Date(session.endTime).toLocaleString() : "Active Session";

      const logsHtml = data.focusLogs && data.focusLogs.length > 0
        ? data.focusLogs.map(log => {
            let statusText = "✅ Focused";
            if (log.faceDetected === false) {
              statusText = "❌ Stepped Away";
            } else if (log.lookingAway === true) {
              statusText = "⚠️ Distracted";
            }
            return `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(log.createdAt).toLocaleTimeString()}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; font-weight: bold; color: ${log.focusScore >= 80 ? '#00A86B' : log.focusScore >= 60 ? '#D4AF37' : '#DC2626'}">${log.focusScore}%</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${statusText}</td>
              </tr>
            `;
          }).join("")
        : `<tr><td colspan="3" style="padding: 20px; text-align: center; color: #64748b;">No eye-tracking data captured during this session.</td></tr>`;

      printWindow.document.write(`
        <html>
          <head>
            <title>Focus Report - Session #${sessions.length - sessions.findIndex(s => s._id === session._id)}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
              .header { border-bottom: 3px solid #00A86B; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
              h1 { color: #0f172a; margin: 0; font-size: 28px; }
              .logo { font-size: 20px; font-weight: bold; color: #00A86B; }
              .meta-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
              .meta-item { font-size: 14px; }
              .meta-label { color: #64748b; text-transform: uppercase; font-size: 11px; tracking-wider; font-weight: 600; margin-bottom: 4px; }
              .meta-value { font-weight: 600; color: #0f172a; }
              table { width: 100%; border-collapse: collapse; margin-top: 30px; }
              th { background-color: #f1f5f9; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #475569; font-weight: 600; border-bottom: 2px solid #cbd5e1; }
              tr:hover { background-color: #f8fafc; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Focus Session Report</h1>
              <div class="logo">FocusTrack AI</div>
            </div>
            <div class="meta-grid">
              <div class="meta-item">
                <div class="meta-label">Session Name</div>
                <div class="meta-value">Session #${sessions.length - sessions.findIndex(s => s._id === session._id)} (${session._id.slice(-6)})</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Date</div>
                <div class="meta-value">${new Date(session.startTime).toLocaleDateString()}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Start Time</div>
                <div class="meta-value">${startTimeStr}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">End Time</div>
                <div class="meta-value">${endTimeStr}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Average Focus</div>
                <div class="meta-value" style="color: #00A86B; font-size: 18px;">${Math.round(data.averageFocusScore || 0)}%</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Distractions Count</div>
                <div class="meta-value">${data.distractionCount || 0}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th style="text-align: center;">Focus Score</th>
                  <th style="text-align: center;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${logsHtml}
              </tbody>
            </table>
            <div class="footer">
              Generated by FocusTrack AI. All rights reserved.
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("PDF print window opened");
    } catch (err) {
      console.error("PDF Download failed", err);
      toast.error("PDF Download failed");
    }
  };

  // Stats summary banner calculations
  const totalSessions = sessions.length;
  const activeSessionsCount = sessions.filter(s => !s.endTime).length;
  const completed = sessions.filter(s => s.endTime && s.averageFocusScore && s.averageFocusScore > 0);
  const avgFocus = completed.length > 0
    ? Math.round(completed.reduce((sum, s) => sum + (s.averageFocusScore || 0), 0) / completed.length)
    : 0;

  const totalMs = completed.reduce((sum, s) => {
    if (s.endTime) {
      return sum + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime());
    }
    return sum;
  }, 0);
  const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
  const totalMins = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const totalStudyTimeStr = `${totalHours}h ${totalMins}m`;

  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.25em] text-accent">Reports</div>
        <h1 className="mt-1 font-display text-3xl font-semibold">Download your insights</h1>
      </header>

      {/* Stats summary banner */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Study Time</span>
            <Clock className="h-4 w-4 text-accent" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-gradient-gold">{totalStudyTimeStr}</div>
        </div>
        <div className="glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Average Focus</span>
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-gradient-emerald">{avgFocus}%</div>
        </div>
        <div className="glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Sessions</span>
            <BarChart2 className="h-4 w-4 text-accent" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-white/90">{totalSessions}</div>
        </div>
        <div className="glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Sessions</span>
            <PlayCircle className="h-4 w-4 text-rose-400 animate-pulse" />
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-gradient-rose">{activeSessionsCount}</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Loading sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-panel p-8 text-center text-muted-foreground">
          No focus sessions recorded yet. Start a study session to generate reports!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s, i) => {
            const dateStr = new Date(s.startTime).toLocaleDateString();
            const durationMs = s.endTime
              ? new Date(s.endTime).getTime() - new Date(s.startTime).getTime()
              : timeNow - new Date(s.startTime).getTime();
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
            const durationStr = s.endTime
              ? `${hours}h ${minutes}m`
              : `${hours}h ${minutes}m ${seconds}s`;

            const showAvgFocus = s.averageFocusScore !== undefined && s.averageFocusScore !== null && (s.averageFocusScore > 0 || s.endTime);

            return (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-panel relative overflow-hidden p-6"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${
                      s.endTime
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-danger/30 bg-danger/10 text-danger animate-pulse"
                    }`}>
                      {!s.endTime && <span className="h-1.5 w-1.5 rounded-full bg-danger animate-ping" />}
                      {s.endTime ? "Completed" : "Active"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {dateStr}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug truncate">
                    Session #{sessions.length - i} ({s._id.slice(-6)})
                  </h3>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <Mini label="Avg focus" value={showAvgFocus ? `${Math.round(s.averageFocusScore || 0)}%` : "--"} tone="emerald" icon={Brain} />
                    <Mini label="Study time" value={durationStr} tone="gold" icon={Clock} />
                    <Mini label="Distractions" value={`${s.totalDistractions || 0}`} tone="rose" icon={ShieldAlert} />
                  </div>
                  <div className="mt-6 flex gap-2">
                    {s.endTime ? (
                      <button
                        onClick={() => downloadPDF(s)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground glow-emerald hover:brightness-110"
                      >
                        <FileText className="h-3.5 w-3.5" /> PDF
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStopTrackingInReports(s._id)}
                        disabled={stoppingId === s._id}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-800/50 disabled:cursor-not-allowed px-3 py-2.5 text-xs font-semibold text-white glow-red hover:brightness-110 transition-all"
                      >
                        {stoppingId === s._id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Stopping...
                          </>
                        ) : (
                          <>
                            Stop Tracking
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Mini({ label, value, tone, icon: Icon }: { label: string; value: string; tone: "emerald" | "gold" | "rose"; icon?: any }) {
  return (
    <div className="rounded-xl border border-border bg-white/5 p-2 flex flex-col justify-between min-h-[64px]">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-muted-foreground gap-1">
        <span className="truncate">{label}</span>
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-60" />}
      </div>
      <div className={`mt-1.5 font-display text-sm font-semibold truncate ${
        tone === "emerald"
          ? "text-gradient-emerald"
          : tone === "gold"
            ? "text-gradient-gold"
            : "text-gradient-rose"
      }`}>{value}</div>
    </div>
  );
}


