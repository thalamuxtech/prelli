"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sortedPosts } from "@/content/posts";
import { initiatives as seedInitiatives } from "@/content/initiatives";
import type { Post, AdminEvent, Initiative } from "@/lib/types";

/**
 * Public content reads from Firestore (admin-managed) and falls back to the
 * bundled seed content when Firestore is empty or unreachable. This lets the
 * site render instantly with seed data, then hydrate with live admin content.
 */
export function usePublishedPosts(max = 100) {
  const [posts, setPosts] = useState<Post[]>(sortedPosts);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, "posts"),
            where("status", "==", "published"),
            orderBy("date", "desc"),
            limit(max),
          ),
        );
        if (!snap.empty) {
          setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Post));
        }
      } catch {
        // keep seed fallback
      }
    })();
  }, [max]);

  return posts;
}

/** Upcoming events (admin-managed), soonest first. Empty array if none. */
export function useUpcomingEvents(max = 2) {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const now = Date.now();
        const up = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as AdminEvent)
          .filter((e) => new Date(e.startAt).getTime() > now)
          .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
          .slice(0, max);
        setEvents(up);
      } catch {
        /* none */
      } finally {
        setLoaded(true);
      }
    })();
  }, [max]);

  return { events, loaded };
}

interface SponsorDoc {
  id: string;
  name: string;
  logo?: string;
  url?: string;
  order?: number;
}

/** Partners/sponsors (admin-managed). Empty array if none. */
export function useSponsors() {
  const [sponsors, setSponsors] = useState<SponsorDoc[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "sponsors"), orderBy("order", "asc")));
        setSponsors(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SponsorDoc));
      } catch {
        /* none */
      }
    })();
  }, []);

  return sponsors;
}

interface SlideDoc {
  id: string;
  image: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  body?: string;
  order?: number;
}

/** Initiatives (admin-managed) with bundled seed fallback. */
export function useInitiatives() {
  const [items, setItems] = useState<Initiative[]>(seedInitiatives as Initiative[]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "initiatives"), orderBy("order", "asc")));
        if (!snap.empty) {
          setItems(snap.docs.map((d) => d.data() as Initiative));
        }
      } catch {
        /* seed fallback */
      }
    })();
  }, []);

  return items;
}

/** Hero slides (admin-managed); empty array means use the component's defaults. */
export function useHeroSlides() {
  const [slides, setSlides] = useState<SlideDoc[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "heroSlides"), orderBy("order", "asc")));
        if (!snap.empty) {
          setSlides(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SlideDoc));
        }
      } catch {
        /* defaults */
      }
    })();
  }, []);

  return slides;
}
