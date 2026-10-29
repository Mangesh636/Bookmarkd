import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	RiAddLine,
	RiAlertLine,
	RiBookmark3Line,
	RiDeleteBinLine,
	RiExternalLinkLine,
	RiLoader4Line,
	RiSearchLine,
} from "@remixicon/react";
import { auth } from "@/features/auth/auth";
import { BookmarkCard } from "@/features/bookmarks/components/bookmark-card";
import { BookmarkFormDialog } from "@/features/bookmarks/components/bookmark-form-dialog";
import {
	deleteBookmark,
	listBookmarks,
} from "@/features/bookmarks/bookmarks";
import type { BookmarkDocument } from "@/features/bookmarks/types";
import { getDomain } from "@/features/bookmarks/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { toast } from "@/shared/components/ui/toast";

export const Route = createFileRoute("/_dashboard/dashboard")({
	component: Dashboard,
});

type AuthenticatedUser = Awaited<ReturnType<typeof auth.getSession>>;

function Dashboard() {
	const navigate = useNavigate();
	const [user, setUser] = useState<AuthenticatedUser | null>(null);
	const [checkingSession, setCheckingSession] = useState(true);
	const [bookmarks, setBookmarks] = useState<BookmarkDocument[]>([]);
	const [loadingBookmarks, setLoadingBookmarks] = useState(false);
	const [loadError, setLoadError] = useState("");
	const [search, setSearch] = useState("");
	const [formOpen, setFormOpen] = useState(false);
	const [editingBookmark, setEditingBookmark] = useState<BookmarkDocument | null>(null);
	const [selectedBookmark, setSelectedBookmark] = useState<BookmarkDocument | null>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<BookmarkDocument | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [signingOut, setSigningOut] = useState(false);

	useEffect(() => {
		let active = true;

		void auth
			.getSession()
			.then((currentUser) => {
				if (active) setUser(currentUser);
			})
			.catch(() => {
				if (active) void navigate({ to: "/auth/sign-in", replace: true });
			})
			.finally(() => {
				if (active) setCheckingSession(false);
			});

		return () => {
			active = false;
		};
	}, [navigate]);

	useEffect(() => {
		if (!user) return;
		let active = true;
		setLoadingBookmarks(true);
		setLoadError("");

		void listBookmarks(user.$id)
			.then((result) => {
				if (active) setBookmarks(result);
			})
			.catch((cause) => {
				if (active) {
					setLoadError(
						cause instanceof Error
							? cause.message
							: "Unable to load your bookmarks. Please try again.",
					);
				}
			})
			.finally(() => {
				if (active) setLoadingBookmarks(false);
			});

		return () => {
			active = false;
		};
	}, [user]);

	const filteredBookmarks = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();
		if (!normalizedSearch) return bookmarks;

		return bookmarks.filter((bookmark) =>
			[
				bookmark.title,
				bookmark.url,
				bookmark.description,
				bookmark.siteName,
			].some((value) => value.toLowerCase().includes(normalizedSearch)),
		);
	}, [bookmarks, search]);

	function openAddDialog() {
		setEditingBookmark(null);
		setFormOpen(true);
	}

	function openEditDialog(bookmark: BookmarkDocument) {
		setDetailsOpen(false);
		setSelectedBookmark(null);
		setEditingBookmark(bookmark);
		setFormOpen(true);
	}

	function handleSaved(saved: BookmarkDocument) {
		setBookmarks((current) => {
			const exists = current.some((bookmark) => bookmark.$id === saved.$id);
			return exists
				? current.map((bookmark) => (bookmark.$id === saved.$id ? saved : bookmark))
				: [saved, ...current];
		});
		if (selectedBookmark?.$id === saved.$id) setSelectedBookmark(saved);
	}

	async function handleDelete() {
		if (!deleteTarget) return;
		setDeleting(true);

		try {
			await deleteBookmark(deleteTarget.$id);
			setBookmarks((current) =>
				current.filter((bookmark) => bookmark.$id !== deleteTarget.$id),
			);
			if (selectedBookmark?.$id === deleteTarget.$id) {
				setSelectedBookmark(null);
				setDetailsOpen(false);
			}
			toast.add({ type: "success", description: "Bookmark deleted." });
			setDeleteTarget(null);
		} catch (cause) {
			toast.add({
				type: "error",
				description:
					cause instanceof Error ? cause.message : "Unable to delete this bookmark.",
			});
		} finally {
			setDeleting(false);
		}
	}

	async function handleSignOut() {
		setSigningOut(true);
		try {
			await auth.signOut();
			toast.add({ type: "success", description: "Signed out successfully." });
			await navigate({ to: "/", replace: true });
		} catch {
			toast.add({
				type: "error",
				description: "Unable to sign out. Please try again.",
			});
		} finally {
			setSigningOut(false);
		}
	}

	if (checkingSession || !user) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-background">
				<p className="text-sm text-muted-foreground">
					{checkingSession ? "Checking your session..." : "Redirecting to sign in..."}
				</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-background">
			<header className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-8">
				<a href="/" className="font-display text-xl font-semibold tracking-tight">
					bookmarkd
				</a>
				<div className="flex items-center gap-3">
					<span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">
						{user.name || user.email}
					</span>
					<Button variant="outline" size="sm" disabled={signingOut} onClick={() => void handleSignOut()}>
						{signingOut ? "Signing out..." : "Sign out"}
					</Button>
				</div>
			</header>

			<section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
				<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
					<div>
						<p className="text-sm text-muted-foreground">Your personal library</p>
						<h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
							Your bookmarks
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							{bookmarks.length} {bookmarks.length === 1 ? "link" : "links"} saved
						</p>
					</div>
					<Button onClick={openAddDialog}>
						<RiAddLine aria-hidden="true" />
						Add bookmark
					</Button>
				</div>

				<div className="mt-8 max-w-lg">
					<div className="relative">
						<RiSearchLine className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search your bookmarks..."
							aria-label="Search bookmarks"
							className="h-10 pl-9"
						/>
					</div>
				</div>

				{loadError ? (
					<div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-5" role="alert">
						<div className="flex items-start gap-3">
							<RiAlertLine className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
							<div className="min-w-0 flex-1">
								<h2 className="font-medium">Bookmarks could not be loaded</h2>
								<p className="mt-1 break-words text-sm text-muted-foreground">{loadError}</p>
								<Button className="mt-3" variant="outline" size="sm" onClick={() => {
									setUser({ ...user });
								}}>
									Retry
								</Button>
							</div>
						</div>
					</div>
				) : loadingBookmarks ? (
					<div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
						<RiLoader4Line className="size-4 animate-spin" aria-hidden="true" />
						Loading your bookmarks...
					</div>
				) : filteredBookmarks.length > 0 ? (
					<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{filteredBookmarks.map((bookmark) => (
							<BookmarkCard
								key={bookmark.$id}
								bookmark={bookmark}
								onOpen={(item) => {
									setSelectedBookmark(item);
									setDetailsOpen(true);
								}}
								onEdit={openEditDialog}
								onDelete={setDeleteTarget}
							/>
						))}
					</div>
				) : bookmarks.length > 0 ? (
					<div className="mt-16 text-center">
						<RiSearchLine className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
						<h2 className="mt-3 font-medium">No matching bookmarks</h2>
						<p className="mt-1 text-sm text-muted-foreground">Try another title, URL, or keyword.</p>
						<Button variant="outline" className="mt-4" onClick={() => setSearch("")}>Clear search</Button>
					</div>
				) : (
					<div className="mt-12 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-12 text-center">
						<div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
							<RiBookmark3Line className="size-6 text-muted-foreground" aria-hidden="true" />
						</div>
						<h2 className="mt-4 font-display text-xl font-semibold">Your library starts here</h2>
						<p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
							Save articles, tools, and websites you want to come back to. Add your first bookmark to get started.
						</p>
						<Button className="mt-5" onClick={openAddDialog}>
							<RiAddLine aria-hidden="true" />
							Add your first bookmark
						</Button>
					</div>
				)}
			</section>

			<BookmarkFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				ownerId={user.$id}
				bookmark={editingBookmark}
				onSaved={handleSaved}
			/>

			<Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
				<DialogContent>
					{selectedBookmark && (
						<>
							<DialogHeader>
								<DialogTitle>{selectedBookmark.title}</DialogTitle>
								<DialogDescription>
									{selectedBookmark.siteName || getDomain(selectedBookmark.url)}
								</DialogDescription>
							</DialogHeader>
							{selectedBookmark.imageUrl && (
								<img src={selectedBookmark.imageUrl} alt="" className="max-h-56 w-full rounded-xl object-cover" />
							)}
							<p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
								{selectedBookmark.description || "No description was saved for this bookmark."}
							</p>
							<a
								href={selectedBookmark.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex min-w-0 items-center gap-2 break-all text-sm text-primary hover:underline"
							>
								<RiExternalLinkLine className="size-4 shrink-0" aria-hidden="true" />
								{selectedBookmark.url}
							</a>
							<DialogFooter>
								<Button variant="outline" onClick={() => openEditDialog(selectedBookmark)}>
									Edit
								</Button>
								<Button onClick={() => {
									setDetailsOpen(false);
									window.open(selectedBookmark.url, "_blank", "noopener,noreferrer");
								}}>
									Open website
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>

			<AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => {
				if (!open && !deleting) setDeleteTarget(null);
			}}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this bookmark?</AlertDialogTitle>
						<AlertDialogDescription>
							{deleteTarget
								? `“${deleteTarget.title}” will be permanently removed from your library.`
								: "This bookmark will be permanently removed from your library."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction variant="destructive" disabled={deleting} onClick={() => void handleDelete()}>
							{deleting && <RiLoader4Line className="size-4 animate-spin" aria-hidden="true" />}
							{deleting ? "Deleting..." : <><RiDeleteBinLine aria-hidden="true" /> Delete bookmark</>}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</main>
	);
}
