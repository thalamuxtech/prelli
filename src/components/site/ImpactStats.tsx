"use client";

import { Counter } from "@/components/motion/Counter";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

const stats = [
  { value: 8, suffix: "+", label: "Years of service" },
  { value: 25, suffix: "+", label: "Communities reached" },
  { value: 2500, suffix: "+", label: "Women empowered" },
  { value: 4000, suffix: "+", label: "Lives touched" },
];

/**
 * Animated impact counters (§2.5). `variant="dark"` renders glassy tiles on a
 * dark band; default renders light cards.
 */
export function ImpactStats({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <Stagger className={cn("grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4", className)}>
      {stats.map((s) => (
        <StaggerItem key={s.label}>
          <div
            className={cn(
              "group relative overflow-hidden rounded-lg p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:[box-shadow:0_0_0_1px_rgba(123,186,60,.6),0_0_28px_-4px_rgba(123,186,60,.6)]",
              dark
                ? "border border-white/10 bg-white/5 backdrop-blur"
                : "border border-line bg-white shadow-e1",
            )}
          >
            {/* neon glow that lights up + pulses on hover */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:animate-glow group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(60% 70% at 50% 0%, rgba(123,186,60,.35), transparent 70%)",
              }}
            />
            <div className="relative">
              <div
                className={cn(
                  "font-display text-4xl font-bold sm:text-5xl",
                  dark ? "text-white" : "text-prelli-green",
                )}
              >
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className={cn("mt-2 text-sm font-medium", dark ? "text-white/75" : "text-slate")}>
                {s.label}
              </p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
