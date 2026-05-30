import { HeartHandshake, Users, HandHeart, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ImpactStats } from "@/components/site/ImpactStats";
import { EventCountdown } from "@/components/site/EventCountdown";
import { UpcomingEvents } from "@/components/site/UpcomingEvents";
import { HeroSlider } from "@/components/site/HeroSlider";
import { FeaturedStories } from "@/components/site/FeaturedStories";
import { PartnersSlider } from "@/components/site/PartnersSlider";
import { mission, supportPillars } from "@/content/site";

const icons = [HeartHandshake, Users, HandHeart];
const accents: Record<string, { color: string; iconBg: string; bar: string }> = {
  blue: { color: "text-prelli-blue", iconBg: "bg-prelli-blue/10", bar: "from-prelli-blue to-prelli-green" },
  green: { color: "text-prelli-green-600", iconBg: "bg-prelli-green-50", bar: "from-prelli-green to-prelli-blue" },
  orange: { color: "text-prelli-orange", iconBg: "bg-prelli-orange-50", bar: "from-prelli-orange to-prelli-pink" },
};
const pillars = supportPillars.map((p, i) => ({ ...p, icon: icons[i], ...accents[p.accent] }));

export default function Home() {
  return (
    <>
      {/* ── Hero slider ───────────────────────────────────────── */}
      <HeroSlider />

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

      {/* ── Upcoming events (premium horizontal cards) ────────── */}
      <UpcomingEvents />

      {/* ── Impact counters (dark band) ───────────────────────── */}
      <section className="relative overflow-hidden bg-ink section-y">
        <div
          className="animate-glow pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 60% at 80% 10%, rgba(123,186,60,.5), transparent 60%), radial-gradient(40% 60% at 12% 90%, rgba(45,156,219,.45), transparent 60%)",
          }}
        />
        <Container className="relative">
          <Reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green">
              Our impact
            </p>
            <h2 className="text-h2 mt-2 font-display font-bold text-white">
              Measurable change, since 2018
            </h2>
          </Reveal>
          <ImpactStats className="mt-12" variant="dark" />
        </Container>
      </section>

      {/* ── Three pillars ─────────────────────────────────────── */}
      <section className="bg-cloud section-y">
        <Container>
          <SectionHeading eyebrow="What we do" title="Three ways we care" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article className="glow-card group relative h-full overflow-hidden rounded-lg bg-white p-8 shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-1.5">
                  <span className="border-beam pointer-events-none" />
                  <div className={`relative mb-5 inline-flex rounded-md p-3.5 transition-transform duration-300 group-hover:scale-110 ${p.iconBg}`}>
                    <p.icon className={`h-7 w-7 ${p.color}`} />
                  </div>
                  <h3 className="relative font-display text-xl font-semibold text-ink transition-colors group-hover:text-prelli-green-600">
                    {p.title}
                  </h3>
                  <p className="relative mt-2 leading-relaxed text-slate">{p.body}</p>
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
          <FeaturedStories />
        </Container>
      </section>

      {/* ── Partners & sponsors (admin-managed, shows when any exist) ── */}
      <PartnersSlider />

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="section-y">
        <Container>
          <Reveal>
            <div className="neon-ring relative overflow-hidden rounded-lg bg-ink px-8 py-14 text-center sm:px-16">
              <div
                className="animate-glow pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 120% at 80% 0%, rgba(123,186,60,.55), transparent 55%), radial-gradient(50% 120% at 10% 100%, rgba(45,156,219,.45), transparent 55%)",
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
