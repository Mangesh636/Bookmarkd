import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/auth")({
	component: AuthLayout,
});

function AuthLayout() {
	return <Outlet />;
}
