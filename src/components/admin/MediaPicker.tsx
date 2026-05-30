"use client";

import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { resizeAndUpload } from "@/lib/media";

/** Single-image upload field with preview (resizes client-side → Storage). */
export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
}: {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const url = await resizeAndUpload(file, folder);
      onChange(url);
    } catch {
      setError("Upload failed. Check Storage is enabled.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-ink">{label}</p>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-32 w-auto rounded-md border border-line object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-pill bg-ink text-white"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-32 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-cloud text-slate transition-colors hover:border-prelli-green hover:text-prelli-green-600">
          {busy ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-6 w-6" />
              <span className="text-sm">Click to upload</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </label>
      )}
      {error && <p className="mt-1 text-sm text-prelli-pink">{error}</p>}
    </div>
  );
}

/** Multi-image upload (capped) for event galleries — 3–5 images (§ media rules). */
export function MultiImageUpload({
  values,
  onChange,
  folder = "events",
  max = 5,
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const room = max - values.length;
    if (room <= 0) {
      setError(`Maximum ${max} images.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const f of files.slice(0, room)) {
        uploaded.push(await resizeAndUpload(f, folder));
      }
      onChange([...values, ...uploaded]);
    } catch {
      setError("Upload failed. Check Storage is enabled.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-ink">
        Images <span className="text-slate">({values.length}/{max})</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div key={url} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-24 w-24 rounded-md border border-line object-cover" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-pill bg-ink text-white"
              aria-label="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {values.length < max && (
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-line bg-cloud text-slate hover:border-prelli-green hover:text-prelli-green-600">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} disabled={busy} />
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-prelli-pink">{error}</p>}
    </div>
  );
}
