import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export const metadata: Metadata = { title: "Lend a hand" };

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Volunteer"
      title="Lend a hand"
      description="Give your time and skills to bring joy and relief to vulnerable communities. Sign-up coming soon."
    />
  );
}
