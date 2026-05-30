"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCollection, createDoc, updateDocById, deleteDocById, byOrderAsc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { Label, Input, Textarea } from "@/components/ui/FormField";

interface InitiativeDoc {
  id: string;
  title: string;
  summary: string;
  order: number;
}

export default function InitiativesAdmin() {
  const { data, loading } = useCollection<InitiativeDoc>("initiatives", byOrderAsc());
  const [editing, setEditing] = useState<Partial<InitiativeDoc> | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title")),
      summary: String(fd.get("summary")),
      order: Number(fd.get("order")) || 0,
    };
    setBusy(true);
    try {
      if (editing?.id) await updateDocById("initiatives", editing.id, payload);
      else await createDoc("initiatives", payload);
      setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Initiatives"
        subtitle="The core programmes shown on the Our Work & Impact page."
        action={
          <button
            onClick={() => setEditing({ order: data.length + 1 })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
          >
            <Plus className="h-5 w-5" /> New initiative
          </button>
        }
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No initiatives yet. Add one, or use &ldquo;Import starter content&rdquo; in Settings.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((item) => (
            <div key={item.id} className="rounded-lg border border-line bg-white p-5 shadow-e1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-semibold text-ink">{item.title}</h3>
                <span className="shrink-0 text-xs text-slate">#{item.order}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">{item.summary}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(item)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-ink hover:bg-cloud">
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <ConfirmButton onConfirm={() => deleteDocById("initiatives", item.id)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-prelli-pink hover:bg-prelli-pink/5">
                  <Trash2 className="h-4 w-4" />
                </ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit initiative" : "New initiative"}>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={editing.title} />
            </div>
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" required defaultValue={editing.summary} className="min-h-[90px]" />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input id="order" name="order" type="number" inputMode="numeric" defaultValue={editing.order ?? 0} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">Cancel</button>
              <SubmitButton busy={busy}>{editing.id ? "Save changes" : "Create initiative"}</SubmitButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
