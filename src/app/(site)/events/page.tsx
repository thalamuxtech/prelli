import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, CalendarClock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { sortedPosts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Past and upcoming events from Precious Little Lives Initiative — outreaches, fun fairs, and community programs across Nigeria.",
};

export default function EventsPage() {
  // Until upcoming events are added in the CMS, surface the outreach history as past events.
  const pastEvents = sortedPosts;

  return (
    <>
      {/* Upcoming (empty-state for now) */}
      <section className="section-y">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
              Events
            </p>
            <h1 className="text-h1 mt-3 font-display font-bold text-ink">
              Be part of what's next
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate">
              We're planning our next outreach. Follow us or get in touch to be
              the first to know — and to join us on the ground.
            </p>
            <div className="mt-8">
              <div className="mx-auto inline-flex items-center gap-3 rounded-lg border border-dashed border-line bg-cloud px-6 py-5 text-slate">
                <CalendarClock className="h-6 w-6 text-prelli-green-600" />
                <span>New events will appear here soon.</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact">Get notified</Button>
              <Button href="/volunteer" variant="secondary">
                Volunteer with us
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Past events */}
      <section className="bg-cloud section-y">
        <Container>
          <SectionHeading
            eyebrow="Past events"
            title="Where we've been"
            align="left"
            seeAll={{ label: "All stories", href: "/stories" }}
          />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
            {pastEvents.map((post) => (
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
