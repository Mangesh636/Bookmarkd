import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { auth } from "@/features/auth/auth";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "@/shared/components/ui/toast";

export const Route = createFileRoute("/")({ component: Home });

type AuthenticatedUser = Awaited<ReturnType<typeof auth.getSession>>;

function getInitials(name: string, email: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (initials || email[0] || "?").toUpperCase();
}

function Home() {
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
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await auth.signOut();
      setUser(null);
      toast.add({ type: "success", description: "Signed out successfully." });
    } catch {
      toast.add({
        type: "error",
        description: "Unable to sign out. Please try again.",
      });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <a href="/" className="font-display text-2xl font-semibold tracking-tight">
          bookmarkd
        </a>

        <div className="flex min-h-10 items-center gap-3">
          {checkingSession ? (
            <div
              className="size-9 animate-pulse rounded-full bg-muted"
              aria-label="Checking session"
            />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open account menu"
                className="flex size-10 items-center justify-center rounded-full outline-none ring-offset-background transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Avatar>
                  <AvatarFallback>
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-52">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{user.name || "Your account"}</span>
                    <span className="font-normal text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void navigate({ to: "/dashboard" })}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={signingOut}
                  onClick={() => void handleSignOut()}
                >
                  {signingOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => void navigate({ to: "/auth/sign-in" })}>
              Sign in
            </Button>
          )}
        </div>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-28 text-center sm:py-40">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Your links, thoughtfully organized
        </p>
        <h1 className="max-w-3xl font-display text-5xl font-semibold tracking-tight sm:text-7xl">
          Everything worth saving, all in one place.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Keep the articles, tools, and ideas you find online organized and ready
          whenever you need them.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {user ? (
            <Button size="lg" onClick={() => void navigate({ to: "/dashboard" })}>
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                onClick={() => void navigate({ to: "/auth/sign-up" })}
              >
                Get started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => void navigate({ to: "/auth/sign-in" })}
              >
                Sign in
              </Button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
