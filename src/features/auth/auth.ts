import { Account, Avatars, ID, OAuthProvider } from "appwrite";
import { appwriteClient } from "@/integrations/appwrite/config";

const account = new Account(appwriteClient);
const avatars = new Avatars(appwriteClient);

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

  // Use the actual user ID so this works even when Appwrite is on a
  // different domain and its session cookie cannot be sent with the image request.
  getUserPhoto: (userId: string) =>
    avatars.getPhoto({ userId, width: 96, height: 96 }),
};
