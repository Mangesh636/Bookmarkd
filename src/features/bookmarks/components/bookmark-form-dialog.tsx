import { useEffect, useState } from "react";
import { RiLoader4Line, RiLinkM } from "@remixicon/react";
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
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "@/shared/components/ui/toast";
import { createBookmark, updateBookmark } from "../bookmarks";
import type { BookmarkDocument, BookmarkFields } from "../types";
import { extractBookmarkMetadata, getDomain, normalizeBookmarkUrl } from "../utils";

type BookmarkFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	ownerId: string;
	bookmark?: BookmarkDocument | null;
	onSaved: (bookmark: BookmarkDocument) => void;
};

export function BookmarkFormDialog({
	open,
	onOpenChange,
	ownerId,
	bookmark,
	onSaved,
}: BookmarkFormDialogProps) {
	const [url, setUrl] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!open) return;
		setUrl(bookmark?.url ?? "");
		setTitle(bookmark?.title ?? "");
		setDescription(bookmark?.description ?? "");
		setError("");
	}, [open, bookmark]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		setError("");

		try {
			const normalizedUrl = normalizeBookmarkUrl(url);
			const metadata = await extractBookmarkMetadata(normalizedUrl);
			const fields: BookmarkFields = {
				url: normalizedUrl,
				title: title.trim() || metadata.title || getDomain(normalizedUrl),
				description: description.trim() || metadata.description,
				siteName: metadata.siteName || getDomain(normalizedUrl),
				imageUrl: metadata.imageUrl,
				faviconUrl: metadata.faviconUrl,
			};

			const saved = bookmark
				? await updateBookmark(bookmark.$id, fields)
				: await createBookmark(ownerId, fields);

			onSaved(saved);
			onOpenChange(false);
			toast.add({
				type: "success",
				description: bookmark ? "Bookmark updated." : "Bookmark saved.",
			});
		} catch (cause) {
			const message =
				cause instanceof Error ? cause.message : "Unable to save this bookmark.";
			setError(message);
		} finally {
			setSaving(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{bookmark ? "Edit bookmark" : "Add a bookmark"}</DialogTitle>
					<DialogDescription>
						Save a link to revisit later. We’ll try to fetch the page title and description automatically.
					</DialogDescription>
				</DialogHeader>

				<form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
					<div className="grid gap-2">
						<Label htmlFor="bookmark-url">Website URL</Label>
						<div className="relative">
							<RiLinkM className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
							<Input
								id="bookmark-url"
								className="pl-9"
								type="text"
								autoComplete="url"
								placeholder="https://example.com/article"
								value={url}
								onChange={(event) => setUrl(event.target.value)}
								required
								disabled={saving}
							/>
						</div>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="bookmark-title">Title <span className="font-normal text-muted-foreground">(optional)</span></Label>
						<Input
							id="bookmark-title"
							placeholder="A useful article or website"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							maxLength={200}
							disabled={saving}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="bookmark-description">Description <span className="font-normal text-muted-foreground">(optional)</span></Label>
						<Textarea
							id="bookmark-description"
							placeholder="What do you want to remember about this link?"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							maxLength={2000}
							rows={3}
							disabled={saving}
						/>
					</div>

					{error && <p role="alert" className="text-sm text-destructive">{error}</p>}

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
							Cancel
						</Button>
						<Button type="submit" disabled={saving || !url.trim()}>
							{saving && <RiLoader4Line className="size-4 animate-spin" aria-hidden="true" />}
							{saving ? "Saving..." : bookmark ? "Save changes" : "Save bookmark"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
