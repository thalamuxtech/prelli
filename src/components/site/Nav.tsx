"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/content/nav";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Sticky-shrink: add blur + shadow once the user scrolls past the hero edge (§2.5).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route change + lock body scroll while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Only the home page has a dark full-bleed hero behind a transparent nav.
  // Everywhere else the nav is solid from the top so links stay legible.
  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out-expo",
        solid
          ? "border-b border-line bg-white/80 py-4 shadow-e1 backdrop-blur-lg"
          : "border-b border-transparent bg-gradient-to-b from-ink/45 to-transparent py-6",
      )}
      style={{ paddingTop: "max(env(safe-area-inset-top), 1rem)" }}
    >
      {/* Logo is allowed to overflow the bar (detached, oversized) without clipping. */}
      <nav className="container-px mx-auto flex max-w-content items-center justify-between gap-4 overflow-visible">
        {/* relative wrapper lets the oversized logo extend below the bar */}
        <div className="relative z-10 flex items-center">
          <Logo scrolled={solid} />
        </div>

        {/* Desktop links (lg+) */}
        <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1.5">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "group relative rounded-pill px-3.5 py-2 text-[0.95rem] font-medium transition-colors duration-200",
                    active
                      ? solid
                        ? "text-prelli-green-600"
                        : "text-white"
                      : solid
                        ? "text-ink hover:text-prelli-green-600"
                        : "text-white/85 hover:text-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-center rounded-full transition-transform duration-300 ease-out-expo",
                      solid ? "bg-prelli-green" : "bg-white",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Button
            href="/donate"
            size="sm"
            className={cn(
              "btn-gradient-loop shadow-e1",
              !solid && "ring-1 ring-white/30",
            )}
          >
            <Heart className="h-4 w-4" /> Donate
          </Button>
        </div>

        {/* Mobile hamburger (≥44px target) */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors lg:hidden",
            solid ? "text-ink" : "text-white",
          )}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col bg-white shadow-e3"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
              <div className="container-px flex items-center justify-between py-4">
                <Logo size={40} />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <ul className="container-px mt-2 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-md px-4 py-3 text-lg font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-prelli-green-50 text-prelli-green-600"
                          : "text-ink hover:bg-cloud",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="container-px mt-auto pb-8 pt-4">
                <Button href="/donate" className="btn-gradient-loop w-full" size="lg">
                  <Heart className="h-5 w-5" /> Donate
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
