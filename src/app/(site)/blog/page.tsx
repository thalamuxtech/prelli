"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { PenLine } from "lucide-react";
import { db } from "@/lib/firebase";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StoryCard } from "@/components/site/StoryCard";
import type { Post } from "@/lib/types";

/**
 * Blog by PreLLI Editorial. Starts empty; fills from the admin (posts with
 * category "blog" or any published post created in the CMS). Outreach stories
 * live under Events, so this is reserved for editorial writing.
 */
export default function BlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "blogPosts"), where("status", "==", "published"), orderBy("date", "desc")),
        );
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post));
      } catch {
        setPosts([]);
      }
    })();
  }, []);

  return (
    <section className="section-y">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
            Blog by PreLLI Editorial
          </p>
          <h1 className="text-h1 mt-3 font-display font-bold text-ink">Stories, ideas, and reflections</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate">
            Writing from the PreLLI team on our work, the communities we serve,
            and the change we hope to see.
          </p>
        </Reveal>

        {posts && posts.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <StoryCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <Reveal className="mt-12">
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-lg border border-dashed border-line bg-cloud p-10 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-pill bg-prelli-green-50 text-prelli-green-600">
                <PenLine className="h-6 w-6" />
              </span>
              <h2 className="font-display text-lg font-semibold text-ink">Coming soon</h2>
              <p className="text-slate">
                Our editorial blog is just getting started. Check back soon for
                new articles, or follow our latest work on the Events page.
              </p>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
