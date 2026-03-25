import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/85 border border-transparent",
  outline:
    "bg-transparent text-foreground border border-border hover:bg-muted/60",
  ghost: "bg-transparent text-foreground hover:bg-muted/60 border-transparent",
  destructive:
    "bg-danger text-danger-foreground hover:bg-danger/90 border border-transparent shadow-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      aria-busy={isLoading || props["aria-busy"]}
      disabled={isLoading || props.disabled}
      {...props}
    />
  );
}
