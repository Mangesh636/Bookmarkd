import { z } from "zod";

export const SignInSchema = z.object({
	email: z.email("Enter a valid email address."),
	password: z.string().min(1, "Password is required."),
});

export const SignUpSchema = z.object({
	firstName: z.string().trim().min(1, "First name is required."),
	lastName: z.string().trim().min(1, "Last name is required."),
	email: z.email("Enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters."),
});
