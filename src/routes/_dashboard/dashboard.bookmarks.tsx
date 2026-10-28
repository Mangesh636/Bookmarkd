import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/bookmarks")({
	component: Bookmarks,
});

function Bookmarks() {
	return <div>Hello "/_dashboard/bashboard/bookmarks"!</div>;
}
