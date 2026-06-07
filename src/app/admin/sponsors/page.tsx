"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Handshake } from "lucide-react";
import { useCollection, createDoc, updateDocById, deleteDocById, byOrderAsc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/MediaPicker";
import { Label, Input } from "@/components/ui/FormField";
import { type Sponsor } from "@/lib/types";

export default function SponsorsAdmin() {
  const { data, loading } = useCollection<Sponsor>("sponsors", byOrderAsc());
  const [editing, setEditing] = useState<Partial<Sponsor> | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")),
      url: String(fd.get("url")),
      logo: editing?.logo || "",
      order: Number(fd.get("order")) || 0,
    };
    setBusy(true);
    try {
      if (editing?.id) await updateDocById("sponsors", editing.id, payload);
      else await createDoc("sponsors", payload);
      setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Partners"
        subtitle="Partners and sponsors shown on the website."
        action={
          <button
            onClick={() => setEditing({ order: (data.length + 1) })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
          >
            <Plus className="h-5 w-5" /> New partner
          </button>
        }
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No partners yet. Add your first partner.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-e1"
            >
              <div className="flex items-center gap-3">
                {sponsor.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-14 w-14 shrink-0 rounded-md border border-line bg-white object-contain p-1"
                  />
                ) : (
                  <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-prelli-green-50 text-prelli-green-600">
                    <Handshake className="h-6 w-6" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-ink">{sponsor.name}</h3>
                  {sponsor.url && (
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-sm text-prelli-green-600 hover:underline"
                    >
                      {sponsor.url}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(sponsor)}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-ink hover:bg-cloud"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <ConfirmButton
                  onConfirm={() => deleteDocById("sponsors", sponsor.id)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-prelli-pink hover:bg-prelli-pink/5"
                >
                  <Trash2 className="h-4 w-4" />
                </ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit partner" : "New partner"}>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing.name} />
            </div>
            <div>
              <Label htmlFor="url">Website URL</Label>
              <Input id="url" name="url" type="url" placeholder="https://example.com" defaultValue={editing.url} />
            </div>
            <ImageUpload
              value={editing.logo}
              onChange={(url) => setEditing((p) => ({ ...p, logo: url }))}
              folder="sponsors"
              label="Logo"
            />
            <div>
              <Label htmlFor="order">Order</Label>
              <Input id="order" name="order" type="number" defaultValue={editing.order ?? 0} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">
                Cancel
              </button>
              <SubmitButton busy={busy}>{editing.id ? "Save changes" : "Create partner"}</SubmitButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
