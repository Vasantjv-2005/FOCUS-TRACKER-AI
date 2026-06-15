import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, FileText, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAllSessions, fetchSessionReport, SessionRecord } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/reports")({
  component: Reports,
});

function Reports() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const downloadCSV = async (session: SessionRecord) => {
    try {
      const data = await fetchSessionReport(session._id);
      if (!data.focusLogs || data.focusLogs.length === 0) {
        toast.error("No log data available for this session");
        return;
      }
      const headers = ["Timestamp", "Focus Score", "Looking Away"];
      const rows = data.focusLogs.map(log => [
        new Date(log.createdAt).toISOString(),
        log.focusScore,
        log.lookingAway
      ]);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `focus_report_${session._id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV report downloaded!");
    } catch (err) {
      console.error("CSV Download failed", err);
      toast.error("CSV Download failed");
    }
  };

  const downloadPDF = async (session: SessionRecord) => {
    try {
      const data = await fetchSessionReport(session._id);
      if (!data.focusLogs || data.focusLogs.length === 0) {
        toast.error("No log data available for this session");
        return;
      }

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Popup blocked! Please allow popups to download PDF.");
        return;
      }

      const startTimeStr = new Date(session.startTime).toLocaleString();
      const endTimeStr = session.endTime ? new Date(session.endTime).toLocaleString() : "Active Session";

      let logsHtml = data.focusLogs.map(log => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(log.createdAt).toLocaleTimeString()}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; font-weight: bold; color: ${log.focusScore >= 80 ? '#00A86B' : log.focusScore >= 60 ? '#D4AF37' : '#DC2626'}">${log.focusScore}%</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${log.lookingAway ? "⚠️ Yes" : "✅ No"}</td>
        </tr>
      `).join("");

      printWindow.document.write(`
        <html>
          <head>
            <title>Focus Report - ${session._id}</title>
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
                <div class="meta-label">Session ID</div>
                <div class="meta-value">${session._id}</div>
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
                <div class="meta-value" style="color: #00A86B; font-size: 18px;">${Math.round(data.averageFocusScore)}%</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Distractions Count</div>
                <div class="meta-value">${data.distractionCount}</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th style="text-align: center;">Focus Score</th>
                  <th style="text-align: center;">Looking Away</th>
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

  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.25em] text-accent">Reports</div>
        <h1 className="mt-1 font-display text-3xl font-semibold">Download your insights</h1>
      </header>

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
            const durationMs = s.endTime ? new Date(s.endTime).getTime() - new Date(s.startTime).getTime() : 0;
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const durationStr = s.endTime ? `${hours}h ${minutes}m` : "Active";

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
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">
                      {s.endTime ? "Completed" : "Active"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {dateStr}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug truncate">
                    Session {s._id.slice(-6)}
                  </h3>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Mini label="Avg focus" value={s.averageFocusScore ? `${s.averageFocusScore}%` : "--"} tone="emerald" />
                    <Mini label="Study time" value={durationStr} tone="gold" />
                  </div>
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => downloadPDF(s)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground glow-emerald hover:brightness-110"
                    >
                      <FileText className="h-3.5 w-3.5" /> PDF
                    </button>
                    <button
                      onClick={() => downloadCSV(s)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-2.5 text-xs font-semibold hover:bg-white/10"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
                    </button>
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

function Mini({ label, value, tone }: { label: string; value: string; tone: "emerald" | "gold" }) {
  return (
    <div className="rounded-xl border border-border bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-lg ${tone === "emerald" ? "text-gradient-emerald" : "text-gradient-gold"}`}>{value}</div>
    </div>
  );
}
