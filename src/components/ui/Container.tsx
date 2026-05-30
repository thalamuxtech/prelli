import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Max-width content wrapper with the standard fluid gutters (§2.3). */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("container-px mx-auto w-full max-w-content", className)}>
      {children}
    </Tag>
  );
}
