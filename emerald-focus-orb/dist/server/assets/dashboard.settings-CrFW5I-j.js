import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
function Settings() {
  const {
    user
  } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [updating, setUpdating] = useState(false);
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);
  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!user) return;
    setUpdating(true);
    try {
      await user.update({
        firstName,
        lastName
      });
      toast.success("Name updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update name");
    } finally {
      setUpdating(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-accent", children: "Settings" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 font-display text-3xl font-semibold", children: "Preferences" })
    ] }),
    /* @__PURE__ */ jsx(Section, { title: "Profile Information", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveName, className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "First Name" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: firstName, onChange: (e) => setFirstName(e.target.value), placeholder: "First Name", className: "mt-1.5 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm focus:outline-none focus:border-primary/50" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Last Name" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: lastName, onChange: (e) => setLastName(e.target.value), placeholder: "Last Name", className: "mt-1.5 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm focus:outline-none focus:border-primary/50" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: updating, className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground glow-emerald hover:brightness-110 disabled:opacity-50", children: updating ? "Saving..." : "Save Changes" })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Appearance", children: /* @__PURE__ */ jsx(Row, { label: "Theme", hint: "Midnight Emerald Luxury", children: /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: ["Midnight", "Aurora", "Obsidian"].map((t, i) => /* @__PURE__ */ jsx("button", { className: `rounded-lg border px-3 py-1.5 text-xs ${i === 0 ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-white/5 text-muted-foreground hover:text-foreground"}`, children: t }, t)) }) }) }),
    /* @__PURE__ */ jsxs(Section, { title: "Notifications", children: [
      /* @__PURE__ */ jsx(Toggle, { label: "Session reminders", hint: "Get nudged before scheduled focus time", defaultOn: true }),
      /* @__PURE__ */ jsx(Toggle, { label: "Weekly summary email", hint: "Every Monday morning", defaultOn: true }),
      /* @__PURE__ */ jsx(Toggle, { label: "Distraction alerts", hint: "Subtle ping when attention drops" })
    ] }),
    /* @__PURE__ */ jsxs(Section, { title: "Webcam", children: [
      /* @__PURE__ */ jsx(Toggle, { label: "Enable face detection", hint: "Required for focus scoring", defaultOn: true }),
      /* @__PURE__ */ jsx(Toggle, { label: "Eye tracking", hint: "Higher fidelity attention analytics", defaultOn: true }),
      /* @__PURE__ */ jsx(Toggle, { label: "Mirror video preview", hint: "Flip horizontally for natural view", defaultOn: true })
    ] }),
    /* @__PURE__ */ jsxs(Section, { title: "Privacy", children: [
      /* @__PURE__ */ jsx(Toggle, { label: "Process video locally", hint: "Frames never leave your device", defaultOn: true, locked: true }),
      /* @__PURE__ */ jsx(Toggle, { label: "Anonymous analytics", hint: "Help us improve focus models" })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "glass-panel p-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 divide-y divide-border/60", children })
  ] });
}
function Row({
  label,
  hint,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: label }),
      hint && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: hint })
    ] }),
    children
  ] });
}
function Toggle({
  label,
  hint,
  defaultOn,
  locked
}) {
  const [on, setOn] = useState(!!defaultOn);
  return /* @__PURE__ */ jsx(Row, { label, hint, children: /* @__PURE__ */ jsx("button", { onClick: () => !locked && setOn((v) => !v), className: `relative h-7 w-12 rounded-full border transition ${on ? "border-primary/40 bg-primary/30 glow-emerald" : "border-border bg-white/5"} ${locked ? "opacity-60" : ""}`, children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-white to-white/70 shadow transition ${on ? "left-[22px]" : "left-0.5"}` }) }) });
}
export {
  Settings as component
};
