"use client";

import { useMemo, useState } from "react";
import {
  Inbox,
  Mail,
  Phone,
  Check,
  Archive,
  ArchiveRestore,
  Trash2,
  Download,
  Dot,
} from "lucide-react";
import { useCollection, updateDocById, deleteDocById, byCreatedDesc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { downloadCsv } from "@/lib/csv";
import { submissionLabels, type Submission, type SubmissionType } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = SubmissionType | "all";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "contact", label: submissionLabels.contact },
  { key: "volunteer", label: submissionLabels.volunteer },
  { key: "partner", label: submissionLabels.partner },
  { key: "pledge", label: submissionLabels.pledge },
  { key: "subscribe", label: submissionLabels.subscribe },
];

const typeBadge: Record<SubmissionType, string> = {
  contact: "bg-prelli-green-50 text-prelli-green-600",
  volunteer: "bg-prelli-orange/10 text-prelli-orange",
  partner: "bg-prelli-pink/10 text-prelli-pink",
  pledge: "bg-cloud text-slate",
  subscribe: "bg-prelli-blue/10 text-prelli-blue-700",
};

/** Safely render a Firestore Timestamp (or anything date-ish). */
function fmtDate(value: unknown): string {
  if (!value) return "";
  let d: Date | null = null;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    try {
      d = (value as { toDate: () => Date }).toDate();
    } catch {
      d = null;
    }
  } else if (typeof value === "string" || typeof value === "number") {
    d = new Date(value);
  }
  if (!d || isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SubmissionsAdmin() {
  const { data, loading } = useCollection<Submission>("submissions", byCreatedDesc());
  const [active, setActive] = useState<Filter>("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const visible = useMemo(
    () => (active === "all" ? data : data.filter((s) => s.type === active)),
    [data, active],
  );

  const unhandledCount = useMemo(() => data.filter((s) => !s.handled).length, [data]);

  function exportCsv() {
    const rows = visible.map((s) => ({
      type: submissionLabels[s.type],
      name: s.name,
      email: s.email,
      phone: s.phone ?? "",
      message: s.message,
      handled: s.handled ? "yes" : "no",
      archived: s.archived ? "yes" : "no",
      date: fmtDate(s.createdAt),
    }));
    downloadCsv("submissions.csv", rows);
  }

  async function toggleHandled(s: Submission) {
    const next = !s.handled;
    await updateDocById("submissions", s.id, { handled: next });
    setSelected((cur) => (cur && cur.id === s.id ? { ...cur, handled: next } : cur));
  }

  async function toggleArchived(s: Submission) {
    const next = !s.archived;
    await updateDocById("submissions", s.id, { archived: next });
    setSelected((cur) => (cur && cur.id === s.id ? { ...cur, archived: next } : cur));
  }

  async function remove(id: string) {
    await deleteDocById("submissions", id);
    setSelected((cur) => (cur && cur.id === id ? null : cur));
  }

  return (
    <div>
      <PageHeader
        title="Submissions"
        subtitle={
          unhandledCount > 0
            ? `${unhandledCount} new submission${unhandledCount === 1 ? "" : "s"} awaiting review.`
            : "All submissions reviewed."
        }
        action={
          <button
            onClick={exportCsv}
            disabled={visible.length === 0}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-line bg-white px-5 font-semibold text-ink hover:bg-cloud disabled:opacity-60"
          >
            <Download className="h-5 w-5" /> Export CSV
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2.5">
        {filters.map((f) => {
          const count =
            f.key === "all" ? data.length : data.filter((s) => s.type === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              className={cn(
                "min-h-[40px] rounded-pill border px-4 text-sm font-medium transition-all duration-200",
                active === f.key
                  ? "border-prelli-green bg-prelli-green text-white shadow-e1"
                  : "border-line bg-white text-slate hover:border-prelli-green hover:text-prelli-green-600",
              )}
            >
              {f.label} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingRow />
      ) : visible.length === 0 ? (
        <EmptyState>
          <Inbox className="mx-auto mb-2 h-8 w-8 text-slate/60" />
          No submissions in this view yet.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {visible.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelected(s)}
              className={cn(
                "flex w-full min-h-[44px] flex-col gap-3 rounded-lg border bg-white p-4 text-left shadow-e1 transition-shadow hover:shadow-e2 sm:flex-row sm:items-center",
                s.handled ? "border-line" : "border-prelli-green/40",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-semibold",
                      typeBadge[s.type],
                    )}
                  >
                    {submissionLabels[s.type]}
                  </span>
                  {!s.handled && (
                    <span className="inline-flex items-center rounded-pill bg-prelli-green px-2 py-0.5 text-xs font-semibold text-white">
                      <Dot className="-ml-1 h-4 w-4" /> New
                    </span>
                  )}
                  {s.archived && (
                    <span className="inline-flex items-center gap-1 rounded-pill bg-cloud px-2 py-0.5 text-xs font-semibold text-slate">
                      <Archive className="h-3 w-3" /> Archived
                    </span>
                  )}
                  <span className="text-xs text-slate">{fmtDate(s.createdAt)}</span>
                </div>
                <h3 className="mt-1 truncate font-medium text-ink">
                  {s.name ? (
                    <>
                      {s.name} <span className="font-normal text-slate">· {s.email}</span>
                    </>
                  ) : (
                    s.email
                  )}
                </h3>
                {s.message ? (
                  <p className="mt-0.5 truncate text-sm text-slate">{s.message}</p>
                ) : s.type === "subscribe" ? (
                  <p className="mt-0.5 truncate text-sm text-slate">
                    Newsletter sign-up{s.extra?.source ? ` · via ${s.extra.source}` : ""}
                  </p>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? submissionLabels[selected.type] : "Submission"}
        wide
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-semibold",
                  typeBadge[selected.type],
                )}
              >
                {submissionLabels[selected.type]}
              </span>
              {selected.handled ? (
                <span className="inline-flex items-center gap-1 rounded-pill bg-prelli-green-50 px-2.5 py-0.5 text-xs font-semibold text-prelli-green-600">
                  <Check className="h-3 w-3" /> Handled
                </span>
              ) : (
                <span className="inline-flex items-center rounded-pill bg-prelli-green px-2.5 py-0.5 text-xs font-semibold text-white">
                  New
                </span>
              )}
              {selected.archived && (
                <span className="inline-flex items-center gap-1 rounded-pill bg-cloud px-2.5 py-0.5 text-xs font-semibold text-slate">
                  <Archive className="h-3 w-3" /> Archived
                </span>
              )}
              <span className="ml-auto text-xs text-slate">{fmtDate(selected.createdAt)}</span>
            </div>

            <dl className="space-y-3 rounded-lg border border-line bg-cloud/40 p-4">
              <Field label="Name" value={selected.name} />
              <Field label="Email" value={selected.email} />
              {selected.phone && <Field label="Phone" value={selected.phone} />}
              {selected.extra &&
                Object.entries(selected.extra).map(([k, v]) => (
                  <Field key={k} label={k} value={v} />
                ))}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate">
                  Message
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-ink">{selected.message}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  `Re: ${submissionLabels[selected.type]} · PreLLI`,
                )}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
              >
                <Mail className="h-4 w-4" /> Reply by email
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line px-4 font-medium text-ink hover:bg-cloud"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
              )}
              <button
                type="button"
                onClick={() => toggleHandled(selected)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line px-4 font-medium text-ink hover:bg-cloud"
              >
                <Check className="h-4 w-4" />
                {selected.handled ? "Mark unhandled" : "Mark handled"}
              </button>
              <button
                type="button"
                onClick={() => toggleArchived(selected)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line px-4 font-medium text-ink hover:bg-cloud"
              >
                {selected.archived ? (
                  <>
                    <ArchiveRestore className="h-4 w-4" /> Unarchive
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" /> Archive
                  </>
                )}
              </button>
              <ConfirmButton
                onConfirm={() => remove(selected.id)}
                message="Delete this submission permanently? This cannot be undone."
                className="ml-auto inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line px-4 font-medium text-prelli-pink hover:bg-prelli-pink/5"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </ConfirmButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  );
}
