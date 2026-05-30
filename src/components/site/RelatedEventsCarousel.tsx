"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoryCard } from "@/components/site/StoryCard";
import type { Post } from "@/lib/types";

/**
 * Auto-sliding carousel of related events with prev/next navigation.
 * Pauses on hover; loops. Used at the bottom of an event detail page.
 */
export function RelatedEventsCarousel({ posts }: { posts: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  function scrollByCards(dir: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : 320;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  // Auto-advance; loop back to start when reaching the end.
  useEffect(() => {
    if (paused || posts.length <= 1) return;
    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      if (atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
      else scrollByCards(1);
    }, 3500);
    return () => clearInterval(id);
  }, [paused, posts.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((p) => (
          <div
            key={p.id}
            data-card
            className="w-[300px] shrink-0 snap-start sm:w-[340px]"
          >
            <StoryCard post={p} />
          </div>
        ))}
      </div>

      {posts.length > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Previous"
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-line bg-white text-ink transition-colors hover:border-prelli-green hover:text-prelli-green-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Next"
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-line bg-white text-ink transition-colors hover:border-prelli-green hover:text-prelli-green-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
