import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { ImpactStats } from "@/components/site/ImpactStats";
import { initiatives } from "@/content/initiatives";
import { sortedPosts } from "@/content/posts";
import { categoryLabels, categoryColors } from "@/lib/types";

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
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((item, i) => (
              <StaggerItem key={item.title}>
                <article className="group flex h-full flex-col rounded-lg border border-line bg-white p-7 shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-e2">
                  <span className="font-display text-sm font-bold text-prelli-green/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 font-display text-lg font-semibold text-ink transition-colors group-hover:text-prelli-green-600">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{item.summary}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Timeline */}
      <section className="section-y">
        <Container>
          <SectionHeading eyebrow="Our journey" title="A timeline of outreach" />
          <div className="relative mx-auto mt-14 max-w-3xl">
            <div className="absolute left-[7px] top-2 h-full w-0.5 bg-line sm:left-1/2 sm:-translate-x-1/2" />
            <ol className="space-y-8">
              {timeline.map((post, i) => (
                <li key={post.id} className="relative">
                  <Reveal delay={(i % 4) * 0.05}>
                    <div
                      className={`relative pl-8 sm:w-1/2 sm:pl-0 ${
                        i % 2 === 0 ? "sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10"
                      }`}
                    >
                      <span
                        className={`absolute top-1.5 h-4 w-4 rounded-full border-2 border-white bg-prelli-green shadow-e1 ${
                          i % 2 === 0 ? "left-0 sm:left-auto sm:-right-2" : "left-0 sm:-left-2"
                        }`}
                      />
                      <div className="rounded-lg border border-line bg-white p-5 shadow-e1">
                        <div className={`mb-2 flex items-center gap-2 ${i % 2 === 0 ? "sm:justify-end" : ""}`}>
                          <span className="font-display text-sm font-bold text-prelli-green-600">{post.year}</span>
                          <Badge className={categoryColors[post.category]}>{categoryLabels[post.category]}</Badge>
                        </div>
                        <h3 className="font-display font-semibold leading-snug text-ink">{post.title}</h3>
                        {post.location && (
                          <p className={`mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate ${i % 2 === 0 ? "sm:flex-row-reverse" : ""}`}>
                            <MapPin className="h-3.5 w-3.5" /> {post.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
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
