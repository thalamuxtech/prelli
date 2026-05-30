"use client";

/**
 * Optional email notification on form submit (Implementation Plan §8).
 * Uses EmailJS (client-side, free tier) when configured via env. If keys are
 * absent it silently no-ops — the submission is still saved to Firestore and
 * visible in the admin, so notifications are purely additive.
 */
export async function notifyByEmail(subject: string, payload: Record<string, string>) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) return;

  try {
    const emailjs = await import("@emailjs/browser");
    await emailjs.send(
      serviceId,
      templateId,
      { subject, ...payload },
      { publicKey },
    );
  } catch {
    // Never block the user on a notification failure.
  }
}
