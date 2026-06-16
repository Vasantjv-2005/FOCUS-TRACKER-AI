import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Target, Sparkles, ArrowRight, PlayCircle, Eye, Timer, Zap, Brain, ChartLine, Gauge } from "lucide-react";
import { A as AuroraBackground } from "./AuroraBackground-xoL8dbCa.js";
import { useRef, useEffect } from "react";
import { F as FocusSphere } from "./FocusSphere-DwEM2tbu.js";
function GoldenParticles({ count = 40 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      const size = Math.random() * 3 + 1;
      p.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;border-radius:9999px;background:radial-gradient(circle,#F5E6A8,#D4AF37);box-shadow:0 0 ${size * 4}px #D4AF37;opacity:${0.3 + Math.random() * 0.5};animation:float-y ${4 + Math.random() * 6}s ease-in-out ${-Math.random() * 6}s infinite;`;
      el.appendChild(p);
    }
  }, [count]);
  return /* @__PURE__ */ jsx("div", { ref, className: "pointer-events-none absolute inset-0 -z-10 overflow-hidden" });
}
function Landing() {
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx(AuroraBackground, {}),
    /* @__PURE__ */ jsx(GoldenParticles, {}),
    /* @__PURE__ */ jsxs("header", { className: "relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-primary/15 glow-emerald", children: /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-lg font-semibold tracking-tight", children: "FocusTrack" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden items-center gap-8 text-sm text-muted-foreground md:flex", children: [
        /* @__PURE__ */ jsx("a", { href: "#features", className: "hover:text-foreground transition", children: "Features" }),
        /* @__PURE__ */ jsx("a", { href: "#how", className: "hover:text-foreground transition", children: "How it works" }),
        /* @__PURE__ */ jsx("a", { href: "#testimonials", className: "hover:text-foreground transition", children: "Testimonials" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "hidden rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline", children: "Sign in" }),
        /* @__PURE__ */ jsx(Link, { to: "/signup", className: "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-emerald hover:brightness-110 transition", children: "Start free" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-12 lg:pt-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          y: 18
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.7
        }, className: "inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-accent" }),
          "Powered by realtime attention intelligence"
        ] }),
        /* @__PURE__ */ jsxs(motion.h1, { initial: {
          opacity: 0,
          y: 24
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          delay: 0.05
        }, className: "mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tight md:text-6xl lg:text-7xl", children: [
          "Master Your Focus.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-gradient-emerald", children: "Train Your Mind." }),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "text-gradient-gold", children: "Achieve More." })
        ] }),
        /* @__PURE__ */ jsx(motion.p, { initial: {
          opacity: 0,
          y: 24
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          delay: 0.15
        }, className: "mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg", children: "The world's most advanced focus intelligence platform that measures real attention, cognitive engagement, and study performance — in real time." }),
        /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          y: 24
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          delay: 0.25
        }, className: "mt-9 flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxs(Link, { to: "/signup", className: "group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-emerald-deep to-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-emerald hover:brightness-110 transition", children: [
            "Get Started ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-0.5" })
          ] }),
          /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-2 rounded-2xl border border-border bg-white/5 px-6 py-3.5 text-sm font-medium text-foreground backdrop-blur hover:bg-white/10 transition", children: [
            /* @__PURE__ */ jsx(PlayCircle, { className: "h-4 w-4 text-accent" }),
            " Watch Demo"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-10 grid max-w-lg grid-cols-3 gap-6 text-sm", children: [{
          v: "98%",
          l: "Accuracy"
        }, {
          v: "120k+",
          l: "Sessions"
        }, {
          v: "4.9★",
          l: "User rating"
        }].map((s) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-display text-2xl text-gradient-gold", children: s.v }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.l })
        ] }, s.l)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative lg:col-span-5", children: /* @__PURE__ */ jsxs("div", { className: "relative mx-auto aspect-square w-full max-w-md", children: [
        /* @__PURE__ */ jsx(motion.div, { animate: {
          rotate: [0, 4, -3, 0]
        }, transition: {
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }, className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(FocusSphere, { score: 87, size: 320 }) }),
        /* @__PURE__ */ jsxs(motion.div, { animate: {
          y: [0, -10, 0]
        }, transition: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }, className: "glass-card absolute -left-6 top-8 w-44 p-3 text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5 text-primary" }),
            " Gaze stability"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 font-display text-xl text-gradient-emerald", children: "94%" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10", children: /* @__PURE__ */ jsx("div", { className: "h-full w-[94%] rounded-full bg-gradient-to-r from-primary to-accent" }) })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { animate: {
          y: [0, 12, 0]
        }, transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }, className: "glass-card absolute -right-4 bottom-12 w-48 p-3 text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Timer, { className: "h-3.5 w-3.5 text-accent" }),
              " Session"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Live" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 font-display text-xl text-gradient-gold", children: "01:42:08" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 flex gap-1", children: Array.from({
            length: 14
          }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-5 flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-accent/70", style: {
            opacity: 0.2 + i / 14 * 0.8
          } }, i)) })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { animate: {
          y: [0, -8, 0]
        }, transition: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }, className: "glass-card absolute right-4 top-0 flex items-center gap-2 p-2 pr-3 text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-accent", children: /* @__PURE__ */ jsx(Zap, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Flow state" }),
            /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground", children: "Activated" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "features", className: "relative z-10 mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsx(SectionHeader, { eyebrow: "Capabilities", title: "Engineered for deep work" }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3", children: features.map((f, i) => /* @__PURE__ */ jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true,
        margin: "-60px"
      }, transition: {
        duration: 0.5,
        delay: i * 0.05
      }, whileHover: {
        y: -6
      }, className: "glass-card group relative overflow-hidden p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 opacity-0 blur-2xl transition group-hover:opacity-100" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary glow-emerald", children: /* @__PURE__ */ jsx(f.icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("h3", { className: "mt-5 font-display text-lg font-semibold", children: f.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: f.desc })
        ] })
      ] }, f.title)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "how", className: "relative z-10 mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsx(SectionHeader, { eyebrow: "Workflow", title: "From session to insight" }),
      /* @__PURE__ */ jsxs("div", { className: "relative mt-14", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-5", children: steps.map((s, i) => /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, whileInView: {
          opacity: 1,
          y: 0
        }, viewport: {
          once: true
        }, transition: {
          duration: 0.5,
          delay: i * 0.08
        }, className: "relative text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "relative mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card text-accent glow-gold", children: /* @__PURE__ */ jsx("span", { className: "font-display text-lg", children: i + 1 }) }),
          /* @__PURE__ */ jsx("h4", { className: "mt-4 font-display text-sm font-semibold", children: s.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: s.desc })
        ] }, s.title)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "testimonials", className: "relative z-10 mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsx(SectionHeader, { eyebrow: "Loved by learners", title: "A new standard for studying" }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 grid grid-cols-1 gap-5 md:grid-cols-3", children: testimonials.map((t, i) => /* @__PURE__ */ jsxs(motion.figure, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, transition: {
        duration: 0.5,
        delay: i * 0.08
      }, whileHover: {
        y: -4
      }, className: "glass-card p-6", children: [
        /* @__PURE__ */ jsxs("blockquote", { className: "text-sm leading-relaxed text-foreground/90", children: [
          '"',
          t.quote,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("figcaption", { className: "mt-5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground", children: t.name.split(" ").map((n) => n[0]).join("") }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: t.name }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: t.role })
          ] })
        ] })
      ] }, t.name)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "relative z-10 mx-auto max-w-5xl px-6 py-24", children: /* @__PURE__ */ jsxs("div", { className: "glass-panel relative overflow-hidden p-12 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -right-24 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" }),
      /* @__PURE__ */ jsxs("h2", { className: "relative font-display text-4xl font-semibold tracking-tight md:text-5xl", children: [
        "Your ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient-gold", children: "deep work" }),
        " era starts now."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "relative mx-auto mt-4 max-w-xl text-muted-foreground", children: "Join thousands of students upgrading their study sessions with real attention data." }),
      /* @__PURE__ */ jsxs("div", { className: "relative mt-8 flex flex-wrap items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/signup", className: "inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-emerald hover:brightness-110", children: [
          "Start free ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "rounded-2xl border border-border bg-white/5 px-6 py-3.5 text-sm font-medium backdrop-blur hover:bg-white/10", children: "Explore dashboard" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("footer", { className: "relative z-10 border-t border-border/60 py-8 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " FocusTrack. Crafted for deep focus."
    ] })
  ] });
}
function SectionHeader({
  eyebrow,
  title
}) {
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-accent", children: eyebrow }),
    /* @__PURE__ */ jsx("h2", { className: "mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl", children: title })
  ] });
}
const features = [{
  icon: Eye,
  title: "Real-Time Focus Tracking",
  desc: "Continuous attention measurement using webcam-based gaze analysis."
}, {
  icon: Brain,
  title: "Attention Analysis",
  desc: "Quantify cognitive engagement across each minute of study."
}, {
  icon: Target,
  title: "Eye Movement Detection",
  desc: "Detect fixations, saccades, and micro-distractions in real time."
}, {
  icon: Timer,
  title: "Study Session Monitoring",
  desc: "Tracked sessions with focus stages, breaks, and recoveries."
}, {
  icon: ChartLine,
  title: "Focus Analytics Dashboard",
  desc: "Visualize trends, peaks and dips across days and weeks."
}, {
  icon: Gauge,
  title: "Productivity Reports",
  desc: "Beautiful daily, weekly and monthly reports exportable to PDF."
}];
const steps = [{
  title: "Start session",
  desc: "Pick a goal and timer length"
}, {
  title: "Enable webcam",
  desc: "Quick, private permission"
}, {
  title: "Analyze attention",
  desc: "Realtime gaze + face tracking"
}, {
  title: "Receive score",
  desc: "Get focus quality feedback"
}, {
  title: "Track progress",
  desc: "Improve week over week"
}];
const testimonials = [{
  name: "Aarav Mehta",
  role: "Medical Student, AIIMS",
  quote: "FocusTrack feels like having a personal coach watching over my deep work. My retention has visibly improved."
}, {
  name: "Sofia Liang",
  role: "PhD Candidate, ETH Zürich",
  quote: "The eye tracking is uncanny. I finally understand when my mind drifts — and how to bring it back."
}, {
  name: "Daniel Okafor",
  role: "CFA Level III",
  quote: "The dashboard is gorgeous and the insights are sharper than anything I've tried. Worth every minute."
}];
export {
  Landing as component
};
