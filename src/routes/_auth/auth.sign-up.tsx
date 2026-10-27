import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const Route = createFileRoute("/_auth/auth/sign-up")({
	component: SignUp,
});

function SignUp() {
	return <SignUpForm />;
}
