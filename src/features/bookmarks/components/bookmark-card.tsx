import {
	RiDeleteBinLine,
	RiEditLine,
	RiExternalLinkLine,
	RiGlobalLine,
} from "@remixicon/react";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/shared/components/ui/card";
import type { BookmarkDocument } from "../types";
import { getDomain } from "../utils";

type BookmarkCardProps = {
	bookmark: BookmarkDocument;
	onOpen: (bookmark: BookmarkDocument) => void;
	onEdit: (bookmark: BookmarkDocument) => void;
	onDelete: (bookmark: BookmarkDocument) => void;
};

export function BookmarkCard({ bookmark, onOpen, onEdit, onDelete }: BookmarkCardProps) {
	function handleBodyKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.target !== event.currentTarget) return;
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onOpen(bookmark);
		}
	}

	return (
		<Card className="group flex min-w-0 flex-col overflow-hidden transition-colors hover:border-foreground/20">
			<div
				role="button"
				tabIndex={0}
				className="flex flex-1 cursor-pointer flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
				onClick={() => onOpen(bookmark)}
				onKeyDown={handleBodyKeyDown}
				aria-label={`View bookmark: ${bookmark.title}`}
			>
				<CardHeader className="w-full gap-3">
					<div className="flex min-w-0 items-center gap-3">
						<div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
							{bookmark.faviconUrl ? (
								<img src={bookmark.faviconUrl} alt="" className="size-5 object-contain" loading="lazy" />
							) : (
								<RiGlobalLine className="size-4 text-muted-foreground" aria-hidden="true" />
							)}
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-xs text-muted-foreground">{bookmark.siteName || getDomain(bookmark.url)}</p>
							<h2 className="mt-1 line-clamp-2 font-medium leading-snug">{bookmark.title}</h2>
						</div>
					</div>
				</CardHeader>
				<CardContent className="w-full flex-1">
					{bookmark.imageUrl && (
						<div className="mb-3 aspect-[16/7] overflow-hidden rounded-xl bg-muted">
							<img src={bookmark.imageUrl} alt="" className="size-full object-cover" loading="lazy" />
						</div>
					)}
					<p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
						{bookmark.description || bookmark.url}
					</p>
				</CardContent>
			</div>
			<CardFooter className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
				<a
					href={bookmark.url}
					target="_blank"
					rel="noopener noreferrer"
					className="flex min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground hover:text-foreground"
				>
					<RiExternalLinkLine className="size-3.5 shrink-0" aria-hidden="true" />
					<span className="truncate">{getDomain(bookmark.url)}</span>
				</a>
				<div className="flex shrink-0 items-center gap-1">
					<Button variant="ghost" size="icon-sm" aria-label={`Edit ${bookmark.title}`} onClick={() => onEdit(bookmark)}>
						<RiEditLine aria-hidden="true" />
					</Button>
					<Button variant="ghost" size="icon-sm" aria-label={`Delete ${bookmark.title}`} onClick={() => onDelete(bookmark)}>
						<RiDeleteBinLine aria-hidden="true" />
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
