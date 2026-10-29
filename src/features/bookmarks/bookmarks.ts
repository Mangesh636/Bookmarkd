import { Databases, ID, Permission, Query, Role } from "appwrite";
import { appwriteClient } from "@/integrations/appwrite/config";
import { clientEnv } from "@/integrations/env/config";
import type { BookmarkDocument, BookmarkFields } from "./types";

const databases = new Databases(appwriteClient);

function getBookmarkConfig() {
	const databaseId = clientEnv.VITE_APPWRITE_DATABASE_ID?.trim();
	const collectionId = clientEnv.VITE_APPWRITE_BOOKMARKS_COLLECTION_ID?.trim();

	if (!databaseId || !collectionId) {
		throw new Error(
			"Bookmark storage is not configured. Add VITE_APPWRITE_DATABASE_ID and VITE_APPWRITE_BOOKMARKS_COLLECTION_ID to your environment, then restart the dev server.",
		);
	}

	return { databaseId, collectionId };
}

export async function listBookmarks(ownerId: string): Promise<BookmarkDocument[]> {
	const { databaseId, collectionId } = getBookmarkConfig();
	const result = await databases.listDocuments({
		databaseId,
		collectionId,
		queries: [
			Query.equal("ownerId", ownerId),
			Query.orderDesc("$createdAt"),
			Query.limit(100),
		],
	});

	return result.documents as BookmarkDocument[];
}

export async function createBookmark(
	ownerId: string,
	fields: BookmarkFields,
): Promise<BookmarkDocument> {
	const { databaseId, collectionId } = getBookmarkConfig();
	const result = await databases.createDocument({
		databaseId,
		collectionId,
		documentId: ID.unique(),
		data: { ownerId, ...fields },
		permissions: [
			Permission.read(Role.user(ownerId)),
			Permission.update(Role.user(ownerId)),
			Permission.delete(Role.user(ownerId)),
		],
	});

	return result as BookmarkDocument;
}

export async function updateBookmark(
	bookmarkId: string,
	fields: BookmarkFields,
): Promise<BookmarkDocument> {
	const { databaseId, collectionId } = getBookmarkConfig();
	const result = await databases.updateDocument({
		databaseId,
		collectionId,
		documentId: bookmarkId,
		data: fields,
	});

	return result as BookmarkDocument;
}

export async function deleteBookmark(bookmarkId: string): Promise<void> {
	const { databaseId, collectionId } = getBookmarkConfig();
	await databases.deleteDocument({
		databaseId,
		collectionId,
		documentId: bookmarkId,
	});
}
