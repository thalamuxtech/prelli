"use client";

import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2, KeyRound } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/site/Logo";
import { Label, Input } from "@/components/ui/FormField";

/** First-login password change for admin-created accounts. */
export function ChangePassword() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const pw = String(fd.get("password"));
    const confirm = String(fd.get("confirm"));
    if (pw.length < 8) return setError("Use at least 8 characters.");
    if (pw !== confirm) return setError("Passwords don't match.");

    setBusy(true);
    setError(null);
    try {
      if (!auth.currentUser) throw new Error("no user");
      await updatePassword(auth.currentUser, pw);
      await updateDoc(doc(db, "users", user!.uid), { mustChangePassword: false });
      // Profile listener will pick up the change and render the shell.
    } catch {
      setError("Couldn't update password. You may need to sign in again.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo size={56} />
        </div>
        <div className="rounded-lg border border-line bg-white p-8 shadow-e2">
          <div className="mb-2 inline-flex rounded-md bg-prelli-green-50 p-2.5">
            <KeyRound className="h-5 w-5 text-prelli-green-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Set a new password</h1>
          <p className="mt-1 text-sm text-slate">
            Welcome! Please choose your own password to continue.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="password">New password</Label>
              <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm password</Label>
              <Input id="confirm" name="confirm" type="password" required autoComplete="new-password" />
            </div>
            {error && <p className="text-sm text-prelli-pink">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-pill bg-prelli-green font-semibold text-white transition-colors hover:bg-prelli-green-600 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save & continue"}
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full text-center text-sm text-slate hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
