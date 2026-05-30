import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Eyebrow + title (+ optional "see all" link), used at the top of sections (§2.6). */
export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  seeAll,
  className,
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
  seeAll?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        seeAll && "sm:flex-row sm:items-end sm:justify-between sm:text-left",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-h2 mt-2 font-display font-bold text-ink">{title}</h2>
      </div>
      {seeAll && (
        <Link
          href={seeAll.href}
          className="group inline-flex items-center gap-1.5 font-semibold text-prelli-green-600 transition-colors hover:text-prelli-green"
        >
          {seeAll.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
