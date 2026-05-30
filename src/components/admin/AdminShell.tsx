"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ExternalLink, PanelLeftClose, PanelLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/site/Logo";
import { adminNav } from "@/components/admin/adminNav";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop collapse

  // Persist the collapsed preference.
  useEffect(() => {
    const saved = localStorage.getItem("prelli-admin-collapsed");
    if (saved) setCollapsed(saved === "1");
  }, []);
  function toggleCollapsed() {
    setCollapsed((c) => {
      localStorage.setItem("prelli-admin-collapsed", c ? "0" : "1");
      return !c;
    });
  }

  const isSuperadmin = profile?.role === "superadmin";
  const items = adminNav.filter((i) => !i.superadminOnly || isSuperadmin);
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  function Sidebar({ mini }: { mini: boolean }) {
    return (
      <>
        <div className={cn("flex items-center py-5", mini ? "justify-center px-2" : "justify-between px-5")}>
          {!mini && <Logo size={36} />}
          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={mini ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-9 w-9 items-center justify-center rounded-md text-slate transition-colors hover:bg-cloud hover:text-ink lg:inline-flex"
          >
            {mini ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              title={mini ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md py-2.5 text-sm font-medium transition-colors",
                mini ? "justify-center px-2" : "px-3",
                isActive(item.href)
                  ? "bg-prelli-green text-white shadow-e1"
                  : "text-slate hover:bg-prelli-green-50 hover:text-prelli-green-600",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!mini && item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            title={mini ? "View site" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md py-2.5 text-sm font-medium text-slate transition-colors hover:bg-cloud",
              mini ? "justify-center px-2" : "px-3",
            )}
          >
            <ExternalLink className="h-5 w-5" /> {!mini && "View site"}
          </a>
          <button
            type="button"
            onClick={() => signOut()}
            title={mini ? "Sign out" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-md py-2.5 text-sm font-medium text-slate transition-colors hover:bg-cloud",
              mini ? "justify-center px-2" : "px-3",
            )}
          >
            <LogOut className="h-5 w-5" /> {!mini && "Sign out"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-cloud">
      {/* Desktop sidebar (collapsible) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-white transition-[width] duration-300 ease-out-expo lg:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <Sidebar mini={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-e3">
            <Sidebar mini={false} />
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
      <main className={cn("transition-[padding] duration-300 ease-out-expo", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
