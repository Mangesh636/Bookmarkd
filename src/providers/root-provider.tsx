import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";

export default function AppProvider({
	theme,
	children,
}: {
	theme: "light" | "dark";
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider theme={theme}>
			<TooltipProvider>{children}</TooltipProvider>
		</ThemeProvider>
	);
}
