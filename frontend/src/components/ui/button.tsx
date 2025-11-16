import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const buttonStyles = {
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none cursor-pointer",
  variants: {
    default: "bg-primary text-primary-foreground hover:bg-primary-hover",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
    outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
  sizes: {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 py-1.5",
    lg: "h-10 px-6 py-2",
    icon: "h-9 w-9",
  },
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const variantClass = buttonStyles.variants[variant];
  const sizeClass = buttonStyles.sizes[size];
  
  return (
    <button
      className={`${buttonStyles.base} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    />
  );
}