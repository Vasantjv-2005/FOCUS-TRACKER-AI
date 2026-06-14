import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ChartLine,
  Eye,
  Gauge,
  PlayCircle,
  Sparkles,
  Target,
  Timer,
  Zap,
} from "lucide-react";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { GoldenParticles } from "@/components/effects/GoldenParticles";
import { FocusSphere } from "@/components/focus/FocusSphere";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FocusTrack — Train Your Focus. Master Your Mind." },
      { name: "description", content: "Advanced focus intelligence platform measuring real attention, cognitive engagement, and study performance." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraBackground />
      <GoldenParticles />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 glow-emerald">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">FocusTrack</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#testimonials" className="hover:text-foreground transition">Testimonials</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline">Sign in</Link>
          <Link to="/signup" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-emerald hover:brightness-110 transition">
            Start free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-12 lg:pt-24">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Powered by realtime attention intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tight md:text-6xl lg:text-7xl"
          >
            Master Your Focus.<br />
            <span className="text-gradient-emerald">Train Your Mind.</span><br />
            <span className="text-gradient-gold">Achieve More.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            The world's most advanced focus intelligence platform that measures real attention,
            cognitive engagement, and study performance — in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-emerald-deep to-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-emerald hover:brightness-110 transition"
            >
              Get Started <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white/5 px-6 py-3.5 text-sm font-medium text-foreground backdrop-blur hover:bg-white/10 transition">
              <PlayCircle className="h-4 w-4 text-accent" /> Watch Demo
            </button>
          </motion.div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 text-sm">
            {[
              { v: "98%", l: "Accuracy" },
              { v: "120k+", l: "Sessions" },
              { v: "4.9★", l: "User rating" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl text-gradient-gold">{s.v}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Floating dashboard preview */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <motion.div
              animate={{ rotate: [0, 4, -3, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FocusSphere score={87} size={320} />
            </motion.div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass-card absolute -left-6 top-8 w-44 p-3 text-xs"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-3.5 w-3.5 text-primary" /> Gaze stability
              </div>
              <div className="mt-1 font-display text-xl text-gradient-emerald">94%</div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-primary to-accent" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="glass-card absolute -right-4 bottom-12 w-48 p-3 text-xs"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-accent" /> Session</span>
                <span className="text-primary">Live</span>
              </div>
              <div className="mt-1 font-display text-xl text-gradient-gold">01:42:08</div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="h-5 flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-accent/70" style={{ opacity: 0.2 + (i / 14) * 0.8 }} />
                ))}
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="glass-card absolute right-4 top-0 flex items-center gap-2 p-2 pr-3 text-xs"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-accent"><Zap className="h-3.5 w-3.5" /></span>
              <div>
                <div className="text-muted-foreground">Flow state</div>
                <div className="font-medium text-foreground">Activated</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Capabilities" title="Engineered for deep work" />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass-card group relative overflow-hidden p-6"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary glow-emerald">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Workflow" title="From session to insight" />
        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative text-center"
              >
                <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card text-accent glow-gold">
                  <span className="font-display text-lg">{i + 1}</span>
                </div>
                <h4 className="mt-4 font-display text-sm font-semibold">{s.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Loved by learners" title="A new standard for studying" />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6"
            >
              <blockquote className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        <div className="glass-panel relative overflow-hidden p-12 text-center">
          <div className="absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -right-24 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <h2 className="relative font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Your <span className="text-gradient-gold">deep work</span> era starts now.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of students upgrading their study sessions with real attention data.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-emerald hover:brightness-110">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/dashboard" className="rounded-2xl border border-border bg-white/5 px-6 py-3.5 text-sm font-medium backdrop-blur hover:bg-white/10">
              Explore dashboard
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FocusTrack. Crafted for deep focus.
      </footer>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
    </div>
  );
}

const features = [
  { icon: Eye, title: "Real-Time Focus Tracking", desc: "Continuous attention measurement using webcam-based gaze analysis." },
  { icon: Brain, title: "Attention Analysis", desc: "Quantify cognitive engagement across each minute of study." },
  { icon: Target, title: "Eye Movement Detection", desc: "Detect fixations, saccades, and micro-distractions in real time." },
  { icon: Timer, title: "Study Session Monitoring", desc: "Tracked sessions with focus stages, breaks, and recoveries." },
  { icon: ChartLine, title: "Focus Analytics Dashboard", desc: "Visualize trends, peaks and dips across days and weeks." },
  { icon: Gauge, title: "Productivity Reports", desc: "Beautiful daily, weekly and monthly reports exportable to PDF." },
];

const steps = [
  { title: "Start session", desc: "Pick a goal and timer length" },
  { title: "Enable webcam", desc: "Quick, private permission" },
  { title: "Analyze attention", desc: "Realtime gaze + face tracking" },
  { title: "Receive score", desc: "Get focus quality feedback" },
  { title: "Track progress", desc: "Improve week over week" },
];

const testimonials = [
  { name: "Aarav Mehta", role: "Medical Student, AIIMS", quote: "FocusTrack feels like having a personal coach watching over my deep work. My retention has visibly improved." },
  { name: "Sofia Liang", role: "PhD Candidate, ETH Zürich", quote: "The eye tracking is uncanny. I finally understand when my mind drifts — and how to bring it back." },
  { name: "Daniel Okafor", role: "CFA Level III", quote: "The dashboard is gorgeous and the insights are sharper than anything I've tried. Worth every minute." },
];
