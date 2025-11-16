import * as React from "react";

export function Input({ className = "", type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`flex h-9 w-full min-w-0 rounded-md border border-input bg-input-background px-3 py-1 text-sm outline-none transition-all placeholder:text-input-placeholder focus:ring-2 focus:ring-ring/50 focus:border-input-border-focus disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}