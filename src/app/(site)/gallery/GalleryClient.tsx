"use client";

import { Gallery, type GalleryItem } from "@/components/site/Gallery";
import { usePublishedPosts } from "@/lib/usePublicContent";

/**
 * Gallery, sourced live from admin-managed posts (Firestore) with the bundled
 * seed posts as fallback. Each published post with a cover image becomes a
 * gallery tile, newest first.
 */
export function GalleryClient() {
  const posts = usePublishedPosts();

  const items: GalleryItem[] = posts
    .filter((p) => p.coverImage)
    .map((p) => ({
      src: p.coverImage as string,
      caption: p.title,
      year: p.year ?? new Date(p.date ?? "").getFullYear() ?? 0,
    }))
    .sort((a, b) => b.year - a.year);

  return <Gallery items={items} />;
}
