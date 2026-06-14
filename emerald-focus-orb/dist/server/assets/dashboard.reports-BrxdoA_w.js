import { jsxs, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
const reports = [{
  kind: "Daily",
  title: "Today's focus report",
  date: "Jun 4, 2026",
  focus: 87,
  time: "3h 42m"
}, {
  kind: "Weekly",
  title: "Week 23 — deep work review",
  date: "May 29 – Jun 4",
  focus: 82,
  time: "21h 14m"
}, {
  kind: "Monthly",
  title: "May 2026 — productivity summary",
  date: "May 2026",
  focus: 79,
  time: "92h 08m"
}];
function Reports() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-accent", children: "Reports" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 font-display text-3xl font-semibold", children: "Download your insights" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3", children: reports.map((r, i) => /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      y: 16
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.05
    }, whileHover: {
      y: -4
    }, className: "glass-panel relative overflow-hidden p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-2xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent", children: r.kind }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: r.date })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 font-display text-lg font-semibold leading-snug", children: r.title }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(Mini, { label: "Avg focus", value: `${r.focus}%`, tone: "emerald" }),
          /* @__PURE__ */ jsx(Mini, { label: "Study time", value: r.time, tone: "gold" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-2", children: [
          /* @__PURE__ */ jsxs("button", { className: "inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground glow-emerald hover:brightness-110", children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
            " PDF"
          ] }),
          /* @__PURE__ */ jsxs("button", { className: "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-2.5 text-xs font-semibold hover:bg-white/10", children: [
            /* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-3.5 w-3.5" }),
            " CSV"
          ] }),
          /* @__PURE__ */ jsx("button", { className: "grid h-10 w-10 place-items-center rounded-xl border border-border bg-white/5 hover:bg-white/10", children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }, r.title)) })
  ] });
}
function Mini({
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-white/5 p-3", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: `mt-1 font-display text-lg ${tone === "emerald" ? "text-gradient-emerald" : "text-gradient-gold"}`, children: value })
  ] });
}
export {
  Reports as component
};
