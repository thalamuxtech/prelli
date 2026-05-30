"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { initAppCheck } from "@/lib/firebase";
import { useAuth, isStaff } from "@/lib/auth";
import { LoginScreen } from "@/components/admin/LoginScreen";
import { ChangePassword } from "@/components/admin/ChangePassword";
import { AdminShell } from "@/components/admin/AdminShell";

/** Auth + role gate guarding the whole /admin area. */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    initAppCheck();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud">
        <Loader2 className="h-8 w-8 animate-spin text-prelli-green" />
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  if (!isStaff(profile?.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cloud px-6 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">No access</h1>
        <p className="max-w-sm text-slate">
          This account isn&apos;t authorised for the admin area. Contact a
          PreLLI administrator.
        </p>
      </div>
    );
  }

  // Force password change on first login (admin-created accounts).
  if (profile?.mustChangePassword) return <ChangePassword />;

  return <AdminShell>{children}</AdminShell>;
}
