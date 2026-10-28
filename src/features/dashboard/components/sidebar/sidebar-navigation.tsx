import { Icon } from "@/shared/components/ui/icon";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { dashboardNavigation } from "@/shared/constant";
import { SidebarNavigationGroup } from "./sidebar-navigation-group";

export function SidebarNavigation() {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{dashboardNavigation.navMain.map((item) => {
						if ("items" in item && item.items.length > 0) {
							return <SidebarNavigationGroup key={item.title} item={item} />;
						}

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									tooltip={item.title}
									// biome-ignore lint/a11y/useAnchorContent: render as link
									render={<a href={item.url} />}
								>
									<Icon icon={item.icon} />
									<span>{item.title}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
