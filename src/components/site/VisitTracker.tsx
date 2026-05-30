"use client";

import { useEffect } from "react";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Lightweight first-party visit counter. Increments siteStats/global once per
 * browser session (sessionStorage guard) so the admin can see traffic without
 * any external analytics. Fails silently if Firestore is unreachable.
 */
export function VisitTracker() {
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const sessionKey = "prelli-visit-counted";
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");

      setDoc(
        doc(db, "siteStats", "global"),
        { totalVisits: increment(1), updatedAt: serverTimestamp(), lastDay: today },
        { merge: true },
      ).catch(() => {});
    } catch {
      /* no-op */
    }
  }, []);

  return null;
}
