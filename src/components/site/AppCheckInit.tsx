"use client";

import { useEffect } from "react";
import { initAppCheck } from "@/lib/firebase";

/** Mounts App Check once on the client (no-op if no reCAPTCHA key is set). */
export function AppCheckInit() {
  useEffect(() => {
    initAppCheck();
  }, []);
  return null;
}
