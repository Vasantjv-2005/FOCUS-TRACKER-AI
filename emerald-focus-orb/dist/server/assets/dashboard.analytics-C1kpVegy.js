import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { f as fetchSessionReport } from "./api-DG4i5KnB.js";
const daily = Array.from({
  length: 14
}, (_, i) => ({
  day: `D${i + 1}`,
  score: 55 + Math.round(Math.random() * 40)
}));
const weekly = [{
  w: "W1",
  score: 68
}, {
  w: "W2",
  score: 74
}, {
  w: "W3",
  score: 79
}, {
  w: "W4",
  score: 82
}, {
  w: "W5",
  score: 88
}];
const monthly = Array.from({
  length: 6
}, (_, i) => ({
  m: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
  score: 60 + i * 5 + Math.random() * 5
}));
const distribution = [{
  name: "Deep work",
  value: 42,
  color: "#00A86B"
}, {
  name: "Review",
  value: 24,
  color: "#D4AF37"
}, {
  name: "Practice",
  value: 20,
  color: "#00695C"
}, {
  name: "Breaks",
  value: 14,
  color: "#B87333"
}];
function Analytics() {
  const [report, setReport] = useState(null);
  useEffect(() => {
    const load = async () => {
      const savedSessionId = localStorage.getItem("focusSessionId");
      if (!savedSessionId) {
        setReport(null);
        return;
      }
      try {
        const data = await fetchSessionReport(savedSessionId);
        setReport(data);
      } catch (error) {
        console.error("Failed to load report", error);
      }
    };
    load();
  }, []);
  const average = report?.averageFocusScore ?? 0;
  const distractionCount = report?.distractionCount ?? 0;
  const totalRecords = report?.totalRecords ?? 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-accent", children: "Analytics" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 font-display text-3xl font-semibold", children: "Performance overview" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1 rounded-xl border border-border bg-white/5 p-1 text-xs", children: [
        /* @__PURE__ */ jsx("span", { className: "rounded-lg bg-primary/15 px-3 py-1.5 text-primary", children: "Live backend report" }),
        ["Day", "Week", "Month", "Year"].map((t, i) => /* @__PURE__ */ jsx("button", { className: `rounded-lg px-3 py-1.5 ${i === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`, children: t }, t))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(MetricCard, { label: "Avg focus", value: `${average.toFixed(1)}%`, tone: "emerald" }),
      /* @__PURE__ */ jsx(MetricCard, { label: "Records", value: `${totalRecords}`, tone: "gold" }),
      /* @__PURE__ */ jsx(MetricCard, { label: "Distractions", value: `${distractionCount}`, tone: "emerald" }),
      /* @__PURE__ */ jsx(MetricCard, { label: "Status", value: report ? "Synced" : "Loading", tone: "gold" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsx(ChartCard, { title: "Daily focus trend", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxs(LineChart, { data: daily, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.06)", vertical: false }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "day", stroke: "rgba(255,255,255,0.4)", fontSize: 11, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "rgba(255,255,255,0.4)", fontSize: 11, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle }),
        /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "score", stroke: "#00A86B", strokeWidth: 2.5, dot: {
          fill: "#D4AF37",
          r: 3
        } })
      ] }) }) }),
      /* @__PURE__ */ jsx(ChartCard, { title: "Weekly performance", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxs(BarChart, { data: weekly, children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "weekBar", x1: "0", x2: "0", y1: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#D4AF37" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#00A86B" })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.06)", vertical: false }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "w", stroke: "rgba(255,255,255,0.4)", fontSize: 11, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "rgba(255,255,255,0.4)", fontSize: 11, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle, cursor: {
          fill: "rgba(255,255,255,0.04)"
        } }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "score", fill: "url(#weekBar)", radius: [8, 8, 0, 0] })
      ] }) }) }),
      /* @__PURE__ */ jsx(ChartCard, { title: "Monthly improvement", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxs(LineChart, { data: monthly, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(255,255,255,0.06)", vertical: false }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "m", stroke: "rgba(255,255,255,0.4)", fontSize: 11, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsx(YAxis, { stroke: "rgba(255,255,255,0.4)", fontSize: 11, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle }),
        /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "score", stroke: "#D4AF37", strokeWidth: 2.5, dot: {
          fill: "#00A86B",
          r: 3
        } })
      ] }) }) }),
      /* @__PURE__ */ jsx(ChartCard, { title: "Study time distribution", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxs(PieChart, { children: [
        /* @__PURE__ */ jsx(Pie, { data: distribution, dataKey: "value", innerRadius: 60, outerRadius: 90, paddingAngle: 3, stroke: "none", children: distribution.map((d) => /* @__PURE__ */ jsx(Cell, { fill: d.color }, d.name)) }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: tooltipStyle }),
        /* @__PURE__ */ jsx(Legend, { wrapperStyle: {
          fontSize: 12,
          color: "#94A3B8"
        } })
      ] }) }) })
    ] })
  ] });
}
const tooltipStyle = {
  background: "rgba(13,22,38,0.95)",
  border: "1px solid rgba(212,175,55,0.25)",
  borderRadius: 12,
  fontSize: 12
};
function MetricCard({
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxs("div", { className: "glass-card p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: `mt-2 font-display text-2xl font-semibold ${tone === "emerald" ? "text-gradient-emerald" : "text-gradient-gold"}`, children: value })
  ] });
}
function ChartCard({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "glass-panel p-5", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-3 font-display text-lg font-semibold", children: title }),
    children
  ] });
}
export {
  Analytics as component
};
