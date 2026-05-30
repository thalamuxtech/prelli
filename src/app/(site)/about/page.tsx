import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const metadata: Metadata = { title: "Who we are" };

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="About PreLLI"
      title="Who we are"
      description="We are a passionate charity supporting the whole family — children, widows, and the elderly. Our full story is coming soon."
    />
  );
}
