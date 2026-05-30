/**
 * Firebase client init for the PreLLI website (project `prelli`, free Spark plan).
 * Web config values are public by design but read from NEXT_PUBLIC_* env so we can
 * swap projects/environments without code changes. See Implementation Plan §9.1.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT,
};

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

/**
 * Firebase App Check (reCAPTCHA v3) — secures public client writes (§8).
 * Only initializes in the browser when a site key is configured, so the build
 * and local dev work without it. Call initAppCheck() once from a client effect.
 */
let appCheckStarted = false;
export function initAppCheck() {
  if (typeof window === "undefined" || appCheckStarted) return;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return;
  appCheckStarted = true;
  // Dynamic import keeps App Check out of the main bundle until needed.
  import("firebase/app-check").then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  });
}

/**
 * Analytics is browser-only and optional; call from a client component/effect.
 * Returns null on the server or where analytics isn't supported.
 */
export async function getAnalyticsSafe() {
  if (typeof window === "undefined") return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  return (await isSupported()) ? getAnalytics(app) : null;
}
