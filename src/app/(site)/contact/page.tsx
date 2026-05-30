import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const metadata: Metadata = { title: "Get in touch" };

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Contact"
      title="Get in touch"
      description="Want to understand how we are spreading hope and creating pathways for less-privileged children? Drop us a message."
    />
  );
}
