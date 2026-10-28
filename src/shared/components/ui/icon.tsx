import type { ComponentProps, ElementType } from "react";

interface IconProps {
	icon: ElementType;
	size?: number | string;
	color?: string;
	className?: string;
}

export function Icon<T extends ElementType>({
	icon: IconComponent,
	size = 24,
	color = "currentColor",
	className,
}: IconProps) {
	const Component = IconComponent as React.ComponentType<{
		size?: number | string;
		color?: string;
		className?: string;
	}>;
	return (
		<Component
			size={size}
			color={color}
			className={className}
			aria-hidden="true"
		/>
	);
}
