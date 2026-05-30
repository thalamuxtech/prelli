"use client";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { posts } from "@/content/posts";
import { defaultHeroSlides } from "@/content/heroSlides";
import { initiatives } from "@/content/initiatives";

/**
 * One-click import of the bundled seed content into Firestore so it becomes
 * admin-manageable. Idempotent: uses deterministic doc IDs (merge), so existing
 * edits to a given doc are preserved on re-run only where fields overlap.
 * Runs client-side under the authenticated admin session.
 */
export async function importSeedContent(): Promise<{
  posts: number;
  slides: number;
  initiatives: number;
  events: number;
  sponsors: number;
}> {
  let p = 0;
  for (const post of posts) {
    await setDoc(
      doc(db, "posts", post.id),
      { ...post, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true },
    );
    p++;
  }

  let s = 0;
  for (const slide of defaultHeroSlides) {
    await setDoc(
      doc(db, "heroSlides", slide.id),
      { ...slide, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true },
    );
    s++;
  }

  let i = 0;
  for (const item of initiatives) {
    const id = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    await setDoc(
      doc(db, "initiatives", id),
      { ...item, order: i + 1, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true },
    );
    i++;
  }

  // Two sample upcoming events so the homepage section is populated. Admin can
  // edit, replace, or delete these. Dates are set relative to import time.
  const now = Date.now();
  const inDays = (d: number) => new Date(now + d * 86400000).toISOString().slice(0, 16);
  const sampleEvents = [
    {
      id: "sample-ramadan-outreach",
      title: "Ramadan Food Outreach",
      slug: "ramadan-food-outreach",
      description: "Join us as we distribute food packages to orphanages and families across Abuja.",
      startAt: inDays(30),
      location: "Abuja, Nigeria",
      images: ["/stories/al-ansar-orphanage-home-ramadan-donation-2025/1.jpg"],
      countdownEnabled: true,
      status: "upcoming",
    },
    {
      id: "sample-back-to-school",
      title: "Back-to-School Drive",
      slug: "back-to-school-drive",
      description: "Providing school supplies and learning materials to less privileged children.",
      startAt: inDays(60),
      location: "Abuja, Nigeria",
      images: ["/stories/mbora-community-visit-empowering-women-2019/1.jpg"],
      countdownEnabled: false,
      status: "upcoming",
    },
  ];
  let e = 0;
  for (const ev of sampleEvents) {
    await setDoc(
      doc(db, "events", ev.id),
      { ...ev, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true },
    );
    e++;
  }

  // Sample partners so the homepage partners slider is populated (text logos;
  // admin can add real logo images). Edit/replace in Admin > Sponsors.
  const sampleSponsors = [
    { id: "partner-ntic", name: "NTIC Foundation", order: 1 },
    { id: "partner-al-ansar", name: "Al Ansar Orphanage", order: 2 },
    { id: "partner-christ-foundation", name: "Christ Foundation", order: 3 },
    { id: "partner-community", name: "Community Partners", order: 4 },
  ];
  let sp = 0;
  for (const partner of sampleSponsors) {
    await setDoc(
      doc(db, "sponsors", partner.id),
      { ...partner, logo: "", url: "", createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true },
    );
    sp++;
  }

  return { posts: p, slides: s, initiatives: i, events: e, sponsors: sp };
}
