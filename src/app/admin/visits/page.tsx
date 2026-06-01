"use client";

import { useState } from "react";
import { orderBy } from "firebase/firestore";
import { Monitor, Pencil, Trash2, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCollection, updateDocById, deleteDocById } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { Label, Input } from "@/components/ui/FormField";
import type { SiteVisit } from "@/lib/types";

function fmt(ts?: { seconds: number } | null) {
  if (!ts?.seconds) return "—";
  const d = new Date(ts.seconds * 1000);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function VisitsAdmin() {
  const { profile } = useAuth();

  // Per-device visit details are superadmin-only (matches Firestore rules).
  if (profile && profile.role !== "superadmin") {
    return (
      <div className="rounded-lg border border-line bg-white p-10 text-center shadow-e1">
        <Shield className="mx-auto h-8 w-8 text-slate" />
        <h1 className="mt-3 font-display text-xl font-bold text-ink">Superadmin only</h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate">
          Only a super admin can view and manage site-visit details.
        </p>
      </div>
    );
  }

  return <VisitsInner />;
}

function VisitsInner() {
  const { data, loading } = useCollection<SiteVisit>("siteVisits", orderBy("lastSeen", "desc"));
  const [editing, setEditing] = useState<SiteVisit | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await updateDocById("siteVisits", editing.id, { label: String(fd.get("label")).trim() });
      setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  const totalVisits = data.reduce((n, v) => n + (v.visits ?? 0), 0);

  return (
    <div>
      <PageHeader
        title="Site visits"
        subtitle="Each device that visited the site, with its name and last visit time. Rename or remove any entry."
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No visits recorded yet.</EmptyState>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate">
            <b className="text-ink">{data.length}</b> device{data.length === 1 ? "" : "s"} ·{" "}
            <b className="text-ink">{totalVisits}</b> total visit{totalVisits === 1 ? "" : "s"}
          </p>
          <div className="overflow-hidden rounded-lg border border-line bg-white shadow-e1">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-cloud text-xs uppercase tracking-wide text-slate">
                <tr>
                  <th className="px-4 py-3 font-semibold">PC / Device name</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">First seen</th>
                  <th className="px-4 py-3 font-semibold">Last seen</th>
                  <th className="px-4 py-3 text-center font-semibold">Visits</th>
                  <th className="px-4 py-3 text-right font-semibold">Manage</th>
                </tr>
              </thead>
              <tbody>
                {data.map((v) => (
                  <tr key={v.id} className="border-b border-line last:border-0 hover:bg-cloud/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 shrink-0 text-prelli-green-600" />
                        <span className="font-medium text-ink">{v.label || "Unnamed device"}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-slate sm:table-cell">{fmt(v.firstSeen)}</td>
                    <td className="px-4 py-3 text-slate">{fmt(v.lastSeen)}</td>
                    <td className="px-4 py-3 text-center font-semibold text-ink">{v.visits ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditing(v)}
                          aria-label="Rename device"
                          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-xs font-medium text-ink hover:bg-cloud"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Rename
                        </button>
                        <ConfirmButton
                          onConfirm={() => deleteDocById("siteVisits", v.id)}
                          message="Remove this visit record? This only deletes the log entry, it does not block the visitor."
                          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-xs font-medium text-prelli-pink hover:bg-prelli-pink/5"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </ConfirmButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Rename */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Rename device">
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="label">Device / PC name</Label>
              <Input id="label" name="label" defaultValue={editing.label || ""} required autoFocus />
              <p className="mt-1 text-xs text-slate">
                A friendly label, e.g. &quot;Reception PC&quot; or &quot;Director&apos;s laptop&quot;.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">Cancel</button>
              <SubmitButton busy={busy}>Save</SubmitButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
