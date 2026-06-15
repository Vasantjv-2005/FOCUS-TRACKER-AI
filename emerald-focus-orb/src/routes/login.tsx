import { createFileRoute, Link } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { AuroraBackground } from "@/components/effects/AuroraBackground";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — FocusTrack" }] }),
  component: Login,
});

function Login() {
  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-10">
      <AuroraBackground />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel relative w-full max-w-md p-8"
      >
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 glow-emerald">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display text-lg font-semibold">FocusTrack</span>
        </Link>
        <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Use your Clerk account to continue your deep work streak.</p>

        <div className="mt-6 flex justify-center">
          <SignIn
            signUpUrl="/signup"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
            appearance={{ variables: { colorPrimary: "#00A86B" } }}
          />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="text-accent hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}


