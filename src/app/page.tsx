"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HeartHandshake, Users, HandHeart, ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { mission, supportPillars } from "@/content/site";

const icons = [HeartHandshake, Users, HandHeart];
const accents: Record<string, { color: string; ring: string }> = {
  blue: { color: "text-prelli-blue", ring: "group-hover:ring-prelli-blue/30" },
  green: { color: "text-prelli-green", ring: "group-hover:ring-prelli-green/30" },
  orange: { color: "text-prelli-orange", ring: "group-hover:ring-prelli-orange/30" },
};
const pillars = supportPillars.map((p, i) => ({
  ...p,
  icon: icons[i],
  ...accents[p.accent],
}));

export default function Home() {
  const reduce = useReducedMotion();

  return (
    <main className="min-h-screen">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="container-px mx-auto flex max-w-content items-center justify-between py-5">
        <Logo />
        <span className="rounded-pill bg-prelli-green-50 px-3 py-1 text-sm font-medium text-prelli-green-600">
          Website in progress
        </span>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(60% 60% at 70% 10%, rgba(123,186,60,.18), transparent 60%), radial-gradient(50% 50% at 15% 30%, rgba(45,156,219,.16), transparent 60%), radial-gradient(40% 40% at 85% 80%, rgba(242,163,60,.16), transparent 60%)",
          }}
        />
        <div className="container-px mx-auto max-w-content py-20 sm:py-28 lg:py-36">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 inline-flex items-center gap-2 rounded-pill border border-line bg-white px-4 py-1.5 text-sm font-medium text-slate shadow-e1"
          >
            <span className="h-2 w-2 rounded-full bg-prelli-green" />
            Precious Little Lives Initiative · since 2018
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-display max-w-4xl font-display font-bold text-ink"
          >
            Bringing hope to{" "}
            <span className="text-prelli-green">precious little lives</span>.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-slate"
          >
            A Nigerian non-profit supporting orphans, widows, and the elderly
            through humanitarian relief, education, and empowerment — caring for
            the whole family, not just the child. Our new home on the web is on
            the way.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#mission"
              className="group inline-flex items-center gap-2 rounded-pill bg-prelli-green px-7 py-3.5 font-semibold text-white shadow-e1 transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-prelli-green-600 hover:shadow-e2 active:translate-y-0 active:scale-[0.98]"
            >
              Make a difference
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="#mission"
              className="inline-flex items-center gap-2 rounded-pill border border-line bg-white px-7 py-3.5 font-semibold text-ink transition-colors duration-200 hover:border-prelli-green hover:text-prelli-green-600"
            >
              Learn more
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Mission band ────────────────────────────────────────── */}
      <section id="mission" className="border-y border-line bg-prelli-green-50">
        <div className="container-px mx-auto max-w-content py-14 sm:py-16">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
              Our mission
            </p>
            <p className="mt-3 font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
              {mission}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Three pillars ───────────────────────────────────────── */}
      <section className="bg-cloud section-y">
        <div className="container-px mx-auto max-w-content">
          <Reveal className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
              What we do
            </p>
            <h2 className="text-h2 mt-2 font-display font-bold text-ink">
              Three ways we care
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article
                  className={`group h-full rounded-lg bg-white p-8 shadow-e1 ring-1 ring-transparent transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-e2 ${p.ring}`}
                >
                  <div className="mb-5 inline-flex rounded-md bg-cloud p-3">
                    <p.icon className={`h-7 w-7 ${p.color}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-white">
        <div className="container-px mx-auto flex max-w-content flex-col items-center justify-between gap-4 py-10 text-center sm:flex-row sm:text-left">
          <Logo size={32} />
          <p className="text-sm text-slate">
            © {new Date().getFullYear()} Precious Little Lives Initiative ·
            CAC-registered · Abuja, Nigeria
          </p>
        </div>
      </footer>
    </main>
  );
}
