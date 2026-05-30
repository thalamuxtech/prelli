import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const metadata: Metadata = { title: "What's coming up" };

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Events"
      title="What's coming up"
      description="Join us at our next outreach, fun fair, or community event."
    />
  );
}
