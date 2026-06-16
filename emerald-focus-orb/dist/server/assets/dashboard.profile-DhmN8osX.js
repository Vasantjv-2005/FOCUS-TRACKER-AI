import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Pencil, Mail, MapPin, Trophy } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { f as fetchDashboardStats } from "./api-CERjnBmU.js";
function Profile() {
  const {
    user
  } = useUser();
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data.stats);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    loadStats();
  }, []);
  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "U";
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "glass-panel relative overflow-hidden p-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/30 to-transparent" }),
      user?.imageUrl ? /* @__PURE__ */ jsx("img", { src: user.imageUrl, alt: user.fullName || "Avatar", className: "relative mx-auto mt-6 h-24 w-24 rounded-full object-cover border border-primary/20 glow-emerald" }) : /* @__PURE__ */ jsx("div", { className: "relative mx-auto mt-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-semibold text-primary-foreground glow-emerald", children: initials }),
      /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-xl font-semibold", children: user?.fullName || "Your account" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Focus Tracker User" }),
      /* @__PURE__ */ jsxs(Link, { to: "/dashboard/settings", className: "mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-4 py-2 text-xs hover:bg-white/10", children: [
        /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }),
        " Edit profile"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-2 text-left text-sm", children: [
        /* @__PURE__ */ jsx(Row, { icon: Mail, label: user?.primaryEmailAddress?.emailAddress || "No email listed" }),
        /* @__PURE__ */ jsx(Row, { icon: MapPin, label: "Online" }),
        /* @__PURE__ */ jsx(Row, { icon: Trophy, label: "Tier: Bronze Focus" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 lg:col-span-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold", children: "Focus statistics" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 grid grid-cols-2 gap-4 md:grid-cols-4", children: [
          /* @__PURE__ */ jsx(Stat, { value: stats?.totalStudy || "0h 0m", label: "Total study", tone: "emerald" }),
          /* @__PURE__ */ jsx(Stat, { value: `${stats?.weeklyAvg || 0}%`, label: "Avg focus", tone: "gold" }),
          /* @__PURE__ */ jsx(Stat, { value: `${stats?.totalSessions || 0}`, label: "Sessions", tone: "emerald" }),
          /* @__PURE__ */ jsx(Stat, { value: stats?.totalSessions > 0 ? "Active" : "None", label: "Status", tone: "gold" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold", children: "Recent achievements" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: ["7-day streak unlocked", "First 95%+ session", "10h deep work in a day", "Distraction-free hour"].map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-white/5 p-3 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent", children: /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4" }) }),
          a
        ] }, a)) })
      ] })
    ] })
  ] });
}
function Row({
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-white/5 px-3 py-2.5", children: [
    /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-accent" }),
    /* @__PURE__ */ jsx("span", { className: "text-foreground", children: label })
  ] });
}
function Stat({
  value,
  label,
  tone
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-white/5 p-4 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: `font-display text-2xl ${tone === "emerald" ? "text-gradient-emerald" : "text-gradient-gold"}`, children: value }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: label })
  ] });
}
export {
  Profile as component
};
