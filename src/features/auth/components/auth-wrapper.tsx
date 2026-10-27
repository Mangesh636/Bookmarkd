import { cn } from "cn";
import type * as React from "react";

import { Button } from "@/shared/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldSeparator,
} from "@/shared/components/ui/field";
import { auth } from "../auth";

interface AuthWrapperProps {
	mode: "sign-in" | "sign-up";
	brandingTitle: string;
	brandingDescription: string;
	title: string;
	description: string;
	children: React.ReactNode;
	footer: React.ReactNode;
	onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
	showOAuth?: boolean;
}

export const AuthWrapper = ({
	mode,
	brandingTitle,
	brandingDescription,
	title,
	description,
	children,
	footer,
	onSubmit,
	showOAuth = false,
}: AuthWrapperProps) => {
	return (
		<div
			className={cn(
				mode === "sign-in"
					? "flex-row"
					: mode === "sign-up"
						? "flex-row-reverse"
						: "",
				"flex min-h-screen w-full",
			)}
		>
			<div className="hidden lg:flex flex-col gap-6 justify-center items-center w-full max-w-md bg-accent-foreground text-white dark:text-black">
				<img
					src="/logo.svg"
					alt="Bookmakrd Logo"
					className="size-20 hover:animate-spin"
				/>
				<div className="space-y-2 text-center">
					<h4 className="text-5xl font-display">{brandingTitle}</h4>
					<p>{brandingDescription}</p>
				</div>
			</div>
			<div className="w-full max-w-120 mx-auto flex flex-col gap-6 justify-center items-center">
				<div className="text-center space-y-0.5">
					<h4 className="font-display text-3xl md:text-5xl">{title}</h4>
					<p className="text-muted-foreground text-sm">{description}</p>
				</div>
				<form
					className="flex flex-col gap-3 max-w-80 w-full"
					onSubmit={onSubmit}
				>
					<div className="space-y-3.5">
						{children}
						{showOAuth && (
							<>
								<FieldSeparator className="uppercase mb-3">or</FieldSeparator>
								<Field>
									<Button
										type="button"
										onClick={() => auth.signInWithGoogle()}
										variant={"secondary"}
									>
										<img
											src="/google.svg"
											alt="Google Logo"
											className="size-4"
										/>
										Continue With Google
									</Button>
								</Field>
								<Field>
									<Button
										type="button"
										onClick={() => auth.signInWithGitHub()}
										variant={"secondary"}
									>
										<img
											src="/github.svg"
											alt="Github Logo"
											className="size-4"
										/>
										Continue With Github
									</Button>
								</Field>
							</>
						)}
						{footer && (
							<Field className="pt-0.5">
								<FieldDescription className="text-center [&>a]:text-foreground [&>a:hover]:text-foreground">
									{footer}
								</FieldDescription>
							</Field>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};
