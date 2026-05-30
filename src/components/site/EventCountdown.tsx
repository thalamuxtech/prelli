"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import type { AdminEvent } from "@/lib/types";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

/** Odometer-style animated digit cell. */
function Cell({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        {str.split("").map((d, i) => (
          <div
            key={i}
            className="relative h-14 w-10 overflow-hidden rounded-md bg-ink/90 sm:h-16 sm:w-12"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={d}
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold text-white sm:text-3xl"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wide text-white/80">{label}</span>
    </div>
  );
}

/**
 * Homepage countdown band — shows the soonest upcoming event whose
 * countdown is enabled in the admin (§ events manager). Renders nothing if none.
 */
export function EventCountdown() {
  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [t, setT] = useState(() => diff(0));

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

  useEffect(() => {
    if (!event) return;
    const target = new Date(event.startAt).getTime();
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [event]);

  if (!event) return null;

  return (
    <section className="section-y">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-lg bg-prelli-orange px-6 py-12 sm:px-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(50% 120% at 85% 0%, rgba(255,255,255,.6), transparent 55%)",
              }}
            />
            <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
              <div className="max-w-md text-center lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-pill bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                  <CalendarClock className="h-4 w-4" /> Upcoming event
                </span>
                <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                  {event.title}
                </h2>
                {event.location && <p className="mt-1 text-white/85">{event.location}</p>}
                <div className="mt-5">
                  <Button
                    href={`/events`}
                    className="bg-white text-ink hover:bg-white/90"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <Cell value={t.days} label="Days" />
                <Cell value={t.hours} label="Hrs" />
                <Cell value={t.minutes} label="Min" />
                <Cell value={t.seconds} label="Sec" />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
