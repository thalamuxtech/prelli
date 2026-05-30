import type { Metadata } from "next";
import { Heart, GraduationCap, Truck, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { VolunteerForm } from "@/components/site/VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Give your time and skills to Precious Little Lives Initiative — join our outreaches and help bring hope to vulnerable communities in Nigeria.",
};

const ways = [
  { Icon: Heart, label: "Outreach & visits" },
  { Icon: GraduationCap, label: "Education & mentorship" },
  { Icon: Truck, label: "Logistics & distribution" },
  { Icon: Users, label: "Community engagement" },
];

export default function VolunteerPage() {
  return (
    <section className="section-y">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
            Volunteer
          </p>
          <h1 className="text-h1 mt-3 font-display font-bold text-ink">Lend a hand</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate">
            Your time and skills can bring joy and relief to vulnerable children,
            widows, and the elderly. Tell us how you'd like to help — we'll be in
            touch about our next outreach.
          </p>

          <ul className="mt-8 space-y-3">
            {ways.map(({ Icon, label }) => (
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
            <VolunteerForm />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
