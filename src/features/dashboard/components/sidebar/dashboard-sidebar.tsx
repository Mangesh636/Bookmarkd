import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
} from "@/shared/components/ui/sidebar";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarUser } from "./sidebar-user";

export const DashboardSidebar = () => {
	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarBrand />

			<SidebarContent>
				<SidebarNavigation />
			</SidebarContent>

			<SidebarFooter>
				<SidebarUser />
			</SidebarFooter>
		</Sidebar>
	);
};
