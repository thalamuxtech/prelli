"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const baseInput =
  "w-full rounded-md border border-line bg-white px-4 py-3 text-ink placeholder:text-slate/60 transition-colors focus-visible:border-prelli-green focus-visible:outline-none";

export function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children}
    </label>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(baseInput, className)} {...props} />;
}

/**
 * Password input with a show/hide toggle. Accepts all the usual input props
 * (name, required, minLength, autoComplete, defaultValue, etc.). When the eye
 * is toggled the field switches between type="password" and type="text".
 */
export function PasswordInput({
  className,
  defaultVisible = false,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  defaultVisible?: boolean;
}) {
  const [show, setShow] = useState(defaultVisible);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={cn(baseInput, "pr-12", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate transition-colors hover:text-ink"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(baseInput, "min-h-[140px] resize-y", className)} {...props} />;
}
