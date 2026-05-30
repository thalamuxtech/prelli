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

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(baseInput, "min-h-[140px] resize-y", className)} {...props} />;
}
