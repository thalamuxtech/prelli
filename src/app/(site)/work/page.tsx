import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ImpactStats } from "@/components/site/ImpactStats";
import { InitiativesGrid } from "@/components/site/InitiativesGrid";
import { ImpactTimeline } from "@/components/site/ImpactTimeline";
import { sortedPosts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Our Work & Impact",
  description:
    "The work of Precious Little Lives Initiative and the difference it makes: our core programmes, the people we've reached, and a timeline of outreach across Nigeria since 2018.",
};

export default function WorkPage() {
  const timeline = sortedPosts;

  return (
    <>
      {/* Intro */}
      <section className="section-y">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
              Our work and impact
            </p>
            <h1 className="text-h1 mt-3 font-display font-bold text-ink">
              The work we do, and the difference it makes
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate">
              We support the whole family, meeting urgent needs today while
              building real pathways to a self-reliant tomorrow. Here are the
              programmes we run, and the change we&apos;ve made together since 2018.
            </p>
          </Reveal>

          {/* Impact stats */}
          <ImpactStats className="mt-12" />
        </Container>
      </section>

      {/* Initiatives */}
      <section className="bg-cloud section-y">
        <Container>
          <SectionHeading eyebrow="What we do" title="Initiatives that create lasting change" />
          <InitiativesGrid />
        </Container>
      </section>

      {/* Timeline */}
      <section className="section-y">
        <Container>
          <SectionHeading eyebrow="Our journey" title="A timeline of dedication and impact" />
          <ImpactTimeline items={timeline} />
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-cloud section-y">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2 font-display font-bold text-ink">Want to be part of the change?</h2>
            <p className="mt-4 leading-relaxed text-slate">
              Whether through giving or volunteering, your support helps us reach
              more vulnerable children, widows, and families.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/donate" size="lg">Donate</Button>
              <Button href="/volunteer" variant="secondary" size="lg">Volunteer</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
