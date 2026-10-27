import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { auth } from "@/features/auth/auth";
import { Button } from "@/shared/components/ui/button";

export const Route = createFileRoute("/_dashboard/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const handleSubmit = () => {
		try {
			auth.signOut();
			navigate({ to: "/" });
		} catch {
			console.error();
		}
	};
	return (
		<div>
			<Button onClick={handleSubmit}>Out</Button>
		</div>
	);
}
