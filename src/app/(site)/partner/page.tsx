import type { Metadata } from "next";
import { Handshake, Building2, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PartnerForm } from "@/components/site/PartnerForm";

export const metadata: Metadata = {
  title: "Partner with us",
  description:
    "Partner or sponsor Precious Little Lives Initiative. Together we can reach more vulnerable children, widows, and families across Nigeria.",
};

const reasons = [
  { Icon: HeartHandshake, label: "Make a measurable difference in communities" },
  { Icon: Building2, label: "Corporate social responsibility partnerships" },
  { Icon: Handshake, label: "Transparent reporting on every contribution" },
];

export default function PartnerPage() {
  return (
    <section className="section-y">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
            Partner & sponsor
          </p>
          <h1 className="text-h1 mt-3 font-display font-bold text-ink">Let&apos;s work together</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate">
            Organisations and individuals partnering with PreLLI help us reach
            further and do more. Tell us how you&apos;d like to get involved.
          </p>
          <ul className="mt-8 space-y-3">
            {reasons.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-ink">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-prelli-green-50 text-prelli-green-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-medium">{label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-lg border border-line bg-white p-6 shadow-e1 sm:p-8">
            <PartnerForm />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
