import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StoriesGrid } from "@/components/site/StoriesGrid";
import { sortedPosts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Read about PreLLI's visits, donations, and the lives touched across Nigeria since 2018.",
};

export default function StoriesPage() {
  return (
    <section className="section-y">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
            Stories
          </p>
          <h1 className="text-h1 mt-3 font-display font-bold text-ink">
            From the field
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate">
            Every story is a community reached and a life touched. Filter by the
            areas closest to your heart.
          </p>
        </Reveal>

        <div className="mt-12">
          <StoriesGrid posts={sortedPosts} />
        </div>
      </Container>
    </section>
  );
}
