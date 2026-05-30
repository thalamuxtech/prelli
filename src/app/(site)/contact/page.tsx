import type { Metadata } from "next";
import { Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import { org } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Precious Little Lives Initiative. Partner with us, volunteer, or learn how we support vulnerable communities across Nigeria.",
};

const socials = [
  { Icon: Instagram, href: org.socials.instagram, label: "Instagram" },
  { Icon: Facebook, href: org.socials.facebook, label: "Facebook" },
  { Icon: Twitter, href: org.socials.twitter, label: "Twitter / X" },
];

export default function ContactPage() {
  return (
    <section className="section-y">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        {/* Info */}
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-prelli-green-600">
            Contact
          </p>
          <h1 className="text-h1 mt-3 font-display font-bold text-ink">Get in touch</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate">
            Want to understand how we are spreading hope and creating pathways
            for less-privileged children? Drop us a message.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={`mailto:${org.email}`}
              className="flex items-center gap-3 text-slate transition-colors hover:text-prelli-green-600"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-prelli-green-50 text-prelli-green-600">
                <Mail className="h-5 w-5" />
              </span>
              {org.email}
            </a>
            <p className="flex items-center gap-3 text-slate">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-prelli-blue/10 text-prelli-blue-700">
                <MapPin className="h-5 w-5" />
              </span>
              {org.location}
            </p>
          </div>

          <div className="mt-8 flex gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-line text-slate transition-all duration-200 hover:-translate-y-0.5 hover:border-prelli-green hover:text-prelli-green-600 hover:shadow-e1"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.08}>
          <div className="rounded-lg border border-line bg-white p-6 shadow-e1 sm:p-8">
            <ContactForm />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
