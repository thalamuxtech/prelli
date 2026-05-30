import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const metadata: Metadata = { title: "Support our work" };

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Donate"
      title="Support our work"
      description="Your generosity provides food, education, and empowerment. Giving options are on the way."
    />
  );
}
