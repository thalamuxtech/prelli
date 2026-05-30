import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const metadata: Metadata = { title: "Moments captured" };

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Gallery"
      title="Moments captured"
      description="A growing archive of photos and videos from our outreach across the years."
    />
  );
}
