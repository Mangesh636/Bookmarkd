import { Account, ID, OAuthProvider } from "appwrite";
import { appwriteClient } from "@/integrations/appwrite/config";

const account = new Account(appwriteClient);

export const auth = {
  signUp: (name: string, email: string, password: string) =>
    account.create({
      userId: ID.unique(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    }),

  signIn: (email: string, password: string) =>
    account.createEmailPasswordSession({
      email: email.trim().toLowerCase(),
      password,
    }),

  signInWithGitHub: () =>
    account.createOAuth2Session({
      provider: OAuthProvider.Github,
      success: `${window.location.origin}/dashboard`,
      failure: `${window.location.origin}/auth/sign-in`,
    }),

  signInWithGoogle: () =>
    account.createOAuth2Session({
      provider: OAuthProvider.Google,
      success: `${window.location.origin}/dashboard`,
      failure: `${window.location.origin}/auth/sign-in`,
    }),

  signOut: () => account.deleteSession({ sessionId: "current" }),

  getSession: () => account.get(),
};
