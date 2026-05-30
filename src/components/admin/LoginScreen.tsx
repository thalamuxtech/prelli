"use client";

import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/site/Logo";
import { Label, Input } from "@/components/ui/FormField";

export function LoginScreen() {
  const { signIn } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await signIn(String(fd.get("email")), String(fd.get("password")));
    } catch {
      setError("Incorrect email or password.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo size={40} />
        </div>
        <div className="rounded-lg border border-line bg-white p-8 shadow-e2">
          <h1 className="font-display text-2xl font-bold text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate">Manage the PreLLI website.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            {error && <p className="text-sm text-prelli-pink">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-pill bg-prelli-green font-semibold text-white transition-colors hover:bg-prelli-green-600 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><LogIn className="h-5 w-5" /> Sign in</>}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-slate">
          Precious Little Lives Initiative · Admin
        </p>
      </div>
    </div>
  );
}
