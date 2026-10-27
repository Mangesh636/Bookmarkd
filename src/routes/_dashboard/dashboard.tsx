import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { auth } from "@/features/auth/auth";
import { Button } from "@/shared/components/ui/button";
import { toast } from "@/shared/components/ui/toast";

export const Route = createFileRoute("/_dashboard/dashboard")({
  component: Dashboard,
});

type AuthenticatedUser = Awaited<ReturnType<typeof auth.getSession>>;

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    void auth
      .getSession()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) void navigate({ to: "/auth/sign-in", replace: true });
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await auth.signOut();
      toast.add({ type: "success", description: "Signed out successfully." });
      await navigate({ to: "/", replace: true });
    } catch {
      toast.add({
        type: "error",
        description: "Unable to sign out. Please try again.",
      });
    } finally {
      setSigningOut(false);
    }
  }

  if (checkingSession || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          {checkingSession ? "Checking your session..." : "Redirecting to sign in..."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <a href="/" className="font-display text-xl font-semibold">
          bookmarkd
        </a>
        <Button
          variant="outline"
          disabled={signingOut}
          onClick={() => void handleSignOut()}
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </Button>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold">
          Welcome back, {user.name || user.email}
        </h1>
        <p className="mt-2 text-muted-foreground">
          You're signed in. Your bookmark workspace will live here.
        </p>
      </section>
    </main>
  );
}
