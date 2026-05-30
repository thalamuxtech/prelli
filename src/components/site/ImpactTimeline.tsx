"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { categoryLabels, categoryColors, type Post } from "@/lib/types";

/**
 * Animated vertical timeline. The center line "grows" as you scroll, dots pop
 * in, and entries slide in from alternating sides.
 */
export function ImpactTimeline({ items }: { items: Post[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative mx-auto mt-14 max-w-3xl">
      {/* track */}
      <div className="absolute left-[7px] top-2 h-full w-0.5 bg-line sm:left-1/2 sm:-translate-x-1/2" />
      {/* growing brand line */}
      <motion.div
        style={{ scaleY: reduce ? 1 : lineScale }}
        className="absolute left-[7px] top-2 h-full w-0.5 origin-top bg-gradient-to-b from-prelli-green via-prelli-blue to-prelli-orange sm:left-1/2 sm:-translate-x-1/2"
      />

      <ol className="space-y-8">
        {items.map((post, i) => {
          const left = i % 2 === 0;
          return (
            <li key={post.id} className="relative">
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: left ? -40 : 40, y: 10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={`relative pl-8 sm:w-1/2 sm:pl-0 ${left ? "sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"}`}
              >
                {/* dot */}
                <motion.span
                  initial={reduce ? { scale: 1 } : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                  className={`absolute top-1.5 z-10 h-4 w-4 rounded-full border-2 border-white bg-prelli-green shadow-e1 ${left ? "left-0 sm:left-auto sm:-right-2" : "left-0 sm:-left-2"}`}
                />
                <div className="glow-card group relative overflow-hidden rounded-lg border border-line bg-white p-5 shadow-e1 transition-all duration-300 hover:-translate-y-1">
                  <span className="border-beam pointer-events-none" />
                  <div className={`relative mb-2 flex items-center gap-2 ${left ? "sm:justify-end" : ""}`}>
                    <span className="font-display text-sm font-bold text-prelli-green-600">{post.year}</span>
                    <Badge className={categoryColors[post.category]}>{categoryLabels[post.category]}</Badge>
                  </div>
                  <h3 className="relative font-display font-semibold leading-snug text-ink">{post.title}</h3>
                  {post.location && (
                    <p className={`relative mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate ${left ? "sm:flex-row-reverse" : ""}`}>
                      <MapPin className="h-3.5 w-3.5" /> {post.location}
                    </p>
                  )}
                </div>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
