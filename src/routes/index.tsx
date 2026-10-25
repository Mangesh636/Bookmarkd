import { createFileRoute } from "@tanstack/react-router";

import { appwriteClient } from "@/integrations/appwrite/config";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { toast } from "@/shared/components/ui/toast";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	async function handlePing() {
		const id = toast.add({ title: "Pinging Appwrite..." });

		try {
			const response = await appwriteClient.ping();
			console.log("Appwrite connection successful:", response);
			toast.add({ title: "Appwrite connection successful!" });
		} catch (error) {
			console.error("Appwrite ping failed:", error);
			toast.add({ title: "Failed to connect to Appwrite." });
		}
	}
	return (
		<div className="mx-auto translate-y-1/2 w-full max-w-xs">
			<Alert>
				<AlertTitle>Test Appwrite Connection</AlertTitle>
				<AlertDescription>
					Making a call to test appwrite connection
				</AlertDescription>
				<AlertAction onClick={handlePing}>
					<Button variant="outline" onClick={handlePing}>
						Ping
					</Button>
				</AlertAction>
			</Alert>
		</div>
	);
}
