"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { MapPin, ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import type { AdminEvent } from "@/lib/types";

function parts(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms / 3600000) % 24),
    m: Math.floor((ms / 60000) % 60),
    s: Math.floor((ms / 1000) % 60),
  };
}

/** Compact countdown matching the upcoming-event cards. */
function MiniCountdown({ iso }: { iso: string }) {
  const target = new Date(iso).getTime();
  const [t, setT] = useState(() => parts(target));
  useEffect(() => {
    const id = setInterval(() => setT(parts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  const cells = [
    { v: t.d, l: "days" },
    { v: t.h, l: "hrs" },
    { v: t.m, l: "min" },
    { v: t.s, l: "sec" },
  ];
  return (
    <div className="flex gap-2">
      {cells.map((c) => (
        <div key={c.l} className="flex min-w-[44px] flex-col items-center rounded-md bg-ink/90 px-2 py-1.5">
          <span className="font-display text-lg font-bold leading-none text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
            {String(c.v).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-wide text-white/70">{c.l}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Homepage featured countdown — the soonest upcoming event whose countdown is
 * enabled in the admin. Uses the same card design as the upcoming-event cards
 * (green date badge + mini countdown + animated border). Renders nothing if none.
 */
export function EventCountdown() {
  const [event, setEvent] = useState<AdminEvent | null>(null);

  useEffect(() => {
    const q = query(collection(db, "events"), where("countdownEnabled", "==", true));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const upcoming = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as AdminEvent)
          .filter((e) => new Date(e.startAt).getTime() > Date.now())
          .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
        setEvent(upcoming[0] ?? null);
      },
      () => setEvent(null),
    );
    return unsub;
  }, []);

  if (!event) return null;

  const date = new Date(event.startAt);
  const month = date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const day = date.getDate();

  return (
    <section className="section-y">
      <Container>
        <SectionHeading
          eyebrow="Mark your calendar"
          title="Upcoming event"
          align="left"
          seeAll={{ label: "All events", href: "/events" }}
        />
        <Reveal className="mt-10">
          <div className="glow-card group relative overflow-hidden rounded-lg border border-line bg-white shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-1">
            <span className="border-beam pointer-events-none z-20" />
            <div className="flex flex-col sm:flex-row">
              {/* Date badge */}
              <div className="relative flex w-full shrink-0 flex-row items-center justify-center gap-3 bg-gradient-to-b from-prelli-green to-prelli-green-600 py-4 text-white sm:w-32 sm:flex-col sm:gap-0 sm:py-0">
                <span
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,.35), transparent 60%)" }}
                />
                <span className="relative text-sm font-semibold tracking-wider">{month}</span>
                <span className="relative font-display text-4xl font-bold leading-none sm:text-5xl">{day}</span>
                <span className="relative text-xs opacity-80 sm:mt-1">{date.getFullYear()}</span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-prelli-green-600">
                    {event.title}
                  </h3>
                  {event.location && (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate">
                      <MapPin className="h-4 w-4" /> {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate">{event.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <MiniCountdown iso={event.startAt} />
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-prelli-green-600 transition-colors hover:text-prelli-green"
                  >
                    Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
