import * as React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`flex items-center gap-2 text-sm leading-none font-medium select-none ${className}`}
      {...props}
    />
  );
}
