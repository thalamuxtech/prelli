"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCollection, createDoc, deleteDocById, byCreatedDesc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/MediaPicker";
import { Label, Input } from "@/components/ui/FormField";

interface GalleryDoc {
  id: string;
  src: string;
  caption: string;
  year: number;
}

export default function GalleryAdmin() {
  const { data, loading } = useCollection<GalleryDoc>("galleries", byCreatedDesc());
  const [editing, setEditing] = useState<Partial<GalleryDoc> | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing?.src) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await createDoc("galleries", {
        src: editing.src,
        caption: String(fd.get("caption")),
        year: Number(fd.get("year")) || new Date().getFullYear(),
      });
      setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle="Photos shown in the public gallery. (Event photos are managed per-event.)"
        action={
          <button
            onClick={() => setEditing({ year: new Date().getFullYear() })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
          >
            <Plus className="h-5 w-5" /> Add photo
          </button>
        }
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No gallery photos yet.</EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((g) => (
            <div key={g.id} className="group relative overflow-hidden rounded-md border border-line bg-white shadow-e1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.caption} className="aspect-square w-full object-cover" />
              <div className="p-2">
                <p className="truncate text-xs font-medium text-ink">{g.caption || "Untitled"}</p>
                <p className="text-xs text-slate">{g.year}</p>
              </div>
              <ConfirmButton
                onConfirm={() => deleteDocById("galleries", g.id)}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-pill bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </ConfirmButton>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Add gallery photo">
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <ImageUpload
              value={editing.src}
              onChange={(url) => setEditing((p) => ({ ...p, src: url }))}
              folder="gallery"
              label="Photo"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Input id="caption" name="caption" defaultValue={editing.caption} />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" name="year" type="number" inputMode="numeric" defaultValue={editing.year} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">Cancel</button>
              <SubmitButton busy={busy}>Add photo</SubmitButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
