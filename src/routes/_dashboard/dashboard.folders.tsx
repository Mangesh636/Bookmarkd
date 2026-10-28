import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/folders")({
	component: Folder,
});

function Folder() {
	return <div>Hello "/_dashboard/dashboard/folder"!</div>;
}
