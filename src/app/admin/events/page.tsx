"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Timer, MapPin } from "lucide-react";
import { useCollection, createDoc, updateDocById, deleteDocById, byCreatedDesc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { MultiImageUpload } from "@/components/admin/MediaPicker";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import type { AdminEvent } from "@/lib/types";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function EventsAdmin() {
  const { data, loading } = useCollection<AdminEvent>("events", byCreatedDesc());
  const [editing, setEditing] = useState<Partial<AdminEvent> | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title"));
    const startAt = String(fd.get("startAt"));
    const payload = {
      title,
      slug: editing?.slug || slugify(title),
      description: String(fd.get("description")),
      startAt,
      location: String(fd.get("location")),
      images: editing?.images || [],
      countdownEnabled: fd.get("countdownEnabled") === "on",
      status: new Date(startAt).getTime() > Date.now() ? "upcoming" : "past",
    };
    setBusy(true);
    try {
      if (editing?.id) await updateDocById("events", editing.id, payload);
      else await createDoc("events", payload);
      setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Outreaches and programs. Enable a countdown to feature an event on the homepage."
        action={
          <button
            onClick={() => setEditing({ images: [], countdownEnabled: false })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
          >
            <Plus className="h-5 w-5" /> New event
          </button>
        }
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No events yet. Create one and optionally enable its countdown.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((ev) => (
            <div key={ev.id} className="overflow-hidden rounded-lg border border-line bg-white shadow-e1">
              {ev.images?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ev.images[0]} alt="" className="h-36 w-full object-cover" />
              )}
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-pill px-2 py-0.5 text-xs font-semibold ${ev.status === "upcoming" ? "bg-prelli-orange-50 text-prelli-orange" : "bg-cloud text-slate"}`}>
                    {ev.status}
                  </span>
                  {ev.countdownEnabled && (
                    <span className="inline-flex items-center gap-1 rounded-pill bg-prelli-green-50 px-2 py-0.5 text-xs font-semibold text-prelli-green-600">
                      <Timer className="h-3 w-3" /> Countdown on
                    </span>
                  )}
                  {ev.images?.length > 0 && (
                    <span className="text-xs text-slate">{ev.images.length} image{ev.images.length > 1 ? "s" : ""}</span>
                  )}
                </div>
                <h3 className="mt-2 font-medium text-ink">{ev.title}</h3>
                {ev.location && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate">
                    <MapPin className="h-3.5 w-3.5" /> {ev.location}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditing(ev)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-ink hover:bg-cloud">
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <ConfirmButton onConfirm={() => deleteDocById("events", ev.id)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-prelli-pink hover:bg-prelli-pink/5">
                    <Trash2 className="h-4 w-4" />
                  </ConfirmButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit event" : "New event"} wide>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="title">Event title</Label>
              <Input id="title" name="title" required defaultValue={editing.title} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={editing.description} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="startAt">Date &amp; time</Label>
                <Input id="startAt" name="startAt" type="datetime-local" required defaultValue={editing.startAt} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" defaultValue={editing.location} />
              </div>
            </div>

            <MultiImageUpload
              values={editing.images || []}
              onChange={(urls) => setEditing((p) => ({ ...p, images: urls }))}
              folder="events"
              max={5}
            />
            <p className="text-xs text-slate">3–5 images recommended. They display as an auto-slider on the event card with a full-view option.</p>

            <label className="flex items-center gap-3 rounded-md border border-line bg-cloud p-4">
              <input type="checkbox" name="countdownEnabled" defaultChecked={editing.countdownEnabled} className="h-5 w-5 accent-prelli-green" />
              <span className="text-sm">
                <span className="font-medium text-ink">Show animated countdown on homepage</span>
                <span className="block text-slate">Counts down to this event&apos;s date.</span>
              </span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">Cancel</button>
              <SubmitButton busy={busy}>{editing.id ? "Save changes" : "Create event"}</SubmitButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
