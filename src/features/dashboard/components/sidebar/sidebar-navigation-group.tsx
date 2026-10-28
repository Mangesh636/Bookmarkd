import { RiArrowDownSLine } from "@remixicon/react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { Icon } from "@/shared/components/ui/icon";
import {
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
				<CollapsibleTrigger
					// biome-ignore lint/a11y/useAnchorContent: render as link
					render={<a href={item.url} />}
				>
					<SidebarMenuButton tooltip={item.title}>
						<Icon icon={item.icon} />
						<span>{item.title}</span>
						<Icon
							icon={RiArrowDownSLine}
							className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
						/>
					</SidebarMenuButton>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<SidebarMenuSub>
						{item.items.map((subItem) => (
							<SidebarMenuSubItem key={subItem.title}>
								<SidebarMenuSubButton
									// biome-ignore lint/a11y/useAnchorContent: render as link
									render={<a href={subItem.url} />}
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
