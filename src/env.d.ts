/// <reference types="vite/client" />

// Client side environment variables
interface ImportMetaEnv {
	readonly VITE_APPWRITE_PROJECT_ID: string;
	readonly VITE_APPWRITE_PROJECT_NAME: string;
	readonly VITE_APPWRITE_ENDPOINT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
