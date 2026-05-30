"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
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
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-ink"
      aria-roledescription="carousel"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchX.current = null;
      }}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.3 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Blurred, dimmed fill so the sides are soft colour rather than bars */}
          <Image
            src={slide.image}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="scale-110 object-cover blur-2xl"
            aria-hidden
          />
          <div className="absolute inset-0 bg-ink/55" />

          {/* The actual image, shown in full (no top/bottom crop) within the
              content column, clear of the nav (top) and the dots (bottom) */}
          <div className="relative flex h-full items-center px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
            <div className="mx-auto h-full w-full max-w-[1320px]">
              <div className="relative h-full w-full overflow-hidden rounded-xl shadow-e3">
              <Image
                src={slide.image}
                alt=""
                fill
                priority
                quality={92}
                sizes="(max-width: 1320px) 100vw, 1320px"
                className="object-contain"
              />
              {/* legibility scrim only over the image, fading from the left */}
              <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Brand aurora glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(50% 50% at 78% 18%, rgba(123,186,60,.5), transparent 60%), radial-gradient(40% 40% at 12% 85%, rgba(45,156,219,.4), transparent 60%)",
        }}
      />

      {/* Eyebrow tag — top-right, dropped to the headline level (sits beside the big text) */}
      <Container className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 pt-14 sm:block">
        <div className="flex justify-end">
          <AnimatePresence mode="wait">
            <motion.p
              key={`eyebrow-${index}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-prelli-green" />
              {slide.eyebrow}
            </motion.p>
          </AnimatePresence>
        </div>
      </Container>

      {/* Content — pushed down so it sits clearly below the menu bar */}
      <Container className="relative z-10 flex h-full items-center pt-28 sm:pt-32">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Mobile eyebrow (inline, since the logo is small/centered there) */}
              <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur sm:hidden">
                <span className="h-2 w-2 rounded-full bg-prelli-green" />
                {slide.eyebrow}
              </p>
              <h1 className="text-display font-display font-bold text-white drop-shadow-sm">
                {slide.title}{" "}
                <span className="text-prelli-green">{slide.highlight}</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/donate" size="lg">
              <Heart className="h-5 w-5" /> Make a difference
            </Button>
            <Button
              href="/about"
              variant="secondary"
              size="lg"
              className="border-white/25 bg-white/10 text-white backdrop-blur hover:border-white hover:bg-white hover:text-ink"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>

      {/* Prev/next arrows — bottom-right of the content column, level with the CTAs */}
      <Container className="pointer-events-none absolute inset-x-0 bottom-16 z-20 hidden sm:block">
        <div className="pointer-events-auto flex justify-end gap-3">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="inline-flex h-12 w-12 items-center justify-center rounded-pill border border-white/20 bg-white/10 text-white backdrop-blur transition-all hover:bg-white/25"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="inline-flex h-12 w-12 items-center justify-center rounded-pill border border-white/20 bg-white/10 text-white backdrop-blur transition-all hover:bg-white/25"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </Container>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
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
