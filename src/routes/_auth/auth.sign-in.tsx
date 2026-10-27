import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export const Route = createFileRoute("/_auth/auth/sign-in")({
	component: SignIn,
});

function SignIn() {
	return <SignInForm />;
}
