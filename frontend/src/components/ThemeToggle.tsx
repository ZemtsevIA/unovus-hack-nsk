import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { actualTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-11 h-11 rounded-xl bg-muted hover:bg-muted/80 transition-all duration-300 group overflow-hidden"
      aria-label={actualTheme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
      type="button"
    >
      {/* Animated background gradient on hover */}
      <span 
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
      />
      
      {/* Sun icon for light mode - Enhanced with rays */}
      <div className={`absolute transition-all duration-500 ease-out ${
        actualTheme === 'light' 
          ? 'rotate-0 scale-100 opacity-100' 
          : 'rotate-180 scale-0 opacity-0'
      }`}>
        <Sun 
          className="w-5 h-5 text-primary group-hover:text-primary-hover"
        />
        {/* Sun rays animation */}
        <Sparkles 
          className="absolute -top-1 -right-1 w-3 h-3 text-primary opacity-60 animate-pulse"
        />
      </div>
      
      {/* Moon icon for dark mode - Enhanced with glow */}
      <div className={`absolute transition-all duration-500 ease-out ${
        actualTheme === 'dark' 
          ? 'rotate-0 scale-100 opacity-100' 
          : '-rotate-180 scale-0 opacity-0'
      }`}>
        <Moon 
          className="w-5 h-5 text-primary group-hover:text-primary-hover dark:glow-effect"
        />
        {/* Stars for dark mode */}
        <div className="absolute -top-1 -left-1 w-1 h-1 rounded-full bg-primary animate-pulse" />
        <div className="absolute -bottom-0.5 -right-1 w-1 h-1 rounded-full bg-primary animate-pulse delay-300" style={{ animationDelay: '300ms' }} />
      </div>
      
      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-xl scale-0 group-active:scale-100 bg-primary/20 transition-transform duration-150" />
      
      {/* Focus ring */}
      <span className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-focus-visible:ring-primary/50 transition-all duration-200" />
    </button>
  );
}
