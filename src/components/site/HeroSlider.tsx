"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useHeroSlides } from "@/lib/usePublicContent";
import { defaultHeroSlides } from "@/content/heroSlides";

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
}

const defaultSlides: Slide[] = defaultHeroSlides;

const AUTO_MS = 6000;

export function HeroSlider() {
  const reduce = useReducedMotion();
  const adminSlides = useHeroSlides();
  const slides: Slide[] = adminSlides.length
    ? adminSlides.map((s) => ({
        image: s.image,
        eyebrow: s.eyebrow || "Precious Little Lives Initiative",
        title: s.title,
        highlight: s.highlight || "",
        body: s.body || "",
      }))
    : defaultSlides;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number, d: number) => {
    setDir(d);
    setIndex((next + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => go(index + 1, 1), [index, go]);
  const prev = useCallback(() => go(index - 1, -1), [index, go]);

  // Auto-advance (paused when reduced-motion is preferred).
  useEffect(() => {
    if (reduce || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_MS);
    return () => clearInterval(id);
  }, [reduce, index, slides.length]);

  const slide = slides[Math.min(index, slides.length - 1)];
  if (!slide) return null;

  return (
    <section
      className="relative flex min-h-[560px] w-full flex-col overflow-hidden bg-ink lg:h-[82vh] lg:flex-row"
      aria-roledescription="carousel"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchX.current = null;
      }}
    >
      {/* ── LEFT: text panel (transparent — section bg + dissolve gradient
              provide the dark backing, so there's no hard rectangle edge) ── */}
      <div className="relative z-20 flex w-full flex-col px-6 pb-24 pt-32 sm:px-10 lg:w-[46%] lg:pb-20 lg:pt-40 lg:pl-[max(2.5rem,calc((100vw-1200px)/2))]">
        {/* subtle brand glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 25%, rgba(123,186,60,.20), transparent 60%), radial-gradient(50% 50% at 10% 90%, rgba(45,156,219,.16), transparent 60%)",
          }}
        />
        {/* Text block — sits in the lower part of the panel */}
        <div className="relative flex flex-1 flex-col justify-end pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-prelli-green" />
                {slide.eyebrow}
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-[clamp(2.5rem,3.4vw,4rem)]">
                {slide.title}{" "}
                <span className="text-prelli-green">{slide.highlight}</span>.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 lg:text-lg">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons — smaller, pinned to the bottom level with dots & arrows */}
        <div className="relative flex flex-wrap items-center gap-3">
          <Button href="/donate" size="sm">
            <Heart className="h-4 w-4" /> Make a difference
          </Button>
          <Button
            href="/about"
            variant="secondary"
            size="sm"
            className="border-white/25 bg-white/10 text-white backdrop-blur hover:border-white hover:bg-white hover:text-ink"
          >
            Learn more <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── RIGHT: image (70%), natural, fills its column ──────── */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-auto lg:flex-1">
        {/* Render every slide image stacked; only the active one is opaque.
            This guarantees the current image is always visible (no hydration /
            AnimatePresence race that could leave the first slide blank). */}
        {slides.map((s, i) => (
          <motion.div
            key={s.image + i}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.04 }}
            transition={{ duration: reduce ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{ zIndex: i === index ? 1 : 0 }}
          >
            <Image
              src={s.image}
              alt={s.eyebrow}
              fill
              priority={i === 0}
              quality={92}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </motion.div>
        ))}
        {/* vertical bottom scrim for legibility of the controls */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />

        {/* Prev/next arrows — bottom-right of the image */}
        <div className="absolute bottom-5 right-5 z-30 flex gap-3 sm:bottom-6 sm:right-6">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-white/25 bg-ink/40 text-white backdrop-blur transition-all hover:bg-ink/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-white/25 bg-ink/40 text-white backdrop-blur transition-all hover:bg-ink/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Dissolve seam — solid dark across the text panel, then a long, gentle
          fade deep into the image so there's no visible edge (desktop only).
          Sits above the image (z-1) but below the text (z-20). */}
      <div
        className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, #1b2430 0%, #1b2430 38%, rgba(27,36,48,0.92) 48%, rgba(27,36,48,0.7) 58%, rgba(27,36,48,0.4) 70%, rgba(27,36,48,0.15) 82%, transparent 95%)",
        }}
      />

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > index ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-pill transition-all duration-300 ${
              i === index ? "w-8 bg-prelli-green" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Auto-advance progress bar */}
      {!reduce && (
        <motion.div
          key={`bar-${index}`}
          className="absolute bottom-0 left-0 z-20 h-1 bg-prelli-green"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
        />
      )}
    </section>
  );
}
