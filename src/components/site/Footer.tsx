import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
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
    <footer className="border-t border-line bg-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + mission blurb */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Logo size={48} />
          <p className="mt-4 max-w-sm leading-relaxed text-slate">
            Spreading hope and creating pathways for less-privileged children,
            widows, and the elderly across Nigeria since {org.since}.
          </p>
          <div className="mt-5 flex gap-3">
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
        </div>

        {/* Link groups */}
        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate transition-colors hover:text-prelli-green-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-6 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={`mailto:${org.email}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-prelli-green-600"
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
    </footer>
  );
}
