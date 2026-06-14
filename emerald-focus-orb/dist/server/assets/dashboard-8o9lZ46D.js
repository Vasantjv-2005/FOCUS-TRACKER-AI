import { jsxs, jsx } from "react/jsx-runtime";
import { useRouterState, useNavigate, Link, Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader2, Target, Gauge, Timer, BarChart3, FileText, User, Settings, LogOut, Search, Bell } from "lucide-react";
import { useEffect } from "react";
import { A as AuroraBackground } from "./AuroraBackground-xoL8dbCa.js";
const nav = [{
  to: "/dashboard",
  label: "Dashboard",
  icon: Gauge,
  exact: true
}, {
  to: "/dashboard/session",
  label: "Study Session",
  icon: Timer
}, {
  to: "/dashboard/analytics",
  label: "Analytics",
  icon: BarChart3
}, {
  to: "/dashboard/reports",
  label: "Reports",
  icon: FileText
}, {
  to: "/dashboard/profile",
  label: "Profile",
  icon: User
}, {
  to: "/dashboard/settings",
  label: "Settings",
  icon: Settings
}];
function DashboardLayout() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const navigate = useNavigate();
  const {
    isLoaded,
    isSignedIn
  } = useAuth();
  const {
    user
  } = useUser();
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({
        to: "/login"
      });
    }
  }, [isLoaded, isSignedIn, navigate]);
  if (!isLoaded) {
    return /* @__PURE__ */ jsxs("div", { className: "grid min-h-screen place-items-center text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
      "Checking your session…"
    ] });
  }
  if (!isSignedIn) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen", children: [
    /* @__PURE__ */ jsx(AuroraBackground, {}),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto flex max-w-[1500px] gap-6 px-4 py-6 lg:px-6", children: [
      /* @__PURE__ */ jsx("aside", { className: "sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 lg:block", children: /* @__PURE__ */ jsxs("div", { className: "glass-panel flex h-full flex-col p-4", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "mb-6 flex items-center gap-2 px-2", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-primary/15 glow-emerald", children: /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsx("span", { className: "font-display text-lg font-semibold", children: "FocusTrack" })
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: nav.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          return /* @__PURE__ */ jsxs(Link, { to: n.to, className: "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition", children: [
            active && /* @__PURE__ */ jsx(motion.span, { layoutId: "active-nav", transition: {
              type: "spring",
              stiffness: 300,
              damping: 28
            }, className: "absolute inset-0 rounded-xl bg-primary/15 ring-1 ring-primary/30 glow-emerald" }),
            /* @__PURE__ */ jsx(n.icon, { className: `relative h-4 w-4 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}` }),
            /* @__PURE__ */ jsx("span", { className: `relative ${active ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"}`, children: n.label })
          ] }, n.to);
        }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "glass-card flex items-center gap-3 p-3", children: [
          /* @__PURE__ */ jsx("img", { src: user?.imageUrl || "https://images.clerk.dev/static/avatar-placeholder.png", alt: user?.fullName || "User avatar", className: "h-9 w-9 rounded-full object-cover" }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-medium", children: user?.fullName || user?.firstName || "Your account" }),
            /* @__PURE__ */ jsx("div", { className: "truncate text-xs text-muted-foreground", children: user?.primaryEmailAddress?.emailAddress || "Signed in" })
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/", className: "ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground", children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("header", { className: "glass-panel mb-6 flex items-center gap-3 px-4 py-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-2", children: [
            /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { placeholder: "Search sessions, reports…", className: "w-full bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" }),
            /* @__PURE__ */ jsx("kbd", { className: "hidden rounded border border-border bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline", children: "⌘K" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary md:flex", children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_theme(colors.primary)]" }),
            "Focus: High"
          ] }),
          /* @__PURE__ */ jsx("button", { className: "grid h-10 w-10 place-items-center rounded-xl border border-border bg-white/5 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("img", { src: user?.imageUrl || "https://images.clerk.dev/static/avatar-placeholder.png", alt: user?.fullName || "User avatar", className: "h-10 w-10 rounded-full object-cover" })
        ] }),
        /* @__PURE__ */ jsx(Outlet, {})
      ] })
    ] })
  ] });
}
export {
  DashboardLayout as component
};
