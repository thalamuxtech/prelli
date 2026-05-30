"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useHeroSlides } from "@/lib/usePublicContent";

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
}

const defaultSlides: Slide[] = [
  {
    image: "/stories/al-ansar-orphanage-home-ramadan-donation-2025.jpg",
    eyebrow: "Precious Little Lives Initiative · since 2018",
    title: "Bringing hope to",
    highlight: "precious little lives",
    body: "We care for orphans, widows, and the elderly across Nigeria, supporting the whole family and not just the child.",
  },
  {
    image: "/stories/christ-foundation-orphanage-home-widows-outreach-2021.jpg",
    eyebrow: "Empowering families in need",
    title: "Restoring dignity,",
    highlight: "one family at a time",
    body: "From orphanage homes to families across the FCT, we put relief and encouragement directly into the hands that need it most.",
  },
  {
    image: "/stories/prelli-fun-fair-for-orphans-and-widows-2019.jpg",
    eyebrow: "Joy for orphans and widows",
    title: "Every act of kindness",
    highlight: "brings hope and relief",
    body: "Fun fairs, food drives, and outreach that create moments of joy and lasting change for the communities we serve.",
  },
  {
    image: "/stories/orphanage-home-outreach-kaduna-2018.jpg",
    eyebrow: "Supporting the less privileged",
    title: "Creating pathways to",
    highlight: "a brighter future",
    body: "Education, nutrition, and care that break cycles of hardship for children who deserve the chance to thrive.",
  },
];

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
      className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-ink"
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
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={index}
          custom={dir}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.3 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Cinematic scrim for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
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

      {/* Content */}
      <Container className="relative z-10 flex h-full items-center">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
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

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-pill border border-white/20 bg-white/10 text-white backdrop-blur transition-all hover:bg-white/25 sm:flex"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-pill border border-white/20 bg-white/10 text-white backdrop-blur transition-all hover:bg-white/25 sm:flex"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

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
