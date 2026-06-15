import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Pencil, Trophy } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/lib/api";

export const Route = createFileRoute("/dashboard/profile")({
  component: Profile,
});

function Profile() {
  const { user } = useUser();
  const [stats, setStats] = useState<any>(null);

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

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="glass-panel relative overflow-hidden p-6 text-center">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/30 to-transparent" />
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName || "Avatar"}
            className="relative mx-auto mt-6 h-24 w-24 rounded-full object-cover border border-primary/20 glow-emerald"
          />
        ) : (
          <div className="relative mx-auto mt-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-semibold text-primary-foreground glow-emerald">
            {initials}
          </div>
        )}
        <h2 className="mt-4 font-display text-xl font-semibold">{user?.fullName || "Your account"}</h2>
        <p className="text-sm text-muted-foreground">Focus Tracker User</p>
        <Link to="/dashboard/settings" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-4 py-2 text-xs hover:bg-white/10">
          <Pencil className="h-3.5 w-3.5" /> Edit profile
        </Link>
        <div className="mt-6 space-y-2 text-left text-sm">
          <Row icon={Mail} label={user?.primaryEmailAddress?.emailAddress || "No email listed"} />
          <Row icon={MapPin} label="Online" />
          <Row icon={Trophy} label="Tier: Bronze Focus" />
        </div>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <div className="glass-panel p-6">
          <h3 className="font-display text-lg font-semibold">Focus statistics</h3>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat value={stats?.totalStudy || "0h 0m"} label="Total study" tone="emerald" />
            <Stat value={`${stats?.weeklyAvg || 0}%`} label="Avg focus" tone="gold" />
            <Stat value={`${stats?.totalSessions || 0}`} label="Sessions" tone="emerald" />
            <Stat value={stats?.totalSessions > 0 ? "Active" : "None"} label="Status" tone="gold" />
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-display text-lg font-semibold">Recent achievements</h3>
          <div className="mt-4 space-y-2">
            {["7-day streak unlocked", "First 95%+ session", "10h deep work in a day", "Distraction-free hour"].map((a) => (
              <div key={a} className="flex items-center gap-3 rounded-xl border border-border bg-white/5 p-3 text-sm">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent"><Trophy className="h-4 w-4" /></span>
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white/5 px-3 py-2.5">
      <Icon className="h-4 w-4 text-accent" />
      <span className="text-foreground">{label}</span>
    </div>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone: "emerald" | "gold" }) {
  return (
    <div className="rounded-2xl border border-border bg-white/5 p-4 text-center">
      <div className={`font-display text-2xl ${tone === "emerald" ? "text-gradient-emerald" : "text-gradient-gold"}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
