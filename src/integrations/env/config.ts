import { z } from "zod";

// Client side environment variables
const clientEnvSchema = z.object({
	VITE_APPWRITE_PROJECT_ID: z.string(),
	VITE_APPWRITE_PROJECT_NAME: z.string(),
	VITE_APPWRITE_ENDPOINT: z.url(),
	VITE_APPWRITE_DATABASE_ID: z.string().optional(),
	VITE_APPWRITE_BOOKMARKS_COLLECTION_ID: z.string().optional(),
});

export const clientEnv = clientEnvSchema.parse(import.meta.env);
