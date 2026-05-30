"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

/** Polished animated success panel shared by the public forms. */
export function FormSuccess({
  title,
  message,
  onReset,
  resetLabel = "Send another",
}: {
  title: string;
  message: string;
  onReset?: () => void;
  resetLabel?: string;
}) {
  const reduce = useReducedMotion();
  // Confetti dots that pop outward once on success.
  const dots = [
    { c: "bg-prelli-green", x: -60, y: -28 },
    { c: "bg-prelli-blue", x: 58, y: -34 },
    { c: "bg-prelli-orange", x: -44, y: 30 },
    { c: "bg-prelli-pink", x: 50, y: 28 },
    { c: "bg-prelli-green", x: 0, y: -52 },
  ];

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-lg border border-prelli-green/30 bg-prelli-green-50 p-8 text-center"
    >
      <div className="relative mx-auto h-16 w-16">
        {/* confetti */}
        {!reduce &&
          dots.map((d, i) => (
            <motion.span
              key={i}
              className={`absolute left-1/2 top-1/2 h-2 w-2 rounded-full ${d.c}`}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{ x: d.x, y: d.y, opacity: [0, 1, 0], scale: [0, 1, 0.8] }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            />
          ))}
        {/* ring + check */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-pill bg-prelli-green text-white"
          initial={reduce ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.05 }}
        >
          <motion.span
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Check className="h-8 w-8" strokeWidth={3} />
          </motion.span>
        </motion.div>
      </div>

      <h3 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 leading-relaxed text-slate">{message}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 text-sm font-semibold text-prelli-green-600 hover:underline"
        >
          {resetLabel}
        </button>
      )}
    </motion.div>
  );
}
