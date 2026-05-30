import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Temporary page scaffold used while individual pages are built out in later
 * phases. Keeps every nav link resolvable and on-brand.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="section-y">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
            {eyebrow}
          </p>
          <h1 className="text-h1 mt-3 font-display font-bold text-ink">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/">Back home</Button>
            <Button href="/donate" variant="secondary">
              Support our work
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
