import { SidebarHeader } from "@/shared/components/ui/sidebar";

export const SidebarBrand = () => {
	return (
		<SidebarHeader className="flex flex-row justify-start items-center">
			<img src="/logo.svg" alt="Bookmarkd Logo" className="size-8" />
			<span className="font-display text-2xl">Bookmarkd</span>
		</SidebarHeader>
	);
};
