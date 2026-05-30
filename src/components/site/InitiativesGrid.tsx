"use client";

import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useInitiatives } from "@/lib/usePublicContent";

/** Initiatives grid (Firestore-backed, admin-managed, seed fallback). */
export function InitiativesGrid() {
  const initiatives = useInitiatives();
  return (
    <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {initiatives.map((item, i) => (
        <StaggerItem key={item.title}>
          <article className="glow-card group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white p-7 shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-1">
            <span className="border-beam pointer-events-none absolute inset-0 rounded-lg" />
            <span className="relative font-display text-sm font-bold text-prelli-green/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="relative mt-2 font-display text-lg font-semibold text-ink transition-colors group-hover:text-prelli-green-600">
              {item.title}
            </h2>
            <p className="relative mt-2 text-sm leading-relaxed text-slate">{item.summary}</p>
          </article>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
