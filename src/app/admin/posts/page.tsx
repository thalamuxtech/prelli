"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useCollection, createDoc, updateDocById, deleteDocById, byCreatedDesc } from "@/lib/db";
import { PageHeader, Modal, ConfirmButton, SubmitButton, EmptyState, LoadingRow } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/MediaPicker";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { categoryLabels, type Category, type Post } from "@/lib/types";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const cats = Object.keys(categoryLabels) as Category[];

export default function PostsAdmin() {
  const { data, loading } = useCollection<Post>("posts", byCreatedDesc());
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title"));
    const payload = {
      title,
      slug: editing?.slug || slugify(title),
      excerpt: String(fd.get("excerpt")),
      body: String(fd.get("body")).split("\n").filter((p) => p.trim()),
      category: String(fd.get("category")) as Category,
      location: String(fd.get("location")),
      year: Number(fd.get("year")) || new Date().getFullYear(),
      date: String(fd.get("date")) || new Date().toISOString().slice(0, 10),
      coverImage: editing?.coverImage || "",
      status: String(fd.get("status")) as "draft" | "published",
    };
    setBusy(true);
    try {
      if (editing?.id) await updateDocById("posts", editing.id, payload);
      else await createDoc("posts", payload);
      setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Posts"
        subtitle="Stories and updates published on the website."
        action={
          <button
            onClick={() => setEditing({ status: "draft", year: new Date().getFullYear() })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white hover:bg-prelli-green-600"
          >
            <Plus className="h-5 w-5" /> New post
          </button>
        }
      />

      {loading ? (
        <LoadingRow />
      ) : data.length === 0 ? (
        <EmptyState>No posts yet. Create your first story.</EmptyState>
      ) : (
        <div className="space-y-3">
          {data.map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-e1 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-semibold ${
                      post.status === "published"
                        ? "bg-prelli-green-50 text-prelli-green-600"
                        : "bg-cloud text-slate"
                    }`}
                  >
                    {post.status === "published" ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {post.status}
                  </span>
                  <span className="text-xs text-slate">{categoryLabels[post.category]} · {post.year}</span>
                </div>
                <h3 className="mt-1 truncate font-medium text-ink">{post.title}</h3>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setEditing(post)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-ink hover:bg-cloud"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <ConfirmButton
                  onConfirm={() => deleteDocById("posts", post.id)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-prelli-pink hover:bg-prelli-pink/5"
                >
                  <Trash2 className="h-4 w-4" />
                </ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit post" : "New post"} wide>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={editing.title} />
            </div>
            <ImageUpload
              value={editing.coverImage}
              onChange={(url) => setEditing((p) => ({ ...p, coverImage: url }))}
              folder="posts"
              label="Cover image"
            />
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input id="excerpt" name="excerpt" defaultValue={editing.excerpt} />
            </div>
            <div>
              <Label htmlFor="body">Body (one paragraph per line)</Label>
              <Textarea id="body" name="body" required defaultValue={editing.body?.join("\n")} className="min-h-[160px]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="category">Category</Label>
                <select id="category" name="category" defaultValue={editing.category || "children"} className="w-full rounded-md border border-line bg-white px-4 py-3 text-ink">
                  {cats.map((c) => (
                    <option key={c} value={c}>{categoryLabels[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" defaultValue={editing.status || "draft"} className="w-full rounded-md border border-line bg-white px-4 py-3 text-ink">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" defaultValue={editing.location} />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={editing.date} />
              </div>
            </div>
            <input type="hidden" name="year" value={editing.year} />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-pill px-5 py-2.5 font-medium text-slate hover:bg-cloud">
                Cancel
              </button>
              <SubmitButton busy={busy}>{editing.id ? "Save changes" : "Create post"}</SubmitButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
