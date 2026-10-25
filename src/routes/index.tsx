import { RiErrorWarningLine } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";

import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="mx-auto translate-y-1/2 w-full max-w-xs">
			<Alert>
				<RiErrorWarningLine />
				<AlertTitle>Heads up!</AlertTitle>
				<AlertDescription>
					You can add components and dependencies to your app using the cli.
				</AlertDescription>
				<AlertAction>
					<Button variant="outline">Enable</Button>
				</AlertAction>
			</Alert>
		</div>
	);
}
