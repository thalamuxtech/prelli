"use client";

import { useMemo, useState } from "react";
import { Mail, Search, Trash2, Download, UserCheck, UserX } from "lucide-react";
import { useCollection, updateDocById, deleteDocById, byCreatedDesc } from "@/lib/db";
import { PageHeader, ConfirmButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { Input } from "@/components/ui/FormField";
import { downloadCsv } from "@/lib/csv";
import type { Subscriber } from "@/lib/types";

/** Firestore Timestamp → locale date string, or "—" when unavailable. */
function formatJoined(value: unknown): string {
  if (value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toLocaleDateString();
  }
  return "—";
}

function StatusPill({ status }: { status: Subscriber["status"] }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-semibold ${
        active ? "bg-prelli-green-50 text-prelli-green-600" : "bg-cloud text-slate"
      }`}
    >
      {active ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
      {status}
    </span>
  );
}

export default function SubscribersAdmin() {
  const { data, loading } = useCollection<Subscriber>("subscribers", byCreatedDesc());
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        (s.name ?? "").toLowerCase().includes(q),
    );
  }, [data, search]);

  function toggleStatus(sub: Subscriber) {
    updateDocById("subscribers", sub.id, {
      status: sub.status === "active" ? "unsubscribed" : "active",
    });
  }

  function exportCsv() {
    downloadCsv(
      "subscribers.csv",
      filtered.map((s) => ({
        email: s.email,
        name: s.name ?? "",
        source: s.source,
        status: s.status,
      })),
    );
  }

  return (
    <div>
      <PageHeader
        title="Subscribers"
        subtitle={`${data.length} ${data.length === 1 ? "subscriber" : "subscribers"} on the newsletter list.`}
        action={
          <button
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600 disabled:opacity-60"
          >
            <Download className="h-5 w-5" /> Export CSV
          </button>
        }
      />

      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
        <Input
          type="search"
          placeholder="Search by email or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
          aria-label="Search subscribers"
        />
      </div>

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No subscribers yet. They will appear here as people sign up.</EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState>No subscribers match “{search}”.</EmptyState>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-white shadow-e1">
          {/* Desktop table */}
          <table className="hidden w-full text-sm sm:table">
            <thead className="border-b border-line bg-cloud text-left text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                      <Mail className="h-4 w-4 text-slate" /> {sub.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate">{sub.name || "—"}</td>
                  <td className="px-4 py-3 text-slate">{sub.source || "—"}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={sub.status} />
                  </td>
                  <td className="px-4 py-3 text-slate">{formatJoined(sub.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => toggleStatus(sub)}
                        title={sub.status === "active" ? "Mark as unsubscribed" : "Reactivate"}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink hover:bg-cloud"
                      >
                        {sub.status === "active" ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-prelli-green-600" />
                        )}
                      </button>
                      <ConfirmButton
                        onConfirm={() => deleteDocById("subscribers", sub.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-prelli-pink hover:bg-prelli-pink/5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-line sm:hidden">
            {filtered.map((sub) => (
              <div key={sub.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="inline-flex items-center gap-1.5 truncate font-medium text-ink">
                      <Mail className="h-4 w-4 shrink-0 text-slate" /> {sub.email}
                    </h3>
                    {sub.name && <p className="text-xs text-slate">{sub.name}</p>}
                  </div>
                  <StatusPill status={sub.status} />
                </div>
                <p className="mt-1 text-xs text-slate">
                  {sub.source || "—"} · joined {formatJoined(sub.createdAt)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleStatus(sub)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md border border-line px-3 text-sm text-ink"
                  >
                    {sub.status === "active" ? (
                      <>
                        <UserX className="h-4 w-4" /> Unsubscribe
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 text-prelli-green-600" /> Reactivate
                      </>
                    )}
                  </button>
                  <ConfirmButton
                    onConfirm={() => deleteDocById("subscribers", sub.id)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md border border-line px-3 text-sm text-prelli-pink"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </ConfirmButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
