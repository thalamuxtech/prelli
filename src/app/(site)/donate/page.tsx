import type { Metadata } from "next";
import { Heart, Utensils, GraduationCap, HandHeart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { PledgeForm } from "@/components/site/PledgeForm";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Precious Little Lives Initiative. Your generosity provides food, education, and empowerment for vulnerable children, widows, and the elderly in Nigeria.",
};

// TODO (Phase 5): replace with the live Paystack/Flutterwave payment-link URL.
const PAYMENT_URL = "#";

const impactOf = [
  { Icon: Utensils, title: "Feed a family", body: "A bag of rice and essentials brings relief to a household in need." },
  { Icon: GraduationCap, title: "Support a child's learning", body: "School supplies and materials keep a child in education." },
  { Icon: HandHeart, title: "Empower a widow", body: "Tools and materials help a widow rebuild and provide for her family." },
];

export default function DonatePage() {
  return (
    <>
      <section className="section-y">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
              Donate
            </p>
            <h1 className="text-h1 mt-3 font-display font-bold text-ink">
              Every gift brings hope and relief
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate">
              Your generosity provides food, education, and empowerment to
              vulnerable children, widows, and the elderly across Nigeria. Every
              act of kindness, no matter how small, goes a long way.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={PAYMENT_URL} size="lg">
                <Heart className="h-5 w-5" /> Donate now
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Partner with us
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate">
              Secure giving via Paystack / Flutterwave — coming online shortly.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-cloud section-y">
        <Container>
          <SectionHeading eyebrow="Where it goes" title="The difference your gift makes" />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-3">
            {impactOf.map(({ Icon, title, body }) => (
              <StaggerItem key={title}>
                <div className="h-full rounded-lg bg-white p-7 text-center shadow-e1">
                  <div className="mx-auto mb-4 inline-flex rounded-md bg-prelli-green-50 p-3">
                    <Icon className="h-7 w-7 text-prelli-green-600" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 text-center text-sm text-slate">
            <p>
              PreLLI is a CAC-registered non-profit. We believe in transparency —
              with reports showing exactly how donations are allocated.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Pledge form */}
      <section className="section-y">
        <Container className="max-w-2xl">
          <Reveal>
            <SectionHeading
              eyebrow="Pledge your support"
              title="Prefer to pledge?"
              align="left"
            />
            <p className="mt-3 text-slate">
              Let us know what you&apos;d like to give — funds or items — and
              we&apos;ll follow up with how to deliver it.
            </p>
            <div className="mt-8 rounded-lg border border-line bg-white p-6 shadow-e1 sm:p-8">
              <PledgeForm />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
