"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Images } from "lucide-react";
import { useCollection, createDoc, updateDocById, deleteDocById, byOrderAsc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/MediaPicker";
import { Label, Input, Textarea } from "@/components/ui/FormField";

interface Slide {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
  order: number;
}

export default function SlidesAdmin() {
  const { data, loading } = useCollection<Slide>("heroSlides", byOrderAsc());
  const [editing, setEditing] = useState<Partial<Slide> | null>(null);
  const [busy, setBusy] = useState(false);
  const [imageError, setImageError] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing?.image) {
      setImageError(true);
      return;
    }
    const fd = new FormData(e.currentTarget);
    const payload = {
      image: editing.image,
      eyebrow: String(fd.get("eyebrow")),
      title: String(fd.get("title")),
      highlight: String(fd.get("highlight")),
      body: String(fd.get("body")),
      order: Number(fd.get("order")) || 0,
    };
    setBusy(true);
    try {
      if (editing?.id) await updateDocById("heroSlides", editing.id, payload);
      else await createDoc("heroSlides", payload);
      setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Hero slides"
        subtitle="These slides appear in the homepage hero slider. If none exist, the site shows built-in defaults."
        action={
          <button
            onClick={() => {
              setImageError(false);
              setEditing({ order: data.length + 1 });
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
          >
            <Plus className="h-5 w-5" /> New slide
          </button>
        }
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>
          <div className="flex flex-col items-center gap-2">
            <Images className="h-8 w-8 text-slate" />
            <p>No custom slides yet. The homepage hero is showing the built-in defaults.</p>
          </div>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {data.map((slide) => (
            <div
              key={slide.id}
              className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-e1 sm:flex-row sm:items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.image} alt="" className="h-20 w-auto shrink-0 rounded-md border border-line object-cover" />
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 rounded-pill bg-cloud px-2 py-0.5 text-xs font-semibold text-slate">
                  <Images className="h-3 w-3" /> Order {slide.order}
                </span>
                <h3 className="mt-1 truncate font-medium text-ink">
                  {slide.title} <span className="text-prelli-green-600">{slide.highlight}</span>
                </h3>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => {
                    setImageError(false);
                    setEditing(slide);
                  }}
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-ink hover:bg-cloud"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <ConfirmButton
                  onConfirm={() => deleteDocById("heroSlides", slide.id)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-prelli-pink hover:bg-prelli-pink/5"
                >
                  <Trash2 className="h-4 w-4" />
                </ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit slide" : "New slide"}
        wide
      >
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <ImageUpload
              value={editing.image}
              onChange={(url) => {
                setImageError(false);
                setEditing((p) => ({ ...p, image: url }));
              }}
              folder="hero"
              label="Slide image"
            />
            {imageError && <p className="text-sm text-prelli-pink">An image is required.</p>}
            <div>
              <Label htmlFor="eyebrow">Eyebrow</Label>
              <Input id="eyebrow" name="eyebrow" placeholder="Empowering women in need" defaultValue={editing.eyebrow} />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="Bringing hope to" defaultValue={editing.title} />
            </div>
            <div>
              <Label htmlFor="highlight">Highlight</Label>
              <Input id="highlight" name="highlight" placeholder="precious little lives" defaultValue={editing.highlight} />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <Textarea id="body" name="body" defaultValue={editing.body} />
            </div>
            <div className="sm:max-w-[160px]">
              <Label htmlFor="order">Order</Label>
              <Input id="order" name="order" type="number" defaultValue={editing.order ?? data.length + 1} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud"
              >
                Cancel
              </button>
              <SubmitButton busy={busy}>{editing.id ? "Save changes" : "Create slide"}</SubmitButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
