import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { toast } from "@/shared/components/ui/toast";
import { auth } from "../auth";
import { getAuthErrorMessage } from "../auth-errors";
import { SignUpSchema } from "../schema";
import { AuthWrapper } from "./auth-wrapper";

export const SignUpForm = () => {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
		validators: {
			onSubmit: SignUpSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const name = `${value.firstName.trim()} ${value.lastName.trim()}`;
				console.log("Attempting sign-up:", value.email);

				const session = await auth.signUp(name, value.email, value.password);

				console.log("Sign-up succeeded:", session);

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
			mode="sign-up"
			brandingTitle="Your Next Favorite"
			brandingDescription="Save it now. Find it anytime."
			title="Create your account"
			description="Start saving and organizing what matters to you."
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			showOAuth={true}
			footer={
				<>
					Already have an account?{" "}
					<a
						href="/auth/sign-in"
						className="underline-offset-4 hover:underline"
					>
						Sign in
					</a>
				</>
			}
		>
			<div className="grid grid-cols-2 gap-3">
				<form.Field name="firstName">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid} className="-space-y-2">
								<FieldLabel htmlFor={field.name}>First Name</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									type="text"
									placeholder="john"
									autoComplete="given-name"
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

				<form.Field name="lastName">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid} className="-space-y-2">
								<FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									type="text"
									placeholder="doe"
									autoComplete="family-name"
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
			</div>

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
								autoComplete="new-password"
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
							{isSubmitting ? "Creating account..." : "Create Account"}
						</Button>
					)}
				</form.Subscribe>
			</Field>
		</AuthWrapper>
	);
};
