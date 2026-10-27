import { Client } from "appwrite";
import { clientEnv } from "../env/config";

const appwriteEndpoint = clientEnv.VITE_APPWRITE_ENDPOINT;
const appwriteProject = clientEnv.VITE_APPWRITE_PROJECT_ID;

if (!appwriteEndpoint || !appwriteProject) {
	throw new Error(
		"Missing Appwrite endpoint or project ID environment variables.",
	);
}

export const appwriteClient = new Client()
	.setEndpoint(appwriteEndpoint)
	.setProject(appwriteProject);
