import * as React from "react";

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ className = "", value = 0 }: ProgressProps) {
  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-primary/20 ${className}`}
    >
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}