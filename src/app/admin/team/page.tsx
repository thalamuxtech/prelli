"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Users2 } from "lucide-react";
import { useCollection, createDoc, updateDocById, deleteDocById, byOrderAsc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/MediaPicker";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { type TeamMember } from "@/lib/types";

export default function TeamAdmin() {
  const { data, loading } = useCollection<TeamMember>("team", byOrderAsc());
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")),
      role: String(fd.get("role")),
      bio: String(fd.get("bio")),
      photo: editing?.photo || "",
      order: Number(fd.get("order")) || 0,
    };
    setBusy(true);
    try {
      if (editing?.id) await updateDocById("team", editing.id, payload);
      else await createDoc("team", payload);
      setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Members shown on the About page."
        action={
          <button
            onClick={() => setEditing({ order: (data.length + 1) })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
          >
            <Plus className="h-5 w-5" /> New member
          </button>
        }
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No team members yet. Add your first one.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-e1"
            >
              <div className="flex items-center gap-3">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-14 w-14 shrink-0 rounded-pill border border-line object-cover"
                  />
                ) : (
                  <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-prelli-green-50 text-prelli-green-600">
                    <Users2 className="h-6 w-6" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-ink">{member.name}</h3>
                  <p className="truncate text-sm text-slate">{member.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(member)}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-ink hover:bg-cloud"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <ConfirmButton
                  onConfirm={() => deleteDocById("team", member.id)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-prelli-pink hover:bg-prelli-pink/5"
                >
                  <Trash2 className="h-4 w-4" />
                </ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit member" : "New member"}>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing.name} />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" required defaultValue={editing.role} />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" defaultValue={editing.bio} />
            </div>
            <ImageUpload
              value={editing.photo}
              onChange={(url) => setEditing((p) => ({ ...p, photo: url }))}
              folder="team"
              label="Photo"
            />
            <div>
              <Label htmlFor="order">Order</Label>
              <Input id="order" name="order" type="number" defaultValue={editing.order ?? 0} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">
                Cancel
              </button>
              <SubmitButton busy={busy}>{editing.id ? "Save changes" : "Create member"}</SubmitButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
