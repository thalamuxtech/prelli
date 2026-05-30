"use client";

import { Reveal } from "@/components/motion/Reveal";
import { StoryCard } from "@/components/site/StoryCard";
import { usePublishedPosts } from "@/lib/usePublicContent";

/** Latest 3 published stories (Firestore-backed with seed fallback). */
export function FeaturedStories() {
  const posts = usePublishedPosts();
  const featured = posts.slice(0, 3);
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {featured.map((post, i) => (
        <Reveal key={post.id} delay={i * 0.08}>
          <StoryCard post={post} />
        </Reveal>
      ))}
    </div>
  );
}
