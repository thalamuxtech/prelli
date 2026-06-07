"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sortedPosts } from "@/content/posts";
import { initiatives as seedInitiatives } from "@/content/initiatives";
import { org } from "@/content/site";
import type { Post, AdminEvent, Initiative } from "@/lib/types";

export interface PublicSettings {
  contactEmail: string;
  contactLocation: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

/**
 * Public site settings (contact email, location, social links) sourced from the
 * admin-managed settings/site doc, falling back to the bundled defaults so the
 * site always renders. Edits in Admin > Settings appear here without a rebuild.
 */
export function useSiteSettings(): PublicSettings {
  const [s, setS] = useState<PublicSettings>({
    contactEmail: org.email,
    contactLocation: org.location,
    instagram: org.socials.instagram,
    facebook: org.socials.facebook,
    twitter: org.socials.twitter,
  });

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "site"));
        if (snap.exists()) {
          const d = snap.data() as Record<string, string | undefined>;
          setS((prev) => ({
            contactEmail: d.contactEmail || prev.contactEmail,
            contactLocation: d.contactLocation || prev.contactLocation,
            instagram: d.instagram || prev.instagram,
            facebook: d.facebook || prev.facebook,
            twitter: d.twitter || prev.twitter,
          }));
        }
      } catch {
        /* keep defaults */
      }
    })();
  }, []);

  return s;
}

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

/** All events (admin-managed), split into upcoming + past. */
export function useAllEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminEvent));
      } catch {
        /* none */
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const now = Date.now();
  const upcoming = events
    .filter((e) => new Date(e.startAt).getTime() > now)
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  const past = events
    .filter((e) => new Date(e.startAt).getTime() <= now)
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());

  return { upcoming, past, loaded };
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
