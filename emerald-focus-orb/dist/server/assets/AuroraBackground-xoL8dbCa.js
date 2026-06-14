import { jsxs, jsx } from "react/jsx-runtime";
function AuroraBackground() {
  return /* @__PURE__ */ jsxs("div", { className: "aurora-bg -z-10", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -top-40 -left-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.17_158/0.45),transparent_60%)] blur-3xl animate-aurora" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-10 right-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.82_0.14_88/0.28),transparent_60%)] blur-3xl animate-aurora",
        style: { animationDelay: "-6s" }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute bottom-0 left-1/3 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.5_0.11_175/0.45),transparent_60%)] blur-3xl animate-aurora",
        style: { animationDelay: "-12s" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 noise-overlay opacity-40 mix-blend-overlay" })
  ] });
}
export {
  AuroraBackground as A
};
