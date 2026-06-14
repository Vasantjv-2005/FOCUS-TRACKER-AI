import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.25em] text-accent">Settings</div>
        <h1 className="mt-1 font-display text-3xl font-semibold">Preferences</h1>
      </header>

      <Section title="Appearance">
        <Row label="Theme" hint="Midnight Emerald Luxury">
          <div className="flex gap-2">
            {["Midnight", "Aurora", "Obsidian"].map((t, i) => (
              <button key={t} className={`rounded-lg border px-3 py-1.5 text-xs ${i === 0 ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-white/5 text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
        </Row>
      </Section>

      <Section title="Notifications">
        <Toggle label="Session reminders" hint="Get nudged before scheduled focus time" defaultOn />
        <Toggle label="Weekly summary email" hint="Every Monday morning" defaultOn />
        <Toggle label="Distraction alerts" hint="Subtle ping when attention drops" />
      </Section>

      <Section title="Webcam">
        <Toggle label="Enable face detection" hint="Required for focus scoring" defaultOn />
        <Toggle label="Eye tracking" hint="Higher fidelity attention analytics" defaultOn />
        <Toggle label="Mirror video preview" hint="Flip horizontally for natural view" defaultOn />
      </Section>

      <Section title="Privacy">
        <Toggle label="Process video locally" hint="Frames never leave your device" defaultOn locked />
        <Toggle label="Anonymous analytics" hint="Help us improve focus models" />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel p-6">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <div className="mt-4 divide-y divide-border/60">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, hint, defaultOn, locked }: { label: string; hint?: string; defaultOn?: boolean; locked?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <Row label={label} hint={hint}>
      <button
        onClick={() => !locked && setOn((v) => !v)}
        className={`relative h-7 w-12 rounded-full border transition ${on ? "border-primary/40 bg-primary/30 glow-emerald" : "border-border bg-white/5"} ${locked ? "opacity-60" : ""}`}
      >
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-white to-white/70 shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </Row>
  );
}
