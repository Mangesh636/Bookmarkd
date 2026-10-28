import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/archived")({
	component: Archived,
});

function Archived() {
	return <div>Hello "/_dashboard/dashboard/archived"!</div>;
}
