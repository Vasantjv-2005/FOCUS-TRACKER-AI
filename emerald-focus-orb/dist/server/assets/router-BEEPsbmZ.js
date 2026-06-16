import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ClerkProvider } from "@clerk/clerk-react";
import { useEffect } from "react";
const appCss = "/assets/styles-BUHzSjqk.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$a = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$a.useRouteContext();
  const clerkPublishableKey = "pk_test_ZXhjaXRlZC1jcmF5ZmlzaC0zLmNsZXJrLmFjY291bnRzLmRldiQ";
  return /* @__PURE__ */ jsx(
    ClerkProvider,
    {
      publishableKey: clerkPublishableKey,
      signInFallbackRedirectUrl: "/dashboard",
      signUpFallbackRedirectUrl: "/dashboard",
      children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) })
    }
  );
}
const $$splitComponentImporter$9 = () => import("./signup-4EJNLoCC.js");
const Route$9 = createFileRoute("/signup")({
  head: () => ({
    meta: [{
      title: "Create account — FocusTrack"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./login-aPQ4FXFY.js");
const Route$8 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign in — FocusTrack"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./dashboard-8o9lZ46D.js");
const Route$7 = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — FocusTrack"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./index-aiKnW8_1.js");
const Route$6 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "FocusTrack — Train Your Focus. Master Your Mind."
    }, {
      name: "description",
      content: "Advanced focus intelligence platform measuring real attention, cognitive engagement, and study performance."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./dashboard.index-CL7ZVCZc.js");
const Route$5 = createFileRoute("/dashboard/")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./dashboard.settings-CrFW5I-j.js");
const Route$4 = createFileRoute("/dashboard/settings")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./dashboard.session-DHWXlVIP.js");
const Route$3 = createFileRoute("/dashboard/session")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./dashboard.reports-DIZ5xUhd.js");
const Route$2 = createFileRoute("/dashboard/reports")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./dashboard.profile-DhmN8osX.js");
const Route$1 = createFileRoute("/dashboard/profile")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./dashboard.analytics-CuxB78aM.js");
const Route = createFileRoute("/dashboard/analytics")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SignupRoute = Route$9.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$a
});
const LoginRoute = Route$8.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$a
});
const DashboardRoute = Route$7.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$a
});
const IndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$a
});
const DashboardIndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => DashboardRoute
});
const DashboardSettingsRoute = Route$4.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => DashboardRoute
});
const DashboardSessionRoute = Route$3.update({
  id: "/session",
  path: "/session",
  getParentRoute: () => DashboardRoute
});
const DashboardReportsRoute = Route$2.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => DashboardRoute
});
const DashboardProfileRoute = Route$1.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => DashboardRoute
});
const DashboardAnalyticsRoute = Route.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => DashboardRoute
});
const DashboardRouteChildren = {
  DashboardAnalyticsRoute,
  DashboardProfileRoute,
  DashboardReportsRoute,
  DashboardSessionRoute,
  DashboardSettingsRoute,
  DashboardIndexRoute
};
const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  DashboardRoute: DashboardRouteWithChildren,
  LoginRoute,
  SignupRoute
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
