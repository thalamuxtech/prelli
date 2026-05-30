"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HeartHandshake, Users, HandHeart, ArrowRight, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ImpactStats } from "@/components/site/ImpactStats";
import { EventCountdown } from "@/components/site/EventCountdown";
import { StoryCard } from "@/components/site/StoryCard";
import { mission, supportPillars } from "@/content/site";
import { sortedPosts } from "@/content/posts";

const icons = [HeartHandshake, Users, HandHeart];
const accents: Record<string, { color: string; ring: string }> = {
  blue: { color: "text-prelli-blue", ring: "group-hover:ring-prelli-blue/30" },
  green: { color: "text-prelli-green", ring: "group-hover:ring-prelli-green/30" },
  orange: { color: "text-prelli-orange", ring: "group-hover:ring-prelli-orange/30" },
};
const pillars = supportPillars.map((p, i) => ({ ...p, icon: icons[i], ...accents[p.accent] }));
const featured = sortedPosts.slice(0, 3);

export default function Home() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 72% 8%, rgba(123,186,60,.20), transparent 60%), radial-gradient(50% 50% at 12% 28%, rgba(45,156,219,.16), transparent 60%), radial-gradient(42% 42% at 88% 82%, rgba(242,163,60,.18), transparent 60%)",
          }}
        />
        <Container className="py-16 sm:py-24 lg:py-32">
          <motion.p
            {...fade(0)}
            className="mb-4 inline-flex items-center gap-2 rounded-pill border border-line bg-white px-4 py-1.5 text-sm font-medium text-slate shadow-e1"
          >
            <span className="h-2 w-2 rounded-full bg-prelli-green" />
            Precious Little Lives Initiative · since 2018
          </motion.p>

          <motion.h1
            {...fade(0.08)}
            className="text-display max-w-4xl font-display font-bold text-ink"
          >
            Bringing hope to{" "}
            <span className="text-prelli-green">precious little lives</span>.
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">
            A Nigerian non-profit supporting orphans, widows, and the elderly
            through humanitarian relief, education, and empowerment — caring for
            the whole family, not just the child.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/donate" size="lg">
              <Heart className="h-5 w-5" /> Make a difference
            </Button>
            <Button href="/about" variant="secondary" size="lg">
              Learn more <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* ── Mission band ──────────────────────────────────────── */}
      <section className="border-y border-line bg-prelli-green-50">
        <Container className="py-14 sm:py-16">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
              Our mission
            </p>
            <p className="mt-3 font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
              {mission}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── Event countdown (shows only when an event has it enabled) ── */}
      <EventCountdown />

      {/* ── Impact counters ───────────────────────────────────── */}
      <section className="section-y">
        <Container>
          <SectionHeading eyebrow="Our impact" title="Measurable change, since 2018" />
          <ImpactStats className="mt-12" />
        </Container>
      </section>

      {/* ── Three pillars ─────────────────────────────────────── */}
      <section className="bg-cloud section-y">
        <Container>
          <SectionHeading eyebrow="What we do" title="Three ways we care" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article
                  className={`group h-full rounded-lg bg-white p-8 shadow-e1 ring-1 ring-transparent transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-e2 ${p.ring}`}
                >
                  <div className="mb-5 inline-flex rounded-md bg-cloud p-3">
                    <p.icon className={`h-7 w-7 ${p.color}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Featured stories ──────────────────────────────────── */}
      <section className="section-y">
        <Container>
          <SectionHeading
            eyebrow="From the field"
            title="Recent stories"
            align="left"
            seeAll={{ label: "See all stories", href: "/stories" }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featured.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.08}>
                <StoryCard post={post} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="section-y">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-lg bg-ink px-8 py-14 text-center sm:px-16">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(60% 120% at 80% 0%, rgba(123,186,60,.5), transparent 55%), radial-gradient(50% 120% at 10% 100%, rgba(45,156,219,.4), transparent 55%)",
                }}
              />
              <div className="relative">
                <h2 className="text-h2 mx-auto max-w-2xl font-display font-bold text-white">
                  Every act of kindness brings hope and relief.
                </h2>
                <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/80">
                  Join us in creating a brighter future for vulnerable children,
                  widows, and the elderly across Nigeria.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button href="/donate" size="lg">
                    <Heart className="h-5 w-5" /> Donate now
                  </Button>
                  <Button
                    href="/volunteer"
                    variant="secondary"
                    size="lg"
                    className="border-white/20 bg-white/10 text-white hover:border-white hover:bg-white hover:text-ink"
                  >
                    Volunteer
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
