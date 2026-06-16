import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { A as AuroraBackground } from "./AuroraBackground-xoL8dbCa.js";
function Signup() {
  return /* @__PURE__ */ jsxs("div", { className: "relative grid min-h-screen place-items-center px-4 py-10", children: [
    /* @__PURE__ */ jsx(AuroraBackground, {}),
    /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      y: 18
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.6
    }, className: "glass-panel relative w-full max-w-md p-8", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-primary/15 glow-emerald", children: /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-lg font-semibold", children: "FocusTrack" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-semibold", children: "Create your account" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Use Clerk to create your account and sync it to the backend." }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsx(SignUp, { signInUrl: "/login", forceRedirectUrl: "/dashboard", fallbackRedirectUrl: "/dashboard", appearance: {
        variables: {
          colorPrimary: "#00A86B"
        }
      } }) }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-accent hover:underline", children: "Sign in" })
      ] })
    ] })
  ] });
}
export {
  Signup as component
};
