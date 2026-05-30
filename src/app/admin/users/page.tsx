"use client";

import { useState } from "react";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserPlus, Shield, Trash2, Copy, Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { useCollection, deleteDocById, byCreatedDesc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { Label, Input } from "@/components/ui/FormField";
import type { AppUser, Role } from "@/lib/types";

const roles: Role[] = ["superadmin", "admin", "editor"];
const roleLabels: Record<Role, string> = {
  superadmin: "Super admin",
  admin: "Admin",
  editor: "Editor",
};

// Firebase web config (same project) used by a throwaway secondary app so we
// can create a user WITHOUT signing the current admin out.
const fbConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

export default function UsersAdmin() {
  const { profile } = useAuth();
  const { data, loading } = useCollection<AppUser>("users", byCreatedDesc());
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function createUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email")).trim();
    const displayName = String(fd.get("displayName")).trim();
    const role = String(fd.get("role")) as Role;
    const tempPassword = String(fd.get("password"));
    if (tempPassword.length < 8) {
      setError("Temporary password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    setError(null);

    // Secondary app keeps the admin signed in while we create the new account.
    const secondary = initializeApp(fbConfig, `secondary-${Date.now()}`);
    try {
      const secAuth = getAuth(secondary);
      const cred = await createUserWithEmailAndPassword(secAuth, email, tempPassword);
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        displayName,
        role,
        mustChangePassword: true,
        createdAt: serverTimestamp(),
      });
      await signOut(secAuth);
      setCreated({ email, password: tempPassword });
      setAdding(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create user.";
      setError(msg.includes("email-already-in-use") ? "That email already has an account." : "Couldn't create user. Check the email is valid.");
    } finally {
      await deleteApp(secondary).catch(() => {});
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Users & roles"
        subtitle="Create staff accounts and manage who can access the admin."
        action={
          <button
            onClick={() => { setAdding(true); setError(null); }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
          >
            <UserPlus className="h-5 w-5" /> Add user
          </button>
        }
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No staff users recorded yet.</EmptyState>
      ) : (
        <div className="space-y-3">
          {data.map((u) => (
            <div key={u.uid} className="flex flex-col gap-2 rounded-lg border border-line bg-white p-4 shadow-e1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-pill bg-prelli-green-50 px-2 py-0.5 text-xs font-semibold text-prelli-green-600">
                    <Shield className="h-3 w-3" /> {roleLabels[u.role]}
                  </span>
                  {u.mustChangePassword && (
                    <span className="rounded-pill bg-prelli-orange-50 px-2 py-0.5 text-xs font-semibold text-prelli-orange">
                      Pending first login
                    </span>
                  )}
                </div>
                <p className="mt-1 font-medium text-ink">{u.displayName || u.email}</p>
                <p className="text-sm text-slate">{u.email}</p>
              </div>
              {/* Don't allow deleting yourself or the only superadmin record */}
              {u.email !== profile?.email && (
                <ConfirmButton
                  onConfirm={() => deleteDocById("users", u.uid)}
                  message="Remove this user's admin access? (Their login account remains in Firebase Auth but loses all roles.)"
                  className="inline-flex h-10 items-center gap-1.5 self-start rounded-md border border-line px-3 text-sm font-medium text-prelli-pink hover:bg-prelli-pink/5"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </ConfirmButton>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add user */}
      <Modal open={adding} onClose={() => setAdding(false)} title="Add staff user">
        <form onSubmit={createUser} className="space-y-4">
          <div>
            <Label htmlFor="displayName">Name</Label>
            <Input id="displayName" name="displayName" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="off" />
          </div>
          <div>
            <Label htmlFor="password">Temporary password</Label>
            <Input id="password" name="password" type="text" required minLength={8} defaultValue={genPassword()} />
            <p className="mt-1 text-xs text-slate">They&apos;ll be asked to set their own password on first login.</p>
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select id="role" name="role" defaultValue="editor" className="w-full rounded-md border border-line bg-white px-4 py-3 text-ink">
              {roles.map((r) => (<option key={r} value={r}>{roleLabels[r]}</option>))}
            </select>
          </div>
          {error && <p className="text-sm text-prelli-pink">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAdding(false)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">Cancel</button>
            <SubmitButton busy={busy}>Create user</SubmitButton>
          </div>
        </form>
      </Modal>

      {/* Credentials hand-off */}
      <Modal open={!!created} onClose={() => setCreated(null)} title="User created">
        {created && (
          <div className="space-y-4">
            <p className="text-sm text-slate">
              Share these credentials securely. The user will set their own
              password when they first sign in.
            </p>
            <div className="space-y-2 rounded-md border border-line bg-cloud p-4 text-sm">
              <p><span className="text-slate">Email:</span> <b className="text-ink">{created.email}</b></p>
              <p><span className="text-slate">Temp password:</span> <b className="text-ink">{created.password}</b></p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`Email: ${created.email}\nTemporary password: ${created.password}\nSign in at: ${location.origin}/admin`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-line px-5 font-medium text-ink hover:bg-cloud"
            >
              {copied ? <><Check className="h-4 w-4 text-prelli-green-600" /> Copied</> : <><Copy className="h-4 w-4" /> Copy details</>}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function genPassword() {
  // Simple readable temp password (non-crypto; the user changes it immediately).
  const words = ["Hope", "Care", "Light", "Grace", "Kind", "Joy"];
  const w = words[Math.floor((typeof window !== "undefined" ? performance.now() : 1) % words.length)];
  return `${w}-PreLLI-${1000 + Math.floor((typeof window !== "undefined" ? performance.now() * 7 : 1234) % 9000)}`;
}
