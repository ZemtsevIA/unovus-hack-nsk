import * as React from "react";

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  className?: string;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

export function RadioGroup({ value, onValueChange, className = "", children }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`grid gap-2 ${className}`}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, id, className = "" }: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  const isChecked = context.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      id={id}
      className={`relative h-4 w-4 rounded-full border border-border transition-all outline-none focus:ring-2 focus:ring-ring/50 ${
        isChecked ? 'border-primary' : ''
      } ${className}`}
      onClick={() => context.onValueChange?.(value)}
    >
      {isChecked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </button>
  );
}