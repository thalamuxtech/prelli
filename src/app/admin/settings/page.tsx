"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { PageHeader, SubmitButton, LoadingRow } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/MediaPicker";
import { Label, Input, Textarea } from "@/components/ui/FormField";

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
      <PageHeader title="Site settings" subtitle="Homepage hero, contact details, social links, and donation link." />

      <form onSubmit={save} className="max-w-2xl space-y-8">
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
          <h2 className="font-display text-lg font-bold text-ink">Contact & giving</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input id="contactEmail" name="contactEmail" type="email" defaultValue={s.contactEmail} placeholder="prellicares@gmail.com" />
            </div>
            <div>
              <Label htmlFor="contactLocation">Location</Label>
              <Input id="contactLocation" name="contactLocation" defaultValue={s.contactLocation} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="donateUrl">Donation link (Paystack / Flutterwave)</Label>
              <Input id="donateUrl" name="donateUrl" type="url" defaultValue={s.donateUrl} placeholder="https://paystack.com/pay/..." />
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
