import type { BookmarkMetadata } from "./types";

export function normalizeBookmarkUrl(value: string): string {
	const trimmed = value.trim();
	if (!trimmed) {
		throw new Error("Enter a website URL.");
	}

	const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
		? trimmed
		: `https://${trimmed}`;

	let parsed: URL;
	try {
		parsed = new URL(withProtocol);
	} catch {
		throw new Error("Enter a valid website URL.");
	}

	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
		throw new Error("Only HTTP and HTTPS website URLs are supported.");
	}
	if (!parsed.hostname || parsed.hostname.includes(" ")) {
		throw new Error("Enter a valid website URL.");
	}

	const normalized = parsed.toString();
	if (normalized.length > 2048) {
		throw new Error("Website URLs must be 2048 characters or fewer.");
	}

	return normalized;
}

export function getDomain(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return url;
	}
}

export async function extractBookmarkMetadata(url: string): Promise<BookmarkMetadata> {
	const empty: BookmarkMetadata = {
		title: "",
		description: "",
		siteName: "",
		imageUrl: "",
		faviconUrl: "",
	};

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8000);
		try {
			const response = await fetch(
				`https://api.microlink.io/?url=${encodeURIComponent(url)}`,
				{ signal: controller.signal },
			);
			if (!response.ok) return empty;

			const result = (await response.json()) as {
				status?: string;
				data?: {
					title?: string | null;
					description?: string | null;
					publisher?: string | null;
					image?: { url?: string | null } | null;
					logo?: { url?: string | null } | null;
				};
			};
			if (result.status !== "success" || !result.data) return empty;

			return {
				title: result.data.title?.trim() ?? "",
				description: result.data.description?.trim() ?? "",
				siteName: result.data.publisher?.trim() ?? "",
				imageUrl: result.data.image?.url ?? "",
				faviconUrl: result.data.logo?.url ?? "",
			};
		} finally {
			clearTimeout(timeout);
		}
	} catch {
		// Metadata is best-effort: saving a valid URL must still work if lookup fails.
		return empty;
	}
}
