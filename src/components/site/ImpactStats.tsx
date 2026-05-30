"use client";

import { Counter } from "@/components/motion/Counter";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

const stats = [
  { value: 8, suffix: "+", label: "Years of service" },
  { value: 12, suffix: "+", label: "Communities reached" },
  { value: 500, suffix: "+", label: "Women empowered" },
  { value: 1000, suffix: "+", label: "Lives touched" },
];

/** Animated impact counters — used on the home and impact pages (§2.5). */
export function ImpactStats({ className }: { className?: string }) {
  return (
    <Stagger
      className={cn("grid grid-cols-2 gap-6 lg:grid-cols-4", className)}
    >
      {stats.map((s) => (
        <StaggerItem key={s.label}>
          <div className="rounded-lg border border-line bg-white p-6 text-center shadow-e1">
            <div className="font-display text-4xl font-bold text-prelli-green sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm font-medium text-slate">{s.label}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
