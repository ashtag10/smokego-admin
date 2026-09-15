import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-smoke-white">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-smoke-card border border-smoke-border rounded-lg px-4 py-2.5 text-sm text-smoke-white placeholder:text-smoke-muted",
            "focus:outline-none focus:border-smoke-gold/50 focus:ring-1 focus:ring-smoke-gold/20",
            "transition-colors",
            error && "border-smoke-red focus:border-smoke-red focus:ring-smoke-red/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-smoke-red-light">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";