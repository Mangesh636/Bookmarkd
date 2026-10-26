import { Client } from "appwrite";
import { clientEnv } from "../env/config";

export const appwriteClient = new Client()
	.setEndpoint(clientEnv.VITE_APPWRITE_ENDPOINT)
	.setProject(clientEnv.VITE_APPWRITE_PROJECT_ID);
