import type { Metadata } from "next";
import { Heart, Eye, ShieldCheck, Users2, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import {
  intro,
  mission,
  vision,
  whyWeExist,
  values,
  focusAreas,
} from "@/content/site";

export const metadata: Metadata = {
  title: "About PreLLI",
  description:
    "Precious Little Lives Initiative: who we are, our mission and vision, and the focus areas through which we support vulnerable children, widows, and the elderly across Nigeria.",
};

const valueIcons = [ShieldCheck, MapPin, Sparkles, Users2];

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="section-y">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
              Who we are
            </p>
            <h1 className="text-h1 mt-3 font-display font-bold text-ink">
              United in supporting precious little lives
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate">{intro}</p>
          </Reveal>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="bg-cloud section-y">
        <Container className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="group relative h-full overflow-hidden rounded-lg bg-white p-8 shadow-e1 transition-all duration-300 hover:-translate-y-1.5 hover:[box-shadow:0_0_0_1px_rgba(123,186,60,.6),0_0_30px_-4px_rgba(123,186,60,.55)]">
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:animate-glow group-hover:opacity-100"
                style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(123,186,60,.22), transparent 70%)" }}
              />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-md bg-prelli-green-50 p-3 transition-transform duration-300 group-hover:scale-110">
                  <Heart className="h-6 w-6 text-prelli-green-600" />
                </div>
                <h2 className="font-display text-2xl font-bold text-ink">Our Mission</h2>
                <p className="mt-3 leading-relaxed text-slate">{mission}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="group relative h-full overflow-hidden rounded-lg bg-white p-8 shadow-e1 transition-all duration-300 hover:-translate-y-1.5 hover:[box-shadow:0_0_0_1px_rgba(45,156,219,.6),0_0_30px_-4px_rgba(45,156,219,.55)]">
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:animate-glow group-hover:opacity-100"
                style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(45,156,219,.2), transparent 70%)" }}
              />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-md bg-prelli-blue/10 p-3 transition-transform duration-300 group-hover:scale-110">
                  <Eye className="h-6 w-6 text-prelli-blue-700" />
                </div>
                <h2 className="font-display text-2xl font-bold text-ink">Our Vision</h2>
                <p className="mt-3 leading-relaxed text-slate">{vision}</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Why we exist */}
      <section className="section-y">
        <Container>
          <Reveal className="mx-auto max-w-3xl rounded-lg border-l-4 border-prelli-orange bg-prelli-orange-50 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-ink">Why we exist</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/80">{whyWeExist}</p>
          </Reveal>
        </Container>
      </section>

      {/* Focus areas */}
      <section className="bg-cloud section-y">
        <Container>
          <SectionHeading
            eyebrow="Our impact areas"
            title="Where we focus our work"
          />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2">
            {focusAreas.map((area) => (
              <StaggerItem key={area.key}>
                <article className="h-full rounded-lg bg-white p-7 shadow-e1">
                  <h3 className="font-display text-xl font-semibold text-prelli-green-600">
                    {area.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate">{area.body}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Values */}
      <section className="section-y">
        <Container>
          <SectionHeading eyebrow="How we work" title="What makes us different" />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <StaggerItem key={v.title}>
                  <div className="h-full rounded-lg border border-line bg-white p-6 text-center shadow-e1">
                    <div className="mx-auto mb-4 inline-flex rounded-md bg-prelli-green-50 p-3">
                      <Icon className="h-6 w-6 text-prelli-green-600" />
                    </div>
                    <h3 className="font-display font-semibold text-ink">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate">{v.body}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
          <Reveal className="mt-12 text-center">
            <Button href="/work" size="lg">
              Explore our initiatives
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
