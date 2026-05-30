import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { initiatives } from "@/content/initiatives";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "The core initiatives of Precious Little Lives Initiative — from special care for orphans and widows to STEM camps for teen girls and skill-acquisition programs.",
};

export default function WorkPage() {
  return (
    <>
      <section className="section-y">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
              Our work
            </p>
            <h1 className="text-h1 mt-3 font-display font-bold text-ink">
              Initiatives that create lasting change
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate">
              We support the whole family — providing immediate relief while
              building pathways to self-sufficiency. These are the core programs
              through which we work.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((item, i) => (
              <StaggerItem key={item.title}>
                <article className="group flex h-full flex-col rounded-lg border border-line bg-white p-7 shadow-e1 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-e2">
                  <span className="font-display text-sm font-bold text-prelli-green/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 font-display text-lg font-semibold text-ink transition-colors group-hover:text-prelli-green-600">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    {item.summary}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-cloud section-y">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2 font-display font-bold text-ink">
              Want to be part of the change?
            </h2>
            <p className="mt-4 leading-relaxed text-slate">
              Whether through giving or volunteering, your support helps us reach
              more vulnerable children, widows, and families.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/donate" size="lg">
                Donate
              </Button>
              <Button href="/volunteer" variant="secondary" size="lg">
                Volunteer
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
