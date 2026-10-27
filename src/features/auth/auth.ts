import { Account, ID, OAuthProvider } from "appwrite";
import { appwriteClient } from "@/integrations/appwrite/config";

const account = new Account(appwriteClient);

export const auth = {
	signUp: (name: string, email: string, password: string) => {
		return account.create({
			userId: ID.unique(),
			name: name,
			email: email,
			password: password,
		});
	},

	signIn: (email: string, password: string) => {
		return account.createEmailPasswordSession({
			email: email,
			password: password,
		});
	},

	signInWithGitHub: async () => {
		const success = `${window.location.origin}/auth/success`;
		const failure = `${window.location.origin}/auth/failure`;

		const loginUrl = await account.createOAuth2Token({
			provider: OAuthProvider.Github,
			success,
			failure,
		});

		if (!loginUrl) {
			throw new Error("Appwrite did not return a GitHub login URL.");
		}

		window.location.assign(loginUrl);
	},

	signInWithGoogle: async () => {
		const success = `${window.location.origin}/auth/success`;
		const failure = `${window.location.origin}/auth/failure`;

		const loginUrl = await account.createOAuth2Token({
			provider: OAuthProvider.Google,
			success,
			failure,
		});

		if (!loginUrl) {
			throw new Error("Appwrite did not return a GitHub login URL.");
		}

		window.location.assign(loginUrl);
	},

	signOut: () => account.deleteSession({ sessionId: "current" }),

	getSession: () => account.get(),
};
