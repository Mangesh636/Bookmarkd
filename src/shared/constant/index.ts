import {
	RiArchive2Line,
	RiBookShelfLine,
	RiDeleteBin6Line,
	RiFolderLine,
	RiHashtag,
	RiHome5Line,
	RiStarLine,
} from "@remixicon/react";

export const dashboardNavigation = {
	navMain: [
		{
			title: "Overview",
			url: "/dashboard",
			icon: RiHome5Line,
		},
		{
			title: "All Bookmarks",
			url: "/dashboard/bookmarks",
			icon: RiBookShelfLine,
		},
		{
			title: "Favorites",
			url: "/dashboard/favorites",
			icon: RiStarLine,
		},
		{
			title: "Archived",
			url: "/dashboard/archived",
			icon: RiArchive2Line,
		},
		{
			title: "Trash",
			url: "/dashboard/trash",
			icon: RiDeleteBin6Line,
		},
		{
			title: "Folders",
			url: "/dashboard/folders",
			icon: RiFolderLine,
			items: [
				{
					title: "Repository",
					url: "/dashboard?folder=Repository",
				},
				{
					title: "UI Library",
					url: "/dashboard?folder=ui-library",
				},
				{
					title: "Documentation",
					url: "/dashboard?folder=documentation",
				},
			],
		},
		{
			title: "Tags",
			url: "/dashboard/tags",
			icon: RiHashtag,
			items: [
				{
					title: "AI",
					url: "/dashboard?tag=ai",
				},
				{
					title: "ShadCN",
					url: "/dashboard?tag=shadcn",
				},
				{
					title: "GitHub",
					url: "/dashboard?tag=github",
				},
			],
		},
	],
} as const;
