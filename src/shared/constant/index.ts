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
					url: "/dashboard",
					search: { folder: "Repository" },
				},
				{
					title: "UI Library",
					url: "/dashboard",
					search: { folder: "ui-library" },
				},
				{
					title: "Documentation",
					url: "/dashboard",
					search: { folder: "documentation" },
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
					url: "/dashboard",
					search: { tag: "ai" },
				},
				{
					title: "ShadCN",
					url: "/dashboard",
					search: { tag: "shadcn" },
				},
				{
					title: "GitHub",
					url: "/dashboard",
					search: { tag: "github" },
				},
			],
		},
	],
} as const;
