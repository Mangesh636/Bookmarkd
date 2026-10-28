import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/favorites")({
	component: Favorites,
});

function Favorites() {
	return <div>Hello "/_dashboard/dashboard/favorites"!</div>;
}
