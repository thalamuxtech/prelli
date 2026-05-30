import { cn } from "@/lib/utils";

/** Small pill label — used for category tags, status, etc. (§2.6) */
export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold",
        className,
      )}
    >
      {children}
    </span>
  );
}
