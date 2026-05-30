"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, ArrowRight, CalendarClock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { useUpcomingEvents } from "@/lib/usePublicContent";
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

function EventCard({ ev, i }: { ev: AdminEvent; i: number }) {
  const reduce = useReducedMotion();
  const date = new Date(ev.startAt);
  const month = date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const day = date.getDate();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex overflow-hidden rounded-lg border border-line bg-white shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-e2"
    >
      {/* neon glow edge on hover */}
      <span className="pointer-events-none absolute inset-0 rounded-lg opacity-0 ring-2 ring-prelli-green/40 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Date badge square */}
      <div className="relative flex w-24 shrink-0 flex-col items-center justify-center bg-gradient-to-b from-prelli-green to-prelli-green-600 text-white sm:w-28">
        <span
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,.35), transparent 60%)" }}
        />
        <span className="relative text-sm font-semibold tracking-wider">{month}</span>
        <span className="relative font-display text-4xl font-bold leading-none">{day}</span>
        <span className="relative mt-1 text-xs opacity-80">{date.getFullYear()}</span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-prelli-green-600">
            {ev.title}
          </h3>
          {ev.location && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate">
              <MapPin className="h-3.5 w-3.5" /> {ev.location}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MiniCountdown iso={ev.startAt} />
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm font-semibold text-prelli-green-600 transition-colors hover:text-prelli-green"
          >
            Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/** Two upcoming events as premium horizontal cards. Renders nothing if none. */
export function UpcomingEvents() {
  const { events } = useUpcomingEvents(2);
  if (events.length === 0) return null;

  return (
    <section className="bg-cloud section-y">
      <Container>
        <SectionHeading
          eyebrow="Mark your calendar"
          title="Upcoming events"
          align="left"
          seeAll={{ label: "All events", href: "/events" }}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {events.map((ev, i) => (
            <EventCard key={ev.id} ev={ev} i={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
