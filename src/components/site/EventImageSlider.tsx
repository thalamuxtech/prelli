"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

/**
 * Event image slider (media rules): shows up to 5 images as an auto-advancing
 * slider on the card, with a "full view" button that opens a navigable lightbox.
 * Images only, no video.
 */
export function EventImageSlider({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const reduce = useReducedMotion();
  const imgs = images.slice(0, 5);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);

  const next = useCallback(() => setI((p) => (p + 1) % imgs.length), [imgs.length]);
  const prev = useCallback(() => setI((p) => (p - 1 + imgs.length) % imgs.length), [imgs.length]);

  // Auto-advance on the card (paused for reduced motion / single image / lightbox open).
  useEffect(() => {
    if (reduce || imgs.length <= 1 || open) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [reduce, imgs.length, open, next]);

  // Keyboard nav in lightbox.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev]);

  if (imgs.length === 0) return null;

  return (
    <>
      {/* Card slider */}
      <div className="group/slider relative h-full w-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={i}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image src={imgs[i]} alt={alt} fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>

        {/* full-view button */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open full view"
          className="absolute right-2 top-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-pill bg-ink/55 text-white backdrop-blur transition-colors hover:bg-ink/80"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {imgs.length > 1 && (
          <>
            <button type="button" onClick={prev} aria-label="Previous image" className="absolute left-2 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-pill bg-ink/45 text-white opacity-0 backdrop-blur transition-opacity hover:bg-ink/70 group-hover/slider:opacity-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={next} aria-label="Next image" className="absolute right-2 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-pill bg-ink/45 text-white opacity-0 backdrop-blur transition-opacity hover:bg-ink/70 group-hover/slider:opacity-100">
              <ChevronRight className="h-4 w-4" />
            </button>
            {/* dots */}
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {imgs.map((_, d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setI(d)}
                  aria-label={`Image ${d + 1}`}
                  className={`h-1.5 rounded-pill transition-all ${d === i ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox / full view */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-pill bg-white/10 text-white hover:bg-white/20"
              style={{ top: "max(1rem, env(safe-area-inset-top))" }}
            >
              <X className="h-6 w-6" />
            </button>

            <motion.div
              key={i}
              className="relative max-h-[82vh] w-full max-w-4xl overflow-hidden rounded-lg"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={imgs[i]} alt={alt} width={1280} height={960} className="h-auto max-h-[82vh] w-full object-contain" />
            </motion.div>

            {imgs.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-pill bg-white/10 text-white hover:bg-white/20">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-pill bg-white/10 text-white hover:bg-white/20">
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-pill bg-white/10 px-3 py-1 text-sm text-white">
                  {i + 1} / {imgs.length}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
