"use client";

import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightSlot?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, rightSlot, error, className = "", disabled, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={[
              "w-full h-11 rounded-xl border border-[#E5E5EA] px-4 text-sm",
              "bg-white text-[var(--foreground)] placeholder:text-[var(--muted)]",
              "transition-colors duration-150",
              "hover:border-[#C7C7CC]",
              "focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20",
              "disabled:bg-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-60",
              rightSlot ? "pr-12" : "",
              error ? "border-red-500 focus:ring-red-200" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...rest}
          />
          {rightSlot && (
            <div className="absolute right-3 flex items-center">{rightSlot}</div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
