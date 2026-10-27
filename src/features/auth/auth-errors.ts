import { AppwriteException } from "appwrite";

export function isDuplicateAccountError(error: unknown): boolean {
  return (
    error instanceof AppwriteException &&
    (error.type === "user_already_exists" ||
      error.type === "user_email_already_exists")
  );
}

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof AppwriteException)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.type) {
    case "user_already_exists":
    case "user_email_already_exists":
      return "An account with this email already exists. Try signing in instead.";
    case "user_invalid_credentials":
      return "Invalid email or password. Please try again.";
    case "user_password_mismatch":
      return "Invalid email or password. Please try again.";
    default:
      if (error.code >= 500) {
        return "Our server is having trouble. Please try again later.";
      }
      return error.message || "Unable to complete your request.";
  }
}
