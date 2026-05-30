"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, CalendarClock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { EventImageSlider } from "@/components/site/EventImageSlider";
import { useAllEvents } from "@/lib/usePublicContent";
import { sortedPosts } from "@/content/posts";
import type { AdminEvent } from "@/lib/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

/** Upcoming event: no image, date-badge + live countdown (matches the homepage). */
function UpcomingEventCard({ ev }: { ev: AdminEvent }) {
  const date = new Date(ev.startAt);
  const month = date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const day = date.getDate();
  return (
    <div className="glow-card group relative overflow-hidden rounded-lg border border-line bg-white shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-1">
      <span className="border-beam pointer-events-none z-20" />
      <div className="flex">
        <div className="relative flex w-24 shrink-0 flex-col items-center justify-center bg-gradient-to-b from-prelli-green to-prelli-green-600 text-white sm:w-28">
          <span className="pointer-events-none absolute inset-0 opacity-50" style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,.35), transparent 60%)" }} />
          <span className="relative text-sm font-semibold tracking-wider">{month}</span>
          <span className="relative font-display text-4xl font-bold leading-none">{day}</span>
          <span className="relative mt-1 text-xs opacity-80">{date.getFullYear()}</span>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3 p-5">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-prelli-green-600">{ev.title}</h3>
            {ev.location && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate">
                <MapPin className="h-3.5 w-3.5" /> {ev.location}
              </p>
            )}
            {ev.description && <p className="mt-2 line-clamp-2 text-sm text-slate">{ev.description}</p>}
          </div>
          <MiniCountdown iso={ev.startAt} />
        </div>
      </div>
    </div>
  );
}

/** Past event: full card with 3–5 image auto-slider + impact figure. */
function PastEventCard({ ev }: { ev: AdminEvent }) {
  return (
    <article className="glow-card group relative overflow-hidden rounded-lg border border-line bg-white shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-1">
      <span className="border-beam pointer-events-none z-20" />
      {ev.images && ev.images.length > 0 && (
        <div className="relative aspect-[16/9] w-full">
          <EventImageSlider images={ev.images} alt={ev.title} />
        </div>
      )}
      <div className="p-6">
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-cloud px-2.5 py-0.5 text-xs font-semibold text-slate">
          <Calendar className="h-3 w-3" /> {fmtDate(ev.startAt)}
        </span>
        <h3 className="mt-3 font-display text-xl font-semibold text-ink transition-colors group-hover:text-prelli-green-600">{ev.title}</h3>
        {ev.location && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-slate">
            <MapPin className="h-4 w-4" /> {ev.location}
          </p>
        )}
        {ev.description && <p className="mt-3 leading-relaxed text-slate">{ev.description}</p>}
        {ev.impact && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-prelli-green-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-prelli-green" />
            <span className="font-display text-sm font-bold text-prelli-green-600">{ev.impact}</span>
          </div>
        )}
      </div>
    </article>
  );
}

/** Public events page: upcoming countdown cards, past events with sliders,
 *  and the historical outreach list. */
export function EventsList() {
  const { upcoming, past, loaded } = useAllEvents();

  return (
    <>
      {/* Upcoming */}
      <section className="section-y">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">Events</p>
            <h1 className="text-h1 mt-3 font-display font-bold text-ink">Be part of what&apos;s next</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate">
              Join us on the ground at our next outreach. Follow along or get in
              touch to be the first to know.
            </p>
          </Reveal>

          {upcoming.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {upcoming.map((ev) => (
                <UpcomingEventCard key={ev.id} ev={ev} />
              ))}
            </div>
          ) : (
            loaded && (
              <Reveal className="mt-10 text-center">
                <div className="mx-auto inline-flex items-center gap-3 rounded-lg border border-dashed border-line bg-cloud px-6 py-5 text-slate">
                  <CalendarClock className="h-6 w-6 text-prelli-green-600" />
                  <span>No upcoming events just yet. Check back soon.</span>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button href="/contact">Get notified</Button>
                  <Button href="/volunteer" variant="secondary">Volunteer with us</Button>
                </div>
              </Reveal>
            )
          )}
        </Container>
      </section>

      {/* Past admin events (with image sliders) */}
      {past.length > 0 && (
        <section className="bg-cloud section-y">
          <Container>
            <SectionHeading eyebrow="Past events" title="Where we've been" align="left" />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {past.map((ev) => (
                <PastEventCard key={ev.id} ev={ev} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Historical outreach (from the outreach archive) */}
      <section className={past.length > 0 ? "section-y" : "bg-cloud section-y"}>
        <Container>
          <SectionHeading
            eyebrow="Our outreach history"
            title="Years of community impact"
            align="left"
            seeAll={{ label: "View gallery", href: "/gallery" }}
          />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
            {sortedPosts.map((post) => (
              <StaggerItem key={post.id}>
                <Link
                  href={`/stories/${post.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-line bg-white p-5 shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-e2"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-prelli-green-50 text-prelli-green-600">
                    <Calendar className="h-5 w-5" />
                    <span className="mt-0.5 text-xs font-bold">{post.year}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display font-semibold text-ink transition-colors group-hover:text-prelli-green-600">
                      {post.title}
                    </h3>
                    {post.location && (
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate">
                        <MapPin className="h-3.5 w-3.5" /> {post.location}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-slate transition-transform group-hover:translate-x-1 group-hover:text-prelli-green-600" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
