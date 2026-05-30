import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const metadata: Metadata = { title: "The difference we make" };

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Our Impact"
      title="The difference we make"
      description="A timeline of our outreach across Nigeria since 2018 — communities reached, people served, and hope delivered."
    />
  );
}
