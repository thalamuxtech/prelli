"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/site/Logo";
import { adminNav } from "@/components/admin/adminNav";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const isSuperadmin = profile?.role === "superadmin";
  const items = adminNav.filter((i) => !i.superadminOnly || isSuperadmin);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarBody = (
    <>
      <div className="px-5 py-5">
        <Logo size={40} />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-prelli-green text-white shadow-e1"
                : "text-slate hover:bg-prelli-green-50 hover:text-prelli-green-600",
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate transition-colors hover:bg-cloud"
        >
          <ExternalLink className="h-5 w-5" /> View site
        </a>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate transition-colors hover:bg-cloud"
        >
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cloud">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-white lg:flex">
        {SidebarBody}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-e3">
            {SidebarBody}
          </aside>
        </div>
      )}

      {/* Topbar (mobile) */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo size={34} />
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>
      {open && (
        <button
          aria-label="Close"
          className="fixed right-4 top-3 z-50 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink lg:hidden"
          onClick={() => setOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      )}

      {/* Content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
