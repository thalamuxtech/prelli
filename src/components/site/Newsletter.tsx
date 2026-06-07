"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { subscribeNewsletter } from "@/lib/submissions";

type Status = "idle" | "sending" | "done" | "error";

/** Newsletter capture — writes a "subscribe" submission to the unified
 *  `submissions` inbox (§8), shown in Admin > Submissions. */
export function Newsletter() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "");
    setStatus("sending");
    try {
      await subscribeNewsletter(email, "footer");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="inline-flex items-center gap-2 rounded-md bg-prelli-green-50 px-4 py-3 text-sm font-medium text-prelli-green-600">
        <CheckCircle2 className="h-5 w-5" /> You&apos;re subscribed. Thank you!
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <input
        id="nl-email"
        name="email"
        type="email"
        required
        placeholder="Your email address"
        className="min-h-[44px] flex-1 rounded-md border border-line bg-white px-4 text-ink placeholder:text-slate/60 focus-visible:border-prelli-green focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-prelli-green px-5 font-semibold text-white transition-colors hover:bg-prelli-green-600 disabled:opacity-60"
      >
        {status === "sending" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Subscribe <Send className="h-4 w-4" />
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-sm text-prelli-pink sm:absolute sm:mt-12">
          Couldn't subscribe. Please try again.
        </p>
      )}
    </form>
  );
}
