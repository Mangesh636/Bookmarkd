import { z } from "zod";

// Client side environment variables
const clientEnvSchema = z.object({
	VITE_APPWRITE_PROJECT_ID: z.string(),
	VITE_APPWRITE_PROJECT_NAME: z.string(),
	VITE_APPWRITE_ENDPOINT: z.url(),
});

export const clientEnv = clientEnvSchema.parse(import.meta.env);
