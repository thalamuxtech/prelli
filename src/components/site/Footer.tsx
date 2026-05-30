import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { Newsletter } from "./Newsletter";
import { Container } from "@/components/ui/Container";
import { org } from "@/content/site";
import { footerGroups } from "@/content/nav";

const socials = [
  { Icon: Instagram, href: org.socials.instagram, label: "Instagram" },
  { Icon: Facebook, href: org.socials.facebook, label: "Facebook" },
  { Icon: Twitter, href: org.socials.twitter, label: "Twitter / X" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-white">
      {/* Brand aurora — subtle green/blue glow anchoring the dark footer. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(50% 80% at 85% 0%, rgba(123,186,60,.18), transparent 60%), radial-gradient(45% 80% at 8% 100%, rgba(45,156,219,.15), transparent 60%)",
        }}
      />

      <div className="relative">
        {/* Newsletter band */}
        <Container className="pt-14">
          <div className="flex flex-col gap-6 rounded-lg border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <h3 className="font-display text-xl font-bold text-white">Get our emails</h3>
              <p className="mt-1 text-white/70">
                Subscribe to stay up-to-date with our news and outreach.
              </p>
            </div>
            <Newsletter />
          </div>
        </Container>

        <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + mission blurb */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo size={48} />
            <p className="mt-4 max-w-sm leading-relaxed text-white/70">
              Spreading hope and creating pathways for less-privileged children,
              widows, and the elderly across Nigeria since {org.since}.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-white/15 text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-prelli-green hover:text-prelli-green"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 transition-colors hover:text-prelli-green"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </Container>

        <div className="border-t border-white/10">
          <Container className="flex flex-col gap-4 py-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <a
                href={`mailto:${org.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-prelli-green"
              >
                <Mail className="h-4 w-4" /> {org.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {org.location}
              </span>
            </div>
            <p>
              © {new Date().getFullYear()} {org.name} · CAC-registered non-profit
            </p>
          </Container>
        </div>

        {/* Admin entry — discreet centered logo linking to the admin login. */}
        <div className="flex justify-center pb-8 pt-2">
          <Link
            href="/admin"
            aria-label="Admin sign in"
            title="Admin"
            className="opacity-40 transition-opacity duration-200 hover:opacity-100"
          >
            <Image
              src="/brand/prelli-badge.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
