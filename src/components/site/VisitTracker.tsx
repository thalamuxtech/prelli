"use client";

import { useEffect } from "react";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/** A stable, anonymous per-browser id kept in localStorage. */
function getDeviceId(): string {
  const key = "prelli-device-id";
  let id = localStorage.getItem(key);
  if (!id) {
    // Random, non-PII id (browsers can't read the real OS/PC hostname).
    id = "dev-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
    localStorage.setItem(key, id);
  }
  return id;
}

/** Best-effort, human-readable device label from the user agent, e.g.
 * "Chrome on Windows". Used as the default "PC name" the admin can rename. */
function deviceLabel(): string {
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  if (/Windows NT 11/.test(ua) || /Windows NT 10/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";
  else if (/Windows/.test(ua)) os = "Windows";

  let browser = "Browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua) || /Opera/.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = "Safari";

  return `${browser} on ${os}`;
}

/** Best-effort approximate location from the visitor's IP (city, country).
 * Uses a free, key-less geo-IP endpoint; returns "" on any failure so a blocked
 * request never breaks visit tracking. This is approximate (ISP-level), not GPS. */
async function approxLocation(): Promise<string> {
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!res.ok) return "";
    const j = (await res.json()) as { city?: string; region?: string; country_name?: string };
    return [j.city, j.region, j.country_name].filter(Boolean).join(", ").slice(0, 120);
  } catch {
    return "";
  }
}

/**
 * First-party visit tracker. Maintains:
 *  - siteStats/global    aggregate counter (totalVisits)
 *  - siteVisits/{device} one doc per browser with a device label, first/last
 *    seen time and a visit count. Superadmins can rename/edit/delete these.
 * Once-per-session via sessionStorage so a reload doesn't double-count.
 * Fails silently if Firestore is unreachable.
 */
export function VisitTracker() {
  useEffect(() => {
    (async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const sessionKey = "prelli-visit-counted";
        if (sessionStorage.getItem(sessionKey)) return;
        sessionStorage.setItem(sessionKey, "1");

        // Aggregate counter (existing dashboard number).
        setDoc(
          doc(db, "siteStats", "global"),
          { totalVisits: increment(1), updatedAt: serverTimestamp(), lastDay: today },
          { merge: true },
        ).catch(() => {});

        // Approximate (IP-based) location — may be "" if the lookup is blocked.
        const location = await approxLocation();

        // Per-device record (the "PC name" + location + time list).
        const id = getDeviceId();
        const firstKey = "prelli-device-first";
        const isFirst = !localStorage.getItem(firstKey);
        if (isFirst) localStorage.setItem(firstKey, "1");
        const data: Record<string, unknown> = {
          userAgent: navigator.userAgent.slice(0, 300),
          lastSeen: serverTimestamp(),
          visits: increment(1),
        };
        if (location) data.location = location;
        // Only stamp firstSeen + default label on the device's very first visit so
        // later merges don't clobber the original time or a superadmin's rename.
        if (isFirst) {
          data.firstSeen = serverTimestamp();
          data.label = deviceLabel();
        }
        setDoc(doc(db, "siteVisits", id), data, { merge: true }).catch(() => {});
      } catch {
        /* no-op */
      }
    })();
  }, []);

  return null;
}
