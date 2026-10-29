import type { Models } from "appwrite";

export type BookmarkFields = {
	url: string;
	title: string;
	description: string;
	siteName: string;
	imageUrl: string;
	faviconUrl: string;
};

export type BookmarkDocument = Models.Document & BookmarkFields & {
	ownerId: string;
};

export type BookmarkMetadata = Pick<
	BookmarkFields,
	"title" | "description" | "siteName" | "imageUrl" | "faviconUrl"
>;
