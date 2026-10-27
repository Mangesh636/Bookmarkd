import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { toast } from "@/shared/components/ui/toast";
import { auth } from "../auth";
import { getAuthErrorMessage } from "../auth-errors";
import { SignInSchema } from "../schema";
import { AuthWrapper } from "./auth-wrapper";

export const SignInForm = () => {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: SignInSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				try {
					await auth.getSession();

					await navigate({ to: "/dashboard" });
				} catch {}
				console.log("Attempting sign-in:", value.email);

				await auth.signIn(value.email, value.password);

				toast.add({
					type: "success",
					description: "Signed in successfully.",
				});

				await navigate({ to: "/dashboard" });
			} catch (error) {
				console.error("Sign-in failed:", error);

				toast.add({
					type: "error",
					description: getAuthErrorMessage(error),
				});
			}
		},
	});
	return (
		<AuthWrapper
			mode="sign-in"
			brandingTitle="Welcome Back"
			brandingDescription="Your bookmarks, right where you left them."
			title="Welcome back"
			description="Sign in to pick up where you left off."
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			showOAuth={true}
			footer={
				<>
					Don't have an account?{" "}
					<a
						href="/auth/sign-up"
						className="underline-offset-4 hover:underline"
					>
						Create account
					</a>
				</>
			}
		>
			<form.Field name="email">
				{(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field data-invalid={isInvalid} className="-space-y-2">
							<FieldLabel htmlFor={field.name}>Email</FieldLabel>
							<Input
								id={field.name}
								name={field.name}
								type="email"
								autoComplete="email"
								placeholder="name@example.com"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								aria-invalid={isInvalid}
								className="border-2 border-accent bg-background py-4"
							/>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			</form.Field>

			<form.Field name="password">
				{(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field data-invalid={isInvalid} className="-space-y-2">
							<FieldLabel htmlFor={field.name}>Password</FieldLabel>
							<Input
								id={field.name}
								name={field.name}
								type="password"
								autoComplete="current-password"
								placeholder="••••••••"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								aria-invalid={isInvalid}
								className="border-2 border-accent bg-background py-4"
							/>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			</form.Field>

			<Field>
				<form.Subscribe selector={(state) => state.isSubmitting}>
					{(isSubmitting) => (
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Signing in..." : "Sign In"}
						</Button>
					)}
				</form.Subscribe>
			</Field>
		</AuthWrapper>
	);
};
