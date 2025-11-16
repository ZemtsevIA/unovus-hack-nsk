import * as React from "react";

export function Table({ className = "", ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className = "", ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={`border-b ${className}`}
      {...props}
    />
  );
}

export function TableBody({ className = "", ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={className}
      {...props}
    />
  );
}

export function TableFooter({ className = "", ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={`bg-gray-50 border-t font-medium ${className}`}
      {...props}
    />
  );
}

export function TableRow({ className = "", ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={`hover:bg-gray-50 border-b transition-colors ${className}`}
      {...props}
    />
  );
}

export function TableHead({ className = "", ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={`text-gray-900 h-10 px-2 text-left align-middle font-medium whitespace-nowrap ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = "", ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={`p-2 align-middle whitespace-nowrap ${className}`}
      {...props}
    />
  );
}

export function TableCaption({ className = "", ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      className={`text-gray-600 mt-4 text-sm ${className}`}
      {...props}
    />
  );
}
