import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "icon" | "sm" | "lg";
}

const buttonVariants = {
  default:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700 transition",
  outline:
    "border border-gray-300 hover:bg-gray-50 text-gray-700 transition",
};

const buttonSizes = {
  default: "h-10 px-4 py-2",
  icon: "h-10 w-10 p-0 flex items-center justify-center",
  sm: "h-8 px-3",
  lg: "h-12 px-6",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "rounded-md font-medium",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
