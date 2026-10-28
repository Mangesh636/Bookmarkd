import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardSidebar } from "@/features/dashboard/components/sidebar/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";

export const Route = createFileRoute("/_dashboard/dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<SidebarInset>
				<main>
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
