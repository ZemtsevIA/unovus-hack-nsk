import * as React from "react";

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 ${className}`}
      {...props}
    />
  );
}

export function CardTitle({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      className={`leading-none ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <p
      className={`text-muted-foreground ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`px-6 pb-6 ${className}`}
      {...props}
    />
  );
}

export function CardFooter({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`flex items-center px-6 pb-6 ${className}`}
      {...props}
    />
  );
}