import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/")({
	validateSearch: (search: Record<string, unknown>) => ({
		folder: typeof search.folder === "string" ? search.folder : undefined,
		tag: typeof search.tag === "string" ? search.tag : undefined,
	}),
	component: DashboardOverview,
});

function DashboardOverview() {
	const { folder, tag } = Route.useSearch();

	return (
		<section>
			<h1>Dashboard</h1>

			{folder && <p>Folder: {folder}</p>}
			{tag && <p>Tag: {tag}</p>}

			{!folder && !tag && <p>All bookmarks</p>}
		</section>
	);
}
