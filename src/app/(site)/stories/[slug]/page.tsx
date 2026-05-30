import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, CheckCircle2, Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ImpactStats } from "@/components/site/ImpactStats";
import { RelatedEventsCarousel } from "@/components/site/RelatedEventsCarousel";
import { EventImageSlider } from "@/components/site/EventImageSlider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { posts, getPost, sortedPosts } from "@/content/posts";
import { categoryLabels, categoryColors } from "@/lib/types";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Story not found" };
  return { title: post.title, description: post.excerpt };
}

const coverGradients: Record<string, string> = {
  children: "from-prelli-pink/80 to-prelli-orange/70",
  education: "from-prelli-blue/80 to-prelli-green/70",
  community: "from-prelli-green/80 to-prelli-blue/70",
  idp: "from-prelli-orange/80 to-prelli-pink/70",
};

export default async function StoryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const dateStr = new Date(post.date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
  });
  // Same-category first, then fill with other events, for a fuller carousel.
  const others = sortedPosts.filter((p) => p.id !== post.id);
  const sameCat = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  const related = [...sameCat, ...rest].slice(0, 8);

  return (
    <article>
      {/* Hero */}
      <header className={`relative overflow-hidden bg-gradient-to-br ${coverGradients[post.category]}`}>
        {post.coverImage && (
          <>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/30" />
          </>
        )}
        <Container className="relative py-16 sm:py-24">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge className="bg-white/90 text-ink">{categoryLabels[post.category]}</Badge>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90">
              <Calendar className="h-4 w-4" /> {dateStr}
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          {post.location && (
            <p className="mt-4 inline-flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4" /> {post.location}
            </p>
          )}
        </Container>
      </header>

      {/* Photo gallery slider (when the event has multiple images) */}
      {post.gallery && post.gallery.length > 1 && (
        <section className="bg-cloud py-10">
          <Container className="max-w-4xl">
            <div className="overflow-hidden rounded-lg shadow-e2">
              <div className="relative aspect-[16/9] w-full">
                <EventImageSlider images={post.gallery} alt={post.title} />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Body */}
      <section className="section-y">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="space-y-5 text-lg leading-relaxed text-slate">
              {post.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {post.donations && post.donations.length > 0 && (
              <div className="mt-10 rounded-lg border border-line bg-prelli-green-50 p-6 sm:p-8">
                <h2 className="font-display text-lg font-semibold text-ink">
                  What we provided
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {post.donations.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-slate">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-prelli-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-4 border-t border-line pt-8">
              <Button href="/donate">Support our work</Button>
              <Button href="/events" variant="secondary">
                See more events
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Impact band */}
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
              The bigger picture
            </h2>
          </Reveal>
          <ImpactStats className="mt-12" variant="dark" />
        </Container>
      </section>

      {/* Related events carousel */}
      {related.length > 0 && (
        <section className="bg-cloud section-y">
          <Container>
            <SectionHeading eyebrow="Keep exploring" title="Related events" align="left" />
            <div className="mt-10">
              <RelatedEventsCarousel posts={related} />
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
