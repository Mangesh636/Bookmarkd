import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/trash")({
	component: Trash,
});

function Trash() {
	return <div>Hello "/_dashboard/dashboard/trash"!</div>;
}
