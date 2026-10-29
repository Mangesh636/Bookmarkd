import { RiArrowDownSLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { Icon } from "@/shared/components/ui/icon";
import {
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import type { dashboardNavigation } from "@/shared/constant";

type NavigationItem = (typeof dashboardNavigation.navMain)[number];

type NavigationGroupItem = Extract<
	NavigationItem,
	{ items: readonly { title: string; url: string }[] }
>;

interface SidebarNavigationGroupProps {
	item: NavigationGroupItem;
}

export function SidebarNavigationGroup({ item }: SidebarNavigationGroupProps) {
	return (
		<Collapsible
			defaultOpen={item.title === "Folders"}
			className="group/collapsible"
		>
			<SidebarMenuItem>
				<SidebarMenuButton tooltip={item.title} render={<Link to={item.url} />}>
					<Icon icon={item.icon} />
					<span>{item.title}</span>
				</SidebarMenuButton>

				<CollapsibleTrigger
					render={<SidebarMenuAction />}
					aria-label={`Toggle ${item.title}`}
					className="ml-auto transition-transform group-data-open/collapsible:rotate-180"
				>
					<Icon icon={RiArrowDownSLine} />
				</CollapsibleTrigger>

				<CollapsibleContent>
					<SidebarMenuSub>
						{item.items.map((subItem) => (
							<SidebarMenuSubItem key={subItem.title}>
								<SidebarMenuSubButton
									render={<Link to="/dashboard" search={subItem.search} />}
								>
									<span>{subItem.title}</span>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
}
