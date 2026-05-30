import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Gallery, type GalleryItem } from "@/components/site/Gallery";
import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Moments from PreLLI's outreach across Nigeria — photos from our visits, donations, and community programs.",
};

// Curated from the outreach archive; the full library is managed via the admin CMS.
const items: GalleryItem[] = posts
  .filter((p) => p.coverImage)
  .map((p) => ({ src: p.coverImage as string, caption: p.title, year: p.year }))
  .sort((a, b) => b.year - a.year);

export default function GalleryPage() {
  return (
    <section className="section-y">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
            Gallery
          </p>
          <h1 className="text-h1 mt-3 font-display font-bold text-ink">
            Moments captured
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate">
            Every photo tells a story of hope. A growing archive from our
            outreach across the years.
          </p>
        </Reveal>

        <div className="mt-12">
          <Gallery items={items} />
        </div>
      </Container>
    </section>
  );
}
