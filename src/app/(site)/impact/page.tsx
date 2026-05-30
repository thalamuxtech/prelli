import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ImpactStats } from "@/components/site/ImpactStats";
import { sortedPosts } from "@/content/posts";
import { categoryLabels, categoryColors } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Impact",
  description:
    "A timeline of PreLLI's outreach across Nigeria since 2018 — communities reached, people served, and hope delivered.",
};

export default function ImpactPage() {
  const timeline = sortedPosts;

  return (
    <>
      <section className="section-y">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
              Our impact
            </p>
            <h1 className="text-h1 mt-3 font-display font-bold text-ink">
              Measurable change, since 2018
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate">
              Every visit, every donation, every smile — here is the journey of
              hope we've built together across Nigeria.
            </p>
          </Reveal>

          <ImpactStats className="mt-12" />
        </Container>
      </section>

      {/* Timeline */}
      <section className="bg-cloud section-y">
        <Container>
          <SectionHeading eyebrow="Our journey" title="A timeline of outreach" />

          <div className="relative mx-auto mt-14 max-w-3xl">
            {/* vertical line */}
            <div className="absolute left-[7px] top-2 h-full w-0.5 bg-line sm:left-1/2 sm:-translate-x-1/2" />

            <ol className="space-y-8">
              {timeline.map((post, i) => (
                <li key={post.id} className="relative">
                  <Reveal delay={(i % 4) * 0.05}>
                    <div
                      className={`relative pl-8 sm:w-1/2 sm:pl-0 ${
                        i % 2 === 0
                          ? "sm:pr-10 sm:text-right"
                          : "sm:ml-auto sm:pl-10"
                      }`}
                    >
                      {/* dot */}
                      <span
                        className={`absolute top-1.5 h-4 w-4 rounded-full border-2 border-white bg-prelli-green shadow-e1 ${
                          i % 2 === 0
                            ? "left-0 sm:left-auto sm:-right-2"
                            : "left-0 sm:-left-2"
                        }`}
                      />
                      <div className="rounded-lg border border-line bg-white p-5 shadow-e1">
                        <div
                          className={`mb-2 flex items-center gap-2 ${
                            i % 2 === 0 ? "sm:justify-end" : ""
                          }`}
                        >
                          <span className="font-display text-sm font-bold text-prelli-green-600">
                            {post.year}
                          </span>
                          <Badge className={categoryColors[post.category]}>
                            {categoryLabels[post.category]}
                          </Badge>
                        </div>
                        <h3 className="font-display font-semibold leading-snug text-ink">
                          {post.title}
                        </h3>
                        {post.location && (
                          <p
                            className={`mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate ${
                              i % 2 === 0 ? "sm:flex-row-reverse" : ""
                            }`}
                          >
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
    </>
  );
}
