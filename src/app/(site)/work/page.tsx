import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const metadata: Metadata = { title: "Our initiatives" };

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Our Work"
      title="Our initiatives"
      description="From orphanage support to STEM camps and skill acquisition, explore the programs through which we create lasting change."
    />
  );
}
