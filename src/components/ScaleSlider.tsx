import { useState } from 'react';

interface ScaleSliderProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function ScaleSlider({ value, onChange, options }: ScaleSliderProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const selectedIndex = options.findIndex(opt => opt.value === value);

  return (
    <div className="space-y-4">
      {/* Visual Slider Track */}
      <div className="relative">
        {/* Track background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted rounded-full transform -translate-y-1/2" />
        
        {/* Progress fill */}
        {selectedIndex >= 0 && (
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary rounded-full transform -translate-y-1/2 transition-all duration-300"
            style={{ width: `${(selectedIndex / (options.length - 1)) * 100}%` }}
          />
        )}

        {/* Scale Points */}
        <div className="relative flex justify-between items-center">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHovered = hoveredIndex === index;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  relative flex flex-col items-center group touch-manipulation
                  transition-all duration-300
                `}
                aria-label={`${option.label} (${option.value})`}
              >
                {/* Circle Point */}
                <div 
                  className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 transform
                    ${isSelected 
                      ? 'bg-primary border-primary scale-125 shadow-lg' 
                      : isHovered
                        ? 'bg-primary/20 border-primary/50 scale-110'
                        : 'bg-card border-border hover:border-primary/30 hover:bg-accent'
                    }
                  `}
                >
                  <span 
                    className={`text-xs transition-all duration-300 ${
                      isSelected 
                        ? 'text-primary-foreground' 
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    {option.value}
                  </span>
                </div>

                {/* Label below - shown on hover or selected */}
                <div 
                  className={`
                    absolute top-full mt-2 px-2 py-1 rounded-lg bg-card border border-border
                    text-xs whitespace-nowrap transition-all duration-300 pointer-events-none
                    ${(isSelected || isHovered) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 -translate-y-1'
                    }
                  `}
                >
                  {option.label}
                </div>

                {/* Ripple effect on selection */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Always visible labels at ends */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{options[0].label}</span>
        <span>{options[options.length - 1].label}</span>
      </div>
    </div>
  );
}
