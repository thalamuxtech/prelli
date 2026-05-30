"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Check, DownloadCloud, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { PageHeader, SubmitButton, LoadingRow } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/MediaPicker";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { importSeedContent } from "@/lib/seedContent";

interface SiteSettings {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  contactEmail?: string;
  contactLocation?: string;
  donateUrl?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export default function SettingsAdmin() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "settings", "site")).then((snap) => {
      setS(snap.exists() ? (snap.data() as SiteSettings) : {});
    });
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: SiteSettings = {
      heroTitle: String(fd.get("heroTitle")),
      heroSubtitle: String(fd.get("heroSubtitle")),
      heroImage: s?.heroImage || "",
      contactEmail: String(fd.get("contactEmail")),
      contactLocation: String(fd.get("contactLocation")),
      donateUrl: String(fd.get("donateUrl")),
      instagram: String(fd.get("instagram")),
      facebook: String(fd.get("facebook")),
      twitter: String(fd.get("twitter")),
    };
    setBusy(true);
    try {
      await setDoc(doc(db, "settings", "site"), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  if (!s) return <LoadingRow />;

  return (
    <div>
      <PageHeader title="Site settings" subtitle="Homepage hero, contact details, social links, and starter content." />

      <ImportContentCard />

      <form onSubmit={save} className="mt-8 max-w-2xl space-y-8">
        <section className="rounded-lg border border-line bg-white p-6 shadow-e1">
          <h2 className="font-display text-lg font-bold text-ink">Homepage hero</h2>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="heroTitle">Headline</Label>
              <Input id="heroTitle" name="heroTitle" defaultValue={s.heroTitle} placeholder="Bringing hope to precious little lives." />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Subheadline</Label>
              <Textarea id="heroSubtitle" name="heroSubtitle" defaultValue={s.heroSubtitle} className="min-h-[80px]" />
            </div>
            <ImageUpload value={s.heroImage} onChange={(url) => setS((p) => ({ ...p, heroImage: url }))} folder="settings" label="Hero background image (optional)" />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 shadow-e1">
          <h2 className="font-display text-lg font-bold text-ink">Contact &amp; giving</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input id="contactEmail" name="contactEmail" type="email" defaultValue={s.contactEmail} placeholder="prellicares@gmail.com" />
            </div>
            <div>
              <Label htmlFor="contactLocation">Location</Label>
              <Input id="contactLocation" name="contactLocation" defaultValue={s.contactLocation} placeholder="Abuja, Nigeria" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="donateUrl">Donation link (optional, for future use)</Label>
              <Input id="donateUrl" name="donateUrl" type="url" defaultValue={s.donateUrl} placeholder="https://… (leave blank; pledges come through the form)" />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 shadow-e1">
          <h2 className="font-display text-lg font-bold text-ink">Social links</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" name="instagram" type="url" defaultValue={s.instagram} />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" name="facebook" type="url" defaultValue={s.facebook} />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input id="twitter" name="twitter" type="url" defaultValue={s.twitter} />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4">
          <SubmitButton busy={busy}>Save settings</SubmitButton>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-prelli-green-600">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function ImportContentCard() {
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<{ posts: number; slides: number; initiatives: number; events: number; sponsors: number } | null>(null);

  async function run() {
    setState("running");
    try {
      const r = await importSeedContent();
      setResult(r);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="rounded-lg border border-line bg-white p-6 shadow-e1">
      <h2 className="font-display text-lg font-bold text-ink">Import starter content</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate">
        Load the website&apos;s built-in stories, hero slides, and initiatives into
        the database so you can edit them here. Safe to run once; it won&apos;t
        create duplicates.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={state === "running"}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-prelli-green px-5 font-semibold text-white transition-colors hover:bg-prelli-green-600 disabled:opacity-60"
        >
          {state === "running" ? <Loader2 className="h-5 w-5 animate-spin" /> : <DownloadCloud className="h-5 w-5" />}
          {state === "running" ? "Importing…" : "Import content"}
        </button>
        {state === "done" && result && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-prelli-green-600">
            <Check className="h-4 w-4" /> Imported {result.posts} posts, {result.slides} slides, {result.initiatives} initiatives, {result.events} events, {result.sponsors} partners.
          </span>
        )}
        {state === "error" && (
          <span className="text-sm text-prelli-pink">Import failed. Check you&apos;re signed in and try again.</span>
        )}
      </div>
    </section>
  );
}
