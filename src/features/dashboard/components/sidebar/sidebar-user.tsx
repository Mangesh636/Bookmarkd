import {
	RiLogoutBoxRLine,
	RiMore2Line,
	RiSettings2Line,
	RiUserLine,
} from "@remixicon/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/features/auth/auth";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Icon } from "@/shared/components/ui/icon";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/shared/components/ui/sidebar";
import { toast } from "@/shared/components/ui/toast";

type AuthenticatedUser = Awaited<ReturnType<typeof auth.getSession>>;

function getInitials(name: string, email: string) {
	const initials = name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0])
		.join("");

	return (initials || email[0] || "?").toUpperCase();
}

export function SidebarUser() {
	const navigate = useNavigate();
	const { isMobile } = useSidebar();

	const [user, setUser] = useState<AuthenticatedUser | null>(null);
	const [checkingSession, setCheckingSession] = useState(true);
	const [signingOut, setSigningOut] = useState(false);

	useEffect(() => {
		let active = true;

		void auth
			.getSession()
			.then((currentUser) => {
				if (active) setUser(currentUser);
			})
			.catch(() => {
				if (active) setUser(null);
			})
			.finally(() => {
				if (active) setCheckingSession(false);
			});

		return () => {
			active = false;
		};
	}, []);

	async function handleSignOut() {
		setSigningOut(true);

		try {
			await auth.signOut();
			setUser(null);

			toast.add({
				type: "success",
				description: "Signed out successfully.",
			});

			await navigate({ to: "/" });
		} catch {
			toast.add({
				type: "error",
				description: "Unable to sign out. Please try again.",
			});
		} finally {
			setSigningOut(false);
		}
	}

	const name = user?.name?.trim() || "Your account";
	const email = user?.email || "Not signed in";
	const initials = getInitials(name, email);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						aria-label="Open user menu"
						disabled={checkingSession || signingOut}
						render={
							<SidebarMenuButton
								size="lg"
								className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
							/>
						}
					>
						<Avatar className="h-8 w-8 rounded-lg">
							{user && (
								<AvatarImage
									src={auth.getUserPhoto(user.$id).toString()}
									alt={`${name}'s profile photo`}
								/>
							)}
							<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
						</Avatar>

						<div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">
								{checkingSession ? "Loading account..." : name}
							</span>
						</div>
						<Icon
							icon={RiMore2Line}
							className="ml-auto text-muted-foreground"
							aria-hidden="true"
						/>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-2 py-2">
									<Avatar className="h-9 w-9 rounded-lg">
										{user && (
											<AvatarImage
												src={auth.getUserPhoto(user.$id).toString()}
												alt={`${name}'s profile photo`}
											/>
										)}
										<AvatarFallback className="rounded-lg">
											{initials}
										</AvatarFallback>
									</Avatar>

									<div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{name}</span>
										<span className="truncate text-xs text-muted-foreground">
											{email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem render={<Link to="/dashboard/settings" />}>
								<Icon icon={RiUserLine} />
								Profile
							</DropdownMenuItem>

							{user ? (
								<DropdownMenuItem render={<Link to="/dashboard/profile" />}>
									<span className="inline-flex size-4 items-center justify-center">
										<Icon icon={RiSettings2Line} />
									</span>
									Setting
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem render={<Link to="/auth/sign-in" />}>
									Sign in
								</DropdownMenuItem>
							)}
						</DropdownMenuGroup>

						{user && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									disabled={signingOut}
									onClick={() => void handleSignOut()}
									variant="destructive"
								>
									<Icon icon={RiLogoutBoxRLine} />
									{signingOut ? "Signing out..." : "Sign out"}
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
