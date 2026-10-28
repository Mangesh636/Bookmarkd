import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/features/auth/auth";
import { TodoDashboard } from "@/features/todos/todo-dashboard";
import { Button } from "@/shared/components/ui/button";
import { toast } from "@/shared/components/ui/toast";

export const Route = createFileRoute("/_dashboard/dashboard")({
	component: Dashboard,
});
type User = Awaited<ReturnType<typeof auth.getSession>>;

function Dashboard() {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		let active = true;
		void auth
			.getSession()
			.then((current) => {
				if (active) setUser(current);
			})
			.catch(() => {
				if (active) void navigate({ to: "/auth/sign-in", replace: true });
			})
			.finally(() => {
				if (active) setChecking(false);
			});
		return () => {
			active = false;
		};
	}, [navigate]);

	async function signOut() {
		try {
			await auth.signOut();
			toast.add({ type: "success", description: "Signed out successfully." });
			await navigate({ to: "/", replace: true });
		} catch {
			toast.add({
				type: "error",
				description: "Unable to sign out. Please try again.",
			});
		}
	}

	if (checking || !user)
		return (
			<main className="flex min-h-screen items-center justify-center bg-background">
				<p className="text-sm text-muted-foreground">
					{checking ? "Checking your session..." : "Redirecting to sign in..."}
				</p>
			</main>
		);

	return (
		<main className="min-h-screen bg-background">
			<header className="flex items-center justify-between border-b px-6 py-4">
				<a href="/" className="font-display text-xl font-semibold">
					bookmarkd
				</a>
				<Button variant="outline" onClick={() => void signOut()}>
					Sign out
				</Button>
			</header>
			<section>
				<div className="mx-auto max-w-4xl px-5 pt-8 sm:px-6">
					<p className="text-sm text-muted-foreground">
						Signed in as {user.name || user.email}
					</p>
				</div>
				<TodoDashboard />
			</section>
		</main>
	);
}
