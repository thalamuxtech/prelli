"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { useSponsors } from "@/lib/usePublicContent";

/**
 * Partners & sponsors band — an infinite auto-scrolling marquee of logos
 * (grayscale, colour on hover), admin-managed via the Sponsors collection.
 * Renders nothing until at least one partner exists.
 */
export function PartnersSlider() {
  const sponsors = useSponsors();
  if (sponsors.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...sponsors, ...sponsors];

  return (
    <section className="section-y">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="In good company" title="Our partners & sponsors" />
        </Reveal>
      </Container>

      <Reveal className="group mt-12 overflow-hidden">
        {/* edge fades */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

          <div className="flex w-max animate-marquee items-center gap-12 group-hover:[animation-play-state:paused]">
            {loop.map((s, idx) => {
              const inner = s.logo ? (
                <Image
                  src={s.logo}
                  alt={s.name}
                  width={160}
                  height={64}
                  className="h-12 w-auto object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-14"
                />
              ) : (
                <span className="whitespace-nowrap font-display text-lg font-semibold text-slate transition-colors hover:text-prelli-green-600">
                  {s.name}
                </span>
              );
              return (
                <div key={`${s.id}-${idx}`} className="flex shrink-0 items-center justify-center">
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" aria-label={s.name}>
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
