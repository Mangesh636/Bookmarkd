import { Sidebar, SidebarContent } from "@/shared/components/ui/sidebar";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNavigation } from "./sidebar-navigation";

export function DashboardSidebar() {
	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarBrand />

			<SidebarContent>
				<SidebarNavigation />
			</SidebarContent>
		</Sidebar>
	);
}
