import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-200 ease-out-expo focus-visible:outline-none disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-prelli-green text-white shadow-e1 hover:-translate-y-0.5 hover:bg-prelli-green-600 hover:shadow-e2 active:translate-y-0 active:scale-[0.98]",
  secondary:
    "border border-line bg-white text-ink hover:border-prelli-green hover:text-prelli-green-600",
  ghost: "text-ink hover:bg-prelli-green-50 hover:text-prelli-green-600",
};

// >=44px tall on every size for touch targets (§2.7)
const sizes: Record<Size, string> = {
  sm: "min-h-[44px] px-4 text-sm",
  md: "min-h-[44px] px-6 py-2.5",
  lg: "min-h-[52px] px-7 py-3.5 text-[1.0625rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & { href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
