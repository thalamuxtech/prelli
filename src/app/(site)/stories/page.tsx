import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const metadata: Metadata = { title: "From the field" };

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Stories"
      title="From the field"
      description="Read about our visits, donations, and the lives touched along the way."
    />
  );
}
