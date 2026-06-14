import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  BarChart3,
  Bell,
  FileText,
  Gauge,
  Loader2,
  LogOut,
  Search,
  Settings,
  Target,
  Timer,
  User,
} from "lucide-react";
import { useEffect } from "react";
import { AuroraBackground } from "@/components/effects/AuroraBackground";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FocusTrack" }] }),
  component: DashboardLayout,
});

const nav: Array<{ to: string; label: string; icon: any; exact?: boolean }> = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge, exact: true },
  { to: "/dashboard/session", label: "Study Session", icon: Timer },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/reports", label: "Reports", icon: FileText },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: "/login" });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking your session…
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />

      <div className="relative z-10 mx-auto flex max-w-[1500px] gap-6 px-4 py-6 lg:px-6">
        {/* Sidebar */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 lg:block">
          <div className="glass-panel flex h-full flex-col p-4">
            <Link to="/" className="mb-6 flex items-center gap-2 px-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 glow-emerald">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display text-lg font-semibold">FocusTrack</span>
            </Link>

            <nav className="space-y-1">
              {nav.map((n) => {
                const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to as any}
                    className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition"
                  >
                    {active && (
                      <motion.span
                        layoutId="active-nav"
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className="absolute inset-0 rounded-xl bg-primary/15 ring-1 ring-primary/30 glow-emerald"
                      />
                    )}
                    <n.icon className={`relative h-4 w-4 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                    <span className={`relative ${active ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{n.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto">
              <div className="glass-card flex items-center gap-3 p-3">
                <img
                  src={user?.imageUrl || "https://images.clerk.dev/static/avatar-placeholder.png"}
                  alt={user?.fullName || "User avatar"}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{user?.fullName || user?.firstName || "Your account"}</div>
                  <div className="truncate text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || "Signed in"}</div>
                </div>
                <Link to="/" className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="glass-panel mb-6 flex items-center gap-3 px-4 py-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search sessions, reports…" className="w-full bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" />
              <kbd className="hidden rounded border border-border bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">⌘K</kbd>
            </div>
            <div className="hidden items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_theme(colors.primary)]" />
              Focus: High
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-white/5 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <img
              src={user?.imageUrl || "https://images.clerk.dev/static/avatar-placeholder.png"}
              alt={user?.fullName || "User avatar"}
              className="h-10 w-10 rounded-full object-cover"
            />
          </header>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
